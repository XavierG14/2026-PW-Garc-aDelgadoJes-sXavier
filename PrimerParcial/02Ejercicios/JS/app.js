const talleres = [
  { nombre: 'Introducción a Python', instructor: 'Ing. María López', cupo: 25, inscritos: 25 },
  { nombre: 'Fundamentos de Redes', instructor: 'Ing. Carlos Ramírez', cupo: 30, inscritos: 18 },
  { nombre: 'Diseño de Bases de Datos', instructor: 'Ing. Ana Torres', cupo: 20, inscritos: 20 },
  { nombre: 'Desarrollo Web con JS', instructor: 'Ing. María López', cupo: 25, inscritos: 10 },
];


function pintarTabla() {
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

pintarTabla();


const formArreglos = document.getElementById('form-arreglos');
const resultadoArreglos = document.getElementById('resultado-arreglo');
const selectOperacionArreglo = document.getElementById('operacion-arreglo');

formArreglos.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const operacion = selectOperacionArreglo.value;

  let resultado = '';

  switch (operacion) {
    case 'forEach':
      let lista = [];
      talleres.forEach((t) => {
        lista.push(`- ${t.nombre} (${t.inscritos}/${t.cupo})`);
      });
      resultado = lista.join('\n');
      break;

    case 'map':
      const nombres = talleres.map((t) => t.nombre);
      resultado = 'Lista de nombres de los talleres:\n' + nombres.map((n) => `- ${n}`).join('\n');
      break;

    case 'filter':
      // Filtra solo los talleres donde inscritos sea igual al cupo (llenos)
      const llenos = talleres.filter((t) => t.inscritos >= t.cupo);
      if (llenos.length > 0) {
        resultado = 'Talleres con cupo lleno:\n' + llenos.map((t) => `- ${t.nombre} (${t.inscritos}/${t.cupo})`).join('\n');
      } else {
        resultado = 'No hay talleres con cupo lleno.';
      }
      break;

    case 'find':
      // Solicita al usuario el nombre del instructor a buscar
      const busqueda = prompt('Ingresa el nombre del instructor a buscar (ej. Ing. María López):');
      if (busqueda) {
        const encontrado = talleres.find((t) =>
          t.instructor.toLowerCase().includes(busqueda.toLowerCase().trim())
        );
        if (encontrado) {
          // Espacios agregados después de los dos puntos
          resultado = `Taller encontrado:\n- Taller: ${encontrado.nombre}\n- Instructor:${encontrado.instructor}\n- Cupo: ${encontrado.cupo}\n- Inscritos:${encontrado.inscritos}`;
        } else {
          // Corrección de redacción: "impartido por"
          resultado = `No se encontró ningún taller impartido por "${busqueda}".`;
        }
      } else {
        resultado = 'Búsqueda cancelada.';
      }
      break;

    default:
      resultado = 'Selecciona una opción válida.';
  }

  resultadoArreglos.textContent = resultado;
});