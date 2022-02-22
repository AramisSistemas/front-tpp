import request from '../context/interceptor';
import { messageService } from './messagesducks';
import { logout } from './usersducks';

const dataInicial = {
    loading: false
}

// types
const LOADING = 'LOADING'
const LIQUIDACIONES_OK = 'LIQUIDACIONES_OK'
const LIQUIDACIONES_FAIL = 'LIQUIDACIONES_FAIL'

// reducer
export default function liquidacionesReducer(state = dataInicial, action) {
    switch (action.type) {
        case LOADING:
            return { ...state, loading: true }
        case LIQUIDACIONES_OK:
            return { ...state, loading: false }
        case LIQUIDACIONES_FAIL:
            return { ...dataInicial }
        default:
            return { ...state }
    }
}

// action
export const liquidacionesAdd = (liquidaciones) => async (dispatch) => {
    dispatch({
        type: LOADING
    })
    const options = {
        headers: { "content-type": "application/json" }
    }
    await request.put('Empleados/LiquidacionesAdd', liquidaciones, options)
        .then(function (response) {
            dispatch({
                type: LIQUIDACIONES_OK
            })
            dispatch(messageService(true, 'Liquidaciones agregadas ', response.status));
        })
        .catch(function (error) {
            dispatch({
                type: LIQUIDACIONES_FAIL
            })
            dispatch(messageService(false, error.response.data.message, error.response.status));
            if (error.response.status === 401) {
                dispatch(logout);
            }
        });
}