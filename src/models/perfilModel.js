const pool = require('../config/db');

async function getPerfilCompleto(id) {
  const [rows] = await pool.query(
    `SELECT id, nombres_apellidos, telefono_movil, correo_personal,
            correo_institucional, carrera, ciclo, distrito_residencia,
            avatar_url, created_at, updated_at
     FROM aprendices WHERE id = ?`,
    [id]
  );
  if (rows.length === 0) return null;
  const aprendiz = rows[0];

  const [palabras] = await pool.query(
    'SELECT id, palabra FROM palabras_clave WHERE aprendiz_id = ? ORDER BY id',
    [id]
  );

  const [distritos] = await pool.query(
    'SELECT orden, distrito FROM distritos_adicionales WHERE aprendiz_id = ? ORDER BY orden',
    [id]
  );

  return {
    ...aprendiz,
    palabras_clave: palabras,
    distritos_adicionales: distritos,
  };
}

async function existeAprendiz(id) {
  const [rows] = await pool.query('SELECT id FROM aprendices WHERE id = ?', [id]);
  return rows.length > 0;
}

async function actualizarDatosPersonales(id, datos) {
  const campos = ['nombres_apellidos', 'telefono_movil', 'correo_personal', 'distrito_residencia'];
  const sets = [];
  const valores = [];

  for (const campo of campos) {
    if (Object.prototype.hasOwnProperty.call(datos, campo)) {
      sets.push(`${campo} = ?`);
      valores.push(datos[campo]);
    }
  }

  if (sets.length === 0) return false;

  valores.push(id);
  await pool.query(`UPDATE aprendices SET ${sets.join(', ')} WHERE id = ?`, valores);
  return true;
}

async function actualizarAvatar(id, avatarUrl) {
  await pool.query('UPDATE aprendices SET avatar_url = ? WHERE id = ?', [avatarUrl, id]);
}

async function actualizarPassword(id, passwordHash) {
  await pool.query('UPDATE aprendices SET password_hash = ? WHERE id = ?', [passwordHash, id]);
}

async function getPasswordHash(id) {
  const [rows] = await pool.query('SELECT password_hash FROM aprendices WHERE id = ?', [id]);
  return rows.length ? rows[0].password_hash : null;
}

async function agregarPalabraClave(aprendizId, palabra) {
  const [result] = await pool.query(
    'INSERT INTO palabras_clave (aprendiz_id, palabra) VALUES (?, ?)',
    [aprendizId, palabra]
  );
  return { id: result.insertId, palabra };
}

async function eliminarPalabraClave(aprendizId, palabraId) {
  const [result] = await pool.query(
    'DELETE FROM palabras_clave WHERE id = ? AND aprendiz_id = ?',
    [palabraId, aprendizId]
  );
  return result.affectedRows > 0;
}

async function palabraClaveExiste(aprendizId, palabra) {
  const [rows] = await pool.query(
    'SELECT id FROM palabras_clave WHERE aprendiz_id = ? AND palabra = ?',
    [aprendizId, palabra]
  );
  return rows.length > 0;
}

async function setDistritosAdicionales(aprendizId, distritos) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query('DELETE FROM distritos_adicionales WHERE aprendiz_id = ?', [aprendizId]);
    for (const [orden, distrito] of Object.entries(distritos)) {
      if (distrito) await conn.query('INSERT INTO distritos_adicionales (aprendiz_id, orden, distrito) VALUES (?, ?, ?)', [aprendizId, orden, distrito]);
    }
    await conn.commit();
  } catch (err) { await conn.rollback(); throw err; }
  finally { conn.release(); }
}

module.exports = {
  getPerfilCompleto,
  existeAprendiz,
  actualizarDatosPersonales,
  actualizarAvatar,
  actualizarPassword,
  getPasswordHash,
  agregarPalabraClave,
  eliminarPalabraClave,
  palabraClaveExiste,
  setDistritosAdicionales,
};
