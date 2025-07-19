const { request, response } = require('express');
const { pool } = require('../MySQL/basedatos')

const getAllMethod = (req = request, res = response) => {
    pool.query('CALL pa_SelectAllProducto', (error, results) => {
        if (error) {
            console.error('Error en getAllMethod:', error);
            return res.status(500).json({
                success: false,
                error: 'Error al obtener productos'
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
    pool.query('CALL pa_SelectProducto(?)', [id], (error, results) => {
        if (error) {
            console.error('Error en getMethod:', error);
            return res.status(500).json({
                success: false,
                error: 'Error al obtener productos'
            });
        }

        if (results[0].length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        res.json({
            success: true,
            data: results[0][0]
        });
    });
};


const postMethod = (req = request, res = response) => {
    let { codigoProducto, nombre, descripcion, cantidad, categoria, unidadMedida } = req.body;

    if (!codigoProducto || !nombre || !cantidad) {
        return res.status(400).json({
            success: false,
            message: 'Faltan datos: codigoProducto, nombre, cantidad'
        });
    }
    descripcion = descripcion ?? null; 
    categoria = categoria ?? null;
    unidadMedida = unidadMedida ?? null;

    pool.query(
        'CALL pa_InsertProducto(?, ?, ?, ?, ?, ?);',
        [codigoProducto, nombre, descripcion, cantidad, categoria, unidadMedida], (error, results) => {
        if (error) {
            console.error('Error al insertar producto:', error);
            return res.status(500).json({
                success: false,
                error: 'Error al insertar producto'
            });
        }

        res.status(201).json({
            success: true,
            message: 'Producto insertado correctamente',
            data: {
                id: results[0][0].id, 
                codigoProducto,
                nombre,
                descripcion,
                cantidad,
                categoria,
                unidadMedida
            }
        });
    });
};

const putMethod = (req = request, res = response) => {
    const {id} = req.body;
    const {codigoProducto, nombre, descripcion, cantidad, categoria, unidadMedida } = req.body;

    if (!id || !codigoProducto || nombre == null || descripcion == null || cantidad == null || categoria == null || unidadMedida == null) {
        return res.status(400).json({
            success: false,
            message: 'Faltan datos: id, codigoProducto, nombre, descripcion, cantidad, categoria, unidadMedida'
        });
    }

    pool.query('CALL pa_UpdateProducto(?, ?, ?, ?, ?, ?, ?)', [id, codigoProducto, nombre, descripcion, cantidad, categoria, unidadMedida], (error, results) => {
        if (error) {
            console.error('Error al actualizar producto:', error);
            return res.status(500).json({
                success: false,
                error: 'Error al actualizar producto'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Producto actualizado correctamente',
            data: {
                codigoProducto,
                nombre,
                descripcion,
                cantidad,
                categoria,
                unidadMedida
            }
        });
    });
};


const deleteMethod = (req = request, res = response) => {
    const { id } = req.params; 

    if (!id) {
        return res.status(400).json({
            success: false,
            message: 'ID de producto no proporcionado en el body'
        });
    }

    pool.query('CALL pa_DeleteProducto(?)', [id], (error, results) => {
        if (error) {
            console.error('Error al eliminar producto:', error);
            return res.status(500).json({
                success: false,
                error: 'Error al eliminar producto'
            });
        }

        res.json({
            success: true,
            message: `Producto con ID ${id} eliminado correctamente`
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