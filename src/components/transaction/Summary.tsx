import { Card, CardContent, CardHeader, Divider } from "@mui/material";
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
        {transactions.map((transaction, index) => (
          <div key={`${transaction.type}-${index}`}>
            <TransactionCard
              viewOnly={viewOnly}
              transaction={{ ...transaction, id: index }}
              onDelete={handleDeleteTransaction}
            />
            <Divider />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default Summary;
