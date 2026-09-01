const express = require('express');
const router = express.Router();
const perfilController = require('../controllers/perfilController');

router.get('/:id', perfilController.obtenerPerfil);
router.put('/:id', perfilController.actualizarPerfil);
router.put('/:id/avatar', perfilController.actualizarAvatar);
router.put('/:id/password', perfilController.cambiarPassword);
router.put('/:id/distritos-adicionales', perfilController.actualizarDistritosAdicionales);
router.post('/:id/palabras-clave', perfilController.agregarPalabraClave);
router.delete('/:id/palabras-clave/:palabraId', perfilController.eliminarPalabraClave);

module.exports = router;
