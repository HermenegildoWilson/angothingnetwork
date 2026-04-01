import type { Dispatch } from "react";
export type AlertSeverity = "success" | "warning" | "error" | "info";

export type AlertState = {
  text: string;
  style: AlertSeverity;
  show: boolean;
  title?: string;
  duration?: number;
};

export type AlertAction =
  | {
      type: "SHOW";
      text?: string;
      style?: AlertSeverity;
      title?: string;
      duration?: number;
    }
  | {
      type: "HIDE";
    };

export type AlertContextType = {
  alert: AlertState;
  setAlert: Dispatch<AlertAction>;
};
