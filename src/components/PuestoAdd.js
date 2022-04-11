import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import React, { Fragment, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AddManiobras, AddPuestos } from '../redux/compositionsducks';
import { CompositionService } from '../service/CompositionService';  
import { messageService } from '../redux/messagesducks';
import { Dropdown } from 'primereact/dropdown';
const PuestoAdd = () => {

    const [model, setModel] = useState([]);
    const [agrupaciones, setAgrupaciones] = useState([]); 
    const [display, setDisplay] = useState(false);

    const dispatch = useDispatch()
    const compositionService = new CompositionService();

    const fetchAgrupaciones = async () => {
        await compositionService.getAgrupaciones().then(data => {
            setAgrupaciones(data);
        }).catch((error) => dispatch(messageService(false, error.response.data.message, error.response.status)));
    }

    const onSubmit = (e) => {
        e.preventDefault();
        let data = { ...model }
        dispatch(AddPuestos(data));
        setModel([]);
        setDisplay(false);
    }

    const actualizarModel = (nombre, valor) => {
        let _model = { ...model };
        _model[`${nombre}`] = valor;
        setModel(_model);
    }

    useEffect(() => {
        fetchAgrupaciones() 
    }, []);

    return <>
        <button className="p-link layout-topbar-button" onClick={() => setDisplay(true)}>
            <i className="pi pi-plus" />
            <span>Agregar</span>
        </button>

        <Dialog header="Puestos" className="card p-fluid" visible={display} style={{ width: '30vw' }} modal onHide={() => setDisplay(false)}>
            <Fragment>
                <form className="field grid" onSubmit={onSubmit}>
                    <div className="formgroup-inline">
                        <div className="field col-12"  >
                        <h5>Puesto</h5>
                            <label htmlFor="detalle" className="p-sr-only">Nombre Puesto</label>
                            <InputText type="text" placeholder="Nombre Puesto" onChange={(e) => actualizarModel("detalle", e.target.value)}
                                required />
                        </div>
                        <div className="field col-12">
                            <h5>Agrupacion</h5>
                            <Dropdown name="agrupacion" onChange={(e) => actualizarModel("agrupacion", e.value)} value={model.agrupacion} options={agrupaciones} optionValue="id" optionLabel="detalle" placeholder="Agrupacion"
                                filter showClear filterBy="detalle" required />
                        </div>
                        <Button label="Registro"></Button>
                    </div>
                </form>
            </Fragment>
        </Dialog>
    </>
};

export default PuestoAdd;
