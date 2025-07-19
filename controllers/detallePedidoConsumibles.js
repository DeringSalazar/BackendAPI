const { request, response } = require('express');
const { pool } = require('../MySQL/basedatos')

const getAllMethod = (req = request, res = response) => {
    pool.query('CALL pa_SelectAllDetallePedidoConsumible', (error, results) => {
        if (error) {
            console.error('Error en getAllMethod:', error);
            return res.status(500).json({
                success: false,
                error: 'Error al obtener detalles de pedidos consumibles'
            });
        }

        res.json({
            success: true,
            data: results[0]
        });
    });
};

const getMethod = (req = request, res = response) => {
    let { id } = req.params;
    pool.query('CALL pa_SelectDetallePedidoConsumible(?)', [id], (error, results) => {
        if (error) {
            console.error('Error en getMethod:', error);
            return res.status(500).json({
                success: false,
                error: 'Error al obtener detalle de pedido consumible'
            });
        }

        if (results[0].length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Detalle no encontrado'
            });
        }

        res.json({
            success: true,
            data: results[0][0]
        });
    });
};


const postMethod = (req = request, res = response) => {
    const { idPedido, idConsumible, cantidad } = req.body;

    if (!idPedido || !idConsumible || !cantidad) {
        return res.status(400).json({
            success: false,
            message: 'Faltan datos: idPedido, idConsumible, cantidad'
        });
    }

    pool.query('CALL pa_InsertDetallePedidoConsumible(?, ?, ?)', [idPedido, idConsumible, cantidad], (error, results) => {
        if (error) {
            console.error('Error al insertar usuario:', error);
            return res.status(500).json({
                success: false,
                error: 'Error al insertar detalle de pedido consumible'
            });
        }

        res.status(201).json({
            success: true,
            message: 'Detalle insertado correctamente',
            data: {
                id: results[0][0].id,
                idPedido, idConsumible, cantidad
            }
        });
    });
};
const putMethod = (req = request, res = response) => {
    const {id} = req.body;
    const {idPedido, idConsumible, cantidad } = req.body;

    if (!id || idPedido == null || idConsumible == null || cantidad == null) {
        return res.status(400).json({
            success: false,
            message: 'Faltan datos: id, idPedido, idConsumible, cantidad'
        });
    }

    pool.query('CALL pa_UpdateDetallePedidoConsumible(?, ?, ?, ?)', [id, idPedido, idConsumible, cantidad], (error, results) => {
        if (error) {
            console.error('Error al actualizar usuario:', error);
            return res.status(500).json({
                success: false,
                error: 'Error al actualizar detalle de pedido consumible'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Detalle actualizado correctamente',
            data: {
                id, idPedido, idConsumible, cantidad
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

    pool.query('CALL pa_DeleteDetallePedidoConsumible(?)', [id], (error, results) => {
        if (error) {
            console.error('Error al eliminar detalle:', error);
            return res.status(500).json({
                success: false,
                error: 'Error al eliminar detalle de pedido consumible'
            });
        }

        res.json({
            success: true,
            message: `Detalle con ID ${id} eliminado correctamente`
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