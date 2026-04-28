import { Stack } from "@mui/material";

import StyledInput from "./StyledInput";
import type { FormFieldsProps } from "./types";

export default function FormFields(formFieldsProps: FormFieldsProps) {
  const { Fields, children } = formFieldsProps;

  return (
    <Stack spacing={2} py={1}>
      {Fields.map((field) => (
        <StyledInput {...field} />
      ))}
      {children}
    </Stack>
  );
}
