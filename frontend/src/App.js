import React, { useEffect, useState } from "react";

function App() {
  const [tareas, setTareas] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [recomendacion, setRecomendacion] = useState("");

  // Pillar tareas
  const cargarTareas = () => {
    fetch("http://localhost:3001/tareas")
      .then(res => res.json())
      .then(data => setTareas(data));
  };

  // Obtener recomendación
  const cargarRecomendacion = () => {
    fetch("http://localhost:3001/recomendacion/1")
      .then(res => res.json())
      .then(data => {
        if (data.mensaje) setRecomendacion(data.mensaje);
      });
  };

  useEffect(() => {
    cargarTareas();
    cargarRecomendacion();
  }, []);

  // Añadir tarea
  const agregarTarea = () => {
    fetch("http://localhost:3001/tareas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        titulo,
        usuario_id: 1
      })
    })
      .then(res => res.json())
      .then(() => {
        setTitulo("");
        cargarTareas();
        cargarRecomendacion();
      });
  };

  // Completar tarea
  const completarTarea = (tarea) => {
  const nuevoEstado = tarea.completado ? 0 : 1;

  console.log("Enviando:", nuevoEstado);

  fetch(`http://localhost:3001/tareas/${tarea.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ completado: nuevoEstado })
  })
    .then(res => res.json())
    .then(data => {
      console.log("Respuesta:", data);
      cargarTareas();
      cargarRecomendacion();
    });
};

  // Borrar tarea
  const borrarTarea = (id) => {
    fetch(`http://localhost:3001/tareas/${id}`, {
      method: "DELETE"
    }).then(() => {
      cargarTareas();
      cargarRecomendacion();
    });
  };

  return (
  <div style={{ maxWidth: "600px", margin: "0 auto", fontFamily: "Arial" }}>
    <h1>Gestor de Tareas</h1>

    <div style={{ marginBottom: "20px" }}>
      <h3>Recomendación</h3>
      <p><strong>{recomendacion}</strong></p>
    </div>

    <div style={{ marginBottom: "20px" }}>
      <input
        value={titulo}
        onChange={e => setTitulo(e.target.value)}
        placeholder="Nueva tarea"
        style={{ padding: "8px", width: "70%" }}
      />
      <button onClick={agregarTarea} style={{ padding: "8px" }}>
        Añadir
      </button>
    </div>

    <ul style={{ listStyle: "none", padding: 0 }}>
      {tareas.map(t => (
        <li
          key={t.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "8px"
          }}
        >
          <span style={{
            textDecoration: Number(t.completado) ? "line-through" : "none"
          }}>
            {t.titulo}
          </span>

          <div>
            <button onClick={() => completarTarea(t)}>
              {Number(t.completado) ? "Desmarcar" : "Completar"}
            </button>

            <button onClick={() => borrarTarea(t.id)}>
              Borrar
            </button>
          </div>
        </li>
      ))}
    </ul>
  </div>
);
}

export default App;