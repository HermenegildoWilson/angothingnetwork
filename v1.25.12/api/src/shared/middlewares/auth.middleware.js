import jwt from "jsonwebtoken";
import env from "../../config/env.js";

class classAutenticacaoMiddleware {
    authanticateAccess = (req, res, next) => {
        const access_token = req.headers["authorization"]?.split(" ")[1];
        // SE NÃO TIVER UM TOKEN DE ACESSO
        if (!access_token) {
            return res.status(401).json({
                status: 401,
                success: false,
                message: "Início de seção necessário!",
            });
        }

        // SETIVER UM TOKEN DE ACESSO, VERIFICAMO-LO COM A CHAVE.
        jwt.verify(access_token, env.access_token_secret, (err, user) => {
            //SE O TOKEN DE ACESSO TIVER EXPIRADO, avismos que o token espirou
            if (err) {
                return res.status(401).json({
                    status: 401,
                    success: false,
                    message: "Token inválido!",
                });
            }

            // SE O TOKEN DE ACESSO ESTIVER EM DIA, ENTÃO OK.
            req.user = user.payload;
            return next();
        });
    };

    verifyRole = (roles = []) => {
        return (req, res, next) => {
            const userRole = req?.user?.role;

            if (!userRole) {
                return res.status(403).json({
                    status: 403,
                    success: false,
                    message: "Acesso negado!",
                });
            }
            const isAuth = roles.some((v) => v === userRole);
            if (isAuth) {
                return next();
            }

            return res.status(403).json({
                status: 403,
                success: false,
                message: "Acesso negado!",
            });
        };
    };
}

const AutenticacaoMiddleware = new classAutenticacaoMiddleware();

export default AutenticacaoMiddleware;