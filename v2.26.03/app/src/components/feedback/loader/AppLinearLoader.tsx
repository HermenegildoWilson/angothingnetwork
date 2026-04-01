import LinearProgress, {
  type LinearProgressProps,
} from "@mui/material/LinearProgress";

type AppLinearLoaderProps = LinearProgressProps & {};

export default function AppLinearLoader(
  appLinearLoaderProps: AppLinearLoaderProps,
) {
  const { sx } = appLinearLoaderProps;

  return <LinearProgress sx={{ height: 4, width: "100%", ...sx }} />;
}
