export default function errorMiddleware(error, req, res, next) {
    console.error(`\n\n🔥 ERRO CAPTURADO NO SERVIDOR: ${error.message} 🔥`);
    console.log(`🧠 Erro em: ${error.stack.split("at")[1]}`);
    console.log(`🧠 ${error.stack.split("at")}\n`);

    return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Erro interno do servidor...",
    });
}