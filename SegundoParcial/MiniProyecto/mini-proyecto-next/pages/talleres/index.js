import { useEffect, useState } from 'react';
import { pedirJSON } from '../../lib/api';
import TarjetaTaller from '../../components/TarjetaTaller';
import estilos from '../../styles/Talleres.module.css';

export default function Talleres() {
  const [talleres, setTalleres] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [orden, setOrden] = useState('fecha');

  useEffect(() => {
    cargarTalleres();
  }, []);

  async function cargarTalleres() {
    try {
      const lista = await pedirJSON('/talleres');
      // La lista no dice cuántos inscritos tiene cada taller: se piden las asistencias de todos a la vez.
      const asistencias = await Promise.all(lista.map((t) => pedirJSON(`/talleres/${t.id}/asistencias`)));
      setTalleres(lista.map((t, i) => ({ ...t, inscritos: asistencias[i].length })));
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  const texto = busqueda.trim().toLowerCase();
  const visibles = talleres
    .filter((t) => `${t.nombre} ${t.instructor || ''}`.toLowerCase().includes(texto))
    .sort((a, b) =>
      orden === 'nombre'
        ? a.nombre.localeCompare(b.nombre, 'es')
        : String(a.fecha).localeCompare(String(b.fecha))
    );

  return (
    <main>
      <h1>Talleres</h1>
      <div className={estilos.controles}>
        <input
          className={estilos.buscador}
          placeholder="Buscar por nombre o instructor"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <select value={orden} onChange={(e) => setOrden(e.target.value)} aria-label="Ordenar talleres">
          <option value="fecha">Ordenar por fecha</option>
          <option value="nombre">Ordenar por nombre</option>
        </select>
      </div>
      {cargando && <p>Cargando talleres…</p>}
      {error && <p className="error">{error}</p>}
      {!cargando && !error && talleres.length === 0 && <p>No hay talleres registrados.</p>}
      {!cargando && !error && talleres.length > 0 && visibles.length === 0 && (
        <p>No hay talleres que coincidan con la búsqueda.</p>
      )}

      <div className={estilos.rejilla}>
        {visibles.map((t) => (
          <TarjetaTaller key={t.id} taller={t} />
        ))}
      </div>
    </main>
  );
}