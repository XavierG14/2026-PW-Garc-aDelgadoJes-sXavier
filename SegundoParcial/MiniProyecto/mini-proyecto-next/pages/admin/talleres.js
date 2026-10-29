import Link from 'next/link';
import { useState } from 'react';
import { crearTaller } from '../../lib/servicios';
import estilos from '../../styles/Talleres.module.css';
 
export default function CrearTaller() {
  const [nombre, setNombre] = useState('');
  const [instructor, setInstructor] = useState('');
  const [fecha, setFecha] = useState('');
  const [cupo, setCupo] = useState('');
  const [error, setError] = useState('');
  const [creado, setCreado] = useState(null);
  const [enviando, setEnviando] = useState(false);
 
  async function crear(e) {
    e.preventDefault();
    setError('');
    setCreado(null);
 
    const nombreLimpio = nombre.trim();
    if (!nombreLimpio) return setError('El nombre del taller es obligatorio.');
    if (nombreLimpio.length > 25) {
      return setError('El nombre del taller no puede tener más de 25 caracteres.');
    }
 
    if (!fecha) return setError('La fecha es obligatoria.');
 
    const instructorLimpio = instructor.trim();
    if (instructorLimpio) {
      if (instructorLimpio.length > 60) {
        return setError('El nombre del instructor no puede tener más de 60 caracteres.');
      }
      if (/\d/.test(instructorLimpio)) {
        return setError('El nombre del instructor no puede contener números.');
      }
    }
 
    const cupoNumero = cupo === '' ? undefined : Number(cupo);
    if (cupoNumero !== undefined && (!Number.isInteger(cupoNumero) || cupoNumero < 1 || cupoNumero > 30)) {
      return setError('El cupo debe ser un número entero entre 1 y 30.');
    }
 
    setEnviando(true);
    try {
      const nuevo = await crearTaller({
        nombre: nombreLimpio,
        instructor: instructorLimpio || undefined,
        fecha, // el input de fecha ya entrega 'AAAA-MM-DD', el formato del backend
        cupo: cupoNumero,
      });
      setCreado(nuevo);
      setNombre('');
      setInstructor('');
      setFecha('');
      setCupo('');
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }
 
  return (
<main>
<h1>Crear taller</h1>
<form onSubmit={crear} className="formulario">
<input 
          placeholder="Nombre del taller (máx. 25 caracteres)" 
          maxLength={25}
          value={nombre} 
          onChange={(e) => setNombre(e.target.value)} 
        />
<input 
          placeholder="Instructor (opcional, máx. 60 caracteres)" 
          maxLength={60}
          value={instructor} 
          onChange={(e) => setInstructor(e.target.value)} 
        />
<input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
<input
          type="number"
          min="1"
          max="30"
          placeholder="Cupo (máx. 30, opcional)"
          value={cupo}
          onChange={(e) => setCupo(e.target.value)}
        />
<button type="submit" disabled={enviando}>{enviando ? 'Creando…' : 'Crear taller'}</button>
</form>
      {error && <p className="error">{error}</p>}
      {creado && <p className={estilos.exito || ""}>¡Taller creado con éxito!</p>}
</main>
  );
}