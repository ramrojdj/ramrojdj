const REPORTE = [];
let TOTALACTAS = 0;
const validaNumActas = numActas => numActas % 25 === 0 ? true : false;
function setActions() {
    document.querySelector("nav button").addEventListener("click", () => {
        function validaReporteYcreaMensaje(reporte) {
            let totalNa = 0, totalMa = 0, totalDe = 0, totalSuc = 0, totalFem = 0, totalBoy = 0;
            for (const [na, ma, de, suc, fem, boy] of reporte) {
                totalNa += +na;
                totalMa += +ma;
                totalDe += +de;
                totalSuc += +suc;
                totalFem += +fem;
                totalBoy += +boy;
            };
            const mensaje =
                `*ACTAS*
Nacimiento:${totalNa}
Matrimonio:${totalMa}
Defunción:${totalDe}
Sucias:${totalSuc}
*ATENCIÓNES*
Femenino:${totalFem}
Masculino:${totalBoy}

*ACTAS USADAS:* ${totalNa + totalMa + totalDe + totalSuc}
*ACTAS ENTREGADAS:* ${totalFem + totalBoy}
*SOBRAN:* ${TOTALACTAS - (totalFem + totalBoy + totalSuc)}`;

            document.querySelector("footer").innerHTML = `<p>${mensaje}</p>`;
        };

        validaReporteYcreaMensaje(REPORTE);
    });
    const Hojas = document.querySelectorAll("main form");
    Hojas.forEach((hoja, index) => {
        // Action Next 
        hoja.querySelector("input[type=button]").addEventListener("click", () => {
            if (index + 1 < Hojas.length) {
                document.querySelectorAll("div.statusItemContainer div.statusItem")[index].classList.remove("activeStatus");
                document.querySelectorAll("div.statusItemContainer div.statusItem")[index + 1].classList.add("activeStatus");

                Hojas[index].style.display = "none";
                Hojas[index + 1].style.display = "grid";
            } else {
                document.querySelectorAll("div.statusItemContainer div.statusItem")[index].classList.remove("activeStatus");
                document.querySelectorAll("div.statusItemContainer div.statusItem")[0].classList.add("activeStatus");

                Hojas[index].style.display = "none";
                Hojas[0].style.display = "grid";
            };
        });
        // Action Capturar
        hoja.addEventListener("submit", (event) => {
            event.preventDefault();
            const datos = Hojas[index].querySelectorAll("input[type=number]");
            const datosDelFormulario = validaYFormateaDatos(datos);

            if (!datosDelFormulario) {
                return false;
            } else {
                REPORTE[index] = datosDelFormulario;
                document.querySelectorAll("nav div.statusItem")[index].classList.add("doneStatus");
            }
        });
    });
    return true;
};
function validaYFormateaDatos(datos) {
    const actasPorHoja = 25 - datos[3].value;
    const sumaActas = +datos[0].value + +datos[1].value + +datos[2].value;
    const sumaAtenciones = +datos[4].value + +datos[5].value;

    if (sumaActas > actasPorHoja) {
        alert("Revisa los datos de las Actas");
        return false;
    };
    if (sumaAtenciones !== sumaActas) {
        alert("Revisa los valores de atenciones");
        return false;
    };

    const datosHoja = [];
    datos.forEach(dato => {
        datosHoja.push(dato.value);
    });
    return datosHoja;
};
const creaHojas = (numActas) => {
    if (!validaNumActas(numActas)) {
        throw new Error("creaHojas:validaNumActas:numActas");
    };
    const numHojas = numActas / 25;
    document.querySelector("main").innerHTML = "";
    for (let j = 0; j < numHojas; j++) {
        const form = document.createElement("form");
        form.id = `hoja${j}`;
        if (j !== 0) {
            form.style.display = "none";
        };
        form.innerHTML = `
            <div class="formInputs">
                <div class="inputItem">
                    <label for="hoja${j}nac">🚼</label>
                    <input type="number" name="hoja${j}nac" id="hoja${j}nac" placeholder="NA" min="0" max="25"
                        step="1">
                </div>

                <div class="inputItem">
                    <label for="hoja${j}mat">💍</label>
                    <input type="number" id="hoja${j}mat" placeholder="MA" min="0" max="25" step="1">
                </div>
                <div class="inputItem">
                    <label for="hoja${j}def">🪦</label>
                    <input type="number" name="hoja${j}def" id="hoja${j}def" placeholder="DE" min="0" max="25"
                        step="1">

                </div>

                <div class="inputItem">
                    <label for="hoja${j}suc">❌</label>
                    <input type="number" name="hoja${j}suc" id="hoja${j}suc" placeholder="sucias" min="0" max="25" step="1">

                </div>

            </div>
            <div class="formActions">
                <input type="button" value="➡" class="button">
                <button class="button" type="submit">✅</button>
            </div>
            <div class="formInputs">
                <div class="inputItem"> <label for="hoja${j}fem">🧜‍♀️</label>
                    <input type="number" name="hoja${j}fem" id="hoja${j}fem" placeholder="fem" min="0" max="25" step="0">
                </div>
                <div class="inputItem"> <label for="hoja${j}boy">🧜‍♂️</label>
                    <input type="number" name="" hoja${j}boy id="hoja${j}boy" placeholder="boy" min="0" max="25" step="0">
                </div>
            </div>
            `;
        document.querySelector("main").appendChild(form);

        const statusItem = document.createElement("div");
        statusItem.innerHTML = `${j}`;
        statusItem.className = `statusItem`;
        if (j == 0) {
            statusItem.className = "activeStatus statusItem"
        }
        document.querySelector("div.statusItemContainer").appendChild(statusItem);
    };

    if (!setActions()) { throw new Error("setActions:error") }
    return true;
};
const handleNumActas = event => {
    event.preventDefault();
    const numActas = document.querySelector("form#inicio input").value;
    if (!validaNumActas(numActas)) {
        alert("Numero de Actas ilegales")
        throw new Error("handleNumActas:validaNumActas:error");
    };
    document.querySelector("form#inicio").style.display = "none";
    TOTALACTAS = numActas;
    return creaHojas(numActas);
};

try {
    document.querySelector("form#inicio").addEventListener("submit", handleNumActas);
} catch (e) {
    console.log(error)
};