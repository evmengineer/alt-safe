import { Button, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useEffect, useState } from "react";
import { type Address, formatUnits, parseUnits, zeroAddress } from "viem";
import { useAccount, usePublicClient } from "wagmi";
import { useSafeWalletContext } from "../../../context/WalletContext";
import { type Transaction, TransactionType } from "../../../context/types";
import MonospacedTextField from "../../common/MonospacedTextField";

interface EthTransferInputProps {
  onAdd: (newTransaction: Transaction) => void;
}

const EthTransferInput: React.FC<EthTransferInputProps> = ({ onAdd }) => {
  const [to, setTo] = useState<Address>(zeroAddress);
  const [value, setValue] = useState<string>("0");
  const [balance, setBalance] = useState<string>("0");
  const publicClient = usePublicClient();
  const { safeAccount } = useSafeWalletContext();

  const { address } = useAccount();

  useEffect(() => {
    const fetchBalance = async () => {
      if (address && publicClient && safeAccount) {
        const balance = await publicClient.getBalance({ address: safeAccount });
        setBalance(formatUnits(balance, 18));
      }
    };

    fetchBalance();
  }, [address, publicClient, safeAccount]);

  const handleAdd = () => {
    const valueInWei = parseUnits(value, 18).toString();
    const newTransaction: Transaction = {
      type: TransactionType.ETH_TRANSFER,
      to,
      value: valueInWei,
      data: "0x",
    };
    onAdd(newTransaction);
  };

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <Typography variant="body1">Current Balance: {balance} ETH</Typography>
      </Grid>
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
          label="Value in ETH"
          value={value}
          onChange={(e) => setValue(e.target.value)}
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

export default EthTransferInput;
