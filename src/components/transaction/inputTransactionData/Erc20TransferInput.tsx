import { Autocomplete, Button, ListItem, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { readContract } from "@wagmi/core";
import { useEffect, useState } from "react";
import { type Address, formatUnits, zeroAddress } from "viem";
import { encodeFunctionData } from "viem";
import ERC20ABI from "../../../abis/ERC20.json";
import { useSafeWalletContext } from "../../../context/WalletContext";
import { getShortAddress } from "../../../utils/utils";
import { config } from "../../../wagmi";
import MonospacedTextField from "../../common/MonospacedTextField";
import { type Transaction, TransactionType } from "../CreateTransaction";

interface Erc20TransferInputProps {
  onAdd: (newTransaction: Transaction) => void;
}

interface TokenInfo {
  name: string;
  address: Address;
}

const tokenAddresses: TokenInfo[] =
  import.meta.env.VITE_TEST_TOKEN_ADDRESS && import.meta.env.VITE_TEST_TOKEN_NAME
    ? [{ name: import.meta.env.VITE_TEST_TOKEN_NAME, address: import.meta.env.VITE_TEST_TOKEN_ADDRESS as Address }]
    : [];

const Erc20TransferInput: React.FC<Erc20TransferInputProps> = ({ onAdd }) => {
  const { safeAccount } = useSafeWalletContext();
  const [tokenAddress, setTokenAddress] = useState<Address>(zeroAddress);
  const [to, setTo] = useState<Address>(zeroAddress);
  const [value, setValue] = useState<string>("0");
  const [decimals, setDecimals] = useState<number>(18);
  const [tokenName, setTokenName] = useState<string>("");
  const [balance, setBalance] = useState<bigint>(0n);
  const [tokenAddressError, setTokenAddressError] = useState<string>("");
  const [valueError, setValueError] = useState<string>("");

  useEffect(() => {
    const fetchTokenDetails = async () => {
      if (tokenAddress !== zeroAddress) {
        try {
          const decimals = await readContract(config, {
            address: tokenAddress,
            abi: ERC20ABI,
            functionName: "decimals",
          });
          setDecimals(Number(decimals));

          const name = await readContract(config, {
            address: tokenAddress,
            abi: ERC20ABI,
            functionName: "name",
          });
          setTokenName(name as string);

          const balance = (await readContract(config, {
            address: tokenAddress,
            abi: ERC20ABI,
            functionName: "balanceOf",
            args: [safeAccount],
          })) as bigint;
          setBalance(balance);
          setTokenAddressError("");
        } catch (error) {
          console.error("Failed to fetch token details", error);
          setTokenAddressError("Failed to fetch token details");
        }
      }
    };

    fetchTokenDetails();
  }, [tokenAddress, safeAccount]);

  const toBigIntWithDecimals = (value: string, decimals: number): bigint => {
    const [integerPart, decimalPart = ""] = value.toString().split(".");
    const fullDecimalPart = decimalPart.padEnd(decimals, "0").slice(0, decimals); // Handle rounding
    const scaledValue = BigInt(integerPart) * BigInt(10 ** decimals) + BigInt(fullDecimalPart);
    return scaledValue;
  };

  const handleAdd = () => {
    try {
      const formattedValue = toBigIntWithDecimals(value, decimals);

      const data = encodeFunctionData({
        abi: ERC20ABI,
        functionName: "transfer",
        args: [to, formattedValue],
      });

      const newTransaction: Transaction = {
        type: TransactionType.ERC20_TRANSFER,
        to: tokenAddress,
        value: "0",
        data,
        erc20TokenTransfer: {
          tokenAddress,
          to,
          amount: value,
        },
      };

      onAdd(newTransaction);
      setValueError("");
    } catch (error) {
      console.error("Invalid value", error);
      setValueError("Invalid value");
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <Autocomplete
          id="token-address-autocomplete"
          freeSolo
          options={tokenAddresses}
          getOptionLabel={(option: any) => `${option.name} ${getShortAddress(option.address)}`}
          renderOption={(props, option) => (
            <ListItem {...props} key={`${option.name}-${option.address}`}>
              <Grid container justifyContent="space-between" width="100%">
                <Grid>
                  <Typography>{option.name}</Typography>
                </Grid>
                <Grid>
                  <Typography>{getShortAddress(option.address)}</Typography>
                </Grid>
              </Grid>
            </ListItem>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Token Address"
              fullWidth
              margin="normal"
              error={!!tokenAddressError}
              helperText={tokenAddressError}
            />
          )}
          onInputChange={(_event, newInputValue) => {
            const selectedToken = tokenAddresses.find(
              (token) => `${token.name} ${getShortAddress(token.address)}` === newInputValue,
            );
            setTokenAddress((selectedToken?.address || newInputValue) as Address);
          }}
        />
      </Grid>
      {tokenName && (
        <Grid size={12}>
          <Typography variant="body1">Token Name: {tokenName}</Typography>
          <Typography variant="body1">Balance: {formatUnits(balance, decimals)}</Typography>
        </Grid>
      )}
      <Grid size={12}>
        <MonospacedTextField
          label="To"
          value={to}
          onChange={(e) => setTo(e.target.value as Address)}
          fullWidth
          margin="normal"
        />
      </Grid>
      <Grid size={12}>
        <MonospacedTextField
          label="Token Amount"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          fullWidth
          margin="normal"
          error={!!valueError}
          helperText={valueError}
        />
      </Grid>
      <Grid size={12} display="flex" justifyContent="flex-end">
        <Button onClick={handleAdd} color="primary" variant="contained" disabled={!!tokenAddressError || !!valueError}>
          Add to batch
        </Button>
      </Grid>
    </Grid>
  );
};

export default Erc20TransferInput;
