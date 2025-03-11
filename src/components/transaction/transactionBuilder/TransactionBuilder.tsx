import { Button, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import type React from "react";
import { useSafeWalletContext } from "../../../context/WalletContext";
import { type Transaction, type TransactionSpec, TransactionType } from "../../../context/types";
import InputTransactionData from "../inputTransactionData/InputTransactionData";
import TransactionInputBuilder from "../inputTransactionData/TransactionInputBuilder";
import TransactionTypePanel from "./TransactionTypePanel";

interface TransactionBuilderProps {
  selectedTransactionType: string;
  group: string;
  importHex: `0x${string}`;
  setImportHex: (value: `0x${string}`) => void;
  handleSelectTransactionType: (group: string, type: string) => void;
  handleAddTransaction: (newTransaction: Transaction) => void;
  handleImportTransactions: () => void;
}

const TransactionBuilder: React.FC<TransactionBuilderProps> = ({
  selectedTransactionType,
  group,
  importHex,
  setImportHex,
  handleSelectTransactionType,
  handleAddTransaction,
  handleImportTransactions,
}) => {
  const { txBuilderSpec } = useSafeWalletContext();
  const keys = txBuilderSpec.flatMap((group) => group.actions.map((action) => action.name));
  const groupNames = txBuilderSpec.map((group) => group.groupName);

  return (
    <Grid container spacing={2} sx={{ overflowY: "scroll", height: "60vh", scrollbarWidth: "thin" }}>
      <Grid size={4}>
        <TransactionTypePanel onSelect={handleSelectTransactionType} />
      </Grid>
      <Grid size={8}>
        {selectedTransactionType === "Eth transfer" && (
          <>
            <Typography variant="h6">ETH Transfer</Typography>
            <InputTransactionData transactionType={TransactionType.ETH_TRANSFER} onAdd={handleAddTransaction} />
          </>
        )}
        {selectedTransactionType === "Send" && (
          <>
            <Typography variant="h6">ERC20 Transfer</Typography>
            <InputTransactionData transactionType={TransactionType.ERC20_TRANSFER} onAdd={handleAddTransaction} />
          </>
        )}
        {selectedTransactionType === "Smart contract call" && (
          <>
            <Typography variant="h6">Smart Contract Call</Typography>
            <InputTransactionData transactionType={TransactionType.CONTRACT_CALL} onAdd={handleAddTransaction} />
          </>
        )}
        {selectedTransactionType === "Import" && (
          <>
            <Typography variant="h6">Import Transactions</Typography>
            <TextField
              label="Hex Encoded JSON"
              value={importHex}
              onChange={(e) => setImportHex(e.target.value as `0x${string}`)}
              fullWidth
              margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleImportTransactions}>
              Import
            </Button>
          </>
        )}
        {groupNames.includes(group) && keys.includes(selectedTransactionType) && (
          <TransactionInputBuilder
            key={`${group}-${selectedTransactionType}`}
            onAdd={handleAddTransaction}
            spec={(() => {
              const groupSpec = txBuilderSpec.find((spec) => spec.groupName === group);
              return groupSpec?.actions.find((action) => action.name === selectedTransactionType) as TransactionSpec;
            })()}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default TransactionBuilder;
