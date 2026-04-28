import { useEffect, useState } from "react";
import { useAlert } from "../../hooks/useAlert";
import { useAuth } from "../../hooks/useAuth";
import { Box } from "@mui/material";
import Text from "@/components/ui/Text";
import AppLoader from "@/components/feedback/loader/AppCircularLoader";
import { Navigate } from "react-router-dom";
import { STATUS } from "@/constants/status";

export default function SignOut() {
  const { signOut } = useAuth();
  const { setAlert } = useAlert();
  const [status, setStatus] = useState(STATUS.LOADING);

  useEffect(() => {
    const Logout = async () => {
      try {
        const { data } = await signOut();

        if (data) {
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
      } finally {
        setStatus(STATUS.IDLE);
      }
    };
    Logout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === STATUS.IDLE) {
    return <Navigate to={"/"} />;
  }

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
      <Text>Saindo...</Text>
      <AppLoader />
    </Box>
  );
}
