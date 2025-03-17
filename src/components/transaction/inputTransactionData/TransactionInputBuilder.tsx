import { Alert, Button, Container, ListItem, Paper, TextField, Tooltip, Typography } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Grid from "@mui/material/Grid2";
import { readContract } from "@wagmi/core";
import { Parser } from "expr-eval";
import { useEffect, useState } from "react";
import type React from "react";
import { type AbiFunction, encodeFunctionData, parseAbi, parseAbiItem } from "viem";
import { useAccount } from "wagmi";
import { useSafeWalletContext } from "../../../context/WalletContext";
import { type Transaction, type TransactionSpec, type TransactionType, ValidationType } from "../../../context/types";
import { config } from "../../../wagmi";
import AccountAddress from "../../common/AccountAddress";

interface TransactionInputBuilderProps {
  onAdd: (transaction: Transaction) => void;
  spec: TransactionSpec;
}

const TransactionInputBuilder: React.FC<TransactionInputBuilderProps> = ({ onAdd, spec }) => {
  const { chainId } = useAccount();
  const { safeAccount } = useSafeWalletContext();

  const parser = new Parser();

  // Initialize state dynamically
  const initialContext = {
    safeAddress: safeAccount,
    ...Object.fromEntries(Object.entries(spec.context || {}).map(([key, item]) => [key, item?.defaultValue])),
  };

  const initialInputs = Object.fromEntries(spec.inputs.map((input) => [input.name, ""]));

  const [context, setContext] = useState<Record<string, any>>(initialContext);
  const [inputs, setInputs] = useState<Record<string, string>>(initialInputs);
  const [errors, setErrors] = useState<Record<string, { id: string; errorMessage: string }[]>>({});
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

  const getDetailValue = (type: string, value: string) => {
    const val = parser.parse(value).evaluate({ context, inputs });
    if (val === undefined) {
      return;
    }
    const parsedValue = val.toString();
    if (type === "Text") {
      return <Typography>{parsedValue}</Typography>;
    }

    if (type === "Address") {
      return (
        <Tooltip title={parsedValue}>
          <span>
            <AccountAddress address={parsedValue} short />
          </span>
        </Tooltip>
      );
    }

    return <Typography>{value}</Typography>;
  };

  // Fetch context values from blockchain
  /**
   *  biome-ignore lint/correctness/useExhaustiveDependencies(errors): No need to re-run effect when errors changes.
   *  biome-ignore lint/correctness/useExhaustiveDependencies(spec.onInputUpdate): No need to re-run effect as spec is not expectec to change.
   *  biome-ignore lint/correctness/useExhaustiveDependencies(context): Adding context to dependencies will cause infinite re-render.
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

            const args = ctx.args.map((arg: string) => parser.parse(arg).evaluate({ context, inputs }));
            const to = parser.parse(ctx.to).evaluate({ context, inputs });

            const result = (
              (await readContract(config, { address: to, abi, functionName: abi[0].name, args })) as any
            ).toString();

            console.log("Fetched data for", variable, result);
            setContext((prevContext) => ({ ...prevContext, [variable.split(".")[1]]: result }));

            // Remove error with id value.id if it exists in errors
            setErrors((prevErrors) => {
              const currentErrors = prevErrors[variable.split(".")[1]] || [];
              const updatedErrors = currentErrors.filter((err) => err.id !== value.id);
              return { ...prevErrors, [variable.split(".")[1]]: updatedErrors };
            });
          } catch (error) {
            console.warn(`Failed to fetch data for ${variable}`);
            // update error state
            setErrors((prevErrors) => {
              const errorMessage = value.data.errorMessage || `Failed to fetch data for [${variable}]`;
              const errorKey = variable.split(".")[1];
              const currentErrors = prevErrors[errorKey] || [];
              const updatedErrors = currentErrors.find((err) => err.id === value.id)
                ? currentErrors
                : [...currentErrors, { id: value.id, errorMessage }];
              return {
                ...prevErrors,
                [errorKey]: updatedErrors,
              };
            });
          }
        }
      }
    };

    updateContextValues();
  }, [inputs]);

  /**
   * biome-ignore lint/correctness/useExhaustiveDependencies(context): Valdation should re-run whenever context updates
   * biome-ignore lint/correctness/useExhaustiveDependencies(touchedInputs[name]): No need to re-run validation when touchedInputs changes.
   */
  useEffect(() => {
    for (const name of Object.keys(inputs)) {
      if (touchedInputs[name]) {
        validateInput(name, inputs[name]);
      }
    }
  }, [context, inputs]);

  // Validation logic
  const validateInput = (name: string, value: string) => {
    const errors: { id: string; errorMessage: string }[] = [];

    for (const rule of inputValidations[name] || []) {
      if (rule.type === ValidationType.expression) {
        const result = parser.parse(rule.value).evaluate({ context, inputs });
        if (!result) errors.push({ id: rule.id, errorMessage: rule.errorMessage });
      }
      if (rule.type === ValidationType.regex) {
        if (!new RegExp(rule.value).test(value)) errors.push({ id: rule.id, errorMessage: rule.errorMessage });
      }
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: errors }));
  };

  // Handle input change
  const handleInputChange = (name: string, value: string) => {
    setTouchedInputs((prev) => ({ ...prev, [name]: true }));
    setInputs((prevInputs) => ({ ...prevInputs, [name]: value }));
    // validateInput(name, value);
  };

  // Generate transaction calldata
  const handleSubmit = () => {
    if (Object.values(errors).some((err) => err.length > 0)) {
      alert("Please fix errors before submitting.");
      return;
    }

    const abiItem = parseAbiItem(spec.functionSignature) as AbiFunction;

    const calldata = encodeFunctionData({
      abi: [abiItem],
      functionName: abiItem.name,
      args: spec.onFinalize.calldataArgs.map((arg) => parser.parse(arg).evaluate({ context, inputs })),
    });

    const transaction: Transaction = {
      type: spec.summaryView as TransactionType,
      value: parser.parse(spec.onFinalize.value).evaluate({ context, inputs }),
      to: parser.parse(spec.onFinalize.to).evaluate({ context, inputs }),
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
              key={`textfield-${spec.name}-${input.name}`}
              id={`textfield-${spec.name}-${input.name}`}
              label={input.label}
              value={inputs[input.name]}
              onChange={(e) => handleInputChange(input.name, e.target.value)}
              error={!!errors[input.name]?.length}
              helperText={errors[input.name]?.map((err) => err.errorMessage).join(", ")}
              fullWidth
              margin="normal"
            />
          )}

          {input.type === "SelectOne" && (
            <Autocomplete
              id={`auto-complete-${spec.name}-${input.name}`}
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

      {spec.detailsView.length > 0 && (
        <Paper elevation={0} sx={{ padding: 1, marginTop: 1 }}>
          <Typography variant="h6">Details</Typography>

          <Grid container spacing={1}>
            {spec.detailsView.map((detail, index) => (
              <Grid sx={{ overflowX: "scroll" }} size={12} key={`${index}-${detail.label}`}>
                <Grid container spacing={2}>
                  <Grid size={4}>
                    <Typography>{detail.label}</Typography>
                  </Grid>
                  <Grid size={8}>{getDetailValue(detail.type, detail.value)} </Grid>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      <Grid container spacing={1} sx={{ marginTop: 1 }}>
        {Object.values(errors)
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
        disabled={Object.values(errors).some((err) => err.length > 0)}
      >
        Add to batch
      </Button>
    </Container>
  );
};

export default TransactionInputBuilder;
