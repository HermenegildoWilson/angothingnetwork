import jwt from "jsonwebtoken";
import env from "../../config/env.js";
import UserServices from "./user.service.js";

import { getModels } from "../../config/postgresqlClient.js";
const { tokens: token_model } = getModels();

class ClassUserControllers {
    cadastrar = async (req, res, next) => {
        try {
            const usuario = req.body;

            const response = await UserServices.cadastrar(usuario);

            // Em caso de insucesso
            if (!response.success) {
                // Se não tiver é porque o erro é do lado do cliente {Conflito de dados ou Chave enviada inexistente}
                return res.status(response.status).json({
                    ...response,
                });
            }

            // Se chegamos até aqui é porque tudo tá OK
            return res.status(200).json({
                status: 200,
                ...response,
            });
        } catch (error) {
            next(error);
        }
    };

    login = async (req, res, next) => {
        try {
            const credencials = req.body;

            const response = await UserServices.login(credencials, res);
            // Em caso de insucesso
            if (!response.success) {
                return res.status(response.status).json({
                    ...response,
                });
            }

            // Se chegamos até aqui é porque tudo tá OK
            return res.status(200).json({
                status: 200,
                ...response,
            });
        } catch (error) {
            next(error);
        }
    };

    logout = async (req, res, next) => {
        try {
            const response = await UserServices.logout(req, res);

            // Se chegamos até aqui é porque tudo tá OK
            return res.status(200).json({
                status: 200,
                ...response,
            });
        } catch (error) {
            next(error);
        }
    };

    getUsuarios = async (req, res, next) => {
        try {
            const { id } = req.query;

            const response = await UserServices.getUsuarios(id);

            // Em caso de insucesso
            if (!response.success) {
                // Se não tiver é porque o erro é do lado do cliente {Conflito de dados ou Chave enviada inexistente}
                return res.status(response.status).json({
                    ...response,
                });
            }

            // Se chegamos até aqui é porque tudo tá OK
            return res.status(200).json({
                status: 200,
                ...response,
            });
        } catch (error) {
            next(error);
        }
    };

    refreshSession = async (req, res, next) => {
        try {
            const refresh_token = req.cookies.refresh_token;

            // SE NÃO TIVER UM TOKEN DE REFRESCO, FAÇA LOGIN
            if (!refresh_token) {
                return res.status(400).json({
                    status: 400,
                    success: false,
                    message: "Sua sessão expitou faça login...",
                });
            }

            // SETIVER UM TOKEN DE REFRESCO, VERIFICAMO-LO COM A CHAVE.
            jwt.verify(
                refresh_token,
                env.refresh_token_secret,
                async (err, user) => {
                    //SE O TOKEN DE REFRESCO TIVER EXPIRADO, FAÇA LOGIN
                    if (err) {
                        return res.status(403).json({
                            status: 403,
                            success: false,
                            message: "Sua sessão expitou faça login...",
                        });
                    }

                    // SE O TOKEN DE REFRESCO ESTIVER EM DIA, ENTÃO VERIFICAMOS SE EXISTE NO BANCO.
                    const refresh_token_exist = await token_model.findOne({
                        where: {
                            refresh_token: refresh_token,
                        },
                    });

                    if (!refresh_token_exist) {
                        return res.status(403).json({
                            status: 403,
                            success: false,
                            message: "Sua sessão expitou faça login...",
                        });
                    }

                    //SE TUDO ESTÁ OK, ENTÃO GERAMOS UM NOVO TOKEN DE ACESSO
                    const ACCESS_TOKEN = await UserServices.createToken(
                        user.payload,
                        env.access_token_secret,
                        env.access_token_expiration
                    );

                    return res.status(200).json({
                        status: 200,
                        success: true,
                        user: user.payload,
                        access_token: ACCESS_TOKEN,
                        message: "Seção restaurada!",
                    });
                }
            );
        } catch (error) {
            next(error);
        }
    };

    generateKeyRegister = async (req, res, next) => {
        try {
            const { role } = req.body;

            const payload = { role: role };
            const REGISTER_TOKEN = await UserServices.createToken(
                payload,
                env.register_token_secret,
                env.register_token_expiration
            );

            // Se chegamos até aqui é porque tudo tá OK
            return res.status(200).json({
                status: 200,
                registerKey: REGISTER_TOKEN,
            });
        } catch (error) {
            next(error);
        }
    };
}

const UserControllers = new ClassUserControllers();

export default UserControllers;
