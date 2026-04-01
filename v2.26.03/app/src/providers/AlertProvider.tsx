import { useReducer } from "react";
import type { ReactNode } from "react";

import AppAlert from "../components/feedback/alert/AppAlert";
import { AlertContext } from "../context/AlertContext";
import type { AlertAction, AlertState } from "@/components/feedback/alert/types";

type AlertProviderProps = {
  children: ReactNode;
};

const initialState: AlertState = {
  text: "",
  style: "info",
  show: false,
  duration: 6000,
};

function alertReducer(state: AlertState, action: AlertAction): AlertState {
  switch (action.type) {
    case "SHOW":
      return {
        text: action.text ?? "Informação",
        style: action.style ?? "info",
        show: true,
        title: action.title,
        duration: action.duration ?? 6000,
      };
    case "HIDE":
      return { ...state, show: false };
    default:
      return state;
  }
}

export function AlertProvider({ children }: AlertProviderProps) {
  const [alert, setAlert] = useReducer(alertReducer, initialState);

  return (
    <AlertContext.Provider value={{ alert, setAlert }}>
      <AppAlert />
      {children}
    </AlertContext.Provider>
  );
}
