// Reglas de validación de los datos de un usuario. Son las mismas que valida el backend y las que
// Pruebas de Software prueba con Jest: el front valida para avisar rápido a quien llena el
// formulario; el backend valida para que nadie se las salte mandando la petición con Postman.

export function validarCorreo(correo) {
  if (typeof correo !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim());
}

export function validarBoleta(boleta) {
  if (typeof boleta !== 'string') return false;
  return /^\d{10}$/.test(boleta.trim());
}

export function validarContrasena(contrasena) {
  if (typeof contrasena !== 'string') return false;
  return contrasena.length >= 8;
}

// --- Reglas del formulario de inscripción ---
export const NOMBRE_MAX = 60;

// Regresa el mensaje de error, o '' si el nombre es válido.
export function validarNombre(nombre) {
  const texto = typeof nombre === 'string' ? nombre.trim() : '';
  if (!texto) return 'Escribe tu nombre.';
  if (texto.length < 2) return 'El nombre es demasiado corto (mínimo 2 caracteres).';
  if (texto.length > NOMBRE_MAX) return `El nombre es demasiado largo (máximo ${NOMBRE_MAX} caracteres).`;
  if (/\d/.test(texto)) return 'El nombre no puede contener números.';
  if (!/^\p{L}[\p{L} '’.-]*$/u.test(texto)) {
    return 'El nombre solo puede tener letras, espacios, apóstrofos, puntos o guiones.';
  }
  return '';
}
