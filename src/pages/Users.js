import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { InputText } from 'primereact/inputtext';
import { Skeleton } from 'primereact/skeleton';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { default as React, Fragment, useEffect, useRef, useState } from 'react';
import Moment from 'react-moment';
import { useDispatch, useSelector } from 'react-redux';
import { messageService } from '../redux/messagesducks';
import { actualizarUsuario, eliminarUser, logout } from '../redux/usersducks';
import { UserService } from '../service/UserService';
const Users = () => {
    const dispatch = useDispatch();

    const userService = new UserService();

    const activo = useSelector(store => store.users.activo);
    const perfil = useSelector(store => store.users.perfil);

    const message = useSelector(store => store.messages.message)
    const status = useSelector(store => store.messages.status)
    const toast = useRef();

    const [perfiles, setPerfiles] = useState({ id: null, rol: null });
    const [users, setUsers] = useState([]);
    const [usermodel, setUsermodel] = useState([]);
    const [displayupdate, setDisplayupdate] = useState(false);
    const [loadingUsers, setLoadingUsers] = useState(true);

    const fetchUsers = async () => {
        setLoadingUsers(true);
        await userService.getAll().then(data => { setUsers(data); setLoadingUsers(false) }).catch((error) => dispatch(messageService(false, error.response.data.message, error.response.status)));
    }

    const onsubmitDelete = (data) => {
        dispatch(eliminarUser(data)).then(
            fetchUsers()
        );
    }

    const onSubmitPreUpdate = (rowData) => { 
        userService.getPerfiles().then(data => {
            setPerfiles(data)
        });
        setUsermodel(rowData);
        setDisplayupdate(true);
    }

    const actualizarDatosUsuario = (nombre, valor) => {
        let _usermodel = { ...usermodel };
        _usermodel[`${nombre}`] = valor;
        setUsermodel(_usermodel);
    }

    const onSubmitUpdate = (e) => {
        e.preventDefault()
        let data = { ...usermodel };
        dispatch(actualizarUsuario(data));
        // limpiar campos
        setUsermodel([])
        setDisplayupdate(false);
    }

    const validezBodyTemplate = (rowData) => {
        return <Moment format='D/MM/yyyy'>{rowData.endOfLife}</Moment>
    }

    const perfilBodyTemplate = (rowData) => {
        return <Badge size="small" value={rowData.perfil} severity={rowData.perfil === 1 ? 'success' :
            rowData.perfil === 2 ? 'warning' : 'danger'}
            style={{ textAlign: 'center' }}></Badge>
    }

    const confirmadoBodyTemplate = (rowData) => {
        return <i className={classNames('pi', { 'text-green-500 pi-check-circle': rowData.confirmado, 'text-pink-500 pi-times-circle': !rowData.confirmado })}></i>;
    }

    const actionUserBodyTemplate = (rowData) => {
        return (<>
            <Button icon="pi pi-user-edit" className="p-button-rounded p-button-info p-button-text mr-2 mb-2" onClick={() => onSubmitPreUpdate(rowData)} />
            <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-text mr-2 mb-2" onClick={() => { onsubmitDelete(rowData.id) }} />
        </>
        )
    }

    useEffect(() => {
        if (activo === true && perfil === 3) {
            fetchUsers().catch((error) => error.response.status === 401 ? dispatch(logout()) : dispatch(messageService(false, error.response.data.message, error.response.status)));
            if (message !== '' && message !== null) {
                switch (status) {
                    case 200: toast.current.show({ severity: 'success', summary: 'Correcto', detail: message, life: 3000 });
                        break;
                    case 400: toast.current.show({ severity: 'warn', summary: 'Verifique', detail: message, life: 3000 });
                        break;
                    case 401: toast.current.show({ severity: 'error', summary: 'Autenticacion', detail: message, life: 3000 });
                        dispatch(logout());
                        break;
                    default: toast.current.show({ severity: 'info', summary: 'Atendeme', detail: message, life: 3000 });
                }
            }
        }
    }, [activo, message, status, perfil, dispatch]);

    return (
        activo && perfil === 3 ? (

            <div className="col-12">
                <div className="card">
                    <h5>Usuarios</h5>
                    <DataTable value={users} dataKey="id" loading={loadingUsers}  >
                        <Column field="id" header="Id" sortable />
                        <Column field="firstName" header="Nombre" sortable />
                        <Column field="lastName" header="Apellido" sortable />
                        <Column field="username" header="Usuario" sortable />
                        <Column field="perfil" header="Perfil" sortable body={perfilBodyTemplate} />
                        <Column field="endOfLife" header="Validez" sortable body={validezBodyTemplate} />
                        <Column field="confirmado" header="Ok" sortable body={confirmadoBodyTemplate} />
                        <Column headerStyle={{ width: '4rem' }} body={actionUserBodyTemplate}></Column>
                    </DataTable>
                    {usermodel ? (<Dialog header="Actualizar Usuario" className="card p-fluid" visible={displayupdate} style={{ width: '30vw' }} modal onHide={() => setDisplayupdate(false)}>
                        <Fragment>
                            <form className="field grid" onSubmit={onSubmitUpdate}>
                                <input hidden readOnly value={usermodel.id} />
                                <div className="formgroup-inline">
                                    <div className="field col-12"  >
                                        <label htmlFor="firstname" className="p-sr-only">Nombre</label>
                                        <InputText type="text" value={usermodel.firstName} placeholder="Nombre" onChange={(e) => actualizarDatosUsuario("firstName", e.target.value)} />
                                    </div>
                                    <div className="field col-12"  >
                                        <label htmlFor="lastname" className="p-sr-only">Apellido</label>
                                        <InputText type="text" placeholder="Apellido" value={usermodel.lastName} onChange={(e) => actualizarDatosUsuario("lastName", e.target.value)} />
                                    </div>
                                    <div className="field col-12"  >
                                        <label htmlFor="username" className="p-sr-only">Usuario</label>
                                        <InputText type="text" placeholder="Usuario" value={usermodel.username} onChange={(e) => actualizarDatosUsuario("username", e.target.value)} />
                                    </div>
                                    <div className="field col-12"  >
                                        <label htmlFor="password" className="p-sr-only">Password</label>
                                        <InputText type="password" placeholder="Password" value={usermodel.password} onChange={(e) => actualizarDatosUsuario("password", e.target.value)} />
                                    </div>
                                    <div className="field col-4">
                                        <h5>Confirmado</h5>
                                        <InputSwitch checked={usermodel.confirmado} onChange={(e) => actualizarDatosUsuario("confirmado", e.value)} />
                                    </div>
                                    <div className="field col-7">
                                        <h5>Perfil</h5>
                                        <Dropdown name="perfil" onChange={(e) => actualizarDatosUsuario("perfil", e.value)} value={usermodel.perfil} options={perfiles} optionValue="id" optionLabel="rol" placeholder="Perfil"
                                            required={true} />
                                    </div>
                                    <h5>Validez</h5>
                                    <div className="field col-12">
                                        <label htmlFor="endOfLife" className="p-sr-only">Validez</label>
                                        <Calendar name="endOfLife" value={usermodel.endOfLife} showIcon showButtonBar dateFormat='dd/mm/yy' required
                                            onChange={(e) => actualizarDatosUsuario("endOfLife", e.value)} />
                                    </div>
                                    <Button label="Actualizar"></Button>
                                </div>
                            </form>
                        </Fragment>
                    </Dialog>) : <></>}
                </div>
                <Toast ref={toast} />
            </div>
        ) : (<div className="card">
            <h4>Requiere Autenticación</h4>
            <div className="border-round border-1 surface-border p-4">
                <div className="flex mb-3">
                    <Skeleton shape="circle" size="4rem" className="mr-2"></Skeleton>
                    <div>
                        <Skeleton width="10rem" className="mb-2"></Skeleton>
                        <Skeleton width="5rem" className="mb-2"></Skeleton>
                        <Skeleton height=".5rem"></Skeleton>
                    </div>
                </div>
                <Skeleton width="100%" height="150px"></Skeleton>
                <div className="flex justify-content-between mt-3">
                    <Skeleton width="4rem" height="2rem"></Skeleton>
                    <Skeleton width="4rem" height="2rem"></Skeleton>
                </div>
            </div>
        </div>)
    )
}


const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Users, comparisonFn);  