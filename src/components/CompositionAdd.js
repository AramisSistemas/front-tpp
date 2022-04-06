import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addComposition } from '../redux/compositionsducks';
import { messageService } from '../redux/messagesducks';
import { CompositionService } from '../service/CompositionService';
const CompositionAdd = () => {

    const [model, setModel] = useState([]);
    const [display, setDisplay] = useState(false);

    const dispatch = useDispatch()
    const compositionService = new CompositionService();

    const [esquemas, setEsquemas] = useState([]);
    const [maniobras, setManiobras] = useState([]);
    const [puestos, setPuestos] = useState([]);

    const fetchPuestos = async () => {
        await compositionService.getPuestos().then(data => {
            setPuestos(data);
        }).catch((error) => dispatch(messageService(false, error.response.data.message, error.response.status)));
    }

    const fetchEsquemas = async () => {
        await compositionService.getEsquemas().then(data => {
            setEsquemas(data);
        }).catch((error) => dispatch(messageService(false, error.response.data.message, error.response.status)));
    }

    const fetchManiobras = async () => {
        await compositionService.getManiobras().then(data => {
            setManiobras(data);
        }).catch((error) => dispatch(messageService(false, error.response.data.message, error.response.status)));
    }

    const onSubmit = (e) => {
        e.preventDefault();
        let data = { ...model };
        dispatch(addComposition(data));
        setModel([]);
        setDisplay(false);
    }

    const actualizarModel = (nombre, valor) => {
        if (nombre === 'cantidad' && valor <= 0) {
            dispatch(messageService(false, 'Las cantidad debe ser mayor a 0', 400))
            valor = 1;
        }
        let _model = { ...model };
        _model[`${nombre}`] = valor;
        setModel(_model);
    }

    useEffect(() => {
        fetchPuestos();
        fetchEsquemas();
        fetchManiobras();
    }, []);

    return <>
        <button className="p-link layout-topbar-button" onClick={() => setDisplay(true)}>
            <i className="pi pi-plus" />
            <span>Agregar</span>
        </button>

        <Dialog header="Composición de Maniobras" className="card p-fluid" visible={display} style={{ width: '40vw' }} modal onHide={() => setDisplay(false)}>
            <Fragment>
                <form className="field grid" onSubmit={onSubmit}>
                    <div className="formgroup-inline">
                        <div className="field col-12">
                            <h5>Esquema</h5>
                            <Dropdown name="esquema" onChange={(e) => actualizarModel("esquema", e.value)} value={model.esquema} options={esquemas} optionValue="id" optionLabel="detalle" placeholder="Esquema"
                                filter showClear filterBy="detalle" />
                        </div>
                        <div className="field col-12">
                            <h5>Maniobra</h5>
                            <Dropdown name="maniobra" onChange={(e) => actualizarModel("maniobra", e.value)} value={model.maniobra} options={maniobras} optionValue="id" optionLabel="detalle" placeholder="Maniobra"
                                filter showClear filterBy="detalle" />
                        </div>
                        <div className="field col-12">
                            <h5>Puesto</h5>
                            <Dropdown name="puesto" onChange={(e) => actualizarModel("puesto", e.value)} value={model.puesto} options={puestos} optionValue="id" optionLabel="detalle" placeholder="Puesto"
                                filter showClear filterBy="detalle" />
                        </div>
                        <div className="field col-12"  >
                            <h5>Cantidad de Operarios</h5>
                            <label htmlFor="cantidad" className="p-sr-only">Cantidad</label>
                            <InputText type="number" placeholder="Cantidad" value={model.cantidad} onChange={(e) => actualizarModel("cantidad", e.target.value)} />
                        </div>
                        <Button label="Registro"></Button>
                    </div>
                </form>
            </Fragment>
        </Dialog>
    </>
};

export default CompositionAdd;
