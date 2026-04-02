const sqlite3 = require('sqlite3').verbose();
const path = require('path');

//Ruta bd
const dbPath = path.resolve(__dirname, 'db', 'tareas.db');

//Crear/abrir bd
const db = new sqlite3.Database(dbPath, (err) => {
    if(err) {
        console.error('Error abriendo base de datos: ', err);
    } else {
        console.log('BD SQLite lista');
    }
});

//Crear tablas si no existen
db.serialize(() => {
    //Usuarios
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        email TEXT
    )`);

    //Tareas
    db.run(`CREATE TABLE IF NOT EXISTS tareas(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER,
        titulo TEXT,
        completada INTEGER DEFAULT 0,
        FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
        )`);
});

module.exports = db;