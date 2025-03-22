import { Box, Typography } from "@mui/material";
import type React from "react";
import { formatEther } from "viem";
import { type Transaction, TransactionType } from "../../../context/types";
import AccountAddress from "../../common/AccountAddress";

interface TransactionCardProps {
  transaction: Transaction;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction }) => {
  if (transaction.type === TransactionType.ETH_TRANSFER) return <EthTransferCard transaction={transaction} />;

  if (transaction.type === TransactionType.ERC20_TRANSFER) return <Erc20TransferCard transaction={transaction} />;

  if (transaction.type === TransactionType.CONTRACT_CALL) return <ContractCallCard transaction={transaction} />;
};

const EthTransferCard: React.FC<TransactionCardProps> = ({ transaction }) => (
  <Box>
    <Typography gutterBottom sx={{ color: "text.secondary", fontSize: 14 }}>
      ETH Transfer
    </Typography>
    <Typography>To:</Typography>
    <AccountAddress address={transaction.to} short />
    <Typography>Value: {formatEther(BigInt(transaction.value))}</Typography>
  </Box>
);

const Erc20TransferCard: React.FC<TransactionCardProps> = ({ transaction }) => (
  <Box>
    <Typography gutterBottom sx={{ color: "text.secondary", fontSize: 14 }}>
      ERC20 Transfer
    </Typography>
    {transaction.erc20TokenTransfer && (
      <>
        <Typography>Token Address:</Typography>{" "}
        <AccountAddress address={transaction.erc20TokenTransfer.tokenAddress} short />
        <Typography>To:</Typography> <AccountAddress address={transaction.erc20TokenTransfer.to} short />
        <Typography>Amount: {transaction.erc20TokenTransfer.amount.toString()}</Typography>
      </>
    )}
  </Box>
);

const ContractCallCard: React.FC<TransactionCardProps> = ({ transaction }) => (
  <Box>
    <Typography gutterBottom sx={{ color: "text.secondary", fontSize: 14 }}>
      Contract Call
    </Typography>
    <Typography>To:</Typography> <AccountAddress address={transaction.to} short />
    <Typography>Data: {transaction.data}</Typography>
  </Box>
);

export default TransactionCard;
