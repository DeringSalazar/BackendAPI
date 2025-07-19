const { request, response } = require('express');
const { pool } = require('../MySQL/basedatos')

const getAllMethod = (req = request, res = response) => {
    pool.query('CALL pa_SelectAllCaracteristicasPoblacionales', (error, results) => {
        if (error) {
            console.error('Error en getAllMethod:', error);
            return res.status(500).json({
                success: false,
                error: 'Error al obtener caracteristicas poblacionales'
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
    pool.query('CALL pa_SelectCaracteristicasPoblacionales(?)', [id], (error, results) => {
        if (error) {
            console.error('Error en getMethod:', error);
            return res.status(500).json({
                success: false,
                error: 'Error al obtener caracteristicas poblacionales'
            });
        }

        if (results[0].length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Caracteristicas poblacionales no encontrada'
            });
        }

        res.json({
            success: true,
            data: results[0][0]
        });
    });
};


const postMethod = (req = request, res = response) => {
    let { migrante, indigena, idPersona } = req.body;

    if (!migrante || !indigena) {
        return res.status(400).json({
            success: false,
            message: 'Faltan datos: migrante, indigena'
        });
    }

    idPersona = idPersona ?? null; 

    pool.query('CALL pa_InsertCaracteristicasPoblacionales(?, ?, ?)', [migrante, indigena, idPersona], (error, results) => {
        if (error) {
            console.error('Error al insertar caracteristicas poblacionales:', error);
            return res.status(500).json({
                success: false,
                error: 'Error al insertar caracteristicas poblacionales'
            });
        }

        res.status(201).json({
            success: true,
            message: 'Caracteristicas poblacionales insertada correctamente',
            data: {
                p_id: results[0][0].id,
                migrante,
                indigena,
                idPersona
            }
        });
    });
};

const putMethod = (req = request, res = response) => {
    const {id} = req.body;
    const {migrante, indigena, idPersona } = req.body;

    if (!id || !migrante || indigena == null || !idPersona) {
        return res.status(400).json({
            success: false,
            message: 'Faltan datos: migrante, indigena '
        });
    }

    pool.query('CALL pa_UpdateCaracteristicasPoblacionales(?, ?, ?, ?)', [id, migrante, indigena, idPersona], (error, results) => {
        if (error) {
            console.error('Error al actualizar caracteristicas poblacionales:', error);
            return res.status(500).json({
                success: false,
                error: 'Error al actualizar caracteristicas poblacionales'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Caracteristicas poblacionales actualizada correctamente',
            data: {
                migrante,
                indigena,
                idPersona
            }
        });
    });
};


const deleteMethod = (req = request, res = response) => {
    const { id } = req.params; 

    if (!id) {
        return res.status(400).json({
            success: false,
            message: 'ID de ubicacion no proporcionado en el body'
        });
    }

    pool.query('CALL pa_DeleteCaracteristicasPoblacionales(?)', [id], (error, results) => {
        if (error) {
            console.error('Error al eliminar caracteristica poblacionales:', error);
            return res.status(500).json({
                success: false,
                error: 'Error al eliminar caracteristicas poblacionales'
            });
        }

        res.json({
            success: true,
            message: `Caracteristicas poblacionales con ID ${id} eliminada correctamente`
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