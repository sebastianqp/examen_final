import pool from '../config/db.js';

class Asignacion {
  constructor({ investigador_id, linea_id, disponibilidad_id }) {
    this.investigador_id = investigador_id;
    this.linea_id = linea_id;
    this.disponibilidad_id = disponibilidad_id;
  }

  static async create(data) {
    const { investigador_id, linea_id, disponibilidad_id } = data;
    await pool.query(
      `SELECT * FROM asignar_investigador_linea_disponibilidad($1, $2, $3)`,
      [investigador_id, linea_id, disponibilidad_id]
    );
    return new Asignacion(data);
  }

  static async remove(data) {
    const { investigador_id, linea_id, disponibilidad_id } = data;
    const result = await pool.query(
      `SELECT * FROM eliminar_asignacion($1, $2, $3)`,
      [investigador_id, linea_id, disponibilidad_id]
    );
    return result.rows[0];
  }
}

export default Asignacion;
