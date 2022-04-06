import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { ToggleButton } from 'primereact/togglebutton';
import React, { Fragment, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { addEmpleado } from '../redux/empleadosducks';

const EmpleadoAdd = () => {

    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [empleadomodel, setempleadomodel] = useState([]);
    const [displayadd, setdisplayadd] = useState(false);
    const [sexo, setSexo] = useState(true);
    const dispatch = useDispatch()

    const onSubmit = (data) => {
        
        setempleadomodel([
            ...empleadomodel,
            data
        ])
        data.sexo = sexo ? 'M' : 'F';
        dispatch(addEmpleado(data));
        // limpiar campos
        reset({ nombre: '', cuil: '', cuilcbu: '', cbu: '' });
        setdisplayadd(false);
    }
    return <>
        <Button icon="pi pi-user-plus" label={'Alta'} className="p-button-rounded" onClick={() => setdisplayadd(true)} />
        <Dialog header="Registro Nuevo Empleado" className="card p-fluid" visible={displayadd} style={{ width: '30vw' }} modal onHide={() => setdisplayadd(false)}>
            <Fragment>
                <form className="field grid" onSubmit={handleSubmit(onSubmit)}>
                    <div className="formgroup-inline">
                        <div className="field col-12"  >
                            <label htmlFor="nombre" className="p-sr-only">Nombre</label>
                            <InputText type="text" placeholder="Nombre"   {...register("nombre", {
                                required: true,
                            })}
                            /> {errors.nombre?.type === 'required' && "Ingrese Nombre"}
                        </div>
                        <div className="field col-12"  >
                            <label htmlFor="cuil" className="p-sr-only">Cuil-Dni</label>
                            <InputText type="number" placeholder="Cuil-Dni"   {...register("cuil", {
                                required: true,
                            })}
                            /> {errors.cuil?.type === 'required' && "Ingrese Cuil o Dni"}
                        </div>
                        <div className="field col-12"  >
                            <label htmlFor="cbu" className="p-sr-only">CBU</label>
                            <InputText type="number" placeholder="CBU"   {...register("cbu", {
                                required: true,
                            })}
                            /> {errors.cbu?.type === 'required' && "Ingrese CBU"}
                        </div>
                        <div className="field col-12"  >
                            <label htmlFor="cuilcbu" className="p-sr-only">Cuil-Dni</label>
                            <InputText type="number" placeholder="Cuil-Dni de la Cuenta"   {...register("cuilcbu", {
                                required: true,
                            })}
                            /> {errors.cuilcbu?.type === 'required' && "Ingrese Cuil o Dni"}
                        </div>
                        <div className="field col-5"  >
                            <ToggleButton onLabel="Masculino" offLabel="Femenino" onIcon="pi pi-user-plus" offIcon="pi pi-user-minus" checked={sexo}
                                onChange={(e) => setSexo(e.value)} className={sexo ? "p-button-primary" : "p-button-warning"}  />
                        </div>
                        <Button label="Alta"></Button>
                    </div>
                </form>
            </Fragment>
        </Dialog>
    </>
};

export default EmpleadoAdd;
