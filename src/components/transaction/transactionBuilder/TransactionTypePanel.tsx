import { ExpandLess, ExpandMore } from "@mui/icons-material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import BlurCircularIcon from "@mui/icons-material/BlurCircular";
import CodeIcon from "@mui/icons-material/Code";
import { Box, Collapse, Divider, List, ListItemText, Typography } from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import React from "react";
import { useAccount } from "wagmi";
import { useSafeWalletContext } from "../../../context/WalletContext";

interface TransactionTypePanelProps {
  onSelect: (group: string, type: string) => void;
}

// Default inbuilt transaction types
const transactionTypes = {
  Native: { icon: <AccountBalanceWalletIcon />, types: ["Eth transfer"], disabled: false },
  Other: { icon: <BlurCircularIcon />, types: ["Smart contract call", "Import"], disabled: false },
};

const TransactionTypePanel: React.FC<TransactionTypePanelProps> = ({ onSelect }) => {
  const { chainId } = useAccount();
  const { txBuilderSpec } = useSafeWalletContext();
  const [openCategory, setOpenCategory] = React.useState<string | null>(null);
  const [selectedItem, setSelectedItem] = React.useState<string | null>(null);
  const [_selectedGroup, setSelectedGroup] = React.useState<string | null>(null);

  // Import transaction types from spec
  const combinedTransactionTypes = txBuilderSpec.reduce<
    Record<string, { icon: JSX.Element; types: string[]; disabled: boolean }>
  >((acc, group) => {
    acc[group.groupName] = {
      icon: <CodeIcon />,
      types: group.actions.map((action) => `${action.name}`),
      disabled: !(group.chainIds.includes(0) || group.chainIds.includes(chainId || 0)), // Enable if chainIds includes 0 or the current chainId
    };
    return acc;
  }, {});

  const handleClick = (category: string) => {
    setOpenCategory((prevOpen) => (prevOpen === category ? null : category));
  };

  const handleItemClick = (group: string, type: string) => {
    setSelectedItem(type);
    setSelectedGroup(group);
    onSelect(group, type);
  };

  return (
    <Box sx={{ overflowY: "scroll", height: "60vh", scrollbarWidth: "thin" }}>
      <List>
        {Object.entries({ ...transactionTypes, ...combinedTransactionTypes }).map(
          ([category, { icon, types, disabled }]) => (
            <div key={category}>
              <ListItemButton
                onClick={() => !disabled && handleClick(category)}
                disabled={disabled} // Disable the category if `disabled` is true
              >
                {icon}
                <ListItemText
                  primary={
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      sx={{ marginLeft: 1, color: disabled ? "text.disabled" : "inherit" }}
                    >
                      {category}
                    </Typography>
                  }
                />
                {openCategory === category && !disabled ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={openCategory === category && !disabled} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {types.map((type) => (
                    <ListItemButton
                      key={type}
                      onClick={() => handleItemClick(category, type)}
                      sx={{ pl: 4, backgroundColor: selectedItem === type ? "rgba(0, 0, 0, 0.08)" : "inherit" }}
                    >
                      <ListItemText primary={type} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
              <Divider />
            </div>
          ),
        )}
      </List>
    </Box>
  );
};

export default TransactionTypePanel;
