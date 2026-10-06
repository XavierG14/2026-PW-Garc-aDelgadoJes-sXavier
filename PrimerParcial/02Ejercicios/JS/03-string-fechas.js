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
