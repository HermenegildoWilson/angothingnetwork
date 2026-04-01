import { QuestionMark } from "@mui/icons-material";
import { Avatar, Box, Typography } from "@mui/material";
import { MapPin, ChevronRight, Cpu } from "lucide-react";

type SmartListItemProps = {
  item: object;
  keys: string[];
  ItemAvatar: typeof QuestionMark | typeof Cpu;
  handleItemClick: (item: unknown) => void;
};

export default function SmartListItem(smartListItemProps: SmartListItemProps) {
  const { ItemAvatar, handleItemClick, item, keys } = smartListItemProps;
  return (
    <Box
      onClick={() => handleItemClick(item)}
      sx={{
        bgcolor: "background.paper", 
        p: 1,        
        borderRadius: 4,
        cursor: "pointer",
        transition: ".2s",
        display: "flex",
        alignItems: "center",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        gap: 2,   
        "&:hover": {
          scale: 1.01,
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
        <ItemAvatar sx={{ size: 26 }} />
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
                  {String(item?.[key] || "Atributo indisponível")}
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
            <Box display="flex" alignItems="center" gap={0.5} mt={0.2}>
              {key === "locationString" && <MapPin size={14} color="#9e9e9e" />}
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
    </Box>
  );
}
