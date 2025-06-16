import { Request, Response, NextFunction } from 'express'
import JWT, { JsonWebTokenError } from 'jsonwebtoken'
import dotenv from 'dotenv'
import { compare, genSalt, hash } from 'bcrypt'

// .config
dotenv.config()
const SECRET = process.env.SECRET_KEY_JWT as string
// .middlewares
export const JWT_VERIFY = (request: Request, response: Response, next: NextFunction) => {
    try {
        const { authorization } = request.headers
        const Token = authorization?.split(' ') || undefined
        if (Token && typeof (Token[1]) === "string") {
            const VerifiedToken = JWT.verify(Token[1], SECRET)
            if (VerifiedToken) {
                next()
            } else {
                response.status(403).json({
                    message: "Invalid token ,Please make Login",
                    url: process.env.Login_Url
                })
            }
        } else {

            response.status(403).json({
                message: "unauthorizated to access ,Please make Login",
                url: process.env.Login_Url
            })
        }
    } catch (error) {
        if (error instanceof JsonWebTokenError) {
            response.status(403).json({
                message: "Malformed token",
                url: process.env.Login_Url
            })
        } else {
            response.status(403).json({
                message: "unauthorizated to access ,Please make Login",
                url: process.env.Login_Url
            })
        }
    }
}

export const JWT_CREATOR = async (user: string) => {
    try {
        if (user && typeof (user) === 'string') {
            const Token = JWT.sign(user, SECRET)
            console.log({ Token })
            if (Token) {
                return {
                    Token
                }
            } else {
                throw new Error()
            }
        }
    } catch (error) {
        return {
            message: "an error"
        }
    }
}

export const PASS_VERIFIER = async (data: { Text: string, Hash: string }) => {
    try {
        const res = await compare(data.Text, data.Hash)
        if (res) {
            return {
                Pass: true,
                message: "right passwd"
            }
        } else {
            throw new Error()
        }
    } catch (error) {
        return {
            Pass: false,
            message: "an error occurred "
        }
    }
}

export const HASH = async (data: { password: string }) => {
    try {
        const salt = await genSalt(15, 'b')
        const Hash = await hash(data.password, salt)

        if (Hash) {
            return {
                Hash
            }
        } else {
            throw new Error()
        }
    } catch (error) {
        return {
            error: true
        }
    }
}