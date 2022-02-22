import React, { useState, Fragment } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useForm } from 'react-hook-form';

import { useDispatch } from 'react-redux'
import { login } from '../redux/usersducks'


const Login = () => {

    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [usermodel, setusermodel] = useState([]);
    const [displaylogin, setdisplaylogin] = useState(false);

    const dispatch = useDispatch()

    const onSubmit = (data) => {
        setusermodel([
            ...usermodel,
            data
        ])
        dispatch(login(data));
        // limpiar campos
        reset({ username: '', password: '' });
        setdisplaylogin(false);
    }
    return <>
        <button className="p-link layout-topbar-button" onClick={() => setdisplaylogin(true)}>
            <i className="pi pi-user" />
            <span>Login</span>
        </button>

        <Dialog header="Login" className="card p-fluid" visible={displaylogin} style={{ width: '30vw' }} modal onHide={() => setdisplaylogin(false)}>
            <Fragment>
                <form className="field grid" onSubmit={handleSubmit(onSubmit)}>
                    <div className="formgroup-inline">
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
                        <Button label="Ingreso"></Button>
                    </div>
                </form>
            </Fragment>
        </Dialog>
    </>
};

export default Login;
