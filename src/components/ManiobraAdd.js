import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import React, { Fragment, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AddManiobras } from '../redux/compositionsducks';
const ManiobraAdd = () => {

    const [model, setModel] = useState([]);
    const [display, setDisplay] = useState(false);

    const dispatch = useDispatch()

    const onSubmit = (e) => {
        e.preventDefault();
        let data = { ...model }
        dispatch(AddManiobras(data));
        setModel([]);
        setDisplay(false);
    }

    const actualizarModel = (nombre, valor) => {
        let _model = { ...model };
        _model[`${nombre}`] = valor;
        setModel(_model);
    }

    return <>
        <button className="p-link layout-topbar-button" onClick={() => setDisplay(true)}>
            <i className="pi pi-plus" />
            <span>Agregar</span>
        </button>

        <Dialog header="Maniobras" className="card p-fluid" visible={display} style={{ width: '30vw' }} modal onHide={() => setDisplay(false)}>
            <Fragment>
                <form className="field grid" onSubmit={onSubmit}>
                    <div className="formgroup-inline">
                        <div className="field col-12"  >
                            <label htmlFor="detalle" className="p-sr-only">Nombre Maniobra</label>
                            <InputText type="text" placeholder="Nombre Maniobra" onChange={(e) => actualizarModel("detalle", e.target.value)}
                                required />
                        </div>
                        <Button label="Registro"></Button>
                    </div>
                </form>
            </Fragment>
        </Dialog>
    </>
};

export default ManiobraAdd;
