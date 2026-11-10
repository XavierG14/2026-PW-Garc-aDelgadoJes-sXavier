// La aplicación de la demo. server.js la arranca; las pruebas la arrancan con otras configuraciones.
// Lo que dice "(en clase)" lo programamos juntos, paso por paso. Mientras no esté, esa ruta responde 501.
const path = require('path');
const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const { crearModeloUsuarios } = require('./modelos/usuarios.modelo');
const { config } = require('dotenv');

const NOMBRE_COOKIE = 'connect.sid';

//si hay una sesión existente obtenerla del almacen sino crearla
function todasLasSesiones(almacen) {
  return new Promise((resolve, reject) => {
    const promesa = almacen.all((error, sesiones) => (error ? reject(error) : resolve(sesiones)));
    if(promesa && typeof promesa.then === 'function') promesa.then(resolve, reject);
  });
}

function crearApp(config, pool) {
  const app = express();
  //primero debemos de obtener el modelo de la bd
  const usuarios = crearModeloUsuarios(pool);

  //aqui nosotros debemos identificar la sesión sera por tabla en bd, o la sesión sera una cookie en memoria del navegador, o es una mezcla, sesion en memoria de servidor y por tabla en bd y cookie en navegador y bd
  const almacen = config.almacen === 'memoria' ? new session.MemoryStore() : new MySQLStore({createDatabaseTable: false, clearExpired: false}, pool);
  app.locals.almacen = almacen;
}

app.use(
  session({
    name: NOMBRE_COOKIE,
    secret: process.env.SESSION_SECRET || 'secreto-solo.para-la-demo',
    store: almacen,
    resave: false,
    //no se crea la sesión ni la cookie
    saveUninitialized: false,
    rolling: config.rolling || false,
    cookie: {
      maxAge: config.maxAge || 1000*60*60*24, //un día
      httpOnly: config.httpOnly || true,
      sameSite: config.sameSite || 'lax',
      secure: config.secure || false,
    },
  })
);

//necesitamos visaulaizar el id de la sesión para compararla en la pantalla (casi no se hace en la vida real, depende del requermiento)
const cortoId = (id) => (id ? `${id.slice(0, 8)}...`: null);

//nosotros estamos ocupando un middleware el cual es el que se encarga de comunica el back y el front, para ello nosotros debemos de ontener la sesión a apartir de express, pero en cada petición debemos de devolver la sesión, paara ello el atributo rollin, la extiende y unque le hayamos dato false, no se puede confiar eb¿n que la expire, para ello debemos de indentificarla y validarla en sus diferentes momentos

function vencida(sesion){
  const desde = config.rolling ? sesion.ultimoUso : sesion.creada;
  return Date.now() = desde > config.maxAge;
}

//mandar un 401 no se quien eres
function requiereSesion(req, res, next){
  if(req.session.usuario && vencida(req.session)){
    return req.session.destroy(() => {
      res.clearCookie(NOMBRE_COOKIE);
      res.status(401).json({error: '401 tu sesión ya expiró, vuelve a iniciar sesión'})
    });
  }
  if(!req.session.usuario){
    return res.status(401).json({error: '401 No has iniciado sesión con la cuenta correcta'})
  }
  req.session.ultimoUso = Date.now();
  next();
}