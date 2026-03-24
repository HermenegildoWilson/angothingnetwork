import { useState } from "react";
import { Paper, IconButton, Autocomplete, TextField } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";

export default function FilterBar({
    parametros = ["Temperatura", "Humidade", "Pressão do Ar", "Qualidade do Ar"],
    onApply,
}) {
    const [value, setValue] = useState(parametros?.[0]);
    const [open, setOpen] = useState(false);

    const handleChange = (_, newValue) => {
        setValue(newValue);
        onApply?.(newValue);
    };

    return (
        <Paper
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                p: 0.1,
                width: "100%",
                maxWidth: 225,
                borderRadius: 2,
                overflow: "hidden",
            }}
        >
            <IconButton size="small" onClick={() => setOpen((v) => !v)}>
                <FilterListIcon />
            </IconButton>

            <Autocomplete
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                options={parametros}
                value={value}
                onChange={handleChange}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="standard"
                        placeholder="Filtrar..."
                        InputProps={{
                            ...params.InputProps,
                            disableUnderline: true,
                        }}
                        sx={{ minWidth: 180 }}
                    />
                )}
            />
        </Paper>
    );
}
