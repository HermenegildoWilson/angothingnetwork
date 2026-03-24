import React, { useState } from "react";
import {
    Box,
    Typography,
    Stepper,
    Step,
    StepLabel,
    Button,
    TextField,
    Card,
    CardContent,
    Grid,
    IconButton,
    Paper,
    Divider,
    Alert,
    Fade,
    Grow,
    Chip,
    Container,
    StepConnector,
    stepConnectorClasses,
    styled,
} from "@mui/material";
import {
    Cpu,
    MapPin,
    Settings,
    CheckCircle,
    ChevronRight,
    ChevronLeft,
    Plus,
    Trash2,
    Save,
    Activity,
    Globe,
} from "lucide-react";
import StyledInput from "../../components/form/StyledInput";

// --- Estilização Personalizada do Stepper ---
const QontoConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 22, // Ajuste vertical
        left: "calc(-50% + 20px)",
        right: "calc(50% + 20px)",
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            borderColor: "#3f51b5",
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            borderColor: "#4caf50",
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        borderColor:
            theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
        borderTopWidth: 3,
        borderRadius: 1,
    },
}));

const steps = ["Identificação", "Localização", "Parâmetros", "Revisão"];

export default function FormSteps({ children }) {
    const [activeStep, setActiveStep] = useState(0);
    const [submitted, setSubmitted] = useState(false);

    // Estado principal do formulário
    const [formData, setFormData] = useState({
        sensor_code: "",
        location: {
            pais: "Angola",
            provincia: "Uíge",
            cidade: "",
            latitude: "",
            longitude: "",
        },
        parameters: [],
    });

    // Estado temporário para adicionar um novo parâmetro
    const [newParameter, setNewParameter] = useState({ name: "", unit: "" });

    // --- Validação ---
    const isStepValid = () => {
        switch (activeStep) {
            case 0: // Identificação
                return formData.sensor_code.trim().length > 0;
            case 1: // Localização
                const loc = formData.location;
                return (
                    loc.pais.trim() !== "" &&
                    loc.provincia.trim() !== "" &&
                    loc.cidade.trim() !== "" &&
                    String(loc.latitude).trim() !== "" &&
                    String(loc.longitude).trim() !== ""
                );
            case 2: // Parâmetros
                return formData.parameters.length > 0;
            default:
                return true;
        }
    };

    // --- Manipuladores ---

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleLocationChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            location: { ...formData.location, [name]: value },
        });
    };

    const handleAddParameter = () => {
        if (newParameter.name && newParameter.unit) {
            setFormData({
                ...formData,
                parameters: [
                    ...formData.parameters,
                    { ...newParameter, id: Date.now() },
                ],
            });
            setNewParameter({ name: "", unit: "" });
        }
    };

    const handleRemoveParameter = (id) => {
        setFormData({
            ...formData,
            parameters: formData.parameters.filter((p) => p.id !== id),
        });
    };

    const handleNext = () => {
        if (isStepValid()) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSubmit = () => {
        const payload = {
            sensors: {
                sensor_code: formData.sensor_code,
                created_at: new Date().toISOString(),
            },
            sensor_location: {
                pais: formData.location.pais,
                provincia: formData.location.provincia,
                cidade: formData.location.cidade,
                latitude: parseFloat(formData.location.latitude) || 0,
                longitude: parseFloat(formData.location.longitude) || 0,
            },
            sensor_parameters: formData.parameters.map((p) => ({
                parameter_name: p.name,
                unit: p.unit,
            })),
        };
        console.log("Payload:", payload);

        setSubmitted(true);
    };

    // --- Renderização dos Passos (Conteúdo) ---
    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Box className="step-content">
                        <Typography
                            variant="h6"
                            fontWeight="600"
                            color="primary"
                            gutterBottom
                            display="flex"
                            alignItems="center"
                            gap={1.5}
                        >
                            <Cpu className="text-blue-600" /> Identificação do
                            Dispositivo
                        </Typography>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            paragraph
                            sx={{ mb: 4 }}
                        >
                            Vamos começar identificando o hardware. Insira o
                            código único do sensor.
                        </Typography>

                        <StyledInput
                            icon={<Activity />}
                            label="Código do Sensor (ID Único)"
                            value={formData.sensor_code}
                            placeholder="Ex: ESP32-SENS-001"
                            name="sensor_code"
                            handleChangeInput={handleInputChange}
                            required
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 3,
                                    bgcolor: "background.paper",
                                },
                            }}
                        />
                    </Box>
                );

            case 1:
                return (
                    <Box className="step-content">
                        <Typography
                            variant="h5"
                            fontWeight="600"
                            color="primary"
                            gutterBottom
                            display="flex"
                            alignItems="center"
                            gap={1}
                        >
                            <Globe className="text-green-600" /> Localização
                            Geográfica
                        </Typography>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            paragraph
                            sx={{ mb: 2 }}
                        >
                            Precisamos saber onde este dispositivo está
                            fisicamente instalado.
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    label="País"
                                    name="pais"
                                    value={formData.location.pais}
                                    //onChange={handleLocationChange}
                                    variant="outlined"
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 2,
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    label="Província"
                                    name="provincia"
                                    value={formData.location.provincia}
                                    //onChange={handleLocationChange}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 2,
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    label="Cidade"
                                    name="cidade"
                                    value={formData.location.cidade}
                                    onChange={handleLocationChange}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 2,
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Latitude"
                                    name="latitude"
                                    type="number"
                                    value={formData.location.latitude}
                                    onChange={handleLocationChange}
                                    placeholder="-8.83833"
                                    InputProps={{
                                        startAdornment: (
                                            <MapPin
                                                size={18}
                                                style={{
                                                    marginRight: 8,
                                                    opacity: 0.5,
                                                }}
                                            />
                                        ),
                                    }}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 2,
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Longitude"
                                    name="longitude"
                                    type="number"
                                    value={formData.location.longitude}
                                    onChange={handleLocationChange}
                                    placeholder="13.23444"
                                    InputProps={{
                                        startAdornment: (
                                            <MapPin
                                                size={18}
                                                style={{
                                                    marginRight: 8,
                                                    opacity: 0.5,
                                                }}
                                            />
                                        ),
                                    }}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 2,
                                        },
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                );

            case 2:
                return (
                    <Box className="step-content">
                        <Typography
                            variant="h5"
                            fontWeight="600"
                            color="primary"
                            gutterBottom
                            display="flex"
                            alignItems="center"
                            gap={1.5}
                        >
                            <Settings className="text-orange-500" /> Parâmetros
                            de Leitura
                        </Typography>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            paragraph
                        >
                            Configure o que este sensor deve ler. Adicione pelo
                            menos um parâmetro.
                        </Typography>

                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                mb: 3,
                                bgcolor: "grey.50",
                                border: "1px dashed #ccc",
                                borderRadius: 4,
                            }}
                        >
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} sm={5}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Nome (ex: Temperatura)"
                                        value={newParameter.name}
                                        onChange={(e) =>
                                            setNewParameter({
                                                ...newParameter,
                                                name: e.target.value,
                                            })
                                        }
                                        sx={{ bgcolor: "white" }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Unidade (ex: °C)"
                                        value={newParameter.unit}
                                        onChange={(e) =>
                                            setNewParameter({
                                                ...newParameter,
                                                unit: e.target.value,
                                            })
                                        }
                                        sx={{ bgcolor: "white" }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        onClick={handleAddParameter}
                                        startIcon={<Plus size={18} />}
                                        disabled={
                                            !newParameter.name ||
                                            !newParameter.unit
                                        }
                                        sx={{
                                            borderRadius: 2,
                                            textTransform: "none",
                                            height: 40,
                                            boxShadow: "none",
                                        }}
                                    >
                                        Adicionar
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>

                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                            }}
                        >
                            {formData.parameters.length === 0 && (
                                <Alert
                                    severity="warning"
                                    variant="outlined"
                                    sx={{ borderRadius: 2 }}
                                >
                                    A lista de parâmetros está vazia. Adicione
                                    um item acima.
                                </Alert>
                            )}
                            {formData.parameters.map((param, index) => (
                                <Grow
                                    in={true}
                                    key={param.id}
                                    timeout={300 * (index + 1)}
                                >
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 2,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            border: "1px solid #e0e0e0",
                                            borderRadius: 3,
                                            transition: "all 0.2s",
                                            "&:hover": {
                                                borderColor: "primary.main",
                                                bgcolor: "#f5f9ff",
                                            },
                                        }}
                                    >
                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            gap={2}
                                        >
                                            <Box
                                                sx={{
                                                    p: 1,
                                                    bgcolor: "primary.light",
                                                    borderRadius: "50%",
                                                    color: "white",
                                                    display: "flex",
                                                }}
                                            >
                                                <Activity size={18} />
                                            </Box>
                                            <Box>
                                                <Typography
                                                    variant="subtitle2"
                                                    fontWeight="bold"
                                                >
                                                    {param.name}
                                                </Typography>
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    Unidade: {param.unit}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <IconButton
                                            size="small"
                                            onClick={() =>
                                                handleRemoveParameter(param.id)
                                            }
                                            color="error"
                                            sx={{ bgcolor: "#ffebee" }}
                                        >
                                            <Trash2 size={16} />
                                        </IconButton>
                                    </Paper>
                                </Grow>
                            ))}
                        </Box>
                    </Box>
                );

            case 3:
                return (
                    <Box className="step-content">
                        <Typography
                            variant="h5"
                            fontWeight="600"
                            color="primary"
                            gutterBottom
                            display="flex"
                            alignItems="center"
                            gap={1.5}
                        >
                            <CheckCircle className="text-purple-600" /> Resumo
                            Final
                        </Typography>
                        <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                            Confirme os dados abaixo. Esta ação enviará as
                            configurações para o servidor.
                        </Alert>

                        <Paper
                            variant="outlined"
                            sx={{
                                p: 0,
                                overflow: "hidden",
                                borderRadius: 4,
                                borderColor: "#e0e0e0",
                            }}
                        >
                            <Box
                                sx={{
                                    p: 3,
                                    bgcolor: "#f8fafc",
                                    borderBottom: "1px solid #e0e0e0",
                                }}
                            >
                                <Typography
                                    variant="overline"
                                    color="text.secondary"
                                    fontWeight="bold"
                                >
                                    IDENTIFICAÇÃO
                                </Typography>
                                <Typography variant="h6">
                                    {formData.sensor_code}
                                </Typography>
                            </Box>

                            <Grid container>
                                <Grid
                                    item
                                    xs={12}
                                    md={6}
                                    sx={{
                                        p: 3,
                                        borderRight: {
                                            md: "1px solid #e0e0e0",
                                        },
                                        borderBottom: {
                                            xs: "1px solid #e0e0e0",
                                            md: "none",
                                        },
                                    }}
                                >
                                    <Typography
                                        variant="overline"
                                        color="text.secondary"
                                        fontWeight="bold"
                                        display="block"
                                        mb={1}
                                    >
                                        LOCALIZAÇÃO
                                    </Typography>
                                    <Box
                                        display="flex"
                                        gap={1}
                                        alignItems="flex-start"
                                        mb={1}
                                    >
                                        <MapPin
                                            size={16}
                                            style={{
                                                marginTop: 4,
                                                opacity: 0.6,
                                            }}
                                        />
                                        <Box>
                                            <Typography
                                                variant="body2"
                                                fontWeight="500"
                                            >
                                                {formData.location.cidade},{" "}
                                                {formData.location.provincia}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                {formData.location.pais}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Chip
                                        size="small"
                                        label={`${formData.location.latitude}, ${formData.location.longitude}`}
                                        variant="outlined"
                                        sx={{ mt: 1 }}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6} sx={{ p: 3 }}>
                                    <Typography
                                        variant="overline"
                                        color="text.secondary"
                                        fontWeight="bold"
                                        display="block"
                                        mb={1}
                                    >
                                        PARÂMETROS CONFIGURADOS
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                            gap: 1,
                                        }}
                                    >
                                        {formData.parameters.map((p, idx) => (
                                            <Chip
                                                key={idx}
                                                label={`${p.name} (${p.unit})`}
                                                color="primary"
                                                variant="soft"
                                                size="small"
                                                sx={{
                                                    bgcolor: "primary.50",
                                                    color: "primary.main",
                                                    fontWeight: 600,
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Box>
                );
            default:
                return null;
        }
    };

    // --- Tela de Sucesso ---
    if (submitted) {
        return (
            <Grow in={true}>
                <Container maxWidth="sm" sx={{ mt: 5, textAlign: "center" }}>
                    <Paper
                        elevation={3}
                        sx={{
                            p: 6,
                            borderRadius: 8,
                            background:
                                "linear-gradient(135deg, #ffffff 0%, #f0f4f8 100%)",
                            border: "1px solid #fff",
                        }}
                    >
                        <Box
                            sx={{
                                position: "relative",
                                display: "inline-block",
                                mb: 3,
                            }}
                        >
                            <Box
                                sx={{
                                    position: "absolute",
                                    inset: 0,
                                    bgcolor: "#4caf50",
                                    opacity: 0.2,
                                    borderRadius: "50%",
                                    filter: "blur(20px)",
                                    transform: "scale(1.5)",
                                }}
                            />
                            <CheckCircle
                                size={80}
                                color="#4caf50"
                                fill="white"
                                style={{ position: "relative" }}
                            />
                        </Box>

                        <Typography
                            variant="h4"
                            gutterBottom
                            fontWeight="800"
                            color="#2e7d32"
                        >
                            Sucesso!
                        </Typography>
                        <Typography color="text.secondary" paragraph>
                            O dispositivo{" "}
                            <strong>{formData.sensor_code}</strong> foi
                            registrado e está pronto para sincronização.
                        </Typography>

                        <Button
                            variant="contained"
                            size="large"
                            color="success"
                            sx={{
                                mt: 2,
                                borderRadius: 4,
                                px: 4,
                                textTransform: "none",
                                fontWeight: "bold",
                            }}
                            onClick={() => window.location.reload()}
                        >
                            Cadastrar Novo Dispositivo
                        </Button>
                    </Paper>
                </Container>
            </Grow>
        );
    }

    // --- Renderização Principal ---
    return (
        <Box
            sx={{
                background: "linear-gradient(135deg, #f6f9fc 0%, #eef2f5 100%)",
            }}
        >
            <Container maxWidth="md">
                {children}
                <Card
                    elevation={0}
                    sx={{
                        overflow: "visible",
                    }}
                >
                    <Box sx={{ px: { md: 5 }, pt: 4, pb: 2.5 }}>
                        <Stepper
                            activeStep={activeStep}
                            alternativeLabel
                            connector={<QontoConnector />}
                        >
                            {steps.map((label, index) => {
                                // Lógica visual para ícones do stepper
                                const active = activeStep === index;
                                const completed = activeStep > index;

                                return (
                                    <Step key={label}>
                                        <StepLabel
                                            StepIconComponent={() => (
                                                <Box
                                                    sx={{
                                                        width: 40,
                                                        height: 40,
                                                        borderRadius: "50%",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "center",
                                                        bgcolor: active
                                                            ? "primary.main"
                                                            : completed
                                                              ? "success.main"
                                                              : "grey.200",
                                                        color:
                                                            active || completed
                                                                ? "white"
                                                                : "grey.500",
                                                        boxShadow: active
                                                            ? "0 4px 12px rgba(33, 150, 243, 0.4)"
                                                            : "none",
                                                        transition:
                                                            "all 0.3s ease",
                                                    }}
                                                >
                                                    {completed ? (
                                                        <CheckCircle
                                                            size={20}
                                                        />
                                                    ) : (
                                                        index + 1
                                                    )}
                                                </Box>
                                            )}
                                        >
                                            <Typography
                                                variant="caption"
                                                fontWeight={
                                                    active ? "bold" : "normal"
                                                }
                                                color={
                                                    active
                                                        ? "primary.main"
                                                        : "text.secondary"
                                                }
                                            >
                                                {label}
                                            </Typography>
                                        </StepLabel>
                                    </Step>
                                );
                            })}
                        </Stepper>
                    </Box>

                    <Divider sx={{ borderStyle: "dashed" }} />

                    <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                        {/* Wrapper de Animação para o conteúdo do passo */}
                        <Fade in={true} key={activeStep} timeout={500}>
                            <Box>{renderStepContent(activeStep)}</Box>
                        </Fade>
                    </CardContent>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            p: 4,
                            bgcolor: "#fcfcfc",
                            borderTop: "1px solid #f0f0f0",
                            borderRadius: "0 0 24px 24px",
                        }}
                    >
                        <Button
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            startIcon={<ChevronLeft />}
                            sx={{
                                borderRadius: 3,
                                px: 3,
                                textTransform: "none",
                                visibility:
                                    activeStep === 0 ? "hidden" : "visible",
                            }}
                        >
                            Voltar
                        </Button>

                        {activeStep === steps.length - 1 ? (
                            <Button
                                variant="contained"
                                color="success"
                                onClick={handleSubmit}
                                startIcon={<Save />}
                                size="large"
                                sx={{
                                    borderRadius: 3,
                                    px: 4,
                                    textTransform: "none",
                                    fontWeight: "bold",
                                    boxShadow:
                                        "0 4px 14px rgba(76, 175, 80, 0.4)",
                                }}
                            >
                                Salvar Cadastro
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                onClick={handleNext}
                                disabled={!isStepValid()}
                                endIcon={<ChevronRight />}
                                size="large"
                                sx={{
                                    borderRadius: 3,
                                    px: 4,
                                    textTransform: "none",
                                    fontWeight: "bold",
                                    boxShadow:
                                        "0 4px 14px rgba(33, 150, 243, 0.4)",
                                    "&.Mui-disabled": {
                                        bgcolor: "grey.200",
                                        color: "grey.400",
                                    },
                                }}
                            >
                                Continuar
                            </Button>
                        )}
                    </Box>
                </Card>
            </Container>
        </Box>
    );
}
