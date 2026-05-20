import type { ElementType, ReactNode } from "react";
import {
  Avatar,
  Box,
  Chip,
  Stack,
  Typography,
  type ChipProps,
} from "@mui/material";
import { MapPin, ChevronRight } from "lucide-react";

type SmartListItemMeta = {
  label: string;
  color?: ChipProps["color"];
  subtitle?: ReactNode;
  action?: ReactNode;
};

export type SmartListItemProps = {
  item: object;
  keys: string[];
  ItemAvatar: ElementType;
  handleItemClick?: (item: unknown) => void;
};

export default function SmartListItem(smartListItemProps: SmartListItemProps) {
  const { ItemAvatar, handleItemClick, item, keys } = smartListItemProps;

  const clickable = Boolean(handleItemClick);
  const itemData = item as Record<string, unknown> & {
    smartListMeta?: SmartListItemMeta;
  };
  const meta = itemData.smartListMeta;

  return (
    <Box
      onClick={() => handleItemClick?.(item)}
      sx={{
        bgcolor: "rgba(255,255,255,0.92)",
        p: 1.25,
        borderRadius: 3,
        cursor: clickable ? "pointer" : "default",
        transition: "transform .2s ease, box-shadow .2s ease, border-color .2s ease",
        display: "flex",
        alignItems: "center",
        border: "1px solid rgba(226, 232, 240, 0.95)",
        boxShadow: "0 10px 28px rgba(15,23,42,0.06)",
        gap: 2,
        "&:hover": {
          transform: clickable ? "translateY(-2px)" : "none",
          borderColor: clickable
            ? "rgba(129, 140, 248, 0.42)"
            : "rgba(226, 232, 240, 0.95)",
          boxShadow: clickable
            ? "0 18px 34px rgba(99,102,241,0.12)"
            : "0 10px 28px rgba(15,23,42,0.06)",
        },
      }}
    >
      <Avatar
        variant="rounded"
        sx={{
          bgcolor: "rgba(129, 140, 248, 0.14)",
          color: "primary.main",
          width: 52,
          height: 52,
          borderRadius: 3,
        }}
      >
        <ItemAvatar size={24} />
      </Avatar>

      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        {keys.map((key, index) => {
          const value = itemData?.[key] || "Atributo indisponível";

          if (index === 0) {
            return (
              <Stack
                key={key}
                direction="row"
                alignItems="center"
                gap={1}
                sx={{ minWidth: 0 }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight="800"
                  fontSize={"1rem"}
                  noWrap
                >
                  {String(value)}
                </Typography>
                <Chip
                  label={meta?.label ?? "Ativo"}
                  color={meta?.color ?? "success"}
                  size="small"
                  variant="outlined"
                  sx={{ height: 22, fontSize: "0.68rem" }}
                />
              </Stack>
            );
          }

          return (
            <Box key={key} display="flex" alignItems="center" gap={0.5} mt={0.35}>
              {key === "locationString" && <MapPin size={14} color="#9e9e9e" />}
              <Typography
                variant="caption"
                fontSize={".8rem"}
                color="text.secondary"
                noWrap
              >
                {String(value)}
              </Typography>
            </Box>
          );
        })}
        {meta?.subtitle && (
          <Typography
            component="div"
            variant="caption"
            color="text.secondary"
            sx={{ mt: 0.35 }}
          >
            {meta.subtitle}
          </Typography>
        )}
      </Box>
      {meta?.action ? (
        <Box
          onClick={(event) => event.stopPropagation()}
          sx={{ flexShrink: 0, display: "flex", alignItems: "center" }}
        >
          {meta.action}
        </Box>
      ) : (
        clickable && <ChevronRight size={20} color="#bdbdbd" />
      )}
    </Box>
  );
}
