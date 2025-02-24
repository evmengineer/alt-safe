import { Typography, type TypographyProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import { getShortAddress } from "../../utils/utils";

const StyledTypography = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontFamily: "'Roboto Mono', monospace",
  borderRadius: theme.shape.borderRadius,
}));

interface AccountAddressProps {
  address: `0x${string}` | undefined;
  short?: boolean;
}

export default function AccountAddress({ address, short = false }: AccountAddressProps) {
  if (!address || address.length !== 42 || !address.startsWith("0x")) {
    return <Typography color="error">Invalid Ethereum Address</Typography>;
  }

  const formattedAddress = short ? getShortAddress(address) : address;

  return (
    <StyledTypography variant="body1" component="span">
      {formattedAddress}
    </StyledTypography>
  );
}
