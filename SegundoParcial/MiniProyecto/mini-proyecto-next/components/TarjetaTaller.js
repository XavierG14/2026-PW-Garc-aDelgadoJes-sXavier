import Link from 'next/link';
import { formatearFecha, yaPaso } from '../lib/formato';
import estilos from './TarjetaTaller.module.css';

export default function TarjetaTaller({ taller }) {
  const pasado = yaPaso(taller.fecha);
  const conConteo = typeof taller.inscritos === 'number';
  const lleno = conConteo && taller.inscritos >= taller.cupo;

  return (
    <article className={estilos.tarjeta}>
      <div className={estilos.etiquetas}>
        <span className={pasado ? estilos.etiquetaPasado : estilos.etiqueta}>
          {pasado ? 'Ya pasó' : 'Próximo'}
        </span>
        {lleno && <span className={estilos.etiquetaLleno}>Lleno</span>}
      </div>
      <h3 className={estilos.titulo}>{taller.nombre}</h3>
      <p className={estilos.dato}>
        <strong>Instructor:</strong> {taller.instructor || 'Por confirmar'}
      </p>
      <p className={estilos.dato}>
        <strong>Fecha:</strong> {formatearFecha(taller.fecha)}
      </p>
      <p className={estilos.dato}>
        <strong>Cupo:</strong>{' '}
        {conConteo ? `${taller.inscritos} de ${taller.cupo} lugares ocupados` : `${taller.cupo} lugares`}
      </p>
      <Link className={estilos.enlace} href={`/talleres/${taller.id}`}>
        Ver detalle e inscribirme →
      </Link>
    </article>
  );
}