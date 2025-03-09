import { ExpandLess, ExpandMore } from "@mui/icons-material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BlurCircularIcon from "@mui/icons-material/BlurCircular";
import CodeIcon from "@mui/icons-material/Code";
import { Box, Collapse, Divider, List, ListItemText, Typography } from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import React from "react";
import { useSafeWalletContext } from "../../../context/WalletContext";

interface TransactionTypePanelProps {
  onSelect: (group: string, type: string) => void;
}

// Default inbuilt transaction types
const transactionTypes = {
  Token: { icon: <AttachMoneyIcon />, types: ["Send"] },
  Native: { icon: <AccountBalanceWalletIcon />, types: ["Eth transfer"] },
  Other: { icon: <BlurCircularIcon />, types: ["Smart contract call", "Import"] },
};

const TransactionTypePanel: React.FC<TransactionTypePanelProps> = ({ onSelect }) => {
  const { txBuilderSpec } = useSafeWalletContext();
  const [openCategory, setOpenCategory] = React.useState<string | null>(null);
  const [selectedItem, setSelectedItem] = React.useState<string | null>(null);
  const [_selectedGroup, setSelectedGroup] = React.useState<string | null>(null);

  // Import transaction types from spec
  const combinedTransactionTypes = txBuilderSpec.reduce<Record<string, { icon: JSX.Element; types: string[] }>>(
    (acc, group) => {
      acc[group.groupName] = { icon: <CodeIcon />, types: group.actions.map((action) => `${action.name}`) };
      return acc;
    },
    {},
  );

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
        {Object.entries({ ...transactionTypes, ...combinedTransactionTypes }).map(([category, { icon, types }]) => (
          <div key={category}>
            <ListItemButton onClick={() => handleClick(category)}>
              {icon}
              <ListItemText
                primary={
                  <Typography variant="body1" fontWeight="bold" sx={{ marginLeft: 1 }}>
                    {category}
                  </Typography>
                }
              />
              {openCategory === category ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openCategory === category} timeout="auto" unmountOnExit>
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
        ))}
      </List>
    </Box>
  );
};

export default TransactionTypePanel;
