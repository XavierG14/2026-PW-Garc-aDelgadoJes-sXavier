const MINI_SERVIDOR_URL = 'http://localhost:3000';
const BACKEND_URL = 'http://localhost:3306'; // (Nota: el puerto 3306 es de MySQL, asegúrate de que tu backend use este puerto HTTP o cámbialo si es otro, ej: 4000 o 5000)

/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    async rewrites() {
        return [
            { source: '/mini/:path*', destination: `${MINI_SERVIDOR_URL}/:path*` },
            { source: '/api/:path*', destination: `${BACKEND_URL}/api/:path*` }
        ];
    }
};