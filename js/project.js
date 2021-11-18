//Botones
const btnArchivo = document.getElementById('archivo');
const btnGenerar = document.getElementById('btnGenerar');
const btnLimpiar = document.getElementById('btnLimpiar');
const radioRaiz = document.getElementById('radioRaiz');
const radioSturges = document.getElementById('radioSturges');

//Variables globales
//Se guardan los datos de la tabla 
let inferior = []
let superior = []
let marcaClase = []
let fo = []
let fa = []
let nuevoArray =[] //arreglo donde se encuentran los datos del arreglo myArray, pero con tipo de dato numerico
let amplitud = 0;
let numClase = 0;
let max = 0;
let min = 0;
let maxDecimal = 0;
let myArray = [];
let iArray = [];
let frecArray = [];
let indiceArray = [];
let rango = 0;
let divTable = document.getElementById('divTable');
let divMostrar = document.getElementById('divMostrar');
let tablaResultados = document.getElementById('tablaGenerada');

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
    $('#table td').remove();
    $('#tableBody td').remove();

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
        for (let i = 0; i < read.length-1; i++) {
            let num = Number(myArray[i]);

            if(num.countDecimals() > maxDecimal)
            {
                maxDecimal = num.countDecimals();
            }
        }

        //Maximo valor del CSV
        max = Math.max.apply(Math, myArray)
        document.querySelector('#datoMayor').value = max;
        //Minimo valor del CSV
        min = Math.min.apply(Math, myArray)
        document.querySelector('#datoMenor').value = min;
        //Rango
        rango = max-min;
        document.querySelector('#rango').value = rango.toFixed(maxDecimal);

    }
    divTable.classList.add('h-96');
    
    //Radio Calcular raíz
    radioRaiz.addEventListener('click', ()=> {
        let raiz = Math.sqrt(read.length-1);
        raiz = Math.ceil(raiz);
        numClase = raiz;
        document.querySelector('#numClases').value = raiz;

        //Calculo de amplitud con Raiz
        if(maxDecimal == 0){
            amplitud = (rango/raiz)
        }else{
            amplitud = (rango/raiz).toFixed(maxDecimal)
        }
        document.querySelector('#amplitud').value = amplitud;
    })

     //Radio Calcular Sturges
    radioSturges.addEventListener('click', ()=> {
        let n = read.length-1
        let sturges = 1+(3.322*Math.log10(n))
        sturges = Math.ceil(sturges);
        numClase = sturges;
        document.querySelector('#numClases').value = sturges;

        //Calculo de amplitud con Sturges
        if(maxDecimal == 0){
            amplitud = (rango/sturges)
        }else{
            amplitud = (rango/sturges).toFixed(maxDecimal)
        }
        document.querySelector('#amplitud').value = amplitud;
    })

    
    

    fileRead.readAsText(btnArchivo.files[0])
})

//Botón Generar
btnGenerar.addEventListener('click', ()=> {

    divMostrar.classList.remove('hidden');

    for(let i=0; i<myArray.length; i++){
        nuevoArray[i] = Number(myArray[i]);
    }
    inferior[0] = min
    for(let i=1; i<numClase; i++){
        inferior[i] = (inferior[i-1] + parseFloat(amplitud))
    }
    for(let i=0; i<numClase; i++){
        if(i == numClase-1){
            superior[i] = max
        }else{
            superior[i] = (inferior[i] + parseFloat(amplitud))
        }
        
    }    
    for(let i=0; i<numClase; i++){
        marcaClase[i] = (inferior[i]+superior[i])/2
    }
    let i=0;
    while(i<numClase){
        let j=0;
        let aum=0
        while(j<nuevoArray.length){
            if(nuevoArray[j] >= inferior[i] && nuevoArray[j] < superior[i]){
                aum++
                fo[i] = aum
            }else if(nuevoArray[j] >= inferior[i] && nuevoArray[j] <= superior[i]){
                aum ++
                fo[i] = aum
            }
            if(fo[i]== undefined){
                fo[i] = 0
            }
            j++;
        }
        i++;
    }
    fa[0] = fo[0]
    for(let i=1; i<numClase; i++){
        fa[i] = fa[i-1]+ fo[i]
    }

    let tableBody = document.getElementById('tableBody')
    for (let i = 0; i < numClase; i++) {
        // Creando los 'td' que almacenará cada parte de la información del usuario actual
        let indice = `<td class="px-4 py-3 text-sm border">${i+1}</td>`;
        let limInferior = `<td class="px-4 py-3 text-sm border">${inferior[i].toFixed(maxDecimal)}</td>`;
        let limSuperior = `<td class="px-4 py-3 text-sm border">${superior[i].toFixed(maxDecimal)}</td>`;
        let mClase = `<td class="px-4 py-3 text-sm border">${marcaClase[i].toFixed(maxDecimal)} </td>`;
        let frecObser = `<td class="px-4 py-3 text-sm border">${fo[i]} </td>`;
        let frecAcum = `<td class="px-4 py-3 text-sm border">${fa[i]} </td>`;
        tableBody.innerHTML += `<tr class="text-gray-700">${indice + limInferior + limSuperior + mClase + frecObser + frecAcum}</tr>`;
    }

    $(document).ready(function() { 
        $("#tableBody tr td:nth-child(1)").each(function(i){
            iArray.push($(this).text());
        });
    });
    console.log(iArray);

    $(document).ready(function() { 
        $("#tableBody tr td:nth-child(5)").each(function(i){
            frecArray.push($(this).text());
        });
    });
    console.log(frecArray);

    //Generación de Gráfico con CHartJS
    let ctx = document.getElementById('myChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: iArray,
            datasets: [{
                label: 'Histograma',
                data: frecArray,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                responsive: true,
                maintainAspectRatio: false,
                y: {
                    beginAtZero: true
                },
                xAxisID: [{
                    categoryPercentage: 1.0,
                    barPercentage: 1.0
                }]
            }
        }
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
    document.querySelector('#numClases').value = "";
    document.querySelector('#table').innerHTML= "";
    document.querySelector('#tableBody').innerHTML= "";
    inferior = []
    superior = []
    marcaClase = []
    fo = []
    fa = []
    nuevoArray =[] 
    iArray = []
    frecArray = []
    amplitud = 0;
    numClase = 0;
    max = 0;
    min = 0;
    maxDecimal = 0;
    myArray = [];
    indiceArray = [];
    rango = 0;
    i = 0;
    document.querySelector('#chart').innerHTML = '<canvas id="myChart"></canvas>'
    $(table).append("<td class='px-4 py-3 text-xs border'><span class='px-2 py-1 font-semibold leading-tight text-red-700 bg-red-100 rounded-sm'> Sin datos </span></td><td class='px-4 py-3 text-xs border'><span class='px-2 py-1 font-semibold leading-tight text-red-700 bg-red-100 rounded-sm'> Sin datos </span></td>");
    $("#tableBody").append("<td class='px-4 py-3 text-sm border'><span class='px-2 py-1 font-semibold leading-tight text-red-700 bg-red-100 rounded-sm'> Sin datos </span></td><td class='px-4 py-3 text-sm border'><span class='px-2 py-1 font-semibold leading-tight text-red-700 bg-red-100 rounded-sm'> Sin datos </span></td><td class='px-4 py-3 text-sm border'><span class='px-2 py-1 font-semibold leading-tight text-red-700 bg-red-100 rounded-sm'> Sin datos </span></td><td class='px-4 py-3 text-sm border'><span class='px-2 py-1 font-semibold leading-tight text-red-700 bg-red-100 rounded-sm'> Sin datos </span></td><td class='px-4 py-3 text-sm border'><span class='px-2 py-1 font-semibold leading-tight text-red-700 bg-red-100 rounded-sm'> Sin datos </span></td><td class='px-4 py-3 text-sm border'><span class='px-2 py-1 font-semibold leading-tight text-red-700 bg-red-100 rounded-sm'> Sin datos </span></td></tr>")
    divTable.classList.remove('h-96');
    divMostrar.classList.add('hidden');
})

//Generación de Gráfico con CHartJS
    
