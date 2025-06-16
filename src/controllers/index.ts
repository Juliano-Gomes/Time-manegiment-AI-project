import { Response, Request } from "express"
import { z, ZodError } from 'zod'
import { HASH, JWT_CREATOR, PASS_VERIFIER } from "../Middlewares/jwt.verify"
import { Create, select } from "../Middlewares/actions.db"
import { randomBytes } from "crypto"
import dotenv from 'dotenv'
import { Predicted } from "../Middlewares/mention"
type BData = { id: string, name: string, passwd: string, email: string }[]
// .env
dotenv.config()

export const index = async (request: Request, response: Response) => {
    const Bvalidator = z.object({
        Urgency: z.string(),
        Time: z.number(),
        Occupation: z.string(),
        Complexity: z.string()
    })
    try {
        const { Complexity, Occupation, Time, Urgency } = Bvalidator.parse(request.body)
        //console.log({ Complexity, Occupation, Time, Urgency })
        if (Complexity && Occupation && Time && Urgency) {
            const data = await Predicted({ Complexity, Occupation, Time, Urgency })
            if (data.success) {
                response.status(200).json({
                    ...data
                })
            } else {
                throw new Error()
            }
        } else {
            response.status(400).json({
                message: "Fill all fields"
            })
        }
    } catch (error) {
        if (error instanceof ZodError) {
            response.status(406).json({
                message: "Invalid type of data"
            })
        } else {
            //console.log(error)
            response.status(500).json({
                message: "server error :("
            })
        }
    }
}

export const Donate = (request: Request, response: Response) => {
    response.status(200).json({
        message: "A guess the queen is up"
    })
}

export const LogMeIn = async (request: Request, response: Response) => {
    const Log_validator = z.object({
        email: z.string(),
        password: z.string()
    })

    try {
        const { email, password } = Log_validator.parse(request.body)
        if (email && email.includes("@") && password && !password.includes(">")) {
            const RES_DB = await select({ email })
            const BruteData = RES_DB.data as BData
            if (RES_DB.success) {
                const { message, Pass } = await PASS_VERIFIER({ Hash: BruteData[0].passwd, Text: password })
                console.log({ message, Pass })
                if (Pass) {
                    const TK = await JWT_CREATOR(BruteData[0].name)
                    if (TK?.Token) {
                        response.status(200).json({
                            Token: TK.Token
                        })
                    } else {
                        throw new Error()
                    }
                } else {
                    response.status(404).json({
                        message: "Wrong Email or password ," + message,
                    })
                }
            } else {
                response.status(400).json({
                    message: "wrong password or email , try again later "
                })
            }
        } else {
            response.status(406).json({
                message: "fill all fields"
            })
        }
    } catch (error) {
        if (error instanceof ZodError) {
            response.status(406).json({
                message: "Invalid type of data"
            })
        } else {
            response.status(500).json({
                message: "server error :("
            })
        }
    }
}

export const PutMeIn = async (request: Request, response: Response) => {
    const Dvalidator = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(8)
    })

    try {
        const { email, name, password } = Dvalidator.parse(request.body)
        const id = randomBytes(64).toString('hex')
        console.log({
            id
        })

        if (id && email.includes("@") && password.length > 7 && name) {
            const { Hash, error } = await HASH({ password })
            console.log({
                Hash
            })
            if (error) {
                throw new Error()
            } else {
                const { error, success } = await Create({ email, id, name, password: Hash! })
                console.log({
                    success
                })
                if (success) {
                    response.status(200).json({
                        message: "Your account was created !! Make Log in Now",
                        url: process.env.Login_Url
                    })
                } else {
                    response.status(400).json({
                        message: "Invalid data , fill all fields"
                    })
                }
            }
        } else {
            response.status(406).json({
                message: "Invalid data , fill all fields"
            })
        }
    } catch (error) {
        if (error instanceof ZodError) {
            response.status(406).json({
                message: "Invalid type of data"
            })
        } else {
            response.status(500).json({
                message: "server error :("
            })
        }
    }
}