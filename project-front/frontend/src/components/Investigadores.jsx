import { useState, useEffect } from "react";
import { api } from "../services/api";

export default function Investigadores({ onRefresh }) {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({ nombre: "", apellido: "", departamento: "", experiencia: 0 });

  async function load() {
    const res = await api("/investigadores");
    setData(res);
  }

  async function submit(e) {
    e.preventDefault();
    await api("/investigadores", { method: "POST", body: JSON.stringify(form) });
    setForm({ nombre: "", apellido: "", departamento: "", experiencia: 0 });
    load();
    onRefresh && onRefresh();
  }

  async function remove(id) {
    if (confirm(`Eliminar investigador ${id}?`)) {
      await api(`/investigadores/${id}`, { method: "DELETE" });
      load();
      onRefresh && onRefresh();
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="card">
      <h2>Investigadores</h2>
      <form onSubmit={submit} style={{ display: "grid", gap: "8px" }}>
        <input placeholder="Nombre" value={form.nombre} onChange={e=>setForm({...form, nombre: e.target.value})}/>
        <input placeholder="Apellido" value={form.apellido} onChange={e=>setForm({...form, apellido: e.target.value})}/>
        <input placeholder="Departamento" value={form.departamento} onChange={e=>setForm({...form, departamento: e.target.value})}/>
        <input type="number" min="0" placeholder="Experiencia" value={form.experiencia} onChange={e=>setForm({...form, experiencia: Number(e.target.value)})}/>
        <button>Registrar</button>
      </form>
      <table>
        <thead>
          <tr><th>ID</th><th>Nombre</th><th>Depto</th><th>Experiencia</th><th></th></tr>
        </thead>
        <tbody>
          {data.map(inv=>(
            <tr key={inv.id}>
              <td>{inv.id}</td>
              <td>{inv.nombre} {inv.apellido}</td>
              <td>{inv.departamento}</td>
              <td>{inv.experiencia}</td>
              <td><button className="danger" onClick={()=>remove(inv.id)}>Eliminar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
