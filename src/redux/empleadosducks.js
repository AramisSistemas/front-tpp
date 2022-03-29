import request from '../context/interceptor';
import { messageService } from './messagesducks';
import { logout } from './usersducks';
// data inicial

const dataInicial = {
    loading: false
}

// types
const LOADING = 'LOADING'
const EMPLEADO_ERROR = 'EMPLEADO_ERROR'
const EMPLEADO_EXITO = 'EMPLEADO_EXITO'
const EMPLEADO_UPDATE = 'EMPLEADO_UPDATE'


// reducer
export default function empleadosReducer(state = dataInicial, action) {
    switch (action.type) {
        case LOADING:
            return { ...state, loading: true }
        case EMPLEADO_ERROR:
            return { ...dataInicial }
        case EMPLEADO_EXITO:
            return { ...state, loading: false }
        case EMPLEADO_UPDATE:
            return { ...state }
        default:
            return { ...state }
    }
}

// action

export const addEmpleado = (empleado) => async (dispatch) => {
    var form = new FormData();
    form.append('Cuil', empleado.cuil)
    form.append('Nombre', empleado.nombre)
    form.append('Cbu', empleado.cbu)
    form.append('CuilCbu', empleado.cuilcbu)
    form.append('Sexo', empleado.sexo)
    dispatch({
        type: LOADING
    })
    await request.put('Empleados/Add', form)
        .then(function (response) {
            dispatch({
                type: EMPLEADO_EXITO
            });
            dispatch(messageService(true, response.data));
        })
        .catch(function (error) {
            dispatch({
                type: EMPLEADO_ERROR
            })
            dispatch(messageService(false, error.response.data.message, error.response.status));
        });
}

export const actualizarEmpleado = (data) => async (dispatch) => {  
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
                type: EMPLEADO_UPDATE
            })
            dispatch(messageService(true, 'Empleado Actualizado', response.status));
        })
        .catch(function (error) {
            dispatch({
                type: EMPLEADO_ERROR
            })
            dispatch(messageService(false, error.response.data.message, error.response.status));
            if (error.response.status === 401) {
                dispatch(logout);
            }
        });
}

export const autorizarEmbargo = (data) => async (dispatch) => {   
    dispatch({
        type: LOADING
    })
    await request.patch('Empleados/EmbargoConfirm/?embargo='+data)
        .then(function (response) {
            dispatch({
                type: EMPLEADO_EXITO
            })
            dispatch(messageService(true, 'Correcto', response.status));
        })
        .catch(function (error) {
            dispatch({
                type: EMPLEADO_ERROR
            })
            dispatch(messageService(false, error.response.data.message, error.response.status));
            if (error.response.status === 401) {
                dispatch(logout);
            }
        });
}

export const eliminarEmpleado = (data) => async (dispatch) => {

    await request.delete('Empleados/Delete/?id=' + data)
        .then(function (response) {
            dispatch({
                type: EMPLEADO_EXITO
            })
            dispatch(messageService(true, 'Empleado Eliminado ', response.status));
        })
        .catch(function (error) {
            dispatch({
                type: EMPLEADO_ERROR
            })
            dispatch(messageService(false, error.response.data.message, error.response.status));
            if (error.response.status === 401) {
                dispatch(logout);
            }
        });
}

export const eliminarEmbargo = (data) => async (dispatch) => {

    await request.delete('Empleados/EmbargoDelete/?id=' + data)
        .then(function (response) {
            dispatch({
                type: EMPLEADO_EXITO
            })
            dispatch(messageService(true, 'Correcto', response.status));
        })
        .catch(function (error) {
            dispatch({
                type: EMPLEADO_ERROR
            })
            dispatch(messageService(false, error.response.data.message, error.response.status));
            if (error.response.status === 401) {
                dispatch(logout);
            }
        });
}

export const addEmbargo = (data) => async (dispatch) => {
    var form = new FormData();
    form.append('Empleado', data.id)
    form.append('Total', data.total)
    form.append('Monto', data.monto)
    form.append('Concepto', data.concepto)
    form.append('FechaFin', data.fin)
    form.append('Anticipo', data.anticipo)
    form.append('Operador', 'Web Services')
    dispatch({
        type: LOADING
    })
    await request.post('Empleados/EmbargoAdd', form)
        .then(function (response) {
            dispatch({
                type: EMPLEADO_EXITO
            });
            dispatch(messageService(true, response.data));
        })
        .catch(function (error) {
            dispatch({
                type: EMPLEADO_ERROR
            })
            dispatch(messageService(false, error.response.data.message, error.response.status));
        });
}

