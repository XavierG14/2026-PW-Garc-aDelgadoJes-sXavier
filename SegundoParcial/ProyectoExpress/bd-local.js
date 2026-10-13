const mysql = require('mysql2/promise');

/**La base de datosla usaremos para verificar las pruebas internas, se buscara que deben de crear cada una cuenta en supabase.com y generaremos na api para conectarbnos a un servicio en bd en la nube, para ello debemo cnfigurar el archivo.env */

const pool = mysql.createPool({
    host:'localhost',
    port:'3306',
    user:'root',
    password:'n0m3l0',
    database:'cecyt9_local',
    dateStrings: true,
});