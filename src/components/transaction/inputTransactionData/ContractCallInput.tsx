import { Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useState } from "react";
import { type Address, zeroAddress } from "viem";
import { type Transaction, TransactionType } from "../../../context/types";
import MonospacedTextField from "../../common/MonospacedTextField";

interface ContractCallInputProps {
  onAdd: (newTransaction: Transaction) => void;
}

const ContractCallInput: React.FC<ContractCallInputProps> = ({ onAdd }) => {
  const [to, setTo] = useState<Address>(zeroAddress);
  const [value, setValue] = useState<string>("0");
  const [data, setData] = useState<`0x${string}`>("0x");

  const handleAdd = () => {
    const newTransaction: Transaction = {
      type: TransactionType.CONTRACT_CALL,
      to,
      value,
      data,
    };
    onAdd(newTransaction);
  };

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <MonospacedTextField
          label="To"
          value={to}
          onChange={(e) => setTo(e.target.value as Address)}
          fullWidth
          margin="normal"
        />
      </Grid>
      <Grid size={12}>
        <MonospacedTextField
          label="Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          fullWidth
          margin="normal"
        />
      </Grid>
      <Grid size={12}>
        <MonospacedTextField
          label="Data"
          value={data}
          onChange={(e) => setData(e.target.value as `0x${string}`)}
          fullWidth
          margin="normal"
        />
      </Grid>
      <Grid size={12} display="flex" justifyContent="flex-end">
        <Button onClick={handleAdd} color="primary" variant="contained">
          Add to batch
        </Button>
      </Grid>
    </Grid>
  );
};

export default ContractCallInput;
