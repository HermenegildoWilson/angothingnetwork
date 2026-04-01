import { Box } from "@mui/material";
import CardsTelemetria from "../Devices/CardsTelemetria";

export default function Dashboard() {
  return (
    <Box sx={{ flex: 1, p: 4 }}>
      <CardsTelemetria />
    </Box>
  );
}
