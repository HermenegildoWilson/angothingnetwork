import type { TextFieldProps } from "@mui/material";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { PersonAdd } from "@mui/icons-material";

export type StyledInputProps = TextFieldProps & {
  Icon: LucideIcon | typeof PersonAdd;
};

export type FormFieldsProps = {
  children: ReactNode;
  Fields: StyledInputProps[];
};
