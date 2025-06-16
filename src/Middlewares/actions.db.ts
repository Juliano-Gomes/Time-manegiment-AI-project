import { DataBase } from "../database/database";

type BData = { id: string, name: string, passwd: string, email: string }[]
const DB = new DataBase

export const Create = async (data: { name: string, id: string, email: string, password: string }) => {
    try {
        const { email, id, name, password } = data
        if (email && email.includes("@") && name && typeof (name) === 'string' && password && id) {
            const res = await DB.REGISTER_USER({ email, id, name, password })

            console.log({ ...res.data })

            if (res.success === true) {
                return {
                    success: true,
                }
            } else {
                throw new Error()
            }
        } else {
            throw new Error()
        }
    } catch (error) {
        return {
            error: true,
        }
    }
}


export const select = async (data: { email: string }) => {
    try {
        if (data.email && data.email.includes("@")) {
            const res = await DB.Log_in_USER({ email: data.email })
            const dataT = res.data as unknown as BData
            if (res.status === true) {
                return {
                    success: true,
                    data: dataT
                }
            } else {
                throw new Error()
            }
        } else {
            throw new Error()
        }
    } catch (error) {
        return {
            error: true,
        }
    }
}