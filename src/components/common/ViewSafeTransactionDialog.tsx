import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import type React from "react";
import type { SafeTransactionParams } from "../../utils/utils";
import MonospacedTextField from "./MonospacedTextField";

interface ViewSafeTransactionDialogProps {
  open: boolean;
  onClose: () => void;
  safeTransaction: SafeTransactionParams | undefined;
  safeTransactionHash: `0x${string}` | undefined;
}

const ViewSafeTransactionDialog: React.FC<ViewSafeTransactionDialogProps> = ({
  open,
  onClose,
  safeTransaction,
  safeTransactionHash,
}) => {
  const handleCopyToClipboard = () => {
    const transactionDetails = {
      to: safeTransaction?.to,
      value: safeTransaction?.value.toString(),
      data: safeTransaction?.data,
      operation: safeTransaction?.operation.toString(),
      safeTxGas: safeTransaction?.safeTxGas.toString(),
      baseGas: safeTransaction?.baseGas.toString(),
      gasPrice: safeTransaction?.gasPrice.toString(),
      gasToken: safeTransaction?.gasToken,
      refundReceiver: safeTransaction?.refundReceiver,
      nonce: safeTransaction?.nonce.toString(),
      safeTransactionHash: safeTransactionHash,
    };
    navigator.clipboard.writeText(JSON.stringify(transactionDetails, null, 2));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Safe Transaction Details</DialogTitle>
      <DialogContent>
        {safeTransaction ? (
          <>
            <MonospacedTextField
              label="To"
              value={safeTransaction.to}
              fullWidth
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
              variant="outlined"
              margin="normal"
            />
            <MonospacedTextField
              label="Value"
              value={safeTransaction.value.toString()}
              fullWidth
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
              variant="outlined"
              margin="normal"
            />
            <MonospacedTextField
              label="Data"
              value={safeTransaction.data}
              fullWidth
              multiline
              minRows={3}
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
              variant="outlined"
              margin="normal"
            />
            <MonospacedTextField
              label="Operation"
              value={safeTransaction.operation.toString()}
              fullWidth
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
              variant="outlined"
              margin="normal"
            />
            <MonospacedTextField
              label="SafeTxGas"
              value={safeTransaction.safeTxGas.toString()}
              fullWidth
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
              variant="outlined"
              margin="normal"
            />
            <MonospacedTextField
              label="BaseGas"
              value={safeTransaction.baseGas.toString()}
              fullWidth
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
              variant="outlined"
              margin="normal"
            />
            <MonospacedTextField
              label="GasPrice"
              value={safeTransaction.gasPrice.toString()}
              fullWidth
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
              variant="outlined"
              margin="normal"
            />
            <MonospacedTextField
              label="GasToken"
              value={safeTransaction.gasToken}
              fullWidth
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
              variant="outlined"
              margin="normal"
            />
            <MonospacedTextField
              label="RefundReceiver"
              value={safeTransaction.refundReceiver}
              fullWidth
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
              variant="outlined"
              margin="normal"
            />
            <MonospacedTextField
              label="Nonce"
              value={safeTransaction.nonce.toString()}
              fullWidth
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
              variant="outlined"
              margin="normal"
            />
            <MonospacedTextField
              label="Safe transaction hash"
              value={safeTransactionHash}
              fullWidth
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
              variant="outlined"
              margin="normal"
            />
          </>
        ) : (
          <Typography>No transaction details available</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          disabled={!safeTransaction || !safeTransactionHash}
          onClick={handleCopyToClipboard}
          startIcon={<ContentCopyIcon />}
          variant="contained"
        >
          Copy to clipboard
        </Button>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewSafeTransactionDialog;
