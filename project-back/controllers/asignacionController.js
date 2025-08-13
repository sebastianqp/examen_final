import Asignacion from '../models/Asignacion.js';

export async function createAsignacion(req, res) {
  try {
    const asignacion = await Asignacion.create(req.body);
    res.status(201).json(asignacion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteAsignacion(req, res) {
  try {
    const asignacion = await Asignacion.remove(req.body);
    if (!asignacion) return res.status(404).json({ message: 'Asignación no encontrada' });
    res.json({ message: 'Asignación eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
