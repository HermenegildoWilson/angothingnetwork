import argon2 from "argon2";
import jwt from "jsonwebtoken";

import env from "../../config/env.js";
import { getModels } from "../../config/postgresqlClient.js";
const { tokens: token_model, usuario: user_model } = getModels();
const isProd = env.node_env === "production";

export const cookieOptions = {
    httpOnly: isProd ? false : true,
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
    maxAge: env.cookie_expiration,
};

class classUserServices {
    async cadastrar(usuario) {
        const responseEmail = await this.verifyUserEmail(usuario.email);

        if (responseEmail.success) {
            return {
                success: false,
                status: 409,
                message: "Email indisponível!",
            };
        }

        const responseTelefone = await this.verifyUserTelefone(
            usuario.telefone,
        );

        if (responseTelefone.success) {
            return {
                success: false,
                status: 409,
                message: "Telefone indisponível!",
            };
        }

        const senhaHash = await this.createHash(
            usuario?.senha || usuario.telefone,
        );

        const usuario_criado = await user_model.create({
            nome: usuario.nome,
            telefone: usuario.telefone,
            email: usuario.email,
            role: "admin",
            senha: senhaHash,            
        });

        return {
            success: true,
            message: "Usuário cadastrado com sucesso!",
            data: {
                id: usuario_criado.id,
                nome: usuario_criado.nome,
                telefone: usuario_criado.telefone,
                email: usuario_criado.email,
                role: usuario_criado.role,
            },
        };
    }

    async login(credencials, res) {
        const responseEmail = await this.verifyUserEmail(credencials.email);

        if (!responseEmail.success) {
            return {
                success: false,
                status: 404,
                message: "Email inexistente!",
            };
        }

        const responseSenha = await this.verifyHash(
            responseEmail.data.senha,
            credencials.senha,
        );

        if (!responseSenha) {
            return {
                success: false,
                status: 404,
                message: "Senha incorreta!",
            };
        }

        const payload = {
            id: responseEmail.data.id,
            email: responseEmail.data.email,
            nome: responseEmail.data.nome,
            telefone: responseEmail.data.telefone,
            role: responseEmail.data.role,
            dataCadastro: responseEmail.data.created_at,
        };

        const ACCESS_TOKEN = await this.createToken(
            payload,
            env.access_token_secret,
            env.access_token_expiration,
        );

        const REFRESH_TOKEN = await this.createToken(
            payload,
            env.refresh_token_secret,
            env.refresh_token_expiration,
        );

        token_model.create({
            id_usuario: responseEmail.data.id,
            refresh_token: REFRESH_TOKEN,
        });

        res.cookie("refresh_token", REFRESH_TOKEN, cookieOptions);

        return {
            success: true,
            message: "Seja bem-vindo!",
            user: payload,
            access_token: ACCESS_TOKEN,
        };
    }

    async logout(req, res) {
        try {
            const { user } = req.user;
            const refresh_token = req.cookies.refresh_token;

            token_model.destroy({
                where: { refresh_token: refresh_token },
            });

            res.clearCookie("refresh_token", cookieOptions);

            return {
                success: true,
                user: user,
                message: "Volte sempre...",
            };
        } catch (error) {
            return {
                success: false,
                message: "Erro ao fazer logout",
                errors: `${error}`,
            };
        }
    }

    async getUsuarios(id) {
        const idCondition = id && { id: id };

        let usuarios_encontrados = await user_model.findAll({
            attributes: [
                ["id", "id"],
                "nome",
                "telefone",
                "email",
                "role",
                ["created_at", "dataCadastro"],
            ],
            where: idCondition,
        });

        if (!usuarios_encontrados) {
            return {
                success: false,
                data: [],
            };
        }

        return {
            success: true,
            data: usuarios_encontrados,
        };
    }

    async verifyUserEmail(email = "") {
        let usuario_encontrado = await user_model.findOne({
            where: {
                email: email,
            },
        });

        if (!usuario_encontrado) {
            return {
                success: false,
            };
        }

        return {
            success: true,
            data: usuario_encontrado,
        };
    }

    async verifyUserTelefone(telefone) {
        let usuario_encontrado = await user_model.findOne({
            where: {
                telefone: telefone,
            },
        });

        if (!usuario_encontrado) {
            return {
                success: false,
            };
        }

        return {
            success: true,
            data: usuario_encontrado,
        };
    }

    async createHash(string) {
        return await argon2.hash(string, {
            type: argon2.argon2id,
            memoryCost: 2 ** 16, // 64 MB
            timeCost: 3, // nº de iterações
            parallelism: 1, // threads
        });
    }

    async verifyHash(hash, string) {
        const valid = await argon2.verify(hash, string);
        return valid;
    }

    async createToken(payload, TOKEN_SECRET, TOKEN_EXPIRATION) {
        const token = jwt.sign({ payload }, TOKEN_SECRET, {
            expiresIn: TOKEN_EXPIRATION,
        });
        return token;
    }
}

const UserServices = new classUserServices();
export default UserServices;
