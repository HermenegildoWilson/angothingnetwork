import { Box, Card, Container, Paper, Skeleton, Stack } from "@mui/material";

function SoftSkeleton({
  height,
  rounded = 2,
  width = "100%",
}: {
  height: number | string;
  rounded?: number;
  width?: number | string;
}) {
  return (
    <Skeleton
      animation="wave"
      variant="rounded"
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

export function ListPageSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 3,
      }}
    >
      <Container maxWidth="md">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 4 }}
        >
          <Box>
            <SoftSkeleton width={220} height={34} />
            <Box sx={{ mt: 1 }}>
              <SoftSkeleton width={280} height={18} />
            </Box>
          </Box>
          <SoftSkeleton width={120} height={40} rounded={3} />
        </Stack>

        <Card sx={{ p: 2, borderRadius: 4 }}>
          <Stack spacing={1.5}>
            {Array.from({ length: rows }).map((_, index) => (
              <Paper
                key={index}
                elevation={0}
                sx={{
                  p: 1.5,
                  borderRadius: 3,
                  border: "1px solid rgba(226,232,240,0.85)",
                  bgcolor: "rgba(255,255,255,0.74)",
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <SoftSkeleton width={44} height={44} rounded={3} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <SoftSkeleton width="48%" height={18} />
                    <Box sx={{ mt: 1 }}>
                      <SoftSkeleton width="68%" height={14} />
                    </Box>
                  </Box>
                  <SoftSkeleton width={82} height={28} rounded={3} />
                </Stack>
              </Paper>
            ))}
          </Stack>
        </Card>
      </Container>
    </Box>
  );
}

export function DashboardSkeleton() {
  return (
    <Box sx={{ flex: 1, width: "100%", p: { xs: 1.25, sm: 2, lg: 3 } }}>
      <Box sx={{ maxWidth: 1180, mx: "auto", mb: 5 }}>
        <SoftSkeleton width={180} height={34} />
        <Box sx={{ mt: 1, mb: 3 }}>
          <SoftSkeleton width={330} height={18} />
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, minmax(0, 1fr))",
              md: "repeat(4, minmax(140px, 1fr))",
            },
            gap: { xs: 1.25, md: 2 },
            mb: 3,
          }}
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} sx={{ p: 2, minHeight: 150, borderRadius: 4 }}>
              <Stack spacing={2}>
                <SoftSkeleton width={42} height={42} rounded={3} />
                <SoftSkeleton width="70%" height={18} />
                <SoftSkeleton width="45%" height={30} />
              </Stack>
            </Card>
          ))}
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "repeat(2, 1fr)" },
            gap: { xs: 2, md: 3 },
          }}
        >
          {Array.from({ length: 2 }).map((_, panelIndex) => (
            <Card key={panelIndex} sx={{ p: 2, borderRadius: 4 }}>
              <Stack spacing={1.5}>
                <SoftSkeleton width={170} height={26} />
                {Array.from({ length: 3 }).map((__, itemIndex) => (
                  <SoftSkeleton key={itemIndex} height={72} rounded={3} />
                ))}
              </Stack>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export function DeviceDetailSkeleton() {
  return (
    <Box sx={{ flex: 1, p: 2 }}>
      <Container maxWidth="md">
        <Box
          sx={{
            display: "grid",
            gap: 4,
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          }}
        >
          <Card sx={{ p: 3, borderRadius: 4 }}>
            <Stack alignItems="center" spacing={2}>
              <SoftSkeleton width={80} height={80} rounded={4} />
              <SoftSkeleton width={180} height={28} />
              <SoftSkeleton width={150} height={20} />
            </Stack>
            <Stack spacing={2.5} sx={{ mt: 4 }}>
              {Array.from({ length: 4 }).map((_, index) => (
                <Stack key={index} direction="row" spacing={2}>
                  <SoftSkeleton width={40} height={40} rounded={3} />
                  <Box sx={{ flex: 1 }}>
                    <SoftSkeleton width="42%" height={13} />
                    <Box sx={{ mt: 1 }}>
                      <SoftSkeleton width="72%" height={18} />
                    </Box>
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Card>
          <Card sx={{ p: 3, borderRadius: 4 }}>
            <Stack spacing={2}>
              <SoftSkeleton width="65%" height={24} />
              <SoftSkeleton height={120} rounded={4} />
              <SoftSkeleton height={120} rounded={4} />
            </Stack>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}

export function ProfileSkeleton() {
  return (
    <Box sx={{ py: { xs: 2, md: 2.5 } }}>
      <Box maxWidth="sm" margin="auto" p={1}>
        <Card sx={{ p: 3, borderRadius: 4 }}>
          <Stack alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
            <SoftSkeleton width={110} height={110} rounded={6} />
            <SoftSkeleton width={190} height={26} />
          </Stack>
          <Stack spacing={1.25}>
            {Array.from({ length: 6 }).map((_, index) => (
              <SoftSkeleton key={index} height={68} rounded={4} />
            ))}
          </Stack>
        </Card>
      </Box>
    </Box>
  );
}

export function PresenceSkeleton() {
  return (
    <Box sx={{ flex: 1, p: { xs: 1, md: 2 } }}>
      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          p: { xs: 1.5, md: 2 },
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Box>
            <SoftSkeleton width={220} height={30} />
            <Box sx={{ mt: 1 }}>
              <SoftSkeleton width={160} height={16} />
            </Box>
          </Box>
          <SoftSkeleton width={90} height={32} rounded={3} />
        </Stack>
        <Stack spacing={1.5}>
          {Array.from({ length: 4 }).map((_, index) => (
            <SoftSkeleton key={index} height={78} rounded={3} />
          ))}
        </Stack>
      </Paper>
    </Box>
  );
}

export function HistorySkeleton() {
  return (
    <Box sx={{ flex: 1, p: 1 }}>
      <SoftSkeleton height={118} rounded={2} />
      <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} py={1}>
        {Array.from({ length: 3 }).map((_, index) => (
          <SoftSkeleton key={index} height={74} rounded={2} />
        ))}
      </Stack>
      <SoftSkeleton height={420} rounded={4} />
    </Box>
  );
}

export function RealTimeSkeleton() {
  return (
    <Box sx={{ flex: 1, p: 1 }}>
      <SoftSkeleton height={118} rounded={2} />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "minmax(280px, 420px) 1fr" },
          gap: 2,
          alignItems: "stretch",
          pt: 1,
        }}
      >
        <Card
          sx={{
            p: { xs: 2, md: 3 },
            minHeight: { xs: 300, md: 420 },
            display: "grid",
            placeItems: "center",
            borderRadius: 4,
          }}
        >
          <Box
            sx={{
              width: { xs: 220, sm: 260 },
              maxWidth: "80vw",
              aspectRatio: "1 / 1",
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              background:
                "radial-gradient(circle, rgba(129,140,248,0.08) 0%, rgba(129,140,248,0.14) 58%, rgba(255,255,255,0.72) 59%)",
              border: "1px solid rgba(129,140,248,0.18)",
            }}
          >
            <SoftSkeleton width="46%" height={38} rounded={3} />
          </Box>
        </Card>

        <Card
          sx={{
            p: { xs: 2, md: 3 },
            minHeight: 420,
            display: { xs: "none", md: "block" },
            borderRadius: 4,
          }}
        >
          <Stack spacing={2}>
            <SoftSkeleton width={180} height={24} />
            <SoftSkeleton height={320} rounded={4} />
          </Stack>
        </Card>
      </Box>
    </Box>
  );
}
