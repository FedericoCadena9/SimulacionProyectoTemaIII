
//Botones
const btnArchivo = document.getElementById('archivo');
const btnGenerar = document.getElementById('btnGenerar');
const btnLimpiar = document.getElementById('btnLimpiar');
const radioRaiz = document.getElementById('radioRaiz');
const radioSturges = document.getElementById('radioSturges')

//Variables globales
let myArray = [];
let indiceArray = []
let rango = 0;
let divTable = document.getElementById('divTable');

//Función para extraer el decimal de un número
Number.prototype.countDecimals = function () {
    if(Math.floor(this.valueOf()) === this.valueOf()) return 0;
    return this.toString().split(".")[1].length || 0; 
}

//Botón Examinar y Abrir archivo
btnArchivo.addEventListener('change', ()=> {
    const fileRead = new FileReader();
    let read;

    //Eliminar "Sin datos" de la tabla
    $('#table tr').remove();

    //Función Importar archivo CSV
    fileRead.onloadend = e =>
    {
        //Convertir CSV
        read = fileRead.result.split("\r\n").map(e=>{
            return e.split(",")
        })

        //Mapear CSV en la Tabla 
        read.forEach(e => {
            let map = e.map(e=>{
                return `<td class="px-4 py-3 border">${e}</td>`
            }).join("")
            const create = document.createElement('tr');
            create.innerHTML = map;
            document.getElementById('table').append(create);
        })

        //Generar Array de numeros de la columna de Xi
        $(document).ready(function() { 
            $("#table tr td:nth-child(2)").each(function(i){
                myArray.push($(this).text());
            });
        });


        //Sacar el length máximo del número decimal del Array
        let maxDecimal = 0;

        for (let i = 0; i < read.length-1; i++) {
            let num = Number(myArray[i]);

            if(num.countDecimals() > maxDecimal)
            {
                maxDecimal = num.countDecimals();
            }
        }

        //Maximo valor del CSV
        let max = Math.max.apply(Math, myArray)
        document.querySelector('#datoMayor').value = max;
        //Minimo valor del CSV
        let min = Math.min.apply(Math, myArray)
        document.querySelector('#datoMenor').value = min;
        //Rango
        rango = max-min;
        document.querySelector('#rango').value = rango;

    }
    divTable.classList.add('h-96');
    
    //Radio Calcular raíz
    radioRaiz.addEventListener('click', ()=> {
        let raiz = Math.sqrt(read.length-1);
        raiz = Math.round(raiz);
        document.querySelector('#numClases').value = raiz;

        //Calculo de amplitud con Raiz
        document.querySelector('#amplitud').value = rango/raiz;
    })

     //Radio Calcular Sturges
    radioSturges.addEventListener('click', ()=> {
        let n = read.length-1
        let sturges = 1+(3.222*Math.log10(n))
        sturges = Math.round(sturges);
        document.querySelector('#numClases').value = sturges;

        //Calculo de amplitud con Sturges
        document.querySelector('#amplitud').value = rango/sturges;
    })
    

    fileRead.readAsText(btnArchivo.files[0])
})

//Botón Generar
btnGenerar.addEventListener('click', ()=> {

    //Valor de Amplitud
    let amplitud = document.getElementById('amplitud').value;

    //Generación Array de numeros para la columna de "Indice" | indiceArray 
    $(document).ready(function() { 
        $("#table tr td:nth-child(1)").each(function(i){
            indiceArray.push($(this).text());
        });
    });
})

//Boton Limpiar
btnLimpiar.addEventListener('click', () => {

    
    document.getElementById("archivo").value = "";
    document.getElementById("datoMenor").value = "";
    document.getElementById("datoMayor").value = "";
    document.getElementById("rango").value = "";
    document.getElementById("radioRaiz").checked = false;
    document.getElementById("radioSturges").checked = false;
    document.getElementById("amplitud").value = "";
    document.querySelector('#table').innerHTML= "";
    $(table).append("<td class='px-4 py-3 text-xs border'><span class='px-2 py-1 font-semibold leading-tight text-red-700 bg-red-100 rounded-sm'> Sin datos </span></td><td class='px-4 py-3 text-xs border'><span class='px-2 py-1 font-semibold leading-tight text-red-700 bg-red-100 rounded-sm'> Sin datos </span></td>");
    divTable.classList.remove('h-96');
})