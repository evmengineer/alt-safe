import type React from "react";
import type { Transaction, TransactionType } from "../../../context/types";
import ContractCallInput from "./ContractCallInput";
import EthTransferInput from "./EthTransferInput";

interface InputTransactionDataProps {
  transactionType: TransactionType;
  onAdd: (newTransaction: Transaction) => void;
}

const InputTransactionData: React.FC<InputTransactionDataProps> = ({ transactionType, onAdd }) => {
  switch (transactionType) {
    case "ethTransfer":
      return <EthTransferInput onAdd={onAdd} />;
    case "contractCall":
      return <ContractCallInput onAdd={onAdd} />;
    default:
      return null;
  }
};

export default InputTransactionData;
