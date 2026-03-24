import { IconButton, InputAdornment, Stack } from "@mui/material";
import { useState } from "react";
import { Visibility, VisibilityOff, PersonOutline } from "@mui/icons-material";

import StyledInput from "./StyledInput";

export default function FormFields({
    children,
    Fields = [
        {
            label: "",
            name: "",
            type: "",
            value: "",
            icon: PersonOutline,
            handleChange: "",
            required: Boolean,
            ExtraInputProps: {},
        },
    ],
}) {
    const [showPassword, setShowPassword] = useState(false);

    const PasswordProps = {
        endAdornment: (
            <InputAdornment position="end">
                <IconButton
                    aria-label="Alternar visibilidade da senha"
                    onClick={() => setShowPassword((v) => !v)}
                    edge="end"
                    size="small"
                >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
            </InputAdornment>
        ),
    };

    return (
        <Stack spacing={2} py={1}>
            {Fields.map((Field) => (
                <StyledInput
                    key={Field.name}
                    label={Field.label}
                    name={Field.name}
                    type={
                        Field.type === "password"
                            ? showPassword
                                ? "text"
                                : "password"
                            : Field.type
                    }
                    value={Field.value}
                    handleChangeInput={Field.handleChange}
                    required={Field.required}
                    icon={<Field.icon fontSize="small" />}
                    InputProps={
                        Field.type === "password"
                            ? PasswordProps
                            : Field.ExtraInputProps
                    }
                />
            ))}
            {children}
        </Stack>
    );
}
