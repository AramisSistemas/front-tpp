import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { default as React, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { messageService } from '../redux/messagesducks';
import { AddOperacion } from '../redux/operationsducks';
import { CompositionService } from '../service/CompositionService';
import { CustomerService } from '../service/CustomerService';
import { Calendar } from 'primereact/calendar';

const OperationAdd = () => {

    let operacionModel = {
        inicio: '',
        destino: null,
        cliente: null,
        esquema: null
    };

    const toast = useRef(null);
    const activo = useSelector(store => store.users.activo);
    const [model, setModel] = useState([]);
    const [display, setdisplay] = useState(false);
    const [destinos, setdestinos] = useState([]);
    const [clientes, setclientes] = useState([]);
    const [esquemas, setesquemas] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const compositionService = new CompositionService();
    const customerService = new CustomerService();

    const dispatch = useDispatch()

    const fetchAuxiliares = async () => {
        await compositionService.getEsquemas()
            .then(data => {
                setesquemas(data);
            }).catch((error) => dispatch(messageService(false, error.response.data.message, error.response.status)));
        await customerService.GetClientes()
            .then(data => {
                setclientes(data);
            }).catch((error) => dispatch(messageService(false, error.response.data.message, error.response.status)));
        await customerService.GetDestinos()
            .then(data => {
                setdestinos(data);
            }).catch((error) => dispatch(messageService(false, error.response.data.message, error.response.status)));
    }

    useEffect(() => {
        if (activo & display) {
            fetchAuxiliares();
            setModel(operacionModel);
            setSubmitted(false);
        }
    }, [activo, display]);

    const onSubmit = () => {
        setSubmitted(true);
        if (
            model.destino &&
            model.cliente
        ) {
            dispatch(AddOperacion(model));
            setSubmitted(false);
            setdisplay(false);
        } else {
            toast.current.show({ severity: 'error', summary: 'Verificar', detail: 'Complete los datos Faltantes', life: 3000 });
        }
    }

    const onInputChange = (e, name) => {
        if (name === 'inicio') {
            e.target.value = e.target.value.toDateString();
        }
        const val = (e.target && e.target.value) || '';
        let _model = { ...model };
        _model[`${name}`] = val;
        setModel(_model);
        console.log(_model)
    }

    const dialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={() => setdisplay(false)} />
            <Button label="Alta" icon="pi pi-check" className="p-button-text" onClick={() => onSubmit()} />
        </React.Fragment>
    );
    return <>
        <Toast ref={toast} />
        <Button icon="pi pi-plus" label="Operacion" onClick={() => setdisplay(true)} className="p-button-help"></Button>
        <Dialog header="Nueva Operación" className="p-fluid" visible={display} style={{ width: '50vw' }} modal onHide={() => setdisplay(false)} footer={dialogFooter} >
            <div className="field grid">
                <div className="field col-6">
                    <br></br>
                    <label htmlFor="inicio">Inicio</label>
                    <Calendar name="inicio" value={model.inicio} showIcon showButtonBar dateFormat='dd/mm/yy'
                        onChange={(e) => onInputChange(e, 'inicio')} />
                    {submitted && !model.inicio && <small className="p-error">Inicio es requerido.</small>}
                </div>
                <div className="field col-6">
                    <br></br>
                    <label htmlFor="esquema">Esquema</label>
                    <Dropdown name="esquema" onChange={(e) => onInputChange(e, 'esquema')} value={model.esquema} options={esquemas} optionValue="id" optionLabel="detalle" placeholder="Esquema"
                        filter showClear filterBy="detalle" required autoFocus className={classNames({ 'p-invalid': submitted && !model.esquema })} />
                    {submitted && !model.esquema && <small className="p-error">Esquema es requerido.</small>}
                </div>
                <div className="field col-6">
                    <label htmlFor="destino">Ubicacion</label>
                    <Dropdown name="destino" onChange={(e) => onInputChange(e, 'destino')} value={model.destino} options={destinos} optionValue="id" optionLabel="detalle" placeholder="Destino"
                        filter showClear filterBy="detalle" required autoFocus className={classNames({ 'p-invalid': submitted && !model.destino })} />
                    {submitted && !model.destino && <small className="p-error">Destino es requerido.</small>}
                </div>
                <div className="field col-6">
                    <label htmlFor="cliente">Cliente</label>
                    <Dropdown name="cliente" onChange={(e) => onInputChange(e, 'cliente')} value={model.cliente} options={clientes} optionValue="id" optionLabel="nombre" placeholder="Cliente"
                        filter showClear filterBy="nombre" required autoFocus className={classNames({ 'p-invalid': submitted && !model.cliente })} />
                    {submitted && !model.cliente && <small className="p-error">Cliente es requerido.</small>}
                </div>
            </div>
        </Dialog>
    </>
};

export default OperationAdd;
