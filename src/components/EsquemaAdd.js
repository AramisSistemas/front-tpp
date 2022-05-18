import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { default as React, useEffect, Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AddEsquemas } from '../redux/compositionsducks';
import { EmpleadoService } from '../service/EmpleadoService';
import { Dropdown } from 'primereact/dropdown';
import { messageService } from '../redux/messagesducks';

const EsquemaAdd = () => {
    const empleadoService = new EmpleadoService();
    const activo = useSelector(store => store.users.activo);

    const [model, setModel] = useState([]);
    const [display, setDisplay] = useState(false);
    const [ciudades, setCiudades] = useState([]);

    const dispatch = useDispatch()

    const fetchCiudades = async () => {
        await empleadoService.getCiudades().then(data => {
            setCiudades(data);
        }).catch((error) => dispatch(messageService(false, error.response.data.message, error.response.status)));

    }

    const onSubmit = (e) => {
        e.preventDefault();
        let data = { ...model };
        dispatch(AddEsquemas(data));
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
            fetchCiudades();
        }
    }, [activo, display]);

    return <>
        <button className="p-link layout-topbar-button" onClick={() => setDisplay(true)}>
            <i className="pi pi-plus" />
            <span>Agregar</span>
        </button>

        <Dialog header="Esquemas" className="card p-fluid" visible={display} style={{ width: '30vw' }} modal onHide={() => setDisplay(false)}>
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

export default EsquemaAdd;
