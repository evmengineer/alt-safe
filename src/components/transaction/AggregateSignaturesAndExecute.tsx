import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { Alert, Box, Button, IconButton, TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";
import InputAdornment from "@mui/material/InputAdornment";
import { simulateContract, writeContract } from "@wagmi/core";
import type React from "react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { BaseError, ContractFunctionRevertedError, hexToBytes } from "viem";
import safe from "../../abis/Safe.json";
import { useSafeWalletContext } from "../../context/WalletContext";
import type { ImportSignedData, Transaction } from "../../context/types";
import { type SafeTransactionParams, buildSignatureBytes } from "../../utils/utils";
import { config } from "../../wagmi";
import Title from "../common/Title";
import Summary from "./Summary";

const AggregateSignaturesAndExecute: React.FC = () => {
  const { safeAccount, safeStorage } = useSafeWalletContext();
  const location = useLocation();

  const [importHexes, setImportHexes] = useState<string[]>(
    Array.from({ length: Number(safeStorage?.threshold) || 1 }, () => ""),
  );
  const [imports, setImports] = useState<ImportSignedData[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [safeTransaction, setSafeTransaction] = useState<SafeTransactionParams>();
  const [transactionHash, setTransactionHash] = useState<string>();
  const [importError, setImportError] = useState<string>();
  const [executionError, setExecutionError] = useState<string>();

  useEffect(() => {
    const initialImportHexes = location.state?.initialImportHexes;
    if (initialImportHexes) {
      setImportHexes(initialImportHexes);
      handleImportTransactions();
    }
  }, [location]);

  const handleImportTransactions = () => {
    try {
      const importsTemp: ImportSignedData[] = [];
      for (const importHex of importHexes) {
        const jsonString = new TextDecoder().decode(hexToBytes(importHex as `0x${string}`));
        const importedData = JSON.parse(jsonString) as ImportSignedData;
        importsTemp.push(importedData);
      }
      setTransactions(importsTemp[0].transactions);
      setSafeTransaction(importsTemp[0].safeTransaction);
      setImports(importsTemp);
    } catch (error) {
      console.error("Invalid hex input");
      setImportError("Invalid input");
    }
  };

  const handleAddSignature = () => {
    setImportHexes([...importHexes, "0x"]);
  };

  const handleImportChange = (index: number, value: string) => {
    const newImportHexes = [...importHexes];
    newImportHexes[index] = value as `0x${string}`;
    setImportHexes(newImportHexes);
  };

  const handleRemoveSignature = (index: number) => {
    const newSignatures = importHexes.filter((_, i) => i !== index);
    setImportHexes(newSignatures);
  };

  const handleExecute = async () => {
    const signatures = imports.map((importData: ImportSignedData) => importData.signature);
    const signatureBytes = buildSignatureBytes(signatures);

    if (safeTransaction && safeAccount) {
      try {
        const { request } = await simulateContract(config, {
          abi: safe,
          address: safeAccount,
          functionName: "execTransaction",
          args: [
            safeTransaction.to,
            safeTransaction.value,
            safeTransaction.data,
            safeTransaction.operation,
            safeTransaction.safeTxGas,
            safeTransaction.baseGas,
            safeTransaction.gasPrice,
            safeTransaction.gasToken,
            safeTransaction.refundReceiver,
            signatureBytes,
          ],
        });

        const hash = await writeContract(config, request);
        setTransactionHash(hash);
      } catch (err) {
        console.error(err);
        if (err instanceof BaseError) {
          const revertError = err.walk((err) => err instanceof ContractFunctionRevertedError);
          if (revertError instanceof ContractFunctionRevertedError) {
            const errorName = revertError.data?.errorName ?? "";
            setExecutionError(`${errorName}·${revertError.reason}`);
          }
        }
      }
    }
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Title text="Aggregate Signatures and Execute" />
        <IconButton onClick={handleAddSignature}>
          <AddIcon />
        </IconButton>
      </Box>
      <Grid container spacing={1}>
        {importHexes.map((data, index) => (
          <Grid size={12} key={`${index}-${data.slice(0, 10)}-${index}`}>
            <TextField
              label={`Signer ${index + 1}`}
              value={data}
              onChange={(e) => handleImportChange(index, e.target.value)}
              fullWidth
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => handleRemoveSignature(index)}>
                        <CloseIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              margin="normal"
            />
          </Grid>
        ))}
        <Grid size={12}>
          <Button variant="contained" onClick={handleImportTransactions} fullWidth>
            Import data
          </Button>
        </Grid>
        {importError && (
          <Grid size={12}>
            <Alert severity="error">{importError}</Alert>
          </Grid>
        )}
        <Grid size={12}>
          <Summary viewOnly transactions={transactions} handleDeleteTransaction={() => {}} />
        </Grid>
      </Grid>
      <Button
        disabled={transactionHash !== undefined}
        variant="contained"
        color="primary"
        onClick={handleExecute}
        fullWidth
        sx={{ mt: 2 }}
      >
        Execute
      </Button>
      {transactionHash && !executionError && <Alert severity="success"> Transaction Hash: {transactionHash}</Alert>}
      {executionError && <Alert severity="error">{executionError}</Alert>}
    </>
  );
};

export default AggregateSignaturesAndExecute;
