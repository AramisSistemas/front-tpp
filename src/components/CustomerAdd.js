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
import { CustomerService } from '../service/CustomerService';

const CustomerAdd = () => {
    const activo = useSelector(store => store.users.activo);
    const perfil = useSelector(store => store.users.perfil);

    const dispatch = useDispatch()
    const customerService = new CustomerService();

    const toast = useRef(null);
    const [model, setmodel] = useState([]);
    const [display, setdisplay] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [generos, setGeneros] = useState([]);
    const [imputaciones, setImputaciones] = useState([]);
    const [responsabilidades, setResponsabilidades] = useState([]);

    let modelAdd = {
        cuit: 0,
        responsabilidad: null,
        genero: null,
        imputacion: null,
        nombre: '',
        domicilio: '',
        telefono: '',
        mail: '',
        limiteSaldo: 0,
        observaciones: ''
    };

    const fetchAuxiliares = async () => {
        await customerService.GetGeneros().then(
            data => { setGeneros(data) })
            .catch((error) => dispatch(messageService(false, error.response.data.message, error.response.status)));
        await customerService.GetResponsabilidades().then(
            data => { setResponsabilidades(data) })
            .catch((error) => dispatch(messageService(false, error.response.data.message, error.response.status)));
        await customerService.GetImputaciones().then(
            data => { setImputaciones(data) })
            .catch((error) => dispatch(messageService(false, error.response.data.message, error.response.status)));
    }


    const onSubmit = () => {
        setSubmitted(true);
        if (model.nombre.trim() &&
            model.cuit > 0 &&
            model.responsabilidad &&
            model.genero &&
            model.imputacion &&
            model.telefono.trim()&&
            model.mail.trim()
        ) {
            dispatch(add(model));
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
        if (activo && perfil > 1) {
            setmodel(modelAdd);
            fetchAuxiliares();
        }
    }, [activo, perfil]);

    const clienteDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={() => setdisplay(false)} />
            <Button label="Alta" icon="pi pi-check" className="p-button-text" onClick={() => onSubmit()} />
        </React.Fragment>
    );

    return <>
        <Button icon="pi pi-user-plus" label={'Alta'} className="p-button-rounded" onClick={() => setdisplay(true)} />
        <Toast ref={toast} />
        <Dialog header="Nuevo Cliente" className="p-fluid" visible={display} style={{ width: '50vw' }} modal onHide={() => setdisplay(false)} footer={clienteDialogFooter} >
            <div className="field grid">
                <div className="field col-3">
                    <br></br>
                    <label htmlFor="cuit">Cuit</label>
                    <InputNumber id="cuit" value={model.cuit} onChange={(e) => onInputNumberChange(e, 'cuit')} integeronly useGrouping={false} required autoFocus className={classNames({ 'p-invalid': submitted && !model.cuit })} />
                    {submitted && !model.cuit && <small className="p-error">Cuit es requerido.</small>}
                </div>
                <div className="field col-9">
                    <br></br>
                    <label htmlFor="nombre">Nombre</label>
                    <InputText id="nombre" value={model.nombre} onChange={(e) => onInputChange(e, 'nombre')} required autoFocus className={classNames({ 'p-invalid': submitted && !model.detalle })} />
                    {submitted && !model.detalle && <small className="p-error">Detalle es requerido.</small>}
                </div>
                <div className="field col-4">
                    <label htmlFor="responsabilidad">Iva</label>
                    <Dropdown name="responsabilidad" onChange={(e) => onInputChange(e, 'responsabilidad')} value={model.responsabilidad} options={responsabilidades} optionValue="id" optionLabel="id" placeholder="Responsabilidad"
                        filter showClear filterBy="id" required autoFocus className={classNames({ 'p-invalid': submitted && !model.responsabilidad })} />
                    {submitted && !model.responsabilidad && <small className="p-error">Responsabilidad es requerido.</small>}
                </div>
                <div className="field col-4">
                    <label htmlFor="genero">Genero</label>
                    <Dropdown name="genero" onChange={(e) => onInputChange(e, 'genero')} value={model.genero} options={generos} optionValue="id" optionLabel="id" placeholder="Genero"
                        filter showClear filterBy="id" required autoFocus className={classNames({ 'p-invalid': submitted && !model.genero })} />
                    {submitted && !model.genero && <small className="p-error">Genero es requerido.</small>}
                </div>
                <div className="field col-4">
                    <label htmlFor="imputacion">Imputacion</label>
                    <Dropdown name="imputacion" onChange={(e) => onInputChange(e, 'imputacion')} value={model.imputacion} options={imputaciones} optionValue="id" optionLabel="id" placeholder="Imputacion"
                        filter showClear filterBy="id" required autoFocus className={classNames({ 'p-invalid': submitted && !model.imputacion })} />
                    {submitted && !model.imputacion && <small className="p-error">Imputacion es requerido.</small>}
                </div>
                <div className="field col-8">
                    <label htmlFor="domicilio">Domicilio</label>
                    <InputText id="domicilio" value={model.domicilio} onChange={(e) => onInputChange(e, 'domicilio')} required autoFocus className={classNames({ 'p-invalid': submitted && !model.domicilio })} />
                    {submitted && !model.domicilio && <small className="p-error">Domicilio es requerido.</small>}
                </div>
                <div className="field col-4 md:col-4">
                    <label htmlFor="telefono">Telefono</label>
                    <InputMask id="telefono" mask="(999) 999-9999" value={model.telefono} placeholder="(999) 999-9999" onChange={(e) => onInputChange(e, 'telefono')} required autoFocus className={classNames({ 'p-invalid': submitted && !model.telefono })} />
                    {submitted && !model.telefono && <small className="p-error">Telefono es requerido.</small>}
                </div>
                <div className="field col-8">
                    <label htmlFor="mail">Mail</label>
                    <InputText type="email" id="mail" value={model.mail} onChange={(e) => onInputChange(e, 'mail')} required autoFocus className={classNames({ 'p-invalid': submitted && !model.mail })} />
                    {submitted && !model.mail && <small className="p-error">Mail es requerido.</small>}
                </div>
                <div className="field col-4">
                    <label htmlFor="limiteSaldo">Saldo Limite</label>
                    <InputNumber id="limiteSaldo" value={model.limiteSaldo} onChange={(e) => onInputNumberChange(e, 'limiteSaldo')} mode="currency" currency="USD" locale="en-US" />
                </div>
                <div className="field col-8">
                    <label htmlFor="observaciones">Observaciones</label>
                    <InputTextarea id="observaciones" value={model.observaciones} onChange={(e) => onInputChange(e, 'observaciones')} />
                </div>
            </div>
        </Dialog>
    </>
}

export default CustomerAdd;
