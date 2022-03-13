import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import React, { Fragment, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import {changePassUser} from '../redux/usersducks';

const ChangePass = () => {

    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [usermodel, setusermodel] = useState([]);
    const [displaylogin, setdisplaylogin] = useState(false);

    const dispatch = useDispatch()

    const onSubmit = (data) => { 
        if(data.password===data.npassword)

        setusermodel([
            ...usermodel,
            data
        ])
        dispatch(changePassUser(data));
        // limpiar campos
        reset({ username: '', password: '', npassword: ''});
        setdisplaylogin(false);
    }
    return <>
        <button className="p-link layout-topbar-button" onClick={() => setdisplaylogin(true)}>
            <i className="pi pi-cog" />
            <span>Registro</span>
        </button>

        <Dialog header="Cambio Pass" className="card p-fluid" visible={displaylogin} style={{ width: '30vw' }} modal onHide={() => setdisplaylogin(false)}>
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
                        <div className="field col-12"  >
                            <label htmlFor="npassword" className="p-sr-only">Nuevo Password</label>
                            <InputText type="password" placeholder="Nuevo Password" {...register("npassword", {
                                required: true,
                            })}
                            /> {errors.npassword?.type === 'required' && "Ingrese Nuevo Password"} 
                        </div>
                        <Button label="Ingreso"></Button>
                    </div>
                </form> 
            </Fragment>
        </Dialog>
    </>
};

export default ChangePass;
