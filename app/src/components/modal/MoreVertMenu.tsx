import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box, type BoxProps } from "@mui/material";

const ITEM_HEIGHT = 48;

type MoreVertMenuProps = {
  options: string[];
  sx?: BoxProps["sx"];
};

export default function MoreVertMenu(moreVertMenuProps: MoreVertMenuProps) {
  const { options, sx } = moreVertMenuProps;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{ ...sx }}
        slotProps={{
          paper: {
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: "18ch",
            },
          },
          list: {
            "aria-labelledby": "long-button",
          },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option}
            selected={option === "Pyxis"}
            sx={{ m: 0 }}
            onClick={handleClose}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
