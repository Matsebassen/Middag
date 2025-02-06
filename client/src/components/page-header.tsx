import { Typography } from "@mui/material";
import { ReactNode } from "react";

export const PageHeader = ({ children }: { children: ReactNode }) => {
  return (
    <Typography
      variant="h4"
      variantMapping={{ h4: "h1" }}
      color="CaptionText"
      gutterBottom
    >
      {children}
    </Typography>
  );
};
