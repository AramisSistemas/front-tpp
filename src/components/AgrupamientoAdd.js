import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import React, { Fragment, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AddAgrupamientos } from '../redux/compositionsducks';
const AgrupamientoAdd = () => {

    const [model, setModel] = useState([]);
    const [display, setDisplay] = useState(false);

    const dispatch = useDispatch()

    const onSubmit = (e) => {
        e.preventDefault();
        let data = { ...model }
        dispatch(AddAgrupamientos(data));
        setModel([]);
        setDisplay(false);
    }

    const actualizarModel = (nombre, valor) => {
        let _model = { ...model };
        _model[`${nombre}`] = valor;
        setModel(_model);
    }

    return <>
        <Button icon="pi pi-plus" label="Agregar" onClick={() => setDisplay(true)} className="p-button-help"></Button>
        <Dialog header="Agrupamiento" className="card p-fluid" visible={display} style={{ width: '30vw' }} modal onHide={() => setDisplay(false)}>
            <Fragment>
                <form className="field grid" onSubmit={onSubmit}>
                    <div className="formgroup-inline">
                        <div className="field col-12"  >
                            <label htmlFor="detalle" className="p-sr-only">Nombre Agrupamiento</label>
                            <InputText type="text" placeholder="Nombre Agrupamiento" onChange={(e) => actualizarModel("detalle", e.target.value)}
                                required />
                        </div>
                        <Button label="Registro"></Button>
                    </div>
                </form>
            </Fragment>
        </Dialog>
    </>
};

export default AgrupamientoAdd;
