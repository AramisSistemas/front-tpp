import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputMask } from 'primereact/inputmask';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { default as React, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { add } from '../redux/clientesducks';
import { messageService } from '../redux/messagesducks';
import { addEmpleado } from '../redux/empleadosducks';
import { EmpleadoService } from '../service/EmpleadoService';

const EmpleadoAdd = () => {
    const empleadoService = new EmpleadoService();

    const activo = useSelector(store => store.users.activo); 

    const toast = useRef(null);
    const [model, setmodel] = useState([]);
    const [display, setdisplay] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [sexos, setSexos] = useState([]);
    const [ciudades, setCiudades] = useState([]);
    const dispatch = useDispatch()

    let modelAdd = {
        cuil: 0,
        nombre: '',
        cbu: '',
        cuilCbu: 0,
        sexo: null,
        ciudad: null
    };

    const generos = [
        { id: 'F', detalle: 'Femenino' },
        { id: 'M', detalle: 'Masculino' }
    ];

    const fetchAuxiliares = async () => {
        await empleadoService.getCiudades().then(
            data => { setCiudades(data) })
            .catch((error) => dispatch(messageService(false, error.response.data.message, error.response.status)));
        setSexos(generos);
    }

    const onSubmit = () => {
        setSubmitted(true);
        if (model.nombre.trim() &&
            model.cuil > 0 &&
            model.sexo &&
            model.ciudad
        ) {
            dispatch(addEmpleado(model));
            setSubmitted(false);
            setdisplay(false);
            setmodel(modelAdd);

        } else {
            toast.current.show({ severity: 'error', summary: 'Verificar', detail: 'Complete los datos Faltantes', life: 3000 });
        }
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _model = { ...model };
        _model[`${name}`] = val;
        setmodel(_model);

    }

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _model = { ...model };
        _model[`${name}`] = val;
        setmodel(_model);
    }


    useEffect(() => {
        if (activo) {
            setmodel(modelAdd);
            fetchAuxiliares();
        }
    }, [activo]);


    const empleadoDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={() => setdisplay(false)} />
            <Button label="Alta" icon="pi pi-check" className="p-button-text" onClick={() => onSubmit()} />
        </React.Fragment>
    );

    return <>
        <Button icon="pi pi-user-plus" label={'Alta'} className="p-button-rounded" onClick={() => setdisplay(true)} />
        <Toast ref={toast} />
        <Dialog header="Nuevo Empleado" className="p-fluid" visible={display} style={{ width: '50vw' }} modal onHide={() => setdisplay(false)} footer={empleadoDialogFooter} >
            <div className="field grid">
                <div className="field col-3">
                    <br></br>
                    <label htmlFor="cuil">Cuil</label>
                    <InputNumber id="cuil" value={model.cuil} onChange={(e) => onInputNumberChange(e, 'cuil')} integeronly useGrouping={false} required autoFocus className={classNames({ 'p-invalid': submitted && !model.cuil })} />
                    {submitted && !model.cuil && <small className="p-error">Cuil es requerido.</small>}
                </div>
                <div className="field col-9">
                    <br></br>
                    <label htmlFor="nombre">Nombre</label>
                    <InputText id="nombre" value={model.nombre} onChange={(e) => onInputChange(e, 'nombre')} required autoFocus className={classNames({ 'p-invalid': submitted && !model.nombre })} />
                    {submitted && !model.nombre && <small className="p-error">Nombre es requerido.</small>}
                </div>
                <div className="field col-6">
                    <label htmlFor="cbu">Cbu</label>
                    <InputText id="cbu" value={model.cbu} onChange={(e) => onInputChange(e, 'cbu')} required autoFocus className={classNames({ 'p-invalid': submitted && !model.cbu })} />
                    {submitted && !model.cbu && <small className="p-error">Cbu es requerido.</small>}
                </div>
                <div className="field col-6">
                    <label htmlFor="cuilCbu">Cuil de la cuenta</label>
                    <InputNumber id="cuilCbu" value={model.cuilCbu} onChange={(e) => onInputNumberChange(e, 'cuilCbu')} integeronly useGrouping={false} required autoFocus className={classNames({ 'p-invalid': submitted && !model.cuilCbu })} />
                    {submitted && !model.cuilCbu && <small className="p-error">Cuil es requerido.</small>}
                </div>
                <div className="field col-6">
                    <label htmlFor="ciudad">Ciudad-Puerto</label>
                    <Dropdown name="ciudad" onChange={(e) => onInputChange(e, 'ciudad')} value={model.ciudad} options={ciudades} optionValue="id" optionLabel="detalle" placeholder="Ciudad"
                        filter showClear filterBy="detalle" required autoFocus className={classNames({ 'p-invalid': submitted && !model.ciudad })} />
                    {submitted && !model.ciudad && <small className="p-error">Ciudad es requerido.</small>}
                </div>
                <div className="field col-6">
                    <label htmlFor="sexo">Genero</label>
                    <Dropdown name="sexo" onChange={(e) => onInputChange(e, 'sexo')} value={model.sexo} options={sexos} optionValue="id" optionLabel="detalle" placeholder="Genero"
                        filter showClear filterBy="detalle" required autoFocus className={classNames({ 'p-invalid': submitted && !model.sexo })} />
                    {submitted && !model.sexo && <small className="p-error">Genero es requerido.</small>}
                </div>
            </div>
        </Dialog>
    </>
};

export default EmpleadoAdd;
