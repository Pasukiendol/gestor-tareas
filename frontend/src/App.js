import React, { useEffect, useState } from "react";

function App() {
  const [tareas, setTareas] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [recomendacion, setRecomendacion] = useState("");
  const [prioridad, setPrioridad] = useState(0);
  const [filtro, setFiltro] = useState("todas");

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
        usuario_id: 1,
        prioridad
      })
    }).then(() => {
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

const tareasFiltradas = tareas.filter(t => {
  if (filtro === "pendientes") return !Number(t.completado);
  if (filtro === "completadas") return Number(t.completado);
  return true;
});

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
      <select value={prioridad} onChange={e => setPrioridad(Number(e.target.value))}>
        <option value={0}>🟢 Baja</option>
        <option value={1}>🟡 Media</option>
        <option value={2}>🔴 Alta</option>
      </select>
      <button onClick={agregarTarea} style={{ padding: "8px" }}>
        Añadir
      </button>
      <button onClick={() => setFiltro("todas")}>Todas</button>
      <button onClick={() => setFiltro("pendientes")}>Pendientes</button>
      <button onClick={() => setFiltro("completadas")}>Completadas</button>
    </div>

    <ul style={{ listStyle: "none", padding: 0 }}>
      {tareasFiltradas.map(t => (
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
          <div>
            <span style={{
              textDecoration: Number(t.completado) ? "line-through" : "none"
            }}>
              {t.titulo}
            </span>

            <span style={{ marginLeft: "10px" }}>
              {t.prioridad === 2 && "🔴 Alta"}
              {t.prioridad === 1 && "🟡 Media"}
              {t.prioridad === 0 && "🟢 Baja"}
            </span>
          </div>

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