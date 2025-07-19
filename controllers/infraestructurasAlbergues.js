const { request, response } = require('express');
const { pool } = require('../MySQL/basedatos')

const getAllMethod = (req = request, res = response) => {
    pool.query('CALL pa_SelectAllInfraestructuraAlbergue', (error, results) => {
        if (error) {
            console.error('Error en getAllMethod:', error);
            return res.status(500).json({
                success: false,
                error: 'Error al obtener infraestructura'
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
    if (!id) {         
        return res.status(400).json({             
            success: false,             
            message: 'ID del albergue es requerido'         
        });     
    } 
    pool.query('CALL pa_SelectInfraestructuraAlbergue(?)', [id], (error, results) => {
        if (error) {
            console.error('Error en getMethod:', error);
            return res.status(500).json({
                success: false,
                error: 'Error al obtener la infraestructura'
            });
        }
        if (results[0].length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Infraestructura no encontrado'
            });
        }
        res.json({
            success: true,
            data: results[0][0]
        });
    });
};

const postMethod = (req = request, res = response) => {
    let {cocina,duchas,servicios_sanitarios,bodega,menaje_mobiliario,tanque_agua,area_total_m2, idAlbergue} = req.body;
    if (!idAlbergue) {
        return res.status(400).json({
            success: false,
            message: 'ID del albergue es obligatorio'
        });
    }
    if (cocina == null || duchas == null || servicios_sanitarios == null) {
        return res.status(400).json({
            success: false,
            message: 'Faltan datos obligatorios: cocina, duchas, servicios_sanitarios'
        });
    }
    if (bodega == null || menaje_mobiliario == null || tanque_agua == null) {
        return res.status(400).json({
            success: false,
            message: 'Faltan datos obligatorios: bodega, menaje_mobiliario, tanque_agua'
        });
    }
    if (area_total_m2 == null) {
        return res.status(400).json({
            success: false,
            message: 'El área total en m² es obligatoria'
        });
    }
    pool.query('CALL pa_InsertInfraestructuraAlbergue(?, ?, ?, ?, ?, ?, ?, ?)',[cocina,duchas,servicios_sanitarios,
            bodega,menaje_mobiliario,tanque_agua,area_total_m2,idAlbergue],(error, results) => {
            if (error) {
                console.error('Error al insertar infraestructura del albergue:', error);
                if (error.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({
                        success: false,
                        message: 'Ya existe una infraestructura con esos datos'
                    });
                }
                return res.status(500).json({
                    success: false,
                    error: 'Error al insertar infraestructura del albergue',
                    details: error.message
                });
            }
            res.status(201).json({
                success: true,
                message: 'Infraestructura del albergue insertada correctamente',
                data: {
                    id: results[0][0].id,
                    cocina,
                    duchas,
                    servicios_sanitarios,
                    bodega,
                    menaje_mobiliario,
                    tanque_agua,
                    area_total_m2,
                    idAlbergue
                }
            });
        }
    );
};

const putMethod = (req = request, res = response) => {
    const { id } = req.body;
    const { cocina, duchas, servicios_sanitarios, bodega, menaje_mobiliario, tanque_agua, area_total_m2 } = req.body;
    if (!id || 
        cocina == null || duchas == null || servicios_sanitarios == null || bodega == null || menaje_mobiliario == null || tanque_agua == null || area_total_m2 == null) {
        return res.status(400).json({
            success: false,
            message: 'Faltan datos: id, cocina, duchas, servicios_sanitarios, bodega, menaje_mobiliario, tanque_agua, area_total_m2'
        });
    }
    pool.query('CALL pa_UpdateInfraestructuraAlbergue(?, ?, ?, ?, ?, ?, ?, ?)', 
        [id, cocina, duchas, servicios_sanitarios, bodega, menaje_mobiliario, tanque_agua, area_total_m2], 
        (error, results) => {
            if (error) {
                console.error('Error al actualizar infraestructura del albergue:', error);
                return res.status(500).json({
                    success: false,
                    error: 'Error al actualizar infraestructura del albergue'
                });
            }
            res.status(200).json({
                success: true,
                message: 'Infraestructura del albergue actualizada correctamente',
                data: {
                    id,
                    cocina,
                    duchas,
                    servicios_sanitarios,
                    bodega,
                    menaje_mobiliario,
                    tanque_agua,
                    area_total_m2
                }
            });
        }
    );
};

const deleteMethod = (req = request, res = response) => {
    const { id } = req.params; 
    if (!id) {
        return res.status(400).json({
            success: false,
            message: 'ID de infraestructura no proporcionado en el body'
        });
    }
    pool.query('CALL pa_DeleteInfraestructuraAlbergue(?)', [id], (error, results) => {
        if (error) {
            console.error('Error al eliminar la infraestructura:', error);
            return res.status(500).json({
                success: false,
                error: 'Error al eliminar infraestructura'
            });
        }

        res.json({
            success: true,
            message: `La infraestructura del albergue con ID ${id} eliminado correctamente`
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