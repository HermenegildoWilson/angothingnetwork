import CircularProgress from "@mui/material/CircularProgress";

export default function AppLoader({ type }) {
    if (type === "small") {
        return <CircularProgress sx={{ ml: 1, color: "divider" }} size={20} />;
    }

    return <CircularProgress thickness={5} enableTrackSlot size={40} />;
}
