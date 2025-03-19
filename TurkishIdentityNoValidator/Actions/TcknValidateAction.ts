
class TCKNValidateAction{
    tckn: string 
    surname: string 
    name: string
    birthYear: string

    constructor(tckn: string, surname: string, name: string, birthYear: string){
        this.tckn = tckn
        this.surname = surname
        this.name = name
        this.birthYear = birthYear
    }
    
    getMetadata () {
        return {
            boundParameter: null,
            parameterTypes: {
                tckn: { typeName: "Edm.String", structuralProperty: 1 },
                surname: { typeName: "Edm.String", structuralProperty: 1 },
                name: { typeName: "Edm.String", structuralProperty: 1 },
                birthYear: { typeName: "Edm.String", structuralProperty: 1 }
            },
            operationType: 0, operationName: "uls_TCKNValidateAction"
        };
    }
}