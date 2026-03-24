import { QuestionMark } from "@mui/icons-material";
import {
    Paper,
    Stack,
    Avatar,
    Grow,
    Fade,
    Box,
    Typography,
    Button,
} from "@mui/material";
import { MapPin, ChevronRight } from "lucide-react";

export default function SmartList({
    items = [],
    nameItem = "Items",
    keys = [],
    handleCreateNew,
    ItemAvatar = QuestionMark,
    handleItemClick,
}) {
    return (
        <>
            {items.length === 0 ? (
                <Fade in>
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        py={10}
                        textAlign="center"
                    >
                        <Box
                            sx={{
                                p: 3,
                                bgcolor: "grey.50",
                                borderRadius: "50%",
                                mb: 2,
                            }}
                        >
                            <ItemAvatar
                                size={48}
                                color="#bdbdbd"
                                strokeWidth={1.5}
                            />
                        </Box>
                        <Typography
                            variant="h6"
                            color="text.primary"
                            gutterBottom
                        >
                            Sem {nameItem.toLocaleLowerCase()}
                        </Typography>
                        {handleCreateNew && (
                            <Button
                                variant="outlined"
                                onClick={handleCreateNew}
                                sx={{ borderRadius: 3, mt: 2 }}
                            >
                                Adicionar {nameItem.toLocaleLowerCase()}
                            </Button>
                        )}
                    </Box>
                </Fade>
            ) : (
                <Stack spacing={1.5}>
                    {items.map((item, index) => (
                        <Grow in timeout={400} key={item.id || index}>
                            <Box>
                                <SmartListItem
                                    item={item}
                                    keys={keys}
                                    ItemAvatar={ItemAvatar}
                                    handleItemClick={handleItemClick}
                                />
                            </Box>
                        </Grow>
                    ))}
                </Stack>
            )}
        </>
    );
}

function SmartListItem({
    item = {},
    keys = [],
    // eslint-disable-next-line no-unused-vars
    ItemAvatar = QuestionMark,
    handleItemClick,
}) {
    return (
        <Paper
            elevation={0}
            onClick={() => handleItemClick(item)}
            sx={{
                p: 2,
                borderRadius: 4,
                border: "1px solid #f0f0f0",
                cursor: "pointer",
                transition: "all 0.25s ease",
                display: "flex",
                alignItems: "center",
                gap: 2,
                "&:hover": {
                    borderColor: "primary.light",
                    transform: "scale(1.01)",
                    bgcolor: "#ffffff",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                },
            }}
        >
            <Avatar
                variant="rounded"
                sx={{
                    bgcolor: "#e3f2fd",
                    color: "primary.main",
                    width: 52,
                    height: 52,
                    borderRadius: 3,
                }}
            >
                <ItemAvatar size={26} />
            </Avatar>

            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                {keys.map((key, index) => {
                    if (index === 0) {
                        return (
                            <Box display="flex" alignItems="center" gap={1}>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight="700"
                                    fontSize={"1rem"}
                                    noWrap
                                >
                                    {String(
                                        item?.[key] || "Atributo indisponível",
                                    )}
                                </Typography>
                                <Box
                                    sx={{
                                        width: 8,
                                        height: 8,
                                        bgcolor: "#4caf50",
                                        borderRadius: "50%",
                                    }}
                                />
                            </Box>
                        );
                    }

                    return (
                        <Box
                            display="flex"
                            alignItems="center"
                            gap={0.5}
                            mt={0.2}
                        >
                            {key === "locationString" && (
                                <MapPin size={14} color="#9e9e9e" />
                            )}
                            <Typography
                                variant="caption"
                                fontSize={".8rem"}
                                color="text.secondary"
                                noWrap
                            >
                                {item?.[key] || "Atributo indisponível"}
                            </Typography>
                        </Box>
                    );
                })}
            </Box>
            <ChevronRight size={20} color="#bdbdbd" />
        </Paper>
    );
}
