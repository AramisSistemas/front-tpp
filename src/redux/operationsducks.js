import request from '../context/interceptor';
import { messageService } from './messagesducks';
import { logout } from './usersducks';

const dataInicial = {
    loading: false
}

// types
const LOADING = 'LOADING'
const MANIOBRA_OK = 'MANIOBRA_OK'
const MANIOBRA_FAIL = 'MANIOBRA_FAIL'

// reducer
export default function operationsReducer(state = dataInicial, action) {
    switch (action.type) {
        case LOADING:
            return { ...state, loading: true }
        case MANIOBRA_OK:
            return { ...state, loading: false }
        case MANIOBRA_FAIL:
            return { ...dataInicial }
        default:
            return { ...state }
    }
}

// action
export const ingresarManiobra = (maniobra, turno, fecha, operacion) => async (dispatch) => {
    var form = new FormData();
    form.append('Fecha', fecha)
    form.append('Turno', turno)
    form.append('Maniobra', maniobra)
    form.append('Produccion', 0)
    form.append('Lluvia', false)
    form.append('Insalubre', false)
    form.append('Sobrepeso', false)
    form.append('Operacion', operacion)
    dispatch({
        type: LOADING
    })
    await request.put('Operations/AddManiobraOperacion', form)
        .then(function (response) {
            dispatch({
                type: MANIOBRA_OK
            })
            dispatch(messageService(true, 'Maniobra Cargada ', response.status));
        })
        .catch(function (error) {
            dispatch({
                type: MANIOBRA_FAIL
            })
            dispatch(messageService(false, error.response.data.message, error.response.status));
            if (error.response.status === 401) {
                dispatch(logout);
            }
        });
}

export const actualizarManiobra = (data) => async (dispatch) => {
    var form = new FormData();
    form.append('Id', data.id)
    form.append('Fecha', data.fecha)
    form.append('Turno', data.turno)
    form.append('Maniobra', data.maniobra)
    form.append('Produccion', data.produccion)
    form.append('Lluvia', data.lluvia)
    form.append('Insalubre', data.insalubre)
    form.append('Sobrepeso', data.sobrepeso)
    form.append('Operacion', data.operacion)
    dispatch({
        type: LOADING
    })
    await request.patch('Operations/UpdateManiobraOperacion', form)
        .then(function (response) {
            dispatch({
                type: MANIOBRA_OK
            })
            dispatch(messageService(true, 'Maniobra Actualizada ', response.status));
        })
        .catch(function (error) {
            dispatch({
                type: MANIOBRA_FAIL
            })
            dispatch(messageService(false, error.response.data.message, error.response.status));
            if (error.response.status === 401) {
                dispatch(logout);
            }
        });
} 