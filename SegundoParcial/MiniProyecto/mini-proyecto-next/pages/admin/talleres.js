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
    if (!fecha) return setError('La fecha es obligatoria.');
    // El cupo es opcional: vacío = el backend usa su valor por defecto.
    const cupoNumero = cupo === '' ? undefined : Number(cupo);
    if (cupoNumero !== undefined && (!Number.isInteger(cupoNumero) || cupoNumero < 1)) {
      return setError('El cupo debe ser un número entero mayor a 0.');
    }

    setEnviando(true);
    try {
      const nuevo = await crearTaller({
        nombre: nombreLimpio,
        instructor: instructor.trim() || undefined,
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
        <input placeholder="Nombre del taller (obligatorio)" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        <input placeholder="Instructor (opcional)" value={instructor} onChange={(e) => setInstructor(e.target.value)} />
        <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
        <input
          type="number"
          min="1"
          placeholder="Cupo (opcional)"
          value={cupo}
          onChange={(e) => setCupo(e.target.value)}
        />
        <button type="submit" disabled={enviando}>{enviando ? 'Creando…' : 'Crear taller'}</button>
      </form>
      {error && <p className="error">{error}</p>}
      {creado && (
        <p className={estilos.exito}>
          Taller «{creado.nombre}» creado. <Link href={`/talleres/${creado.id}`}>Ver detalle</Link>
        </p>
      )}
    </main>
  );
}