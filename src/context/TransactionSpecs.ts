import Aave from "../templates/Aave.json";
import ERC20Spec from "../templates/ERC20.json";
import SafeSpec from "../templates/Safe.json";

import type { TransactionGroupSpec } from "./types";

const transactionBuilderSpec: TransactionGroupSpec[] = [ERC20Spec, Aave, SafeSpec];

export default transactionBuilderSpec;
