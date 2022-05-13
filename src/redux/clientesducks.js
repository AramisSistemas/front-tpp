import request from '../context/interceptor';
import { messageService } from './messagesducks'; 

const dataInicial = {
    loading: false
}

// types
const LOADING = 'LOADING'
const CLIENTE_ERROR = 'CLIENTE_ERROR'
const CLIENTE_EXITO = 'CLIENTE_EXITO'
const CLIENTE_UPDATE = 'CLIENTE_UPDATE'


// reducer
export default function clientesReducer(state = dataInicial, action) {
    switch (action.type) {
        case LOADING:
            return { ...state, loading: true }
        case CLIENTE_ERROR:
            return { ...dataInicial }
        case CLIENTE_EXITO:
            return { ...state, loading: false }
        case CLIENTE_UPDATE:
            return { ...state }
        default:
            return { ...state }
    }
}

// action

export const add = (data) => async (dispatch) => {
    var form = new FormData();
    form.append('Cuit', data.cuit)
    form.append('Nombre', data.nombre)
    form.append('Responsabilidad', data.responsabilidad)
    form.append('Genero', data.genero)
    form.append('Imputacion', data.imputacion)
    form.append('Domicilio', data.domicilio)
    form.append('Telefono', data.telefono)
    form.append('Mail', data.mail)
    form.append('LimiteSaldo', data.limiteSaldo)
    form.append('Observaciones', data.observaciones)
  
    dispatch({
        type: LOADING
    })
    await request.put('Customers/Add', form)
        .then(function (response) {
            dispatch({
                type: CLIENTE_EXITO
            });
            dispatch(messageService(true, response.data));
        })
        .catch(function (error) {
            dispatch({
                type: CLIENTE_ERROR
            })
            dispatch(messageService(false, error.response.data.message, error.response.status));
        });
}

export const update = (data) => async (dispatch) => {  
    var form = new FormData();
    form.append('Id', data.id)
    form.append('Cuil', data.cuil)
    form.append('Nombre', data.nombre)
    form.append('Domicilio', data.domicilio ? data.domicilio : 'S/D')
    form.append('Telefono', data.telefono ? data.telefono : 'S/D')
    form.append('Osocial', data.oSocial)
    form.append('Nacimiento', data.nacimiento)
    form.append('Conyuge', data.conyuge)
    form.append('Hijos', data.hijos)
    form.append('Cbu', data.cbu)
    form.append('CuilCbu', data.cuilCbu)
    form.append('Activo', data.activo)
    form.append('Ingreso', data.ingreso)
    form.append('Ciudad', data.ciudad ? data.ciudad : 'S/D')
    form.append('Sexo', data.sexo)
    form.append('Puesto', data.puesto)
    dispatch({
        type: LOADING
    })
    await request.patch('Empleados/Update', form)
        .then(function (response) {
            dispatch({
                type: CLIENTE_UPDATE
            })
            dispatch(messageService(true, 'Empleado Actualizado', response.status));
        })
        .catch(function (error) {
            dispatch({
                type: CLIENTE_ERROR
            })
            dispatch(messageService(false, error.response.data.message, error.response.status)); 
        });
}
 

export const eliminar = (data) => async (dispatch) => {

    await request.delete('Empleados/Delete/?id=' + data)
        .then(function (response) {
            dispatch({
                type: CLIENTE_EXITO
            })
            dispatch(messageService(true, 'Empleado Eliminado ', response.status));
        })
        .catch(function (error) {
            dispatch({
                type: CLIENTE_ERROR
            })
            dispatch(messageService(false, error.response.data.message, error.response.status)); 
        });
}
 
 

