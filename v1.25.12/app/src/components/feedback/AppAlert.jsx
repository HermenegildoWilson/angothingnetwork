import * as React from "react";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";
import { useAlert } from "../../hooks/useAlert";
import { Snackbar } from "@mui/material";

export default function AppAlert() {
    const { alert, setAlert } = useAlert();

    React.useEffect(() => {
        if (alert.show) {
            const timer = setTimeout(() => {
                setAlert({ type: "HIDE" }); // fecha automaticamente após o tempo definido
            }, 8000);
            return () => clearTimeout(timer);
        }
    }, [alert]);
    //className="absolute bottom-8 left-5"
    return (
        <Snackbar open={alert.show} >
            <Collapse in={alert.show}>
                <Alert
                    severity={alert.style}
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                setAlert({ type: "HIDE" });
                            }}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                    sx={{ mb: 2 }}
                >
                    {alert.text}
                </Alert>
            </Collapse>
        </Snackbar>
    );
}