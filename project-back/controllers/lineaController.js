import LineaInvestigacion from '../models/LineaInvestigacion.js';

export async function getAllLineas(req, res) {
  try {
    const lineas = await LineaInvestigacion.getAll();
    res.json(lineas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getLineaById(req, res) {
  try {
    const linea = await LineaInvestigacion.getById(req.params.id);
    if (!linea) return res.status(404).json({ message: 'Línea no encontrada' });
    res.json(linea);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function createLinea(req, res) {
  try {
    const nuevaLinea = await LineaInvestigacion.create(req.body);
    res.status(201).json(nuevaLinea);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateLinea(req, res) {
  try {
    const lineaActualizada = await LineaInvestigacion.update(req.params.id, req.body);
    if (!lineaActualizada) return res.status(404).json({ message: 'Línea no encontrada' });
    res.json(lineaActualizada);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteLinea(req, res) {
  try {
    const lineaEliminada = await LineaInvestigacion.remove(req.params.id);
    if (!lineaEliminada) return res.status(404).json({ message: 'Línea no encontrada' });
    res.json({ message: 'Línea eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
