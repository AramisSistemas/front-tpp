import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { default as React, useEffect, Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AddEsquemas } from '../redux/compositionsducks'; 
import { Dropdown } from 'primereact/dropdown';
import { messageService } from '../redux/messagesducks';
import { CompositionService } from '../service/CompositionService';

const TurnosAdd = () => {
    const compositionService = new CompositionService();
    const activo = useSelector(store => store.users.activo);

    const [model, setModel] = useState([]);
    const [display, setDisplay] = useState(false);
    const [esquemas, setEsquemas] = useState([]);

    const dispatch = useDispatch()

    const fetchEsquemas = async () => {
        await compositionService.getEsquemas().then(data => {
            setEsquemas(data);
        }).catch((error) => dispatch(messageService(false, error.response.data.message, error.response.status)));

    }

    const onSubmit = (e) => {
        e.preventDefault();
        let data = { ...model };
        dispatch(AddTurno(data));
        setModel([]);
        setDisplay(false);
    }

    const actualizarModel = (nombre, valor) => {
        let _model = { ...model };
        _model[`${nombre}`] = valor;
        setModel(_model);
    }

    useEffect(() => {
        if (activo & display) {
            fetchEsquemas();
        }
    }, [activo, display]);

    return <>
        <Button icon="pi pi-plus" label="Turnos" onClick={() => setDisplay(true)} className="p-button-info"></Button>
        <Dialog header="Turnos" className="card p-fluid" visible={display} style={{ width: '30vw' }} modal onHide={() => setDisplay(false)}>
            <Fragment>
                <form className="field grid" onSubmit={onSubmit}>
                    <div className="formgroup-inline">
                        <div className="field col-12"  >
                            <label htmlFor="detalle" className="p-sr-only">Nombre Esquema</label>
                            <InputText type="text" placeholder="Nombre Esquema" onChange={(e) => actualizarModel("detalle", e.target.value)}
                                required />
                        </div>
                        <div className="field col-12">
                            <h5>Puerto</h5>
                            <Dropdown name="puerto" onChange={(e) => actualizarModel('puerto', e.target.value)} value={model.puerto} options={ciudades} optionValue="id" optionLabel="detalle" placeholder="Ciudad"
                                filter showClear filterBy="detalle" required autoFocus />
                        </div>
                        <Button label="Registro"></Button>
                    </div>
                </form>
            </Fragment>
        </Dialog>
    </>
};

export default TurnosAdd;
