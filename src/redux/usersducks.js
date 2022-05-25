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
const USUARIO_REGISTRADO = 'USUARIO_REGISTRADO'
const CERRAR_SESION = 'CERRAR_SESION'
const USUARIO_DELETE = 'USUARIO_DELETE'
const USUARIO_UPDATE = 'USUARIO_UPDATE'


// reducer
export default function usersReducer(state = dataInicial, action) {
    switch (action.type) {
        case LOADING:
            return { ...state, loading: true }
        case USUARIO_ERROR:
            return { ...dataInicial }
        case USUARIO_EXITO:
            return { ...state, loading: false, activo: true, perfil: action.payload.perfil, usuario: action.payload.FirstName }
        case USUARIO_ACTIVO:
            return { ...state, loading: false, user: action.payload, activo: true, perfil: action.payload.perfil }
        case USUARIO_REGISTRADO:
            return { ...dataInicial , loading: false}
        case CERRAR_SESION:
            return { ...dataInicial }
        case USUARIO_DELETE:
            return { ...state , loading: false}
        case USUARIO_UPDATE:
            return { ...state , loading: false}
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
                    perfil: response.data.perfil
                }
            })
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('perfil', response.data.perfil);
            dispatch(messageService(true, 'Bienvenido ' + response.data.firstName, response.status));
        })
        .catch(function (error) {
            dispatch({
                type: USUARIO_ERROR
            })
            dispatch(messageService(false, error.response.data.message, error.response.status));
        });
}

export const registerUser = (usertoauthenticate) => async (dispatch) => {
    var form = new FormData();
    form.append('Username', usertoauthenticate.username)
    form.append('Password', usertoauthenticate.password)
    form.append('FirstName', usertoauthenticate.firstname)
    form.append('LastName', usertoauthenticate.lastname)
    dispatch({
        type: LOADING
    })
    await request.post('Users/register', form)
        .then(function (response) {
            dispatch({
                type: USUARIO_REGISTRADO
            });
            dispatch(messageService(true, response.data));
        })
        .catch(function (error) {
            dispatch({
                type: USUARIO_ERROR
            })
            dispatch(messageService(false, error.response.data.message, error.response.status));
        });
}

export const changePassUser = (usertoauthenticate) => async (dispatch) => {
    var form = new FormData();
    form.append('Username', usertoauthenticate.username)
    form.append('Password', usertoauthenticate.password)
    form.append('NPassword', usertoauthenticate.npassword)
    dispatch({
        type: LOADING
    })
    await request.post('Users/changepassword', form)
        .then(function (response) {
            dispatch({
                type: USUARIO_EXITO,
                payload: {
                    FirstName: response.data.firstName,
                    perfil: response.data.perfil
                }
            })
            localStorage.setItem('token', response.data.token);
            dispatch(messageService(true, 'Bienvenido ' + response.data.firstName, response.status));
        })
        .catch(function (error) {
            dispatch({
                type: USUARIO_ERROR
            })
            dispatch(messageService(false, error.response.data.message, error.response.status));
        });
}

export const userisactive = () => (dispatch) => {
    if (localStorage.getItem('token')) {
        dispatch({
            type: USUARIO_ACTIVO,
            payload: {
                token: localStorage.getItem('token'),
                perfil: localStorage.getItem('perfil')
            }

        })
    }
}

export const logout = () => (dispatch) => {
    localStorage.removeItem('token');
    localStorage.removeItem('perfil');
    dispatch({
        type: CERRAR_SESION,
    });
    dispatch(messageService(true, 'Hasta la Próxima', 200));
}

export const eliminarUser = (data) => async (dispatch) => {

    await request.delete('Users/Delete/?id=' + data)
        .then(function (response) {
            dispatch({
                type: USUARIO_DELETE
            })
            dispatch(messageService(true, 'Usuario Eliminado ', response.status));
        })
        .catch(function (error) {
            dispatch({
                type: USUARIO_DELETE
            })
            dispatch(messageService(false, error.response.data.message, error.response.status));
            if (error.response.status === 401) {
                dispatch(logout);
            }
        });
}

export const actualizarUsuario = (data) => async (dispatch) => {
    data.endOfLife = data.endOfLife.toDateString();
    var form = new FormData();
    form.append('Id', data.id)
    form.append('FirstName', data.firstName)
    form.append('LastName', data.lastName)
    form.append('Username', data.username)
    form.append('Password', data.password)
    form.append('Perfil', data.perfil)
    form.append('EndOfLife', data.endOfLife)
    form.append('Confirmado', data.confirmado)
    dispatch({
        type: LOADING
    })
    await request.patch('Users/UpdateUser', form)
        .then(function (response) {
            dispatch({
                type: USUARIO_UPDATE
            })
            dispatch(messageService(true, 'Usuario Actualizado ', response.status));
        })
        .catch(function (error) {
            dispatch(messageService(false, error.response.data.message, error.response.status));
            if (error.response.status === 401) {
                dispatch(logout);
            }
        });
}
