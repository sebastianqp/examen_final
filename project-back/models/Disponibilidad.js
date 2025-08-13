import pool from '../config/db.js';

class Disponibilidad {
  constructor({ id, franja_horaria, modalidad }) {
    this.id = id;
    this.franja_horaria = franja_horaria;
    this.modalidad = modalidad;
  }

  static async getAll() {
    const result = await pool.query('SELECT * FROM obtener_disponibilidades()');
    return result.rows.map(row => new Disponibilidad(row));
  }

  static async getById(id) {
    const result = await pool.query('SELECT * FROM obtener_disponibilidad_por_id($1)', [id]);
    if (result.rowCount === 0) return null;
    return new Disponibilidad(result.rows[0]);
  }

  static async create(data) {
    const { franja_horaria, modalidad } = data;
    const result = await pool.query(
      'SELECT * FROM crear_disponibilidad($1, $2)',
      [franja_horaria, modalidad]
    );
    return new Disponibilidad(result.rows[0]);
  }

  static async update(id, data) {
    const { franja_horaria, modalidad } = data;
    const result = await pool.query(
      'SELECT * FROM actualizar_disponibilidad($1, $2, $3)',
      [id, franja_horaria, modalidad]
    );
    if (result.rowCount === 0) return null;
    return new Disponibilidad(result.rows[0]);
  }

  static async remove(id) {
    const result = await pool.query('SELECT * FROM eliminar_disponibilidad($1)', [id]);
    return result.rows[0];
  }
}

export default Disponibilidad;
