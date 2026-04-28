import type { AlertContextType } from "@/components/feedback/alert/types";
import { createContext } from "react";

export const AlertContext = createContext<AlertContextType | null>(null);
