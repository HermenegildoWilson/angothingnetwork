import type { AlertContextType } from "@/types/alertTypes";
import { createContext } from "react";

export const AlertContext = createContext<AlertContextType | null>(null);
