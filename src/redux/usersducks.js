import request from '../context/interceptor';
import { messageService } from './messagesducks'
// data inicial

const dataInicial = {
    loading: false,
    activo: false,
    perfil: null,
    usuario: null
}

// types
const LOADING = 'LOADING'
const USUARIO_ERROR = 'USUARIO_ERROR'
const USUARIO_EXITO = 'USUARIO_EXITO'
const USUARIO_ACTIVO = 'USUARIO_ACTIVO'
const CERRAR_SESION = 'CERRAR_SESION'

// reducer
export default function usersReducer(state = dataInicial, action) {
    switch (action.type) {
        case LOADING:
            return { ...state, loading: true }
        case USUARIO_ERROR:
            return { ...dataInicial }
        case USUARIO_EXITO:
            return { ...state, loading: false, activo: true, perfil: action.payload.Perfil, usuario: action.payload.FirstName }
        case USUARIO_ACTIVO:
            return { ...state, loading: false, user: action.payload, activo: true }
        case CERRAR_SESION:
            return { ...dataInicial }
        default:
            return { ...state }
    }
}

// action
export const login = (usertoauthenticate) => async (dispatch) => {
    var form = new FormData();
    form.append('Username', usertoauthenticate.username)
    form.append('Password', usertoauthenticate.password)
    dispatch({
        type: LOADING
    })
    await request.post('Users/authenticate', form)
        .then(function (response) {
            dispatch({
                type: USUARIO_EXITO,
                payload: {
                    FirstName: response.data.firstName,
                    Perfil: response.data.perfil
                }
            })
            localStorage.setItem('token', response.data.token); 
            dispatch(messageService(true, 'Bienvenido '+response.data.firstName,response.status));
        })
        .catch(function (error) {
            dispatch({
                type: USUARIO_ERROR
            }) 
            dispatch(messageService(false,  error.response.data.message,error.response.status));
        });
}

export const userisactive = () => (dispatch) => {
    if (localStorage.getItem('token')) {
        dispatch({
            type: USUARIO_ACTIVO,
            payload: localStorage.getItem('token')
        })
    }
}

export const logout = () => (dispatch) => {
    //  auth.signOut()
    localStorage.removeItem('token') 
    dispatch({
        type: CERRAR_SESION
    });
    dispatch(messageService(true,  'Hasta la Próxima',200));
}