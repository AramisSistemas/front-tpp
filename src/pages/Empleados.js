import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { InputText } from 'primereact/inputtext';
import { Skeleton } from 'primereact/skeleton';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { default as React, Fragment, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EmpleadoAdd from '../components/EmpleadoAdd';
import { actualizarEmpleado, addEmbargo, eliminarEmpleado } from '../redux/empleadosducks';
import { messageService } from '../redux/messagesducks';
import { EmpleadoService } from '../service/EmpleadoService';

const Empleados = () => {
    const dispatch = useDispatch();

    const empleadoService = new EmpleadoService();

    const activo = useSelector(store => store.users.activo);    
    const load = useSelector(store => store.empleados.loading);
    const toast = useRef(null);

    const [oSociales, setOsociales] = useState({ id: null, detalle: null });
    const [ciudades, setciudades] = useState({ id: null, detalle: null });
    const [empleados, setEmpleados] = useState([]);
    const [empleadomodel, setEmpleadomodel] = useState([]);
    const [embargomodel, setEmbargomodel] = useState([]);
    const [displayupdate, setDisplayupdate] = useState(false);
    const [displayembargo, setDisplayembargo] = useState(false);
    const [loadingEmpleados, setLoadingEmpleados] = useState(true);
    const [empleadosFilter, setEmpleadosFilter] = useState(null);

    const fetchEmpleados = async () => {
        setLoadingEmpleados(true);
        await empleadoService.getAll(true).then(data => { setEmpleados(data); setLoadingEmpleados(false) }).catch((error) => dispatch(messageService(false, error.response.data.message, error.response.status)));
    }

    const fetchOsociales = async () => {
        await empleadoService.getOSociales().then(data => { setOsociales(data) }).catch((error) => dispatch(messageService(false, error.response.data.message, error.response.status)));
    }

    const fetchCiudades = async () => {
        await empleadoService.getCiudades().then(data => { setciudades(data) }).catch((error) => dispatch(messageService(false, error.response.data.message, error.response.status)));
    }

    const onsubmitDelete = (data) => {
        dispatch(eliminarEmpleado(data));
    }

    const onSubmitPreUpdate = (rowData) => {
        setEmpleadomodel(rowData);
        setDisplayupdate(true);
    }

    const onSubmitPreEmbargo = (rowData) => {
        var date = new Date();
        var _embargomodel = {
            id: rowData.id,
            cuil: rowData.cuil,
            nombre: rowData.nombre,
            anticipo: false,
            monto: 0,
            total: 0,
            fin: date,
            permanente: false,
            concepto: ''
        }
        setEmbargomodel(_embargomodel);
        setDisplayembargo(true);
    }

    const actualizarDatosEmpleado = (nombre, valor) => {
        if (nombre === 'ingreso' || nombre === 'nacimiento') { 
            valor = valor.toDateString();
        }
        let _empleadomodel = { ...empleadomodel };
        _empleadomodel[`${nombre}`] = valor;
        setEmpleadomodel(_empleadomodel);
    }

    const actualizarDatosEmbargo = (nombre, valor) => {
        if (nombre === 'fin') {
            valor = valor.toDateString();
        }
        if (nombre === 'monto' && valor > 50) {
            toast.current.show({ severity: 'warn', summary: 'Verifique', detail: 'No puede descontarse mas del 50%', life: 3000 });
            valor = 50;
        }
        if (nombre === 'concepto' && valor.length > 30) {
            toast.current.show({ severity: 'warn', summary: 'Verifique', detail: 'No mas de 30 Caracteres', life: 3000 });
            valor = valor.substring(0, 30);
        }

        let _embargomodel = { ...embargomodel };
        if (nombre === 'permanente' && valor === true) {
            _embargomodel['total'] = '1000000';
        }
        if (nombre === 'anticipo' && valor === true) {
            _embargomodel['concepto'] = 'Anticipo';
        }
        _embargomodel[`${nombre}`] = valor;
        setEmbargomodel(_embargomodel);

    }

    const onSubmitEmbargo = (e) => {
        e.preventDefault()
        let data = { ...embargomodel };
        dispatch(addEmbargo(data));
        // limpiar campos
        setEmbargomodel([]);
        setDisplayembargo(false);
    }

    const onSubmitUpdate = (e) => {
        e.preventDefault()
        let data = { ...empleadomodel };
        dispatch(actualizarEmpleado(data));
        // limpiar campos
        setEmpleadomodel([]);
        setDisplayupdate(false);
        fetchEmpleados();
    }

    const activoBodyTemplate = (rowData) => {
        return <i className={classNames('pi', { 'text-green-500 pi-check-circle': rowData.activo, 'text-pink-500 pi-times-circle': !rowData.activo })}></i>;
    }

    const actionEmpleadoBodyTemplate = (rowData) => {
        return (<>
            <Button icon="pi pi-user-edit" className="p-button-rounded p-button-info p-button-text mr-2 mb-2" onClick={() => onSubmitPreUpdate(rowData)} />
            <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-text mr-2 mb-2" onClick={() => { onsubmitDelete(rowData.id) }} />
            <Button icon="pi pi-dollar" className="p-button-rounded p-button-success p-button-text mr-2 mb-2" onClick={() => { onSubmitPreEmbargo(rowData) }} />
        </>
        )
    }

    const headerEmpleados = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <EmpleadoAdd></EmpleadoAdd>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setEmpleadosFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    useEffect(() => {
        if (activo) {
            fetchEmpleados();
        }
    }, [setEmpleados, activo]);

    useEffect(() => {
        if (activo) {
            fetchOsociales();
            fetchCiudades();
        }
    }, [setOsociales, activo]);

    useEffect(() => {
        if (!load) {
            fetchEmpleados();
        } 
    }, [load]);

    return (
        activo ? (
            <div className="col-12">
                <div className="card">
                    <h5>Empleados</h5>
                    <DataTable value={empleados} dataKey="id" loading={loadingEmpleados}
                        paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} empleados"
                        globalFilter={empleadosFilter} emptyMessage="Sin Datos." header={headerEmpleados} responsiveLayout="scroll">
                        <Column field="nombre" header="Nombre" sortable />
                        <Column field="cuil" header="Cuil" sortable />
                        <Column field="cbu" header="CBU" sortable />
                        <Column field="cuilCbu" header="Cuil-CBU" sortable />
                        <Column field="activo" header="Activo" sortable body={activoBodyTemplate} />
                        <Column headerStyle={{ width: '4rem' }} body={actionEmpleadoBodyTemplate}></Column>
                    </DataTable>
                    {empleadomodel ? (<Dialog header="Actualizar Empleado" className="card p-fluid" visible={displayupdate} style={{ width: '50vw' }} position="top" modal onHide={() => setDisplayupdate(false)}>
                        <Fragment>
                            <form className="field grid" onSubmit={onSubmitUpdate}>
                                <input hidden readOnly value={empleadomodel.id} />
                                <input hidden readOnly value={empleadomodel.sexo} />
                                <div className="formgroup-inline">
                                    <h5>Nombre</h5>
                                    <div className="field col-12"  >
                                        <label htmlFor="nombre" className="p-sr-only">Nombre</label>
                                        <InputText type="text" value={empleadomodel.nombre} placeholder="Nombre" onChange={(e) => actualizarDatosEmpleado("nombre", e.target.value)} />
                                    </div>
                                    <div className="field col-3"  >
                                        <h5>Cuil</h5>
                                        <label htmlFor="cuil" className="p-sr-only">Cuil</label>
                                        <InputText type="number" placeholder="Cuil" value={empleadomodel.cuil} readOnly />
                                    </div>
                                    <div className="field col-5">
                                        <h5>CBU</h5>
                                        <label htmlFor="cbu" className="p-sr-only">CBU</label>
                                        <InputText type="text" value={empleadomodel.cbu} placeholder="CBU" onChange={(e) => actualizarDatosEmpleado("cbu", e.target.value)} />
                                    </div>
                                    <div className="field col-3"  >
                                        <h5>Cuil-CBU</h5>
                                        <label htmlFor="cuilCbu" className="p-sr-only">Cuil-CBU</label>
                                        <InputText type="number" placeholder="Cuil-CBU" value={empleadomodel.cuilCbu} onChange={(e) => actualizarDatosEmpleado("cuilCbu", e.target.value)} />
                                    </div>
                                    <div className="field col-8"  >
                                        <h5>Domicilio</h5>
                                        <label htmlFor="domicilio" className="p-sr-only">Domicilio</label>
                                        <InputText type="text" placeholder="Domicilio" value={empleadomodel.domicilio} onChange={(e) => actualizarDatosEmpleado("domicilio", e.target.value)} />
                                    </div>
                                    <div className="field col-3"  >
                                        <h5>Telefono</h5>
                                        <label htmlFor="telefono" className="p-sr-only">Telefono</label>
                                        <InputText type="text" placeholder="Telefono" value={empleadomodel.telefono} onChange={(e) => actualizarDatosEmpleado("telefono", e.target.value)} />
                                    </div>                                  
                                    <div className="field col-2">
                                        <h5>Activo</h5>
                                        <InputSwitch checked={empleadomodel.activo} onChange={(e) => actualizarDatosEmpleado("activo", e.value)} />
                                    </div>
                                    <div className="field col-2">
                                        <h5>Conyuge</h5>
                                        <InputSwitch checked={empleadomodel.conyuge} onChange={(e) => actualizarDatosEmpleado("conyuge", e.value)} />
                                    </div>
                                    <div className="field col-2"  >
                                        <h5>Hijos</h5>
                                        <label htmlFor="hijos" className="p-sr-only">Hijos</label>
                                        <InputText type="number" placeholder="Hijos" value={empleadomodel.hijos} onChange={(e) => actualizarDatosEmpleado("hijos", e.target.value)} />
                                    </div>
                                    <div className="field col-4"  >
                                        <h5>Ciudad</h5>
                                         <Dropdown name="ciudad" onChange={(e) => actualizarDatosEmpleado("ciudad", e.value)} value={empleadomodel.ciudad} options={ciudades} optionValue="id" optionLabel="detalle" placeholder="Ciudad"
                                            filter showClear filterBy="detalle" />     </div>
                                    <div className="field col-12">
                                        <h5>Obra Social</h5>
                                        <Dropdown name="oSocial" onChange={(e) => actualizarDatosEmpleado("oSocial", e.value)} value={empleadomodel.oSocial} options={oSociales} optionValue="id" optionLabel="detalle" placeholder="Obra Social"
                                            filter showClear filterBy="detalle" />
                                    </div>

                                    <div className="field col-4">
                                        <h5>Nacimiento</h5>
                                        <label htmlFor="nacimiento" className="p-sr-only">Nacimiento</label>
                                        <Calendar name="nacimiento" value={empleadomodel.nacimiento} showIcon showButtonBar dateFormat='dd/mm/yy'
                                            onChange={(e) => actualizarDatosEmpleado("nacimiento", e.value)} />
                                    </div>

                                    <div className="field col-4">
                                        <h5>Ingreso</h5>
                                        <label htmlFor="ingreso" className="p-sr-only">Ingreso</label>
                                        <Calendar name="ingreso" value={empleadomodel.ingreso} showIcon showButtonBar dateFormat='dd/mm/yy'
                                            onChange={(e) => actualizarDatosEmpleado("ingreso", e.value)} />
                                    </div>
                                    <Button label="Actualizar"></Button>
                                </div>
                            </form>
                        </Fragment>
                    </Dialog>) : <></>}
                    {embargomodel ? (<Dialog header="Embargos - Anticipos" className="card p-fluid" visible={displayembargo} style={{ width: '30vw' }} position="left" modal onHide={() => setDisplayembargo(false)}>
                        <Fragment>
                            <form className="field grid" onSubmit={onSubmitEmbargo}>
                                <input hidden readOnly value={embargomodel.id} />
                                <div className="formgroup-inline">
                                    <h5>Nombre</h5>
                                    <div className="field col-12"  >
                                        <label htmlFor="nombre" className="p-sr-only">Nombre</label>
                                        <InputText type="text" value={embargomodel.nombre} placeholder="Nombre" readOnly />
                                    </div>
                                    <div className="field col-5"  >
                                        <h5>Cuil</h5>
                                        <label htmlFor="cuil" className="p-sr-only">Cuil</label>
                                        <InputText type="number" placeholder="Cuil" value={embargomodel.cuil} readOnly />
                                    </div>

                                    <div className="field col-12"  >
                                        <h5>Concepto</h5>
                                        <label htmlFor="concepto" className="p-sr-only">Concepto</label>
                                        <InputText type="text" value={embargomodel.concepto} placeholder="Concepto" onChange={(e) => actualizarDatosEmbargo("concepto", e.target.value)} />
                                    </div>
                                    <div className="field col-5">
                                        <h5>% Descuento</h5>
                                        <label htmlFor="monto" className="p-sr-only">% Descuento</label>
                                        <InputText type="number" value={embargomodel.monto} placeholder="% Descuento" onChange={(e) => actualizarDatosEmbargo("monto", e.target.value)} />
                                    </div>
                                    <div className="field col-6"  >
                                        <h5>Total</h5>
                                        <label htmlFor="total" className="p-sr-only">Total</label>
                                        <InputText type="number" placeholder="Total" value={embargomodel.total} onChange={(e) => actualizarDatosEmbargo("total", e.target.value)} />
                                    </div>
                                    <div className="field col-3">
                                        <h5>Permanente</h5>
                                        <InputSwitch checked={embargomodel.permanente} onChange={(e) => { actualizarDatosEmbargo("permanente", e.value) }} />
                                    </div>
                                    <div className="field col-3">
                                        <h5>Anticipo</h5>
                                        <InputSwitch checked={embargomodel.anticipo} onChange={(e) => { actualizarDatosEmbargo("anticipo", e.value) }} />
                                    </div>
                                    <div className="field col-8">
                                        <h5>Finaliza</h5>
                                        <label htmlFor="fin" className="p-sr-only">Finaliza</label>
                                        <Calendar name="fin" value={embargomodel.fin} showIcon showButtonBar dateFormat='dd/mm/yy'
                                            onChange={(e) => actualizarDatosEmbargo("fin", e.value)} />
                                    </div>
                                    <Button label="Alta"></Button>
                                </div>
                            </form>
                        </Fragment>
                    </Dialog>) : <></>}
                    <Toast ref={toast} />
                </div>
            </div>
        ) : (<div className="card">
            <h4>Requiere Autenticación</h4>
            <div className="border-round border-1 surface-border p-4">
                <div className="flex mb-3">
                    <Skeleton shape="circle" size="4rem" className="mr-2"></Skeleton>
                    <div>
                        <Skeleton width="10rem" className="mb-2"></Skeleton>
                        <Skeleton width="5rem" className="mb-2"></Skeleton>
                        <Skeleton height=".5rem"></Skeleton>
                    </div>
                </div>
                <Skeleton width="100%" height="150px"></Skeleton>
                <div className="flex justify-content-between mt-3">
                    <Skeleton width="4rem" height="2rem"></Skeleton>
                    <Skeleton width="4rem" height="2rem"></Skeleton>
                </div>
            </div>
        </div>)
    )
}


const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Empleados, comparisonFn);  