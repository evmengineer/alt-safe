import CancelIcon from "@mui/icons-material/Cancel";
import { Card, CardContent, CardHeader, IconButton, List, ListItem } from "@mui/material";
import type React from "react";
import type { Transaction } from "../../context/types";
import TransactionCard from "./transactionBuilder/TransactionCard";

interface SummaryProps {
  transactions: Transaction[];
  safeTransactionHash?: `0x${string}`;
  handleDeleteTransaction: (id: number) => void;
  viewOnly?: boolean;
}

const Summary: React.FC<SummaryProps> = ({ transactions, handleDeleteTransaction, viewOnly }) => {
  return (
    <Card sx={{ minHeight: "75vh", maxHeight: "75vh", overflowY: "scroll", borderRadius: 0 }}>
      <CardHeader title="Summary" subheader={`Count: ${transactions.length}`} />
      <CardContent>
        <List>
          {transactions.map((transaction, index) => (
            <ListItem
              disablePadding
              sx={{ borderBottom: 1, borderColor: "divider" }}
              key={`${transaction.type}-${index}`}
              secondaryAction={
                !viewOnly && (
                  <IconButton edge="end" aria-label="cancel" onClick={() => handleDeleteTransaction(index)}>
                    <CancelIcon />
                  </IconButton>
                )
              }
            >
              <TransactionCard transaction={transaction} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default Summary;
