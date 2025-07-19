const { request, response } = require('express');
const { pool } = require('../MySQL/basedatos')

const getAllMethod = (req = request, res = response) => {
    pool.query('CALL pa_SelectAllUnidadMedida', (error, results) => {
        if (error) {
            console.error('Error en getAllMethod:', error);
            return res.status(500).json({
                success: false,
                error: 'Error al obtener unidades de medida'
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
    pool.query('CALL pa_SelectUnidadMedida(?)', [id], (error, results) => {
        if (error) {
            console.error('Error en getMethod:', error);
            return res.status(500).json({
                success: false,
                error: 'Error al obtener unidad de medida'
            });
        }

        if (results[0].length === 0) {
            return res.status(404).json({
                success: false,
                message: 'UnidadMedida no encontrado'
            });
        }

        res.json({
            success: true,
            data: results[0][0]
        });
    });
};


const postMethod = (req = request, res = response) => {
    let { nombre, idConsumible } = req.body;

    if (!nombre ) {
        return res.status(400).json({
            success: false,
            message: 'Faltan datos: nombre, idConsumible'
        });
    }
    idConsumible = idConsumible || null; // Allow null for optional fields

    pool.query('CALL pa_InsertUnidadMedida(?, ?)', [nombre, idConsumible], (error, results) => {
        if (error) {
            console.error('Error al insertar unidad:', error);
            return res.status(500).json({
                success: false,
                error: 'Error al insertar unidad de medida'
            });
        }

        res.status(201).json({
            success: true,
            message: 'Unidad insertado correctamente',
            data: {
                id: results[0][0].p_id, // Assuming the stored procedure returns the inserted
                nombre, idConsumible
            }
        });
    });
};

const putMethod = (req = request, res = response) => {
    const {id} = req.body;
    const {nombre, idConsumible } = req.body;

    if (!id || !nombre || idConsumible == null) {
        return res.status(400).json({
            success: false,
            message: 'Faltan datos: id, nombre, idConsumible'
        });
    }

    pool.query('CALL pa_UpdateUnidadMedida(?, ?, ?, ?)', [id, nombre, idConsumible], (error, results) => {
        if (error) {
            console.error('Error al actualizar unidad:', error);
            return res.status(500).json({
                success: false,
                error: 'Error al actualizar unidad de medida'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Unidad actualizado correctamente',
            data: {
                id, nombre, idConsumible
            }
        });
    });
};


const deleteMethod = (req = request, res = response) => {
    const { id } = req.params; 

    if (!id) {
        return res.status(400).json({
            success: false,
            message: 'ID de consumible no proporcionado en el body'
        });
    }

    pool.query('CALL pa_DeleteUnidadMedida(?)', [id], (error, results) => {
        if (error) {
            console.error('Error al eliminar unidad:', error);
            return res.status(500).json({
                success: false,
                error: 'Error al eliminar unidad de medida'
            });
        }

        res.json({
            success: true,
            message: `Unidad con ID ${id} eliminado correctamente`
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