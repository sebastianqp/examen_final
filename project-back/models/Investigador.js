import pool from '../config/db.js';

class Investigador {
  constructor({ id, nombre, apellido, departamento, experiencia }) {
    this.id = id;
    this.nombre = nombre;
    this.apellido = apellido;
    this.departamento = departamento;
    this.experiencia = experiencia;
  }

  static async getAll() {
    const result = await pool.query('SELECT * FROM obtener_investigadores()');
    return result.rows.map(row => new Investigador(row));
  }

  static async getById(id) {
    const result = await pool.query('SELECT * FROM obtener_investigador_por_id($1)', [id]);
    if (result.rowCount === 0) return null;
    return new Investigador(result.rows[0]);
  }

  static async create(data) {
    const { nombre, apellido, departamento, experiencia } = data;
    const result = await pool.query(
      'SELECT * FROM crear_investigador($1, $2, $3, $4)',
      [nombre, apellido, departamento, experiencia]
    );
    return new Investigador(result.rows[0]);
  }

  static async update(id, data) {
    const { nombre, apellido, departamento, experiencia } = data;
    const result = await pool.query(
      'SELECT * FROM actualizar_investigador($1, $2, $3, $4, $5)',
      [id, nombre, apellido, departamento, experiencia]
    );
    if (result.rowCount === 0) return null;
    return new Investigador(result.rows[0]);
  }

  static async remove(id) {
    const result = await pool.query('SELECT * FROM eliminar_investigador($1)', [id]);
    return result.rows[0];
  }
}

export default Investigador;
