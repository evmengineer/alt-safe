import type { Address } from "viem";
import type { SafeSignature, SafeTransactionParams } from "../utils/utils";

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

export enum ValueFetchType {
  RPC_CALL = "rpcCall",
}

export type ContextFetchDataType = { method: string; to: string; args: string[]; errorMessage?: string };

export type ContextItem = { type: string; data: ContextFetchDataType; id: string };

export type ContextType = { [key: string]: { type: string; defaultValue: string } | undefined };
export type InputType = { name: string; type: string; options?: Option[]; label: string };
export type Option = { chainId: number; options: SelectOption[] };
export type SelectOption = { name: string; value: any };

export enum ValidationType {
  expression = "expression",
  regex = "regex",
}
type Validation = { variable: string; type: string; value: string; id: string; errorMessage: string };

export interface TransactionSpec {
  name: string;
  functionSignature: string;
  summaryView: string;
  context?: ContextType;
  inputs: InputType[];
  display: { description: string };
  onUpdateValidations: Validation[];
  onInputUpdate: { variable: string; value: ContextItem }[];
  detailsView: { type: string; label: string; value: string }[];
  onFinalize: { to: string; value: string; calldataArgs: string[] };
}

export interface TransactionGroupSpec {
  groupName: string;
  chainIds: number[];
  actions: TransactionSpec[];
}
