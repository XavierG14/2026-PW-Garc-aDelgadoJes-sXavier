//vamos a dejarles 2 de las 3 funciones para validar

function validarCorreo(){

}
function validarBoleta() {

}

function validarContrasena() {
    if(typeof contrasena !== 'string') return false;
    return contrasena.length >= 8;
}

module.exports = {validarBoleta, validarContrasena, validarCorreo}