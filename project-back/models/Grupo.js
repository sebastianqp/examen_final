import pool from '../config/db.js';

class Grupo {
  static async getGruposFormados() {
    const result = await pool.query('SELECT * FROM obtener_grupos_formados()');
    return result.rows;
  }
}

export default Grupo;
