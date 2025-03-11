import { Card, CardContent, Typography } from "@mui/material";
import type React from "react";

interface FeatureBoxProps {
  icon: JSX.Element;
  title: string;
  description: string;
}

const FeatureBox: React.FC<FeatureBoxProps> = ({ icon, title, description }) => {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        {icon}
        <Typography variant="h5" fontWeight={600}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default FeatureBox;
