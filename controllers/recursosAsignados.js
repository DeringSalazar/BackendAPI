const { request, response } = require('express');
const { pool } = require('../MySQL/basedatos')

const getAllMethod = (req = request, res = response) => {
    pool.query('CALL pa_SelectAllRecursosAsignados', (error, results) => {
        if (error) {
            console.error('Error en getAllMethod:', error);
            return res.status(500).json({
                success: false,
                error: 'Error al obtener los recursos asignados'
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
    const { idProducto, idPersona } = req.body;
    if (!idProducto || !idPersona) {
        return res.status(400).json({
            success: false,
            message: 'Se requieren tanto idProducto como idPersona en el body'
        });
    }
    pool.query('CALL pa_SelectRecursosAsignados(?, ?)', [idProducto, idPersona], (error, results) => {
        if (error) {
            console.error('Error en getMethod:', error);
            return res.status(500).json({
                success: false,
                error: 'Error al obtener recurso asignado'
            });
        }
        if (results[0].length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Recurso asignado no encontrado para los IDs proporcionados'
            });
        }
        res.json({
            success: true,
            data: results[0][0]
        });
    });
};


const postMethod = (req = request, res = response) => {
    let { idProducto, idPersona, cantidadAsignada } = req.body;
    if (!idProducto || !idPersona || !cantidadAsignada) {
        return res.status(400).json({
            success: false,
            message: 'Faltan datos: idProducto, idPersona, cantidadAsignada son requeridos'
        });
    }
    pool.query('CALL pa_InsertRecursosAsignados(?, ?, ?)', [idProducto, idPersona, cantidadAsignada], (error, results) => {
        if (error) {
            console.error('Error al insertar recurso asignado:', error);
            if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                return res.status(400).json({
                    success: false,
                    error: 'El producto o la persona especificada no existe'
                });
            }
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({
                    success: false,
                    error: 'Ya existe una asignación de este producto para esta persona'
                });
            }
            return res.status(500).json({
                success: false,
                error: 'Error al insertar recurso asignado'
            });
        }
        res.status(201).json({
            success: true,
            message: 'Recurso asignado insertado correctamente',
            data: {
                id: results[0][0].p_id,
                idProducto,
                idPersona,
                cantidadAsignada
            }
        });
    });
};

const putMethod = (req = request, res = response) => {
    const {id} = req.body;
    const { idProducto, idPersona, cantidadAsignada } = req.body;
    if (!idProducto || !idPersona || cantidadAsignada == null) {
        return res.status(400).json({
            success: false,
            message: 'Faltan datos: idProducto, idPersona, cantidadAsignada son requeridos'
        });
    }
    pool.query('CALL pa_UpdateRecursosAsignados(?, ?, ?)', [idProducto, idPersona, cantidadAsignada], (error, results) => {
        if (error) {
            console.error('Error al actualizar recurso asignado:', error);
            return res.status(500).json({
                success: false,
                error: 'Error al actualizar recurso asignado'
            });
        }
        const affectedRows = results.affectedRows || 0;
        if (affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'No se encontro el recurso asignado para actualizar con los IDs proporcionados'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Recurso asignado actualizado correctamente',
            data: {
                idProducto,
                idPersona,
                cantidadAsignada
            }
        });
    });
};

//Hay que revisar esto
const deleteMethod = (req = request, res = response) => {
    const { idProducto, idPersona } = req.body; 
    if (!idProducto || !idPersona) {
        return res.status(400).json({
            success: false,
            message: 'Se requieren tanto idProducto como idPersona en el body'
        });
    }
    pool.query('CALL pa_DeleteRecursosAsignados(?, ?)', [idProducto, idPersona], (error, results) => {
        if (error) {
            console.error('Error al eliminar recursos asignados:', error);
            return res.status(500).json({
                success: false,
                error: 'Error al eliminar recursos asignados'
            });
        }

        const affectedRows = results.affectedRows || 0;
        if (affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'No se encontraron recursos asignados para eliminar con los IDs proporcionados'
            });
        }
        res.json({
            success: true,
            message: `Recursos asignados eliminados correctamente para Producto ID: ${idProducto} y Persona ID: ${idPersona}`,
            affectedRows: affectedRows
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