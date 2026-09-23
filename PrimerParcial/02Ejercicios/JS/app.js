const talleres = [
  { nombre: 'Introducción a Python', instructor: 'Ing. María López', cupo: 25, inscritos: 25 },
  { nombre: 'Fundamentos de Redes', instructor: 'Ing. Carlos Ramírez', cupo: 30, inscritos: 18 },
  { nombre: 'Diseño de Bases de Datos', instructor: 'Ing. Ana Torres', cupo: 20, inscritos: 20 },
  { nombre: 'Desarrollo Web con JS', instructor: 'Ing. María López', cupo: 25, inscritos: 10 },
];


function pintarTabla() {
    //debe de obtener la tabla y rellenarla con los datos de talleres

    const tbody = document.querySelector('#tabla-talleres tbody');
    tbody.innerHTML = '';

    talleres.forEach(function(taller) {
        const fila = document.createElement('tr');

        const tdNombre = document.createElement('td');
        tdNombre.textContent = taller.nombre;
        fila.appendChild(tdNombre);

        const tdInstructor = document.createElement('td');
        tdInstructor.textContent = taller.instructor;
        fila.appendChild(tdInstructor);

        const tdCupo = document.createElement('td');
        tdCupo.textContent = taller.cupo;
        fila.appendChild(tdCupo);

        const tdInscritos = document.createElement('td');
        tdInscritos.textContent = taller.inscritos;
        fila.appendChild(tdInscritos);

        tbody.appendChild(fila);
    });
}


const formArreglos = document.getElementById('form-arreglos');
const resultadoArreglos = document.getElementById('resultado-arreglo');
const selectOperacionArreglo = document.getElementById('operacion-arreglo');

formArreglos.addEventListener('submit', (evento) =>{
    evento.preventDefault();
    const operacion = selectOperacionArreglo.value;

    let resultado;

    switch(operacion){
        case 'forEach':
            resultado = talleres.map((t) => `- ${t.nombre} (${t.inscritos}/${t.cupo})`).join('\n');
            break;
    }


    resultadoArreglos.textContent = resultado;
});