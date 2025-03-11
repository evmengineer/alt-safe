import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Alert, Box, Button, Card, CardContent, CardHeader, Tooltip } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { readContract, signTypedData, simulateContract } from "@wagmi/core";
import type React from "react";
import { useState } from "react";
import {
  type Address,
  BaseError,
  ContractFunctionRevertedError,
  bytesToHex,
  hexToBytes,
  stringToBytes,
  zeroAddress,
} from "viem";
import { encodeFunctionData } from "viem";
import { useWriteContract } from "wagmi";
import { useAccount, usePublicClient } from "wagmi";
import { STORAGE_KEY } from "../../constants";
import { type SafeTransactionInfo, useSafeWalletContext } from "../../context/WalletContext";
import type { ImportData, ImportSignedData, Transaction } from "../../context/types";
import multisendCallOnly from "../../safe-contracts/artifacts/MultiSendCallOnly.json";
import safe from "../../safe-contracts/artifacts/Safe.json";
import { encodeMultiSend } from "../../utils/multisend";
import { EIP712_SAFE_TX_TYPE, SafeOperation, type SafeTransactionParams } from "../../utils/utils";
import { config } from "../../wagmi";
import AccountAddress from "../common/AccountAddress";
import ViewSafeTransactionDialog from "../common/ViewSafeTransactionDialog";
import WaitForTransactionDialog from "../dialogs/WaitForTransactionDialog";
import Summary from "./Summary";
import TransactionBuilder from "./transactionBuilder/TransactionBuilder";

const CreateTransaction: React.FC = () => {
  const publicClient = usePublicClient();
  const account = useAccount();
  const { writeContractAsync } = useWriteContract();

  const { safeAccount, safeDeployment, safeStorage, storage } = useSafeWalletContext();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionHash, setTransactionHash] = useState<`0x${string}`>();
  const [safeTransaction, setSafeTransaction] = useState<SafeTransactionParams>();
  const [signature, setSignature] = useState<`0x${string}`>();
  const [safeTransactionHash, setSafeTransactionHash] = useState<`0x${string}`>();
  const [error, setError] = useState<string>();
  const [importHex, setImportHex] = useState<`0x${string}`>("0x");
  const [viewDialogOpen, setViewDialogOpen] = useState<boolean>(false);
  const [copyUnsignedTxButtonEnabled, isCopyUnsignedTxButtonEnabled] = useState<boolean>(true);
  const [waitForTransactionDialogOpen, setWaitForTransactionDialogOpen] = useState<boolean>(false);
  const [selectedTransactionType, setSelectedTransactionType] = useState<string>("Send");
  const [group, setGroup] = useState<string>("Token");

  const handleAddTransaction = async (newTransaction: Transaction) => {
    setTransactions([...transactions, { ...newTransaction }]);
  };

  const getExportHex = (txs: Transaction[], safeTx: SafeTransactionParams, safeTxHash: `0x${string}`): string => {
    if (safeAccount) {
      const exportData: ImportData = {
        transactions: txs,
        safeAccount: safeAccount,
        safeTransaction: safeTx,
        safeTransactionHash: safeTxHash,
      };

      const exportDataString = JSON.stringify(exportData, (_key, value) =>
        typeof value === "bigint" ? value.toString() : value,
      );
      return bytesToHex(stringToBytes(exportDataString));
    }
    return "";
  };

  const getExportHexSigned = (): string => {
    if (safeAccount && safeTransaction && account.address && signature && safeTransactionHash) {
      const exportData: ImportSignedData = {
        transactions: transactions,
        safeAccount: safeAccount,
        signature: { signer: account.address, data: signature },
        safeTransaction: safeTransaction,
        safeTransactionHash: safeTransactionHash,
      };

      const exportDataString = JSON.stringify(exportData, (_key, value) =>
        typeof value === "bigint" ? value.toString() : value,
      );
      return bytesToHex(stringToBytes(exportDataString));
    }
    return "";
  };

  const handleViewSafeTransaction = async () => {
    // Recaclulate safe transaction hash
    if (transactions.length >= 1) {
      const { safeTx, safeTxHash } = await getSafeTransactionInfo();

      setSafeTransactionHash(safeTxHash);

      setSafeTransaction({
        to: safeTx.to,
        value: safeTx.value,
        data: safeTx.data,
        operation: safeTx.operation,
        safeTxGas: safeTx.safeTxGas,
        baseGas: safeTx.baseGas,
        gasPrice: safeTx.gasPrice,
        gasToken: safeTx.gasToken,
        refundReceiver: safeTx.refundReceiver,
        nonce: safeTx.nonce,
      });
    }

    setViewDialogOpen(true);
  };

  const handleCopyToClipboard = async () => {
    isCopyUnsignedTxButtonEnabled(false);
    const result = await getSafeTransactionInfo();
    const safeTx = result.safeTx;

    setSafeTransactionHash(result.safeTxHash);

    setSafeTransaction({
      to: safeTx.to,
      value: safeTx.value,
      data: safeTx.data,
      operation: safeTx.operation,
      safeTxGas: safeTx.safeTxGas,
      baseGas: safeTx.baseGas,
      gasPrice: safeTx.gasPrice,
      gasToken: safeTx.gasToken,
      refundReceiver: safeTx.refundReceiver,
      nonce: safeTx.nonce,
    });

    if (safeTx) {
      const hexString = getExportHex(transactions, safeTx, result.safeTxHash);
      navigator.clipboard.writeText(hexString);
    } else {
      console.error("safeTransaction undefined");
    }
    isCopyUnsignedTxButtonEnabled(true);
  };

  const handleCopyToClipboardSigned = async () => {
    if (safeTransaction) {
      const hexString = getExportHexSigned();
      navigator.clipboard.writeText(hexString);
    } else {
      console.error("safeTransaction undefined");
    }
  };

  const handleDeleteTransaction = (id: number) => {
    setSignature(undefined);
    setSafeTransactionHash(undefined);
    setSafeTransaction(undefined);
    setTransactions(transactions.filter((_, index) => index !== id));
  };

  const handleSignTransaction = async () => {
    // Recaclulate safe transaction hash
    const { safeTx, safeTxHash } = await getSafeTransactionInfo();

    if (!safeTxHash) return;

    const result = await signTypedData(config, {
      domain: {
        chainId: account.chainId,
        verifyingContract: safeAccount,
      },
      types: EIP712_SAFE_TX_TYPE,
      primaryType: "SafeTx",
      message: { ...safeTx },
    });

    setSignature(result);

    setSafeTransactionHash(safeTxHash);

    setSafeTransaction({
      to: safeTx.to,
      value: safeTx.value,
      data: safeTx.data,
      operation: safeTx.operation,
      safeTxGas: safeTx.safeTxGas,
      baseGas: safeTx.baseGas,
      gasPrice: safeTx.gasPrice,
      gasToken: safeTx.gasToken,
      refundReceiver: safeTx.refundReceiver,
      nonce: safeTx.nonce,
    });
  };

  const getSafeTransactionInfo = async (): Promise<{ safeTx: SafeTransactionParams; safeTxHash: `0x${string}` }> => {
    let safeTransactionHashFromContractCall: `0x${string}` = "0x";
    let to: Address;
    let value: bigint;
    let callData: `0x${string}`;
    let operation: SafeOperation;
    const baseGas = 0n;
    const safeTxGas = 0n;
    const gasPrice = 0n;
    const gasToken: Address = zeroAddress;
    const refundReceiver: Address = zeroAddress;

    const abi = safe.abi;
    if (safeAccount === undefined) {
      throw new Error("Safe account is undefined");
    }

    if (transactions.length < 1) {
      throw new Error("No transactions");
    }

    const nonce = (await readContract(config, {
      abi,
      address: safeAccount,
      functionName: "nonce",
    })) as bigint;

    if (transactions.length === 1) {
      to = transactions[0].to;
      value = BigInt(transactions[0].value);
      callData = transactions[0].data;
      operation = SafeOperation.CALL;
    } else {
      const metaTransactions = transactions.map((transaction) => {
        return {
          to: transaction.to,
          value: BigInt(transaction.value),
          data: transaction.data,
          operation: SafeOperation.CALL,
        };
      });

      callData = encodeFunctionData({
        abi: multisendCallOnly.abi,
        functionName: "multiSend",
        args: [encodeMultiSend(metaTransactions)],
      });

      to = safeDeployment?.multiSendCallOnly ?? zeroAddress;
      value = 0n;
      operation = SafeOperation.DELEGATE_CALL;
    }

    safeTransactionHashFromContractCall = (await readContract(config, {
      abi,
      address: safeAccount,
      functionName: "getTransactionHash",
      args: [to, value, callData, operation, safeTxGas, baseGas, gasPrice, gasToken, refundReceiver, nonce],
    })) as `0x${string}`;

    return {
      safeTx: {
        to,
        value,
        data: callData,
        operation,
        safeTxGas: safeTxGas,
        baseGas: baseGas,
        gasPrice: gasPrice,
        gasToken: gasToken,
        refundReceiver: refundReceiver,
        nonce,
      },
      safeTxHash: safeTransactionHashFromContractCall,
    };
  };

  const handleExecuteTransaction = async () => {
    if (signature && safeTransaction && safeAccount) {
      try {
        const { request } = await simulateContract(config, {
          abi: safe.abi,
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
            signature,
          ],
        });

        const hash = await writeContractAsync(request);
        setTransactionHash(hash);
        setWaitForTransactionDialogOpen(true);
        await updateStorage(hash);
      } catch (err) {
        console.error(err);
        if (err instanceof BaseError) {
          const revertError = err.walk((err) => err instanceof ContractFunctionRevertedError);
          if (revertError instanceof ContractFunctionRevertedError) {
            const errorName = revertError.data?.errorName ?? "";
            setError(`${errorName}·${revertError.reason}`);
          }
        }
      }
    }
  };

  const handleImportTransactions = () => {
    try {
      if (importHex) {
        const jsonString = new TextDecoder().decode(hexToBytes(importHex));
        const importedData = JSON.parse(jsonString) as ImportData;
        setTransactions(importedData.transactions);
      }
    } catch (error) {
      console.error("Invalid hex input");
    }
  };

  const updateStorage = async (hash: `0x${string}`) => {
    const safeTransactions = (await storage.getItem(STORAGE_KEY.SAFE_TRANSACTIONS)) as SafeTransactionInfo[];
    const result = await publicClient?.getTransaction({ hash: hash });
    if (safeTransaction && safeAccount) {
      const safeTransactionInfo: SafeTransactionInfo = {
        safeAccount: safeAccount,
        chainId: account.chainId,
        safeTransactionParams: safeTransaction,
        transactionHash: hash,
        status: "success",
        blockNumber: result?.blockNumber,
        blockHash: result?.blockHash,
      };
      if (safeTransactions) {
        await storage.setItem(STORAGE_KEY.SAFE_TRANSACTIONS, [...safeTransactions, safeTransactionInfo]);
      } else {
        await storage.setItem(STORAGE_KEY.SAFE_TRANSACTIONS, [safeTransactionInfo]);
      }
    }
  };

  function handleCloseWaitingDialog(): void {
    setWaitForTransactionDialogOpen(false);
  }

  const handleSelectTransactionType = (group: string, type: string) => {
    setSelectedTransactionType(type);
    setGroup(group);
  };

  return (
    <Box id="box-create-transaction">
      <Grid container spacing={2} sx={{ margin: 1 }}>
        <Grid id="grid-build-transaction" size={{ xs: 12, md: 9, sm: 12 }}>
          <Card id="card-tx-builder" sx={{ height: "75vh" }}>
            <CardHeader
              title="Build transaction"
              subheader={
                <Grid container spacing={1}>
                  <Grid>
                    <AccountAddress address={safeAccount} short />
                  </Grid>
                  <Grid> {safeStorage ? `${safeStorage.threshold?.toString()}/${safeStorage.ownerCount}` : ""}</Grid>
                </Grid>
              }
            />
            <CardContent>
              <TransactionBuilder
                group={group}
                selectedTransactionType={selectedTransactionType}
                importHex={importHex}
                setImportHex={setImportHex}
                handleSelectTransactionType={handleSelectTransactionType}
                handleAddTransaction={handleAddTransaction}
                handleImportTransactions={handleImportTransactions}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid id="grid-summary" size={{ xs: 12, md: 3, sm: 12 }}>
          <Summary viewOnly={false} transactions={transactions} handleDeleteTransaction={handleDeleteTransaction} />
        </Grid>

        {account && safeStorage?.owners?.find((owner) => owner === account.address) === undefined && (
          <Grid size={12}>
            <Alert severity="warning">You are not an owner of this Safe.</Alert>
          </Grid>
        )}

        {error && (
          <Grid size={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}

        {transactionHash && (
          <Grid size={12}>
            <Alert severity="info">Transaction hash: {transactionHash}</Alert>
          </Grid>
        )}

        <Grid container size={12}>
          <Grid size={6}>
            <Button
              disabled={
                !(!signature && transactions.length > 0) ||
                (account && safeStorage?.owners?.find((owner) => owner === account.address) === undefined)
              }
              fullWidth
              variant="contained"
              onClick={() => handleSignTransaction()}
            >
              Sign
            </Button>
          </Grid>
          <Grid size={6}>
            <Button
              disabled={
                transactionHash !== undefined || signature === undefined || (safeStorage && safeStorage.threshold > 1n)
              }
              fullWidth
              variant="contained"
              onClick={() => handleExecuteTransaction()}
            >
              Execute
            </Button>
          </Grid>

          <Grid size={4}>
            <Tooltip title="Share transaction data with other signers">
              <span>
                <Button
                  disabled={transactions.length === 0 || !copyUnsignedTxButtonEnabled}
                  variant="outlined"
                  onClick={handleCopyToClipboard}
                  startIcon={<FileUploadIcon />}
                  fullWidth
                >
                  Copy unsigned transaction
                </Button>
              </span>
            </Tooltip>
          </Grid>

          <Grid size={4}>
            <Tooltip title="Copy signed transaction for aggregation. This can be used when there are more than 1 signers for Safe account.">
              <span>
                <Button
                  disabled={transactions.length === 0 || signature === undefined}
                  variant="outlined"
                  onClick={handleCopyToClipboardSigned}
                  startIcon={<ContentCopyIcon />}
                  fullWidth
                >
                  Copy signed transaction
                </Button>
              </span>
            </Tooltip>
          </Grid>

          <Grid size={4}>
            <Button
              disabled={transactions.length === 0}
              variant="outlined"
              onClick={handleViewSafeTransaction}
              fullWidth
              startIcon={<VisibilityIcon />}
            >
              View Safe Transaction
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <ViewSafeTransactionDialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        safeTransaction={safeTransaction}
        safeTransactionHash={safeTransactionHash || "0x"}
      />
      {transactionHash && (
        <WaitForTransactionDialog
          open={waitForTransactionDialogOpen}
          hash={transactionHash}
          onClose={handleCloseWaitingDialog}
        />
      )}
    </Box>
  );
};

export default CreateTransaction;
