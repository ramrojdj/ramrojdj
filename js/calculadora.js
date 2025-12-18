function oprimeDigito(event) {
    const digito = event.target.innerHTML;
    agregaInput(digito);
    displayInput();
};
function agregaInput(next) {
    return INPUT += next;
};
function borraUltimoInput() {
    return INPUT = INPUT.slice(0, -1);
};
function displayInput() {
    document.querySelector("#input").innerHTML = "";
    document.querySelector("#input").innerHTML = INPUT;
    // return true;
};
function oprimeSigno(event) {
    let operador = "";
    switch (event.target.innerHTML) {
        case ("➕"):
            operador = "+";
            break;
        case ("➖"):
            operador = "-";
            break;
        case ("➗"):
            operador = "/"
            break;
        case ("✖️"):
            operador = "*";
            break;
        case ("🟰"):
            break;
        case ("🆑"):
            break;
        case ("🔙"):
            break;
        default:
            break;
    };
    if(INPUT===""||operador==""){
        return;
    };
    if("+-*/".includes(INPUT.at(-1))){
        borraUltimoInput();
        agregaInput(operador);
        displayInput();
        return;
    };
    agregaInput(operador);
    displayInput();
};

function dividirExpresion(expresion) {
    const valores = [];
    let buffer = "";

    for (let char of expresion) {
        if ("+-/*".includes(char)) {
            if (buffer) {
                valores.push(buffer);
                buffer = "";
            }
            valores.push(char);
        } else {
            buffer += char
        };
    };
    if (buffer) {
        valores.push(buffer);
        buffer = "";
    };
    if ("+-/*".includes(valores[0])) {
        valores.shift();
    };
    if ("+-/*".includes(valores[valores.length - 1])) {
        valores.pop();
    };
    return valores;
};
function creaArbol(entrada) {
    let i = 0;
    function parseTerm() {
        let arbol = { tipo: "numero", valor: Number(entrada[i++]) };
        while (i < entrada.length && ["*", "/"].includes(entrada[i])) {
            const operador = entrada[i++];
            const derecha = { tipo: "numero", valor: Number(entrada[i++]) };
            arbol = {
                tipo: "operacion",
                operador,
                derecha,
                izq: arbol
            };
        };
        return arbol;
    };

    function parseExpr() {
        let arbol = parseTerm();
        while (i < entrada.length && ["+", "-"].includes(entrada[i])) {
            const operador = entrada[i++];
            const derecha = parseTerm();
            arbol = {
                tipo: "operacion",
                operador,
                derecha,
                izq: arbol
            };
        };
        return arbol;
    };

    return parseExpr();
};
function evalua(arbol) {
    if (arbol.tipo === "numero") {
        return arbol.valor;
    };

    const izq = evalua(arbol.izq);
    const der = evalua(arbol.derecha);
    switch (arbol.operador) {
        case "+": return izq + der;
        case "-": return izq - der;
        case "*": return izq * der;
        case "/": return izq / der;
        default:
            throw new Error(`Operador desconocido: ${arbol.operador}`);
    }
};

let INPUT = "";

document.querySelectorAll("li.digito").forEach(digito => {
    digito.addEventListener("click", oprimeDigito);
});
document.querySelectorAll("li.signo").forEach(signo => {
    signo.addEventListener("click", oprimeSigno);
});
document.querySelector("li#equal").addEventListener("click",()=>{
    INPUT= JSON.stringify(evalua(creaArbol(dividirExpresion(INPUT))));
    return INPUT==="null"?INPUT="":displayInput();
});
document.querySelector("li#back").addEventListener("click",()=>{
    borraUltimoInput();
    displayInput();
});
document.querySelector("li#clr").addEventListener("click",()=>{
    INPUT="";
    displayInput();
});