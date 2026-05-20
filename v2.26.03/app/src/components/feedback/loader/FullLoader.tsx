import {
  Box,
  Chip,
  LinearProgress,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import {
  AccountCircle,
  CloudQueue,
  Dashboard,
  DeviceThermostat,
  Menu,
  Opacity,
  Sensors,
  VpnKey,
} from "@mui/icons-material";
import AppLinearLoader from "./AppLinearLoader";

const metricCards = [
  { color: "#818cf8", Icon: DeviceThermostat, delay: "0s" },
  { color: "#10b981", Icon: CloudQueue, delay: "0.08s" },
  { color: "#f59e0b", Icon: Opacity, delay: "0.16s" },
  { color: "#ef4444", Icon: Sensors, delay: "0.24s" },
];

const menuItems = [Dashboard, Sensors, VpnKey, AccountCircle];

function SoftBlock({
  width = "100%",
  height,
  rounded = 2,
}: {
  width?: number | string;
  height: number | string;
  rounded?: number;
}) {
  return (
    <Skeleton
      variant="rounded"
      animation="wave"
      width={width}
      height={height}
      sx={{
        borderRadius: rounded,
        bgcolor: "rgba(129, 140, 248, 0.12)",
        "&::after": {
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.72), transparent)",
        },
      }}
    />
  );
}

export default function FullLoader() {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        bgcolor: "#f4f6f8",
        color: "text.primary",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "fixed",
          inset: "0 0 auto 0",
          zIndex: 20,
          bgcolor: "primary.main",
          color: "primary.contrastText",
          boxShadow: "0 10px 30px rgba(99, 102, 241, 0.22)",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          sx={{ minHeight: 56, px: { xs: 2, md: 3 } }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              display: "grid",
              placeItems: "center",
              borderRadius: 2,
              bgcolor: "rgba(255,255,255,0.16)",
            }}
          >
            <Menu />
          </Box>
          <Typography
            variant="h6"
            noWrap
            sx={{ flex: 1, fontWeight: 800, letterSpacing: 0 }}
          >
            Angothingnetwork
          </Typography>
          <Stack direction="row" spacing={1}>
            <Box
              sx={{
                width: 36,
                height: 36,
                display: "grid",
                placeItems: "center",
                borderRadius: "50%",
                bgcolor: "rgba(255,255,255,0.14)",
              }}
            >
              <VpnKey fontSize="small" />
            </Box>
            <Box
              sx={{
                width: 36,
                height: 36,
                display: "grid",
                placeItems: "center",
                borderRadius: "50%",
                bgcolor: "rgba(255,255,255,0.14)",
              }}
            >
              <AccountCircle fontSize="small" />
            </Box>
          </Stack>
        </Stack>
        <AppLinearLoader
          sx={{
            height: 3,
            bgcolor: "rgba(255,255,255,0.2)",
            "& .MuiLinearProgress-bar": {
              bgcolor: "#ffffff",
            },
          }}
        />
      </Box>

      <Box
        sx={{
          width: { xs: 0, sm: 65 },
          flexShrink: 0,
          pt: 8,
          display: { xs: "none", sm: "block" },
          bgcolor: "rgba(255,255,255,0.84)",
          borderRight: "1px solid rgba(148, 163, 184, 0.18)",
          boxShadow: "10px 0 30px rgba(15, 23, 42, 0.04)",
        }}
      >
        <Stack spacing={1.5} alignItems="center" sx={{ mt: 2 }}>
          {menuItems.map((Icon, index) => (
            <Box
              key={index}
              sx={{
                width: 44,
                height: 44,
                display: "grid",
                placeItems: "center",
                borderRadius: 3,
                color: index === 0 ? "primary.main" : "text.secondary",
                bgcolor:
                  index === 0 ? "rgba(129, 140, 248, 0.14)" : "transparent",
              }}
            >
              <Icon fontSize="small" />
            </Box>
          ))}
        </Stack>
      </Box>

      <Box
        component="main"
        sx={{
          flex: 1,
          mt: 7,
          p: { xs: 1.5, md: 2.5 },
          overflowY: "auto",
          background:
            "linear-gradient(135deg, #f6f9fc 0%, #eef2f5 58%, #eef2ff 100%)",
        }}
      >
        <Box sx={{ maxWidth: 1180 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2}
            sx={{ mb: 3 }}
          >
            <Box>
              <SoftBlock width={210} height={30} rounded={2} />
              <Box sx={{ mt: 1 }}>
                <SoftBlock width={300} height={18} rounded={2} />
              </Box>
            </Box>
            <Chip
              label="Carregando ecossistema..."
              sx={{
                color: "#4338ca",
                fontWeight: 800,
                bgcolor: "rgba(129, 140, 248, 0.14)",
                border: "1px solid rgba(129, 140, 248, 0.26)",
              }}
            />
          </Stack>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, minmax(0, 1fr))",
                md: "repeat(4, minmax(140px, 200px))",
              },
              gap: { xs: 1.25, md: 3 },
              mb: 3,
            }}
          >
            {metricCards.map(({ color, Icon, delay }, index) => (
              <Box
                key={color}
                sx={{
                  p: { xs: 1.5, md: 2 },
                  minHeight: { xs: 142, md: 168 },
                  borderRadius: 4,
                  bgcolor: "rgba(255,255,255,0.82)",
                  border: "1px solid rgba(255,255,255,0.72)",
                  boxShadow: "0 20px 40px rgba(15, 23, 42, 0.06)",
                  backdropFilter: "blur(12px)",
                  animation: "loaderFloat 2.4s ease-in-out infinite",
                  animationDelay: delay,
                  "@keyframes loaderFloat": {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-5px)" },
                  },
                }}
              >
                <Stack direction="row" justifyContent="space-between">
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      display: "grid",
                      placeItems: "center",
                      borderRadius: 2,
                      color,
                      bgcolor: `${color}18`,
                    }}
                  >
                    <Icon />
                  </Box>
                  <SoftBlock width={72} height={24} rounded={4} />
                </Stack>
                <Box sx={{ mt: 3 }}>
                  <SoftBlock width={index === 1 ? "62%" : "48%"} height={30} />
                </Box>
                <Box sx={{ mt: 1 }}>
                  <SoftBlock width="72%" height={16} />
                </Box>
                <Box sx={{ mt: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={[78, 56, 68, 42][index]}
                    sx={{
                      height: 6,
                      borderRadius: 999,
                      bgcolor: `${color}18`,
                      "& .MuiLinearProgress-bar": {
                        bgcolor: color,
                        borderRadius: 999,
                      },
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1fr) 340px" },
              gap: { xs: 2, md: 3 },
              mb: 3,
            }}
          >
            <Box
              sx={{
                p: 2,
                minHeight: 330,
                borderRadius: 4,
                bgcolor: "rgba(255,255,255,0.84)",
                boxShadow: "0 20px 40px rgba(15, 23, 42, 0.06)",
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 3 }}
              >
                <SoftBlock width={165} height={26} />
                <SoftBlock width={90} height={28} rounded={4} />
              </Stack>
              <Box
                sx={{
                  height: 220,
                  display: "grid",
                  gridTemplateColumns: "34px 1fr",
                  gap: 1.5,
                  alignItems: "end",
                }}
              >
                <Stack spacing={3} sx={{ pb: 2 }}>
                  {[0, 1, 2, 3].map((item) => (
                    <SoftBlock key={item} width={26} height={10} />
                  ))}
                </Stack>
                <Box
                  sx={{
                    height: "100%",
                    position: "relative",
                    borderBottom: "1px dashed rgba(148, 163, 184, 0.5)",
                    background:
                      "repeating-linear-gradient(to bottom, transparent 0, transparent 53px, rgba(148, 163, 184, 0.14) 54px)",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      inset: "35px 8px 30px 0",
                      borderRadius: "52% 48% 46% 54% / 44% 45% 55% 56%",
                      border: "3px solid #818cf8",
                      borderLeftColor: "transparent",
                      borderBottomColor: "#10b981",
                      opacity: 0.88,
                      transform: "rotate(-8deg)",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      left: "8%",
                      right: "5%",
                      bottom: 30,
                      height: 120,
                      background:
                        "linear-gradient(180deg, rgba(129,140,248,0.18), rgba(16,185,129,0.04))",
                      clipPath:
                        "polygon(0 72%, 16% 54%, 30% 63%, 45% 34%, 62% 45%, 78% 18%, 100% 32%, 100% 100%, 0 100%)",
                    }}
                  />
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                p: 2.5,
                minHeight: 330,
                borderRadius: 4,
                textAlign: "center",
                bgcolor: "rgba(255,255,255,0.84)",
                boxShadow: "0 20px 40px rgba(15, 23, 42, 0.06)",
              }}
            >
              <SoftBlock width={130} height={16} rounded={2} />
              <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                <SoftBlock width={170} height={28} rounded={2} />
              </Box>
              <Box
                sx={{
                  width: 190,
                  height: 120,
                  mx: "auto",
                  mt: 4,
                  borderRadius: "190px 190px 0 0",
                  border: "14px solid rgba(226, 232, 240, 0.95)",
                  borderBottom: 0,
                  position: "relative",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    left: "50%",
                    bottom: -5,
                    width: 78,
                    height: 8,
                    borderRadius: 999,
                    bgcolor: "#10b981",
                    transformOrigin: "left center",
                    transform: "rotate(-24deg)",
                    boxShadow: "0 0 24px rgba(16,185,129,0.35)",
                  },
                }}
              />
              <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
                <SoftBlock width={115} height={34} rounded={3} />
              </Box>
              <Box sx={{ mt: 3 }}>
                <SoftBlock height={42} rounded={2} />
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: { xs: 2, md: 3 },
            }}
          >
            {[0, 1].map((panel) => (
              <Box
                key={panel}
                sx={{
                  p: 2,
                  borderRadius: 4,
                  bgcolor: "rgba(255,255,255,0.84)",
                  boxShadow: "0 20px 40px rgba(15, 23, 42, 0.06)",
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 2.5 }}
                >
                  <SoftBlock width={panel === 0 ? 140 : 190} height={26} />
                  <SoftBlock width={78} height={28} rounded={4} />
                </Stack>
                <Stack spacing={1.5}>
                  {[0, 1, 2].map((item) => (
                    <Stack
                      key={item}
                      direction="row"
                      alignItems="center"
                      spacing={1.5}
                      sx={{
                        p: 1.5,
                        borderRadius: 3,
                        bgcolor:
                          panel === 0
                            ? "rgba(241,245,249,0.88)"
                            : "rgba(255,251,235,0.9)",
                        border:
                          panel === 1
                            ? "1px solid rgba(254, 243, 199, 0.9)"
                            : "none",
                      }}
                    >
                      <SoftBlock width={38} height={38} rounded={3} />
                      <Box sx={{ flex: 1 }}>
                        <SoftBlock width="52%" height={17} />
                        <Box sx={{ mt: 0.75 }}>
                          <SoftBlock width="76%" height={13} />
                        </Box>
                      </Box>
                      <SoftBlock width={58} height={22} rounded={4} />
                    </Stack>
                  ))}
                </Stack>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
