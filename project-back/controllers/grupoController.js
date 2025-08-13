import Grupo from '../models/Grupo.js';

export async function getGrupos(req, res) {
  try {
    const grupos = await Grupo.getGruposFormados();
    res.json(grupos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
