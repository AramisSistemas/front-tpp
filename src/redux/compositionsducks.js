import request from '../context/interceptor';
import { messageService } from './messagesducks';
// data inicial

const dataInicial = {
    loading: false
}

// types
const LOADING = 'LOADING'
const COMPOSITION_ERROR = 'COMPOSITION_ERROR'
const COMPOSITION_EXITO = 'COMPOSITION_EXITO'


// reducer
export default function compositionsReducer(state = dataInicial, action) {
    switch (action.type) {
        case LOADING:
            return { ...state, loading: true }
        case COMPOSITION_ERROR:
            return { ...dataInicial }
        case COMPOSITION_EXITO:
            return { ...state, loading: false }
        default:
            return { ...state }
    }
}

// action

export const updateComposition = (data) => async (dispatch) => {
    var form = new FormData();
    form.append('Id', data.id)
    form.append('Maniobra', data.maniobra)
    form.append('ManiobraStr', data.maniobraStr)
    form.append('Esquema', data.esquema)
    form.append('EsquemaStr', data.esquemaStr)
    form.append('Puesto', data.puesto)
    form.append('PuestoStr', data.puestoStr)
    form.append('Cantidad', data.cantidad)
    dispatch({
        type: LOADING
    })
    await request.patch('Composicions/UpdateCompositions', form)
        .then(function (response) {
            dispatch({
                type: COMPOSITION_EXITO
            });
            dispatch(messageService(true, response.data));
        })
        .catch(function (error) {
            dispatch({
                type: COMPOSITION_ERROR
            })
            dispatch(messageService(false, error.response.data.message, error.response.status));
        });
}

export const addComposition = (data) => async (dispatch) => {
    var form = new FormData();
    form.append('Id', 0)
    form.append('Maniobra', data.maniobra)
    form.append('ManiobraStr', data.maniobra)
    form.append('Esquema', data.esquema)
    form.append('EsquemaStr', data.esquema)
    form.append('Puesto', data.puesto)
    form.append('PuestoStr', data.puesto)
    form.append('Cantidad', data.cantidad)
    dispatch({
        type: LOADING
    })
    await request.post('Composicions/AddCompositions', form)
        .then(function (response) {
            dispatch({
                type: COMPOSITION_EXITO
            });
            dispatch(messageService(true, response.data));
        })
        .catch(function (error) {
            dispatch({
                type: COMPOSITION_ERROR
            })
            dispatch(messageService(false, error.response.data.message, error.response.status));
        });
}

export const AddEsquemas = (data) => async (dispatch) => {
    var form = new FormData();
    form.append('Id', 0)
    form.append('Detalle', data.detalle)
    dispatch({
        type: LOADING
    })
    await request.post('Composicions/AddEsquemas', form)
        .then(function (response) {
            dispatch({
                type: COMPOSITION_EXITO
            });
            dispatch(messageService(true, response.data));
        })
        .catch(function (error) {
            dispatch({
                type: COMPOSITION_ERROR
            })
            dispatch(messageService(false, error.response.data.message, error.response.status));
        });
}

export const UpdateEsquema = (data) => async (dispatch) => {
    var form = new FormData();
    form.append('Id', data.id)
    form.append('Detalle', data.detalle)
    dispatch({
        type: LOADING
    })
    await request.patch('Composicions/UpdateEsquemas', form)
        .then(function (response) {
            dispatch({
                type: COMPOSITION_EXITO
            });
            dispatch(messageService(true, response.data));
        })
        .catch(function (error) {
            dispatch({
                type: COMPOSITION_ERROR
            })
            dispatch(messageService(false, error.response.data.message, error.response.status));
        });
}

export const AddManiobras = (data) => async (dispatch) => {
    var form = new FormData();
    form.append('Id', 0)
    form.append('Detalle', data.detalle)
    dispatch({
        type: LOADING
    })
    await request.post('Composicions/AddManiobras', form)
        .then(function (response) {
            dispatch({
                type: COMPOSITION_EXITO
            });
            dispatch(messageService(true, response.data));
        })
        .catch(function (error) {
            dispatch({
                type: COMPOSITION_ERROR
            })
            dispatch(messageService(false, error.response.data.message, error.response.status));
        });
}

export const UpdateManiobra = (data) => async (dispatch) => {
    var form = new FormData();
    form.append('Id', data.id)
    form.append('Detalle', data.detalle)
    dispatch({
        type: LOADING
    })
    await request.patch('Composicions/UpdateManiobras', form)
        .then(function (response) {
            dispatch({
                type: COMPOSITION_EXITO
            });
            dispatch(messageService(true, response.data));
        })
        .catch(function (error) {
            dispatch({
                type: COMPOSITION_ERROR
            })
            dispatch(messageService(false, error.response.data.message, error.response.status));
        });
}

export const AddPuestos = (data) => async (dispatch) => {
    var form = new FormData();
    form.append('Id', 0)
    form.append('Detalle', data.detalle)
    dispatch({
        type: LOADING
    })
    await request.post('Composicions/AddPuestos', form)
        .then(function (response) {
            dispatch({
                type: COMPOSITION_EXITO
            });
            dispatch(messageService(true, response.data));
        })
        .catch(function (error) {
            dispatch({
                type: COMPOSITION_ERROR
            })
            dispatch(messageService(false, error.response.data.message, error.response.status));
        });
}

export const UpdatePuesto = (data) => async (dispatch) => {
    var form = new FormData();
    form.append('Id', data.id)
    form.append('Detalle', data.detalle)
    dispatch({
        type: LOADING
    })
    await request.patch('Composicions/UpdatePuestos', form)
        .then(function (response) {
            dispatch({
                type: COMPOSITION_EXITO
            });
            dispatch(messageService(true, response.data));
        })
        .catch(function (error) {
            dispatch({
                type: COMPOSITION_ERROR
            })
            dispatch(messageService(false, error.response.data.message, error.response.status));
        });
}

export const AddAgrupamientos = (data) => async (dispatch) => {
    var form = new FormData();
    form.append('Id', 0)
    form.append('Detalle', data.detalle)
    dispatch({
        type: LOADING
    })
    await request.post('Composicions/AddAgrupaciones', form)
        .then(function (response) {
            dispatch({
                type: COMPOSITION_EXITO
            });
            dispatch(messageService(true, response.data));
        })
        .catch(function (error) {
            dispatch({
                type: COMPOSITION_ERROR
            })
            dispatch(messageService(false, error.response.data.message, error.response.status));
        });
}

export const UpdateAgrupamiento = (data) => async (dispatch) => {
    var form = new FormData();
    form.append('Id', data.id)
    form.append('Detalle', data.detalle)
    dispatch({
        type: LOADING
    })
    await request.patch('Composicions/UpdateAgrupaciones', form)
        .then(function (response) {
            dispatch({
                type: COMPOSITION_EXITO
            });
            dispatch(messageService(true, response.data));
        })
        .catch(function (error) {
            dispatch({
                type: COMPOSITION_ERROR
            })
            dispatch(messageService(false, error.response.data.message, error.response.status));
        });
}

export const DeleteAgrupamiento = (data) => async (dispatch) => {

    await request.delete('Composicions/DeleteAgrupaciones/?id=' + data)
        .then(function (response) {
            dispatch({
                type: COMPOSITION_EXITO
            })
            dispatch(messageService(true, 'Correcto', response.status));
        })
        .catch(function (error) {
            dispatch({
                type: COMPOSITION_ERROR
            })
            dispatch(messageService(false, error.response.data.message, error.response.status));
        });
}

export const CompositionJornalesInsert = (composiciones) => async (dispatch) => {
    dispatch({
        type: LOADING
    })
    const options = {
        headers: { "content-type": "application/json" }
    }
    await request.put('Composicions/InsertCompoJornales', composiciones, options)
        .then(function (response) {
            dispatch({
                type: COMPOSITION_EXITO
            })
            dispatch(messageService(true, 'Composiciones agregadas ', response.status));
        })
        .catch(function (error) {
            dispatch({
                type: COMPOSITION_ERROR
            })
            dispatch(messageService(false, error.response.data.message, error.response.status));
        });
}

export const CompositionJornalesUpdate = (data) => async (dispatch) => {
    var form = new FormData();
    form.append('Id', data.id)
    form.append('Agrupacion', data.agrupacion)
    form.append('Codigo', data.codigo)
    form.append('Concepto', data.concepto)
    form.append('Monto', data.monto)
    form.append('Fijo', data.fijo)
    form.append('Haber', data.haber)
    form.append('Remunerativo', data.remunerativo)
    form.append('Sbasico', data.sbasico)
    form.append('Sbruto', data.sbruto)
    form.append('Sremun', data.sremun)
    form.append('Obligatorio', data.obligatorio) 
    dispatch({
        type: LOADING
    })
    await request.patch('Composicions/UpdateCompoJornales', form)
        .then(function (response) {
            dispatch({
                type: COMPOSITION_EXITO
            });
            dispatch(messageService(true, response.data));
        })
        .catch(function (error) {
            dispatch({
                type: COMPOSITION_ERROR
            })
            dispatch(messageService(false, error.response.data.message, error.response.status));
        });
}

export const CompositionJornalesDelete = (data) => async (dispatch) => { 
    await request.delete('Composicions/DeleteCompoJornales/?id=' + data)
        .then(function (response) {
            dispatch({
                type: COMPOSITION_EXITO
            })
            dispatch(messageService(true, 'Composicion Eliminada ', response.status));
        })
        .catch(function (error) {
            dispatch({
                type: COMPOSITION_ERROR
            })
            dispatch(messageService(false, error.response.data.message, error.response.status)); 
        });
}