import { AlertContext } from "../context/AlertContext";
import AppAlert from "../components/feedback/AppAlert";

import { useReducer } from "react";

export default function AlertProvider({ children }) {
    const [alert, setAlert] = useReducer(alertRedutor, {
        text: "",
        style: "success", // warning || error || success || info
        show: false, // true || false
    });

    return (
        <AlertContext.Provider value={{ alert, setAlert }}>
            <AppAlert />
            {children}
        </AlertContext.Provider>
    );
}

function alertRedutor(state, action) {
    switch (action.type) {
        case "SHOW":
            return {
                text: action.text || "Informação",
                style: action.style || "success",
                show: true,
            };

        case "HIDE":
            return { ...state, show: false };
        default:
            return state;
    }
}