import pool from '../config/db.js';

class LineaInvestigacion {
  constructor({ id, nombre, area }) {
    this.id = id;
    this.nombre = nombre;
    this.area = area;
  }

  static async getAll() {
    const result = await pool.query('SELECT * FROM obtener_lineas_investigacion()');
    return result.rows.map(row => new LineaInvestigacion(row));
  }

  static async getById(id) {
    const result = await pool.query('SELECT * FROM obtener_linea_por_id($1)', [id]);
    if (result.rowCount === 0) return null;
    return new LineaInvestigacion(result.rows[0]);
  }

  static async create(data) {
    const { nombre, area } = data;
    const result = await pool.query(
      'SELECT * FROM crear_linea_investigacion($1, $2)',
      [nombre, area]
    );
    return new LineaInvestigacion(result.rows[0]);
  }

  static async update(id, data) {
    const { nombre, area } = data;
    const result = await pool.query(
      'SELECT * FROM actualizar_linea_investigacion($1, $2, $3)',
      [id, nombre, area]
    );
    if (result.rowCount === 0) return null;
    return new LineaInvestigacion(result.rows[0]);
  }

  static async remove(id) {
    const result = await pool.query('SELECT * FROM eliminar_linea_investigacion($1)', [id]);
    return result.rows[0];
  }
}

export default LineaInvestigacion;
