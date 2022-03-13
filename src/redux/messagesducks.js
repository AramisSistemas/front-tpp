import { logout } from "./usersducks"
const dataInicial = {
    status: null,
    message: null
}

const OK = 'OK'
const FAIL = 'FAIL'
const LOADING = 'LOADING'

export default function messagesReducer(state = dataInicial, action) {
    switch (action.type) {
        case OK:
            return { ...state, status: action.payload.status, message: action.payload.message }
        case FAIL:
            return { ...state, status: action.payload.status, message: action.payload.message }
        case LOADING:
            return { ...dataInicial }
        default:
            return { ...state }
    }
}

export const messageService = (ok, message, status) => (dispatch) => {
    dispatch({
        type: LOADING
    })
    if (ok) {
        dispatch({
            type: OK,
            payload: {
                status: status,
                message: message
            }
        })
    } else {
        dispatch({
            type: FAIL,
            payload: {
                status: status,
                message: message
            }
        });
        if (status === 401) {
            dispatch(logout());
        }
    }
}
