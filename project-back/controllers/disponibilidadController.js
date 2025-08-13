import Disponibilidad from '../models/Disponibilidad.js';

export async function getAllDisponibilidades(req, res) {
  try {
    const disponibilidades = await Disponibilidad.getAll();
    res.json(disponibilidades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getDisponibilidadById(req, res) {
  try {
    const disponibilidad = await Disponibilidad.getById(req.params.id);
    if (!disponibilidad) return res.status(404).json({ message: 'Disponibilidad no encontrada' });
    res.json(disponibilidad);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function createDisponibilidad(req, res) {
  try {
    const nuevaDisponibilidad = await Disponibilidad.create(req.body);
    res.status(201).json(nuevaDisponibilidad);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateDisponibilidad(req, res) {
  try {
    const disponibilidadActualizada = await Disponibilidad.update(req.params.id, req.body);
    if (!disponibilidadActualizada) return res.status(404).json({ message: 'Disponibilidad no encontrada' });
    res.json(disponibilidadActualizada);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteDisponibilidad(req, res) {
  try {
    const disponibilidadEliminada = await Disponibilidad.remove(req.params.id);
    if (!disponibilidadEliminada) return res.status(404).json({ message: 'Disponibilidad no encontrada' });
    res.json({ message: 'Disponibilidad eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
