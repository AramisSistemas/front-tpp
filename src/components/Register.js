import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import React, { Fragment, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import {registerUser} from '../redux/usersducks';

const Register = () => {

    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [usermodel, setusermodel] = useState([]);
    const [displaylogin, setdisplaylogin] = useState(false);

    const dispatch = useDispatch()

    const onSubmit = (data) => { 
        setusermodel([
            ...usermodel,
            data
        ])
        dispatch(registerUser(data));
        // limpiar campos
        reset({ username: '', password: '', firstname: '', lastname: '' });
        setdisplaylogin(false);
    }
    return <>
        <button className="p-link layout-topbar-button" onClick={() => setdisplaylogin(true)}>
            <i className="pi pi-user-plus" />
            <span>Registro</span>
        </button>

        <Dialog header="Registro Nuevo Usuario" className="card p-fluid" visible={displaylogin} style={{ width: '30vw' }} modal onHide={() => setdisplaylogin(false)}>
            <Fragment>
                <form className="field grid" onSubmit={handleSubmit(onSubmit)}>
                    <div className="formgroup-inline">
                        <div className="field col-12"  >
                            <label htmlFor="firstname" className="p-sr-only">Nombre</label>
                            <InputText type="text" placeholder="Nombre"   {...register("firstname", {
                                required: true,
                            })}
                            /> {errors.firstname?.type === 'required' && "Ingrese Nombre"}
                        </div>
                        <div className="field col-12"  >
                            <label htmlFor="lastname" className="p-sr-only">Apellido</label>
                            <InputText type="text" placeholder="Apellido"   {...register("lastname", {
                                required: true,
                            })}
                            /> {errors.lastname?.type === 'required' && "Ingrese Apellido"}
                        </div>
                        <div className="field col-12"  >
                            <label htmlFor="username" className="p-sr-only">Usuario</label>
                            <InputText type="text" placeholder="Usuario"   {...register("username", {
                                required: true,
                            })}
                            /> {errors.username?.type === 'required' && "Ingrese Usuario"}
                        </div>
                        <div className="field col-12"  >
                            <label htmlFor="password" className="p-sr-only">Password</label>
                            <InputText type="password" placeholder="Password" {...register("password", {
                                required: true,
                            })}
                            /> {errors.password?.type === 'required' && "Ingrese Password"}
                        </div>
                        <Button label="Registro"></Button>
                    </div>
                </form>
            </Fragment>
        </Dialog>
    </>
};

export default Register;
