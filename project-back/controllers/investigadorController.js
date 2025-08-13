import Investigador from '../models/Investigador.js';

export async function getAllInvestigadores(req, res) {
  try {
    const investigadores = await Investigador.getAll();
    res.json(investigadores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getInvestigadorById(req, res) {
  try {
    const investigador = await Investigador.getById(req.params.id);
    if (!investigador) return res.status(404).json({ message: 'Investigador no encontrado' });
    res.json(investigador);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function createInvestigador(req, res) {
  try {
    const nuevoInvestigador = await Investigador.create(req.body);
    res.status(201).json(nuevoInvestigador);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateInvestigador(req, res) {
  try {
    const investigadorActualizado = await Investigador.update(req.params.id, req.body);
    if (!investigadorActualizado) return res.status(404).json({ message: 'Investigador no encontrado' });
    res.json(investigadorActualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteInvestigador(req, res) {
  try {
    const investigadorEliminado = await Investigador.remove(req.params.id);
    if (!investigadorEliminado) return res.status(404).json({ message: 'Investigador no encontrado' });
    res.json({ message: 'Investigador eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
