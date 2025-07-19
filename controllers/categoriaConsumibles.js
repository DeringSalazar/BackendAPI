const { request, response } = require('express');
const { pool } = require('../MySQL/basedatos')

const getAllMethod = (req = request, res = response) => {
    pool.query('CALL pa_SelectAllCategoriaConsumible', (error, results) => {
        if (error) {
            console.error('Error en getAllMethod:', error);
            return res.status(500).json({
                success: false,
                error: 'Error al obtener categorías de consumibles'
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
    pool.query('CALL pa_SelectCategoriaConsumible(?)', [id], (error, results) => {
        if (error) {
            console.error('Error en getMethod:', error);
            return res.status(500).json({
                success: false,
                error: 'Error al obtener categoría de consumible'
            });
        }

        if (results[0].length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Categoria no encontrado'
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
    idConsumible = idConsumible ?? null; 
    pool.query('CALL pa_InsertCategoriaConsumible(?, ?)', [nombre, idConsumible], (error, results) => {
        if (error) {
            console.error('Error al insertar categoria:', error);
            return res.status(500).json({
                success: false,
                error: 'Error al insertar categoria de consumible'
            });
        }

        res.status(201).json({
            success: true,
            message: 'Categoria insertado correctamente',
            data: {
                 id: results[0][0].id,
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

    pool.query('CALL pa_UpdateCategoriaConsumible(?, ?, ?, ?)', [id, nombre, idConsumible], (error, results) => {
        if (error) {
            console.error('Error al actualizar categoria:', error);
            return res.status(500).json({
                success: false,
                error: 'Error al actualizar categoria de consumible'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Categoria actualizado correctamente',
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
            message: 'ID de categoria no proporcionado en el body'
        });
    }

    pool.query('CALL pa_DeleteCategoriaConsumible(?)', [id], (error, results) => {
        if (error) {
            console.error('Error al eliminar categoria:', error);
            return res.status(500).json({
                success: false,
                error: 'Error al eliminar categoria de consumible'
            });
        }

        res.json({
            success: true,
            message: `Categoria con ID ${id} eliminado correctamente`
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