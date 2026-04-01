import {
  Box,
  Button,
  Container,
  Typography,
  Fab,
  useTheme,
  useMediaQuery,
  Card,
} from "@mui/material";
import { Cpu, Plus } from "lucide-react";
import type { ReactNode } from "react";

type SmartViewProps = {
  items: unknown[];
  title: string;
  subTitle?: string;
  titleButton?: string;
  voidMessage?: string;
  ItemAvatar: typeof Cpu;
  handleCreateNew?: () => void;
  children: ReactNode;
};

export default function SmartView(smartViewProps: SmartViewProps) {
  const {
    children,
    items,
    handleCreateNew,
    subTitle,
    title,
    titleButton = "Adicionar",
    voidMessage = "Sem dados encontrados",
    ItemAvatar,
  } = smartViewProps;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        flex: "1",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 3,
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight="800"
              sx={{
                background: "linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: { xs: "1.75rem", md: "2.125rem" },
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="body2"
              fontSize={"1rem"}
              color="text.secondary"
            >
              {subTitle}
            </Typography>
          </Box>

          {!isMobile && handleCreateNew && (
            <Button
              variant="contained"
              startIcon={<Plus size={25} />}
              onClick={handleCreateNew}
              sx={{
                borderRadius: 2,
                fontWeight: "bold",
                py: 1,
              }}
            >
              {titleButton}
            </Button>
          )}
        </Box>
        <Card
          sx={{
            display: "flex",
            flexFlow: "column",
            gap: 1.5,
            p: 2,
          }}
        >
          {!items.length ? (
            <Box
              sx={{
                p: 3,
                flex: 1,
                borderRadius: 5,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
              }}
            >
              <ItemAvatar size="48" color="#bdbdbd" />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {voidMessage}
              </Typography>
              {!isMobile && handleCreateNew && (
                <Button
                  variant="outlined"
                  onClick={handleCreateNew}
                  sx={{ borderRadius: 3, mt: 2 }}
                >
                  {titleButton}
                </Button>
              )}
            </Box>
          ) : (
            children
          )}
        </Card>
      </Container>

      {isMobile && handleCreateNew && (
        <Fab
          color="primary"
          onClick={handleCreateNew}
          sx={{ position: "fixed", bottom: 32, right: 32 }}
        >
          <Plus />
        </Fab>
      )}
    </Box>
  );
}
