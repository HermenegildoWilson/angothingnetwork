import { useEffect } from "react";
import { useAlert } from "../../hooks/useAlert";
import { useAuth } from "../../hooks/useAuth";
import { Box, Typography } from "@mui/material";

export default function SignOut() {
  const { signOut } = useAuth();
  const { setAlert } = useAlert();

  useEffect(() => {
    const Logout = async () => {
      const data = await signOut();

      if (data.success) {
        return setAlert({
          type: "SHOW",
          text: data.message,
          style: "success",
        });
      }
      setAlert({
        type: "SHOW",
        text: data.message,
        style: "warning",
      });
    };
    Logout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      sx={{
        height: "89.9vh",
        display: "flex",
        flexFlow: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      <Typography variant="body1" fontSize={"1.3rem"}>
        Saindo...
      </Typography>
    </Box>
  );
}
