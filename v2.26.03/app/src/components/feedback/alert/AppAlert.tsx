import { forwardRef, useMemo } from "react";
import type { ReactElement, Ref, SyntheticEvent } from "react";
import type { SnackbarCloseReason } from "@mui/material/Snackbar";
import type { TransitionProps } from "@mui/material/transitions";
import { Alert, AlertTitle, IconButton, Slide, Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { alpha, useTheme } from "@mui/material/styles";

import { useAlert } from "@/hooks/useAlert";

const SlideTransition = forwardRef(function SlideTransition(
  props: TransitionProps & { children: ReactElement },
  ref: Ref<unknown>,
) {
  return <Slide ref={ref} {...props} direction="left" />;
});

export default function AppAlert() {
  const { alert, setAlert } = useAlert();
  const theme = useTheme();

  const accentColor = useMemo(() => {
    const palette = theme.palette;
    const colors = {
      success: palette.success.main,
      error: palette.error.main,
      warning: palette.warning.main,
      info: palette.info.main,
    };

    return colors[alert.style];
  }, [alert.style, theme.palette]);

  const handleClose = (
    _event?: SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === "clickaway") return;
    setAlert({ type: "HIDE" });
  };

  return (
    <Snackbar
      open={alert.show}
      onClose={handleClose}
      autoHideDuration={alert.duration ?? 6000}
      TransitionComponent={SlideTransition}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      sx={{ mt: 2, mr: 1 }}
    >
      <Alert
        severity={alert.style}
        variant="outlined"
        action={
          <IconButton
            aria-label="fechar alerta"
            size="small"
            onClick={() => setAlert({ type: "HIDE" })}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
        sx={{
          width: "100%",
          minWidth: { xs: 280, sm: 360 },
          maxWidth: 460,
          borderRadius: 2.5,
          border: `.2px solid ${alpha(accentColor, 0.15)}`,
          bgcolor: alpha(accentColor, 0.13),
          color: theme.palette.text.primary,
          boxShadow: `0 10px 25px ${alpha(accentColor, 0.18)}`,
          backdropFilter: "blur(1px)",
          alignItems: "center",
          "& .MuiAlert-icon": {
            color: accentColor,
            fontSize: 22,
          },
          "& .MuiAlert-message": {
            fontWeight: 600,
            lineHeight: 1.4,
          },
          "& .MuiAlert-action": {
            alignItems: "center",
            paddingTop: 0,
          },
        }}
      >
        {alert.title && (
          <AlertTitle sx={{ fontWeight: 700, mb: 0.5 }}>
            {alert.title}
          </AlertTitle>
        )}
        {alert.text}
      </Alert>
    </Snackbar>
  );
}
