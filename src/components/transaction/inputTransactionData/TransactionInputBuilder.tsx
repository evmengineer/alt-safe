import { Alert, Button, Container, ListItem, Paper, TextField, Typography } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Grid from "@mui/material/Grid2";
import { readContract } from "@wagmi/core";
import { Parser } from "expr-eval";
import { useEffect, useReducer, useState } from "react";
import { type AbiFunction, encodeFunctionData, parseAbi, parseAbiItem } from "viem";
import { useAccount } from "wagmi";
import { useSafeWalletContext } from "../../../context/WalletContext";
import { type Transaction, type TransactionSpec, type TransactionType, ValidationType } from "../../../context/types";
import { config } from "../../../wagmi";

// Define types
interface State {
  inputs: Record<string, string>;
  context: Record<string, any>;
  errors: Record<string, { id: string; errorMessage: string }[]>;
}

type Action =
  | { type: "UPDATE_INPUT"; payload: { name: string; value: string } }
  | { type: "UPDATE_CONTEXT"; payload: { name: string; value: any } }
  | { type: "SET_ERRORS"; payload: { name: string; errors: { id: string; errorMessage: string }[] } };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "UPDATE_INPUT":
      return { ...state, inputs: { ...state.inputs, [action.payload.name]: action.payload.value } };
    case "UPDATE_CONTEXT":
      return { ...state, context: { ...state.context, [action.payload.name]: action.payload.value } };
    case "SET_ERRORS":
      return { ...state, errors: { ...state.errors, [action.payload.name]: action.payload.errors } };
    default:
      return state;
  }
};

interface TransactionInputBuilderProps {
  onAdd: (transaction: Transaction) => void;
  spec: TransactionSpec;
}

const TransactionInputBuilder: React.FC<TransactionInputBuilderProps> = ({ onAdd, spec }) => {
  const { chainId } = useAccount();
  const { safeAccount } = useSafeWalletContext();

  const parser = new Parser();

  // Initialize state dynamically
  const initialState: State = {
    context: {
      safeAddress: safeAccount,
      ...Object.fromEntries(Object.entries(spec.context).map(([key, item]) => [key, item.defaultValue])),
    },
    inputs: Object.fromEntries(spec.inputs.map((input) => [input.name, ""])),
    errors: {},
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const [touchedInputs, setTouchedInputs] = useState<Record<string, boolean>>(
    Object.fromEntries(spec.inputs.map((input) => [input.name, false])),
  );

  const inputValidations = spec.onUpdateValidations.reduce((acc: Record<string, any[]>, validation) => {
    const { variable, ...rest } = validation;
    const name = variable.split(".")[1];
    if (!acc[name]) {
      acc[name] = [];
    }
    acc[name].push(rest);
    return acc;
  }, {});

  // Fetch context values from blockchain
  /**
   *  biome-ignore lint/correctness/useExhaustiveDependencies(state.errors): No need to re-run effect when errors changes.
   *  biome-ignore lint/correctness/useExhaustiveDependencies(spec.onInputUpdate): No need to re-run effect as spec is not expectec to change.
   *  biome-ignore lint/correctness/useExhaustiveDependencies(state.context): Adding state.context to dependencies will cause infinite re-render.
   *  biome-ignore lint/correctness/useExhaustiveDependencies(parser.parse):
   */
  useEffect(() => {
    const updateContextValues = async () => {
      for (const update of spec.onInputUpdate) {
        const { variable, value } = update;

        if (value.type === "rpcCall") {
          try {
            const ctx = value.data;
            const abi = parseAbi([ctx.method]) as AbiFunction[];

            const args = ctx.args.map((arg: string) =>
              parser.parse(arg).evaluate({ context: state.context, inputs: state.inputs }),
            );
            const to = parser.parse(ctx.to).evaluate({ context: state.context, inputs: state.inputs });

            const result = (
              (await readContract(config, { address: to, abi, functionName: abi[0].name, args })) as any
            ).toString();

            console.log("Fetched data for", variable, result);
            dispatch({ type: "UPDATE_CONTEXT", payload: { name: variable.split(".")[1], value: result } });

            // Remove error with id value.id if it exists in errors
            const errors = state.errors;
            const currentErrors = errors[variable.split(".")[1]] || [];
            const updatedErrors = currentErrors.filter((err) => err.id !== value.id);
            dispatch({ type: "SET_ERRORS", payload: { name: variable.split(".")[1], errors: updatedErrors } });
          } catch (error) {
            console.error(`Failed to fetch data for ${variable}:`, error);
            // update error state
            dispatch({
              type: "SET_ERRORS",
              payload: {
                name: variable.split(".")[1],
                errors: [{ id: value.id, errorMessage: `Failed to fetch data for [${variable}]` }],
              },
            });
          }
        }
      }
    };

    updateContextValues();
  }, [state.inputs]);

  /**
   * biome-ignore lint/correctness/useExhaustiveDependencies(state.context): Valdation should re-run whenever context updates
   * biome-ignore lint/correctness/useExhaustiveDependencies(touchedInputs[name]): No need to re-run validation when touchedInputs changes.
   */
  useEffect(() => {
    for (const name of Object.keys(state.inputs)) {
      if (touchedInputs[name]) {
        validateInput(name, state.inputs[name]);
      }
    }
  }, [state.context, state.inputs]);

  // Validation logic
  const validateInput = (name: string, value: string) => {
    const errors: { id: string; errorMessage: string }[] = [];

    for (const rule of inputValidations[name] || []) {
      if (rule.type === ValidationType.expression) {
        const result = parser.parse(rule.value).evaluate({ context: state.context, inputs: state.inputs });
        if (!result) errors.push({ id: rule.id, errorMessage: rule.errorMessage });
      }
      if (rule.type === ValidationType.regex) {
        if (!new RegExp(rule.value).test(value)) errors.push({ id: rule.id, errorMessage: rule.errorMessage });
      }
    }

    dispatch({ type: "SET_ERRORS", payload: { name, errors } });
  };

  // Handle input change
  const handleInputChange = (name: string, value: string) => {
    setTouchedInputs((prev) => ({ ...prev, [name]: true }));
    dispatch({ type: "UPDATE_INPUT", payload: { name, value } });
    // validateInput(name, value);
  };

  // Generate transaction calldata
  const handleSubmit = () => {
    if (Object.values(state.errors).some((err) => err.length > 0)) {
      alert("Please fix errors before submitting.");
      return;
    }

    const abiItem = parseAbiItem(spec.functionSignature) as AbiFunction;

    const calldata = encodeFunctionData({
      abi: [abiItem],
      functionName: abiItem.name,
      args: spec.onFinalize.calldataArgs.map((arg) =>
        parser.parse(arg).evaluate({ context: state.context, inputs: state.inputs }),
      ),
    });

    const transaction: Transaction = {
      type: spec.summaryView as TransactionType,
      value: parser.parse(spec.onFinalize.value).evaluate({ context: state.context, inputs: state.inputs }),
      to: parser.parse(spec.onFinalize.to).evaluate({ context: state.context, inputs: state.inputs }),
      data: calldata,
    };

    onAdd(transaction);
  };

  return (
    <Container sx={{ overflowY: "auto", height: "100%" }}>
      <Typography variant="h6">{spec.display.description}</Typography>

      {spec.inputs.map((input) => (
        <div key={input.name}>
          {input.type === "TextField" && (
            <TextField
              label={input.label}
              value={state.inputs[input.name]}
              onChange={(e) => handleInputChange(input.name, e.target.value)}
              error={!!state.errors[input.name]?.length}
              helperText={state.errors[input.name]?.map((err) => err.errorMessage).join(", ")}
              fullWidth
              margin="normal"
            />
          )}

          {input.type === "SelectOne" && (
            <Autocomplete
              id={`auto-complete-${input.name}`}
              freeSolo
              options={
                input.options?.find((option) => option.chainId === chainId)?.options ||
                input.options?.find((option) => option.chainId === 0)?.options ||
                []
              }
              getOptionLabel={(option) => (typeof option === "string" ? option : option.name)}
              renderOption={(props, option) => (
                <ListItem {...props} key={`${option.name}-${option.value}`}>
                  <Grid container justifyContent="space-between" width="100%">
                    <Grid>
                      <Typography>{option.name}</Typography>
                    </Grid>
                    <Grid>
                      <Typography>{option.value}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
              )}
              renderInput={(params) => <TextField {...params} label={input.label} fullWidth margin="normal" />}
              onInputChange={(_event, newValue) => {
                const selected = input.options
                  ?.find((opt) => opt.chainId === chainId)
                  ?.options.find((opt) => opt.name === newValue);
                handleInputChange(input.name, selected ? selected.value : newValue);
              }}
            />
          )}
        </div>
      ))}

      {spec.detailsView.length > 0 ? (
        <Paper elevation={0} sx={{ padding: 1, marginTop: 1 }}>
          <Typography variant="h6">Details</Typography>

          <Grid container spacing={1}>
            {spec.detailsView.map((detail, index) => (
              <Grid size={12} key={`${index}-${detail.label}`}>
                <Grid container spacing={2}>
                  <Grid size={4}>
                    <Typography>{detail.label}</Typography>
                  </Grid>
                  <Grid size={8}>
                    <Typography>
                      {parser.parse(detail.value).evaluate({ context: state.context, inputs: state.inputs }).toString()}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Paper>
      ) : (
        <>No details available.</>
      )}

      <Grid container spacing={1} sx={{ marginTop: 1 }}>
        {Object.values(state.errors)
          .flat()
          .map((error, index) => (
            <Grid size={12} key={`${error.id}-${index}`}>
              <Alert severity="error">{error.errorMessage}</Alert>
            </Grid>
          ))}
      </Grid>

      <Button
        variant="contained"
        color="primary"
        sx={{ marginTop: 1 }}
        onClick={handleSubmit}
        fullWidth
        disabled={Object.values(state.errors).some((err) => err.length > 0)}
      >
        Add to batch
      </Button>
    </Container>
  );
};

export default TransactionInputBuilder;
