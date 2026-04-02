const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

//test endpoint
app.get('/', (req,res) => {
    res.send('Backend tira');
});

//todas tareas
app.get('/tareas', (req, res)=>{
    db.all('SELECT * FROM tareas', [], (err, rows) =>{
        if(err){
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

//crear tarea
app.post('/tareas', (req, res) =>{
    const { titulo, usuario_id } = req.body;

    db.run(
        'INSERT INTO tareas (titulo, usuario_id) VALUES (?, ?)',
        [titulo, usuario_id],
        function (err){
            if(err){
                res.status(500).json({ error: err.message });
            } else {
                res.json({
                    id: this.lastID,
                    titulo,
                    usuario_id
                });
            }
        }
    );
});

//marcar completada
app.put('/tareas/:id', (req, res) => {
    const { id } = req.params;
    const { completado } = req.body;

    db.run(
        'UPDATE tareas SET completado = ? WHERE id = ?',
        [completado, id],
        function (err){
            if(err){
                res.status(500).json({ error: err.message });
            } else {
                res.json({ mensaje: 'Tarea actualizada' });
            }
        }
    );
});

//borrar
app.delete('/tareas/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM tareas WHERE id = ?', id, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ mensaje: 'Tarea eliminada' });
    }
  });
});

//iniciar server
app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});