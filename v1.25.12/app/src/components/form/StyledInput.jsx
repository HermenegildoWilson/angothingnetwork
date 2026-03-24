import { InputAdornment, TextField } from "@mui/material";

export default function StyledInput({
    sx,
    type = "text",
    label,
    value,
    name,
    handleChangeInput,
    icon,
    InputProps = {},
    ...props
}) {
    return (
        <TextField
            fullWidth
            type={type}
            name={name}
            value={value}
            label={label}
            variant="outlined"
            onChange={handleChangeInput}
            sx={{
                "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "rgba(255,255,255,0.05)",
                    "& fieldset": { borderColor: "rgba(0,0,0,0.15)" },
                    "&:hover fieldset": { borderColor: "primary.main" },
                },
                ...sx,
            }}
            {...props}
            InputProps={{
                startAdornment: icon && (
                    <InputAdornment position="start" sx={{ mr: 1 }}>
                        {icon}
                    </InputAdornment>
                ),
                ...InputProps,
            }}
        />
    );
}