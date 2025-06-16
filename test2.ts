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
        console.log(true)
    } else {
        console.log(false)
    }
}

Validator("Simples", "Trabalhador", "Alta")