const bcrypt = require('bcryptjs');
const perfilModel = require('../models/perfilModel');

const validateId = async (id, res) => {
  const existe = await perfilModel.existeAprendiz(id);
  if (!existe) {
    res.status(404).json({ error: 'Aprendiz no encontrado' });
    return false;
  }
  return true;
};

const obtenerPerfil = async (req, res, next) => {
  try {
    const perfil = await perfilModel.getPerfilCompleto(req.params.id);
    return perfil ? res.json(perfil) : res.status(404).json({ error: 'Aprendiz no encontrado' });
  } catch (err) { next(err); }
};

const actualizarPerfil = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!await validateId(id, res)) return;
    const campos = ['nombres_apellidos', 'telefono_movil', 'correo_personal', 'distrito_residencia'];
    const datos = campos.reduce((a, c) => {
      if (Object.prototype.hasOwnProperty.call(req.body, c)) a[c] = req.body[c];
      return a;
    }, {});
    await perfilModel.actualizarDatosPersonales(id, datos);
    res.json(await perfilModel.getPerfilCompleto(id));
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Correo ya en uso' });
    next(err);
  }
};

const actualizarAvatar = async (req, res, next) => {
  try {
    if (!Object.prototype.hasOwnProperty.call(req.body, 'avatar_url') || req.body.avatar_url === undefined) {
      return res.status(400).json({ error: 'avatar_url requerido' });
    }
    if (!await validateId(req.params.id, res)) return;
    await perfilModel.actualizarAvatar(req.params.id, req.body.avatar_url);
    res.json({ msg: 'Avatar actualizado', avatar_url: req.body.avatar_url });
  } catch (err) { next(err); }
};

const cambiarPassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!await validateId(id, res)) return;
    const { password_actual, password_nueva } = req.body;
    if (!password_actual || !password_nueva) return res.status(400).json({ error: 'Contraseñas requeridas' });
    if (password_nueva.length < 8) return res.status(400).json({ error: 'Min 8 caracteres' });

    const hash = await perfilModel.getPasswordHash(id);
    if (!hash || !await bcrypt.compare(password_actual, hash)) return res.status(401).json({ error: 'Contraseña incorrecta' });

    await perfilModel.actualizarPassword(id, await bcrypt.hash(password_nueva, 10));
    res.json({ msg: 'Contraseña actualizada' });
  } catch (err) { next(err); }
};

const agregarPalabraClave = async (req, res, next) => {
  try {
    const { id } = req.params;
    const p = req.body.palabra?.trim();
    if (!p) return res.status(400).json({ error: 'Palabra requerida' });
    if (!await validateId(id, res)) return;
    if (await perfilModel.palabraClaveExiste(id, p)) return res.status(409).json({ error: 'Palabra existe' });
    res.status(201).json(await perfilModel.agregarPalabraClave(id, p));
  } catch (err) { next(err); }
};

const eliminarPalabraClave = async (req, res, next) => {
  try {
    const { id, palabraId } = req.params;
    if (!await validateId(id, res)) return;
    const eliminada = await perfilModel.eliminarPalabraClave(id, palabraId);
    return eliminada ? res.status(204).send() : res.status(404).json({ error: 'Palabra no encontrada' });
  } catch (err) { next(err); }
};

const actualizarDistritosAdicionales = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!await validateId(id, res)) return;
    const { distrito_1: d1, distrito_2: d2, distrito_3: d3 } = req.body;
    await perfilModel.setDistritosAdicionales(id, { 1: d1, 2: d2, 3: d3 });
    res.json(await perfilModel.getPerfilCompleto(id));
  } catch (err) { next(err); }
};

module.exports = {
  obtenerPerfil,
  actualizarPerfil,
  actualizarAvatar,
  cambiarPassword,
  agregarPalabraClave,
  eliminarPalabraClave,
  actualizarDistritosAdicionales,
};
