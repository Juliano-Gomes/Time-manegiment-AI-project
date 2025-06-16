import { Predict } from "../prediction"
import { Resume } from "./Resume.Tecniques"


const Validator = (Complexity: string, Occupation: string, Urgency: string) => {
    const oc = ["Trabalhador", "Desempregado", "Estudante"]
    const comp = ["Simples", "Moderada", "Complexa"]
    const ur = ["Alta", "Média", "Baixa"]

    //.ToUppercase or capitalize
    const L1: any = {}
    const L2: any = {}
    const L3: any = {}
    //Complexity = Complexity.&& Occupation in oc && Urgency in ur
    oc.forEach((e) => {
        if (e.toLowerCase() === Occupation.toLowerCase()) {
            const F = [...Occupation][0].toUpperCase() + Occupation.slice(1,)
            L1.in = true
            L1.word = F
        } else {
            L1.out = false
        }
    })

    comp.forEach((e) => {
        if (e.toLowerCase() === Complexity.toLowerCase()) {
            const F = [...Complexity][0].toUpperCase() + Complexity.slice(1,)
            L2.in = true
            L2.word = F
        } else {
            L2.out = false
        }
    })

    ur.forEach((e) => {
        if (e.toLowerCase() === Urgency.toLowerCase()) {
            const F = [...Urgency][0].toUpperCase() + Urgency.slice(1,)
            L3.in = true
            L3.word = F
        } else {
            L3.out = false
        }
    })

    if (L1.in && L2.in && L3.in) {
        return {
            success: true,
            a: L1.word,
            b: L2.word,
            c: L3.word,
        }
    } else {
        return {
            error: true
        }
    }
}

export const Predicted = async (data: { Complexity: string, Occupation: string, Time: number, Urgency: string }) => {
    const Tecs = ["Pomodoro", "GTD", "Eisenhower", "Time Blocking", "Kanban", "2-Minute Rule"]
    try {
        //const res = await Predict(80, "Alta", "Complexa", "Trabalhador")
        const Nscores: number[] = []
        const Pscores: string[] = []
        const v = Validator(data.Complexity, data.Occupation, data.Urgency)
        console.log({ ...v })
        //oc.includes(data.Occupation) && comp.includes(data.Complexity) && ur.includes(data.Occupation)
        if (data.Time && v.success) {
            const dataP: {
                tec: string;
                scores: Uint8Array<ArrayBufferLike> | Float32Array<ArrayBufferLike> | Int32Array<ArrayBufferLike>;
                id: number;
            } = await Predict(data.Time, v.c, v.b, v.a)
            dataP.scores.forEach(e => {
                const n = Number(e.toFixed(2)) * 100;
                Pscores.push(n.toString() + " %")
                Nscores.push(e)
            })
            return {
                name: dataP.tec,
                scores: [...Nscores],
                per: [...Pscores],
                id: Nscores[dataP.id],
                T: [...Tecs],
                i: dataP.id,
                resume: Resume[dataP.id],
                success: true
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