import type { Address } from "viem";
import type { SafeSignature, SafeTransactionParams } from "../../utils/utils";

export interface Transaction {
  type: TransactionType;
  to: Address;
  value: string;
  data: `0x${string}`;
  erc20TokenTransfer?: {
    tokenAddress: Address;
    to: Address;
    amount: string;
  };
}

export enum TransactionType {
  ETH_TRANSFER = "ethTransfer",
  ERC20_TRANSFER = "erc20Transfer",
  CONTRACT_CALL = "contractCall",
}

export type ImportData = {
  transactions: Transaction[];
  safeAccount: Address;
  safeTransaction: SafeTransactionParams;
  safeTransactionHash: `0x${string}`;
};

export type ImportSignedData = ImportData & {
  signature: SafeSignature;
};
