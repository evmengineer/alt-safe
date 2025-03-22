import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import HistoryIcon from "@mui/icons-material/History";
import SettingsIcon from "@mui/icons-material/Settings";
import { Button, Card, CardActions, CardContent, Chip, IconButton, List, ListItem, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { getChains } from "@wagmi/core";
import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Address } from "viem";
import { formatUnits } from "viem";
import { useAccount, useBalance } from "wagmi";
import { STORAGE_KEY } from "../constants";
import { useSafeWalletContext } from "../context/WalletContext";
import type { SafeAccount } from "../context/types";
import { config } from "../wagmi";
import AccountAddress from "./common/AccountAddress";

const ExistingSafeAccounts: React.FC = () => {
  const [safeAccounts, setSafeAccounts] = useState<SafeAccount[]>([]);
  const { setSafeAccount, storage } = useSafeWalletContext();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const storageAccounts = (await storage.getItem(STORAGE_KEY.SAFE_ACCOUNTS)) as SafeAccount[];
      setSafeAccounts(storageAccounts || []);
    })();
  }, [storage]);

  const handleDelete = async (addressToDelete: Address) => {
    const updatedAccounts = safeAccounts.filter((account: SafeAccount) => account.address !== addressToDelete);
    setSafeAccounts(updatedAccounts);
    await storage.setItem(STORAGE_KEY.SAFE_ACCOUNTS, updatedAccounts);
  };

  const handleAddressClick = async (address: Address) => {
    setSafeAccount(address);
    await storage.setItem(STORAGE_KEY.LAST_SELECTED_SAFE_ACCOUNT, address);
    navigate("/safe-info");
  };

  const handleSettingsClick = async (address: Address) => {
    setSafeAccount(address);
    await storage.setItem(STORAGE_KEY.LAST_SELECTED_SAFE_ACCOUNT, address);
    navigate("/settings");
  };

  const onHistoryClick = async () => {
    navigate("/history");
  };

  return (
    <Grid container spacing={2}>
      <Grid sx={{ marginTop: 2 }} container size={12} justifyContent="space-between" alignItems="center">
        <Grid>
          <Typography variant="h4">Safe Accounts</Typography>
        </Grid>
        <Grid>
          <Button variant="outlined" startIcon={<HistoryIcon />} onClick={() => onHistoryClick()}>
            Transaction History
          </Button>
        </Grid>
      </Grid>
      <Grid size={12}>
        {safeAccounts.length > 0 ? (
          <List sx={{ maxHeight: "70vh", overflow: "auto" }}>
            {safeAccounts.map((safeAccount) => (
              <ListItem key={safeAccount.address}>
                <AccountCard
                  safeAccount={safeAccount}
                  onAddressClick={handleAddressClick}
                  onSettingsClick={handleSettingsClick}
                  onDeleteClick={handleDelete}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Grid size={12}>
            <Typography>No accounts available. Create a new account or import existing.</Typography>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

const AccountCard: React.FC<{
  safeAccount: SafeAccount;
  onAddressClick: (address: Address) => void;
  onSettingsClick: (address: Address) => void;
  onDeleteClick: (address: Address) => void;
}> = ({ safeAccount, onAddressClick, onSettingsClick, onDeleteClick }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const chains = getChains(config);

  const address = safeAccount.address;
  const { data: balance } = useBalance({ address });
  const { chainId } = useAccount();

  const isDisabled = !chainId || !safeAccount.chainIds.includes(chainId);

  const handleCopyToClipboard = (address: Address) => {
    navigator.clipboard.writeText(address);
  };

  const getLabels = () => {
    return (
      safeAccount.labels &&
      safeAccount.labels.length > 0 &&
      safeAccount.labels.map((label) => <Chip key={label} label={label} size="small" />)
    );
  };

  return (
    <Card
      sx={{
        opacity: isDisabled ? 0.5 : 1,
        pointerEvents: isDisabled ? "none" : "auto",
        width: "100%",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: isSmallScreen ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isSmallScreen ? "flex-start" : "center",
        }}
      >
        <Grid
          container
          sx={{ cursor: isDisabled ? "not-allowed" : "pointer" }}
          onClick={() => !isDisabled && onAddressClick(address)}
        >
          <Grid container size={{ xs: 12, sm: 12, md: 8 }}>
            <Grid size={12}>
              <Typography variant="h6" fontWeight="bold">
                {safeAccount.name}
              </Typography>
            </Grid>
            <Grid>
              <AccountAddress address={address} short={isSmallScreen} />
            </Grid>
            <Grid container size={12}>
              <Grid size={12}>
                <Typography variant="subtitle2">
                  {formatUnits(balance?.value || 0n, 18)} {balance?.symbol}
                </Typography>
              </Grid>
              <Grid size={12}>
                <Typography variant="caption">
                  {safeAccount.chainIds
                    .map((chainId) => chains.find((chain) => chain.id === chainId)?.name || chainId)
                    .join(", ")}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 4 }}>{getLabels()}</Grid>
        </Grid>
        <CardActions
          sx={{
            marginTop: isSmallScreen ? 2 : 0,
            justifyContent: isSmallScreen ? "flex-start" : "flex-end",
            width: isSmallScreen ? "100%" : "auto",
          }}
        >
          <IconButton size="small" onClick={() => handleCopyToClipboard(address)} sx={{ ml: 1 }} disabled={isDisabled}>
            <ContentCopyIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={() => onSettingsClick(address)} disabled={isDisabled}>
            <SettingsIcon />
          </IconButton>
          <IconButton onClick={() => onDeleteClick(address)} disabled={isDisabled}>
            <DeleteIcon />
          </IconButton>
        </CardActions>
      </CardContent>
    </Card>
  );
};

export default ExistingSafeAccounts;
