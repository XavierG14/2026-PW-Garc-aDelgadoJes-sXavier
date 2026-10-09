const entrada = ' María López ';

//TODO: trim - imprime ' entrada sin espacios sobrantes
console.log('Ejemplo de uso de .trim()');
console.log(`"${entrada.trim()}"`);

//TODO: split - parte el resultado del trim en un arreglo 'partes', separado por espacio
console.log('Ejemplo deSplit');
const partes = entrada.trim().split(' ');
console.log(partes);

//TODO: include - 
console.log('Ejemplo de includes');
console.log('correo@ipn.mx'.includes('@'));

//TODO: replace y replaceAll - 
console.log('Ejemplo de replace / replaceAll');
console.log('05/09/2026'.replace('/', '-'));
console.log('05/06/2026'.replaceAll('/', '-'));

//TODO: template literals -
console.log('Manejo de template');
const nombre = 'María';
const cupo = 25;
console.log(`${nombre} se inscribio en un taller con cupo para ${cupo} personas`);

//TODO: date - 
console.log('Ejemplo de Date');
function fechaDesdeTexto(textoFecha) {
    const [dia, mes, anio] = textoFecha.split('/').map(Number);
    return new Date(anio, mes - 1, dia);
}

//TODO: usa fechaDesdeTexto ('05/09/2026')
const fechasAsistencia = fechaDesdeTexto('05/09/2026');
console.log('Fecha construida: ', fechasAsistencia.toISOString());
console.log('Dia de la semana (0=domingo): ', fechasAsistencia.getDay());
const hoy = new Date();
const diaDeDiferencia = Math.round((fechasAsistencia - hoy) / (1000*60*60*24));
console.log(`Faltan ${diaDeDiferencia} dia(s) para la fecha de asistencia al taller (puede ser negativo)`);