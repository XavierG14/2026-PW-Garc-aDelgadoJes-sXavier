import { pedirJSON } from './api';

export function crearAsistencia({ taller_id, nombre_alumno, boleta }) {
  // Si el backend nuevo usa otros nombres, se cambian aquí.
  return pedirJSON('/asistencias', {
    method: 'POST',
    body: JSON.stringify({ taller_id, nombre_alumno, boleta }),
  });
}

export function crearUsuario({ nombre, correo, contrasena, boleta }) {
  return pedirJSON('/usuarios', {
    method: 'POST',
    body: JSON.stringify({ nombre, correo, contrasena, boleta }),
  });
}

export function crearTaller({ nombre, instructor, fecha, cupo }) {
  return pedirJSON('/talleres', {
    method: 'POST',
    body: JSON.stringify({ nombre, instructor, fecha, cupo }),
  });
}

export async function buscarUsuarioPorBoleta(boleta) {
  const usuarios = await pedirJSON('/usuarios');
  return usuarios.find((u) => u.boleta === boleta) || null;
}