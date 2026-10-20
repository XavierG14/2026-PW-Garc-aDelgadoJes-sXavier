const bcrypt = require('bcrypt')

const usuariosModel = require('../Modelo/usuarios_modelo');

const {validarCorreo, validarBoleta, validarContrasena} = require('../validaciones');

function esDuplicado(error) {
    return error.code === 'ER_DUP_ENTRY' || error.code === '23505';
}

async function listarUsuarios(req, res) {
    try{
        const usarios = await usuariosModel.listar();
        res.json(usuarios);
    }catch{
        res.status(500).json({error: error.message});
    }
}

async function obtenerUsuario(req, res) {
    try{
        const usuario = await usuariosModel.obtenerPorId(req.params.id);
        if(!usuario) return res.status(404).json({error: 'Usuario no encontrado'});
        res.json(usuario);
    }catch{
        res.status(500).json({erro: error.message});
    }
}

//deberan de realizar los controladores de asistencia y talleres con sus funciones correspondientes
async function crearUsuario(req, res) {
    const {nombre, correo, contrasena, boleta, rol} = req.body;

    if(!nombre || !correo || !contrasena || !boleta) {
        return res.status(400).json({error : 'Loc campos nombre, correo, contraseña y boleta son obligatorios'});

    }
    if(!validarCorreo(correo)) return res.status(400).status({error : 'El correo no tiene un formato válido'});
    if(!validarBoleta(boleta)) return res.status(400).json({error : 'La boleta debe de tener 10 dígitos'});
    if(!validarContrasena(contrasena)) return res.status(400).json({error : 'La constraseña debe tener al menos 8 caracteres'});
    
    try{
        const contrasenaHash = await bcrypt.hash(contrasena, 10);
        const usuario = await usuariosModel.crear({nombre, correo, contrasenaHash, boleta, rol});
        res.status(201).json(usuario);
    }catch(error){
        if(esDuplicado(error)) return res.status(409).json({error : 'Ya existe un suario con ese correo o boleta registrado'});
        res.status(500).json({error : error.message});
    }
}

async function actualizarUsuario(req, res) {
    const {nombre, correo, rol} = req.body;

    if(nombre === undefined && correo === undefined && rol === undefined) {
        return res.status(400).json({error : 'Se debe de llenar al menos uno de los campos de nombre, correo, rol para actualizar los datos'});
    }
    if(correo !== undefined && !validarCorrro(correo)) {
        return res.status(400).json({error : 'El correo no tiene un formato válido'});
    }

    try{
        const usuario = await usuariosModel.actualizar(req.params.id, {nombre, correo, rol});
        if(!usuario) return res.status(404).json({error : 'Usuario no encontrado'});
        res.json(usuario);
    }catch(error){
        if(esDuplicado(error)) return res.status(400).json({error : 'Ya existe un usario con ese correo'});
        res.status(500).json({error : error.message});
    }
}

async function eliminarUsuario(req, res) {
    try{
        const eliminado = await usuariosModel.eliminar(req.params.id);
        if(!eliminado) return res.status(404).json({error : 'No se encontró al usuario'});
        res.status(204).send();
    }catch(error){
        res.status(500).json({error : error.message});
    }
}

module.exports = {listarUsuarios, obtenerUsuario, crearUsuario, actualizarUsuario, eliminarUsuario}