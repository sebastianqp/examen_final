import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

async function api(path, method = "GET", body) {
  const res = await fetch(API_BASE + path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
  return res.json();
}

export default function RegistroCompleto({ onAfterSave }) {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    departamento: "",
    experiencia: 0,
    nombreLinea: "",
    area: "",
    franja: "",
    modalidad: "Presencial",
  });
  const [msg, setMsg] = useState("");
  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");
    try {
      // 1. Crear investigador
      const inv = await api("/investigadores", "POST", {
        nombre: form.nombre,
        apellido: form.apellido,
        departamento: form.departamento,
        experiencia: Number(form.experiencia),
      });

      // 2. Crear línea
      const lin = await api("/lineas", "POST", {
        nombre: form.nombreLinea,
        area: form.area,
      });

      // 3. Crear disponibilidad
      const disp = await api("/disponibilidades", "POST", {
        franja_horaria: form.franja,
        modalidad: form.modalidad,
      });

      // 4. Asignar
      await api("/asignaciones", "POST", {
        investigador_id: inv.id,
        linea_id: lin.id,
        disponibilidad_id: disp.id,
      });

      setMsg("✅ Registro completo y asignado");
      onAfterSave && onAfterSave();
    } catch (err) {
      setMsg("❌ " + err.message);
    }
  }

  return (
    <div className="card">
      <h2>Registro Completo</h2>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 8 }}>
        <input placeholder="Nombre" value={form.nombre} onChange={e => set("nombre", e.target.value)} required />
        <input placeholder="Apellido" value={form.apellido} onChange={e => set("apellido", e.target.value)} required />
        <input placeholder="Departamento" value={form.departamento} onChange={e => set("departamento", e.target.value)} required />
        <input type="number" min="0" placeholder="Experiencia (años)" value={form.experiencia} onChange={e => set("experiencia", e.target.value)} required />

        <input placeholder="Nombre de la Línea" value={form.nombreLinea} onChange={e => set("nombreLinea", e.target.value)} required />
        <input placeholder="Área" value={form.area} onChange={e => set("area", e.target.value)} required />

        <input placeholder="Franja horaria" value={form.franja} onChange={e => set("franja", e.target.value)} required />
        <select value={form.modalidad} onChange={e => set("modalidad", e.target.value)}>
          <option value="Presencial">Presencial</option>
          <option value="Virtual">Virtual</option>
        </select>

        <button>Registrar Completo</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
}
