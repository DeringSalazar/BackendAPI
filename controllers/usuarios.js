const { request, response } = require('express');
const { pool } = require('../MySQL/basedatos')

const getAllMethod = (req = request, res = response) => {
    pool.query('CALL pa_SelectAllUsuario', (error, results) => {
        if (error) {
            console.error('Error en getAllMethod:', error);
            return res.status(500).json({
                success: false,
                error: 'Error al obtener usuarios'
            });
        }

        res.json({
            success: true,
            data: results[0]
        });
    });
};

const getMethod = (req = request, res = response) => {
    const { id } = req.params;
    pool.query('CALL pa_SelectUsuario(?)', [id], (error, results) => {
        if (error) {
            console.error('Error en getMethod:', error);
            return res.status(500).json({
                success: false,
                error: 'Error al obtener usuarios'
            });
        }

        if (results[0].length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        res.json({
            success: true,
            data: results[0][0]
        });
    });
};


const postMethod = (req = request, res = response) => {
    let { nombreUsuario, correo, contrasenaHash, rol, activo, idMunicipalidad, identificacion } = req.body;

    if (!nombreUsuario || !correo || !contrasenaHash ) {
        return res.status(400).json({
            success: false,
            message: 'Faltan datos: nombreUsuario, correo, contrasenaHash '
        });
    }

    rol = rol ?? null; 
    activo = activo ?? null; 
    idMunicipalidad = idMunicipalidad ?? null; 
    identificacion = identificacion ?? null; 

    pool.query('CALL pa_InsertUsuario(?, ?, ?, ?, ?, ?, ?)', [nombreUsuario, correo, contrasenaHash, rol, activo, idMunicipalidad, identificacion], (error, results) => {
        if (error) {
            console.error('Error al insertar usuario:', error);
            return res.status(500).json({
                success: false,
                error: 'Error al insertar usuario'
            });
        }

        res.status(201).json({
            success: true,
            message: 'Usuario insertado correctamente',
            data: {
                id: results[0][0].id,
                nombreUsuario, correo, contrasenaHash, rol, activo, idMunicipalidad, identificacion
            }
        });
    });
};

const putMethod = (req = request, res = response) => {
    const {id} = req.body;
    const {nombreUsuario, correo, contrasenaHash, rol, activo, idMunicipalidad, identificacion } = req.body;

    if (!id || !nombreUsuario || correo == null || contrasenaHash == null || rol == null || activo == null || idMunicipalidad == null || identificacion == null) {
        return res.status(400).json({
            success: false,
            message: 'Faltan datos: nombreUsuario, correo, contrasenaHash, rol, activo, idMunicipalidad, identificacion'
        });
    }

    pool.query('CALL pa_UpdateUsuario(?, ?, ?, ?, ?, ?, ?)', [id, nombreUsuario, correo, contrasenaHash, rol, activo, idMunicipalidad, identificacion], (error, results) => {
        if (error) {
            console.error('Error al actualizar usuario:', error);
            return res.status(500).json({
                success: false,
                error: 'Error al actualizar usuario'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Producto actualizado correctamente',
            data: {
                id, nombreUsuario, correo, contrasenaHash, rol, activo, idMunicipalidad, identificacion
            }
        });
    });
};


const deleteMethod = (req = request, res = response) => {
    const { id } = req.params; 

    if (!id) {
        return res.status(400).json({
            success: false,
            message: 'ID de usuario no proporcionado en el body'
        });
    }

    pool.query('CALL pa_DeleteUsuario(?)', [id], (error, results) => {
        if (error) {
            console.error('Error al eliminar usuario:', error);
            return res.status(500).json({
                success: false,
                error: 'Error al eliminar usuario'
            });
        }

        res.json({
            success: true,
            message: `Usuario con ID ${id} eliminado correctamente`
        });
    });
};


module.exports = {
    getAllMethod,
    getMethod,
    postMethod,
    putMethod,
    deleteMethod
}