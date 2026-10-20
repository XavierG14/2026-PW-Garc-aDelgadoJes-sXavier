//Aquí se hará el controlador de asistencia, con sus funciones correspondientes para
//  registrar y consultar asistencias.
const asistenciaModel = require('../modelo/asistencia_modelo');

async function registrarAsistencia(req, res) {
    try {
        const { tallerId, nombreAlumno, boleta } = req.body;
        const resultado = await asistenciaModel.registrarAsistencia({ tallerId, nombreAlumno, boleta });
        res.status(201).json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function obtenerAsistencia(req, res) {
    try {
        const asistencia = await asistenciaModel.obtenerPorId(req.params.id);
        if (!asistencia) return res.status(404).json({ error: 'Asistencia no encontrada' });
        res.json(asistencia);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
module.exports = {registrarAsistencia,obtenerAsistencia};
