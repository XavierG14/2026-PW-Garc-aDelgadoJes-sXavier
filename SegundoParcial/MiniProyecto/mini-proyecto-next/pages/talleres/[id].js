import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { pedirJSON } from '../../lib/api';
import { buscarUsuarioPorBoleta, crearAsistencia, crearUsuario } from '../../lib/servicios';
import { formatearFecha, ocultarBoleta } from '../../lib/formato';
import {
  NOMBRE_MAX,
  validarBoleta,
  validarContrasena,
  validarCorreo,
  validarNombre,
} from '../../lib/validaciones';
import estilos from '../../styles/Talleres.module.css';

export default function DetalleTaller() {
  const router = useRouter();
  const { id } = router.query;

  const [taller, setTaller] = useState(null);
  const [asistencias, setAsistencias] = useState([]);
  const [errorCarga, setErrorCarga] = useState('');

  const [nombre, setNombre] = useState('');
  const [boleta, setBoleta] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [errorForm, setErrorForm] = useState('');
  const [exito, setExito] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;
    // Si se llegó desde /perfil, la boleta y el nombre vienen en la URL (?boleta=...&nombre=...).
    if (router.query.boleta) setBoleta(String(router.query.boleta));
    if (router.query.nombre) setNombre(String(router.query.nombre));
    cargar();
  }, [router.isReady, id]);

  async function cargar() {
    try {
      setTaller(await pedirJSON(`/talleres/${id}`));
      setAsistencias(await pedirJSON(`/talleres/${id}/asistencias`));
      setErrorCarga('');
    } catch (err) {
      setErrorCarga(err.message);
    }
  }

  const ocupados = asistencias.length;
  const libres = taller ? Math.max(0, taller.cupo - ocupados) : 0;
  const lleno = taller !== null && libres === 0;

  async function inscribir(e) {
    e.preventDefault();
    setErrorForm('');
    setExito('');

    const nombreLimpio = nombre.trim().replace(/\s+/g, ' ');
    const boletaLimpia = boleta.trim();
    const correoLimpio = correo.trim();

    // Validaciones del front: ninguna de estas manda peticiones al backend.
    const errorNombre = validarNombre(nombreLimpio);
    if (errorNombre) return setErrorForm(errorNombre);
    if (!validarBoleta(boletaLimpia)) return setErrorForm('La boleta debe tener 10 dígitos.');
    if (asistencias.some((a) => a.boleta === boletaLimpia)) {
      return setErrorForm('Esa boleta ya está inscrita en este taller.');
    }
    if (lleno) return setErrorForm('El taller ya no tiene lugares.');

    setEnviando(true);
    try {
      // 1) ¿Esa boleta ya tiene cuenta? Si no, se crea con los datos del formulario.
      const cuenta = await buscarUsuarioPorBoleta(boletaLimpia);
      let cuentaNueva = false;
      if (!cuenta) {
        if (!validarCorreo(correoLimpio)) {
          return setErrorForm('Esta boleta aún no tiene cuenta: escribe un correo válido para crearla.');
        }
        if (!validarContrasena(contrasena)) {
          return setErrorForm('Para crear la cuenta, la contraseña debe tener al menos 8 caracteres.');
        }
        await crearUsuario({
          nombre: nombreLimpio,
          correo: correoLimpio,
          contrasena,
          boleta: boletaLimpia,
        });
        cuentaNueva = true;
      }

      // 2) Se registra la inscripción.
      await crearAsistencia({ taller_id: id, nombre_alumno: nombreLimpio, boleta: boletaLimpia });
      setExito(
        cuentaNueva
          ? `¡Listo! Se creó la cuenta de ${nombreLimpio} y quedó inscrito(a) en el taller.`
          : `¡Listo! ${nombreLimpio} quedó inscrito(a) en el taller.`
      );
      setNombre('');
      setBoleta('');
      setCorreo('');
      setContrasena('');
      await cargar();
    } catch (err) {
      setErrorForm(err.message);
    } finally {
      setEnviando(false);
    }
  }

  if (errorCarga) {
    return (
      <main>
        <p className="error">{errorCarga}</p>
        <Link className={estilos.volver} href="/talleres">← Volver a talleres</Link>
      </main>
    );
  }
  if (!taller) return <main><p>Cargando taller…</p></main>;

  const porcentaje = Math.min(100, (ocupados / taller.cupo) * 100);

  return (
    <main>
      <Link className={estilos.volver} href="/talleres">← Volver a talleres</Link>
      <h1>{taller.nombre}</h1>

      <section className={estilos.panel}>
        <p><strong>Instructor:</strong> {taller.instructor || 'Por confirmar'}</p>
        <p><strong>Fecha:</strong> {formatearFecha(taller.fecha)}</p>
        <div className={estilos.barra}>
          <div className={estilos.relleno} style={{ width: `${porcentaje}%` }} />
        </div>
        <p>
          {ocupados} de {taller.cupo} lugares ocupados ·{' '}
          {lleno ? (
            <span className={estilos.lleno}>Taller lleno</span>
          ) : (
            `${libres} ${libres === 1 ? 'lugar libre' : 'lugares libres'}`
          )}
        </p>
      </section>

      <section className={estilos.panel}>
        <h2>Inscribirme</h2>
        <form onSubmit={inscribir} className="formulario">
          <input placeholder="Nombre completo" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          <small className={nombre.trim().length > NOMBRE_MAX ? 'error' : estilos.nota}>
            {nombre.trim().length}/{NOMBRE_MAX} caracteres
          </small>
          <input placeholder="Boleta (10 dígitos)" value={boleta} onChange={(e) => setBoleta(e.target.value)} />
          <p className={estilos.nota}>Solo si es tu primera vez, para crear tu cuenta:</p>
          <input
            type="email"
            placeholder="Correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
          <input
            type="password"
            autoComplete="new-password"
            placeholder="Contraseña (mínimo 8 caracteres)"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />
          <button type="submit" disabled={lleno || enviando}>
            {lleno ? 'Sin lugares' : enviando ? 'Inscribiendo…' : 'Inscribirme'}
          </button>
        </form>
        {errorForm && <p className="error">{errorForm}</p>}
        {exito && <p className={estilos.exito}>{exito}</p>}
      </section>

      <h2>Inscritos ({ocupados})</h2>
      {ocupados === 0 ? (
        <p>Todavía no hay inscritos. ¡Sé el primero!</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Boleta</th>
            </tr>
          </thead>
          <tbody>
            {asistencias.map((a, i) => (
              <tr key={a.id}>
                <td>{i + 1}</td>
                <td>{a.nombre_alumno}</td>
                <td>{ocultarBoleta(a.boleta)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}