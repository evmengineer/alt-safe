import { Box, Typography } from "@mui/material";
import type React from "react";

interface FeatureBoxProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureBox: React.FC<FeatureBoxProps> = ({ icon, title, description }) => {
  return (
    <Box>
      <Typography variant="h5" fontWeight={600}>
        {icon} {title}
      </Typography>
      <Typography variant="body1" sx={{ opacity: 0.8 }}>
        {description}
      </Typography>
    </Box>
  );
};

export default FeatureBox;
