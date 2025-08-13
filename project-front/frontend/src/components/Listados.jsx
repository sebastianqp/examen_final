import { useEffect, useState } from "react";
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

async function api(path) {
  const res = await fetch(API_BASE + path);
  if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
  return res.json();
}

export default function Listados({ refreshKey }) {
  const [investigadores, setInvestigadores] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [msg, setMsg] = useState("");

  async function cargar() {
    setMsg("");
    try {
      const inv = await api("/investigadores");
      const grp = await api("/grupos");
      setInvestigadores(inv);
      setGrupos(grp);
    } catch (err) {
      setMsg("❌ " + err.message);
    }
  }

  useEffect(() => { cargar(); }, [refreshKey]);

  return (
    <div className="card">
      <h2>Investigadores</h2>
      {msg && <p>{msg}</p>}
      <table>
        <thead><tr><th>ID</th><th>Nombre</th><th>Depto</th><th>Experiencia</th></tr></thead>
        <tbody>
          {investigadores.map(i => (
            <tr key={i.id}>
              <td>{i.id}</td>
              <td>{i.nombre} {i.apellido}</td>
              <td>{i.departamento}</td>
              <td>{i.experiencia}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginTop: 20 }}>Grupos de Investigación</h2>
      <table>
        <thead><tr><th>Línea</th><th>Área</th><th>Disponibilidad</th><th>Investigadores</th></tr></thead>
        <tbody>
          {grupos.map((g, idx) => (
            <tr key={idx}>
              <td>{g.nombre_linea}</td>
              <td>{g.area}</td>
              <td>{g.franja_horaria} — {g.modalidad}</td>
              <td>{g.investigadores}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
