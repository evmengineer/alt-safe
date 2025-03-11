import { Button, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import type React from "react";
import { useNavigate } from "react-router-dom";
import { useBalance } from "wagmi";
import { useSafeWalletContext } from "../../context/WalletContext";
import AccountAddress from "../common/AccountAddress";
import Title from "../common/Title";

const SafeInfo: React.FC = () => {
  const { safeAccount } = useSafeWalletContext();
  const { data: balance } = useBalance({ address: safeAccount });
  const navigate = useNavigate();

  const handleBuildTransaction = () => {
    navigate("/transact");
  };

  const handleAggregateSignatures = () => {
    navigate("/aggregate-signatures");
  };

  return (
    <>
      <Grid container spacing={2} alignItems="center">
        <Grid size={12}>
          <Title text="Safe Account" />
          <AccountAddress address={safeAccount} />
        </Grid>
        <Grid size={12}>
          <Typography variant="h6">Balance</Typography>
          <Typography>
            {balance?.formatted} {balance?.symbol}
          </Typography>
        </Grid>
        <Grid container size={12}>
          <Grid size={6}>
            <Button fullWidth variant="contained" onClick={handleBuildTransaction}>
              Build a transaction
            </Button>
          </Grid>
          <Grid size={6}>
            <Button fullWidth variant="outlined" onClick={handleAggregateSignatures}>
              Aggregate signatures and execute
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default SafeInfo;
