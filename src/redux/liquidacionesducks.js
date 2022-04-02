import request from '../context/interceptor';
import { messageService } from './messagesducks';

const dataInicial = {
    loading: false,
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
    await request.put('Operations/LiquidacionesAdd', liquidaciones, options)
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
        });
}

export const liquidacionesPay = (liquidaciones, pagos) => async (dispatch) => {
    dispatch({
        type: LOADING
    })
    const options = {
        headers: { "content-type": "application/json" }
    }
    await request.post('Operations/LiquidacionesPay', liquidaciones, options)
        .then(function (response) {
            dispatch({
                type: LIQUIDACIONES_OK,
            })
            const a = document.createElement("a");

            let contenido = response.data[0].cuit + '\t' + response.data[0].cantidad;
            pagos.forEach(x => {
                contenido = contenido + '\n' + x.cuit + '\t' + x.total.toFixed(2).toString().replace(".", ",")
            });

            const archivo = new Blob([contenido], { type: 'text/plain' });
            const url = URL.createObjectURL(archivo);
            a.href = url;
            a.download = 'Pagos Lote ' + response.data[0].lote + ' Cantidad ' + response.data[0].cantidad + '.txt';
            a.click();
            URL.revokeObjectURL(url);
            dispatch(messageService(true, response.data[0].cantidad + ' Liquidaciones pagadas con Lote ' + response.data[0].lote, response.status));
        })
        .catch(function (error) {
            dispatch({
                type: LIQUIDACIONES_FAIL
            })
            dispatch(messageService(false, error.response.data.message, error.response.status));
        });
}

export const liquidacionesDelete = (operacion, puesto) => async (dispatch) => {
    dispatch({
        type: LOADING
    })
    await request.delete('Operations/LiquidacionesDelete/?operacion=' + operacion + '&puesto=' + puesto)
        .then(function (response) {
            dispatch({
                type: LIQUIDACIONES_OK
            })
            dispatch(messageService(true, 'Liquidaciones eliminadas ', response.status));
        })
        .catch(function (error) {
            dispatch({
                type: LIQUIDACIONES_FAIL
            })
            dispatch(messageService(false, error.response.data.message, error.response.status));
        });
}

export const liquidacionDelete = (liquidacion) => async (dispatch) => {
    dispatch({
        type: LOADING
    })
    await request.delete('Operations/LiquidacionesDeleteByLiq/?liquidacion=' + liquidacion)
        .then(function (response) {
            dispatch({
                type: LIQUIDACIONES_OK
            })
            dispatch(messageService(true, 'Liquidación eliminadas ', response.status));
        })
        .catch(function (error) {
            dispatch({
                type: LIQUIDACIONES_FAIL
            })
            dispatch(messageService(false, error.response.data.message, error.response.status));
        });
}