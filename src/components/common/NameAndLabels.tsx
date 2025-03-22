import { Button, Chip, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useState } from "react";

interface NameAndLabelsProps {
  name: string;
  setName: (name: string) => void;
  labels: string[];
  setLabels: (labels: string[]) => void;
}

const NameAndLabels: React.FC<NameAndLabelsProps> = ({ name, setName, labels, setLabels }) => {
  const [newLabel, setNewLabel] = useState<string>("");

  const handleAddLabel = () => {
    const trimmedLabel = newLabel.trim();
    if (trimmedLabel !== "" && !labels.includes(trimmedLabel)) {
      setLabels([...labels, trimmedLabel]);
      setNewLabel("");
    }
  };

  const handleRemoveLabel = (label: string) => {
    setLabels(labels.filter((l) => l !== label));
  };

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <TextField label="Account Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
      </Grid>
      <Grid size={12}>
        <TextField label="Add Label" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} fullWidth />
        <Button variant="outlined" onClick={handleAddLabel} sx={{ marginTop: 1 }}>
          Add Label
        </Button>
      </Grid>
      <Grid size={12}>
        {labels.length > 0 && (
          <Typography variant="subtitle1" gutterBottom>
            Labels:
          </Typography>
        )}
        {labels.map((label) => (
          <Chip
            key={label}
            label={label}
            onDelete={() => handleRemoveLabel(label)}
            sx={{ marginRight: 1, marginBottom: 1 }}
          />
        ))}
      </Grid>
    </Grid>
  );
};

export default NameAndLabels;
