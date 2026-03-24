<Box
    sx={{
        mb: 4,
        display: "flex",
        alignItems: "center",
        gap: 2,
    }}
>
    <IconButton
        onClick={handleBack}
        sx={{
            bgcolor: "white",
            "&:hover": { bgcolor: "primary.50" },
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
    >
        <ArrowLeft size={20} />
    </IconButton>
    <Breadcrumbs separator={<ChevronRightIcon size={14} />}>
        <Link
            underline="hover"
            color="inherit"
            onClick={() => navigate("/")}
            sx={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
            }}
        >
            Dispositivos
        </Link>
        <Typography color="text.primary" fontWeight="600">
            Detalhes do Sensor
        </Typography>
    </Breadcrumbs>
</Box>;
