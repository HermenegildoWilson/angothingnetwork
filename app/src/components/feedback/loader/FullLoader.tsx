import { Box, Container, Typography } from "@mui/material";
import AppLinearLoader from "./AppLinearLoader";
import AppCircularLoader from "./AppCircularLoader";

export default function FullLoader() {
  return (
    <Box sx={{ height: "100vh", display: "flex", flexFlow: "column" }}>
      <AppLinearLoader />
      <Container
        sx={{
          flex: 1,
          display: "flex",
          flexFlow: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography variant="body1" sx={{ opacity: 1 }}>
          Carregando dados da aplicação...
        </Typography>
        <AppCircularLoader />
      </Container>
    </Box>
  );
}
