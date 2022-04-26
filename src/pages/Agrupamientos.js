import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { confirmDialog } from 'primereact/confirmdialog';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputSwitch } from 'primereact/inputswitch';
import { InputText } from 'primereact/inputtext';
import { Sidebar } from 'primereact/sidebar';
import { Skeleton } from 'primereact/skeleton';
import { SplitButton } from 'primereact/splitbutton';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { default as React, Fragment, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AgrupamientoAdd from '../components/AgrupamientoAdd';
import { CompositionJornalesDelete, CompositionJornalesInsert, CompositionJornalesUpdate, DeleteAgrupamiento, UpdateAgrupamiento } from '../redux/compositionsducks';
import { messageService } from '../redux/messagesducks';
import { logout } from '../redux/usersducks';
import { CompositionService } from '../service/CompositionService';
const Agrupamientos = () => {

    const dispatch = useDispatch();

    const compositionService = new CompositionService();

    const activo = useSelector(store => store.users.activo);
    const perfil = useSelector(store => store.users.perfil);
    const toast = useRef(null);
    const dt = useRef(null);

    //llenado de tablas activas
    const [agrupamientos, setAgrupamientos] = useState([]);
    const [agrupamientosFilter, setAgrupamientosFilter] = useState(null);
    const [model, setModel] = useState([]);
    const [modelConcepto, setModelConcepto] = useState([]);
    const [editar, setEditar] = useState(false);
    const [eliminar, setEliminar] = useState(false);
    const [displayagrupamiento, setDisplayagrupamiento] = useState(false);
    const [displayconceptos, setDisplayconceptos] = useState(false);
    const [displayAltaconceptos, setDisplayAltaconceptos] = useState(false);
    const [compoJornales, setCompoJornales] = useState([]);
    const [conceptosJornales, setConceptosJornales] = useState([]);
    const [conceptosFilter, setConceptosFilter] = useState(null);
    const [selectedConceptos, setSelectedConceptos] = useState([]);
    const [loadingAg, setLoadingAg] = useState(true);
    const [loadingCj, setLoadingCj] = useState(true);

    const [expandedRows, setExpandedRows] = useState(null);

    const agrupamientosItems = [
        {
            label: 'Concepto',
            icon: 'pi pi-upload',
            command: () => { agregarConceptos() }
        },
        {
            label: 'Editar',
            icon: 'pi pi-pencil',
            command: () => { setDisplayagrupamiento(true) }
        },
        {
            label: 'Eliminar',
            icon: 'pi pi-trash',
            command: () => { confirmElimina() }
        },
        {
            label: 'Informes',
            icon: 'pi pi-chart-line'
        },
    ];

    const fetchAgrupamientos = async () => {
        setLoadingAg(true)
        await compositionService.getAgrupaciones().then(data => { setAgrupamientos(data) }).catch((error) => error.response.status === 401 ? dispatch(logout()) : dispatch(messageService(false, error.response.data.message, error.response.status)));
        setLoadingAg(false);
    }

    const fetchComposicionJornales = async () => {
        setLoadingCj(true)
        await compositionService.getCompoJornales(false).then(data => { setCompoJornales(data) }).catch((error) => error.response.status === 401 ? dispatch(logout()) : dispatch(messageService(false, error.response.data.message, error.response.status)));
        setLoadingCj(false);
    }

    const fetchConceptosJornales = async (agrupacion) => {
        await compositionService.GetConceptosJornales(agrupacion).then(data => { setConceptosJornales(data) }).catch((error) => error.response.status === 401 ? dispatch(logout()) : dispatch(messageService(false, error.response.data.message, error.response.status)));
    }

    const actualizarTablas = () => {
        let _expandedRows = expandedRows;
        collapseAll();
        fetchAgrupamientos();
        fetchComposicionJornales();
        setExpandedRows(_expandedRows);
    }

    const expandAll = () => {
        let _expandedRows = {};
        agrupamientos.forEach(p => _expandedRows[`${p.id}`] = true);
        setExpandedRows(_expandedRows);
    }

    const collapseAll = () => {
        setExpandedRows(null);
    }

    const confirmConceptos = () => {
        try {
            let lm = []
            selectedConceptos.forEach(c =>
                lm.push({
                    Agrupacion: model.id,
                    Codigo: c.codigo,
                    Concepto: c.concepto,
                    Monto: c.monto,
                    Fijo: c.fijo,
                    Haber: c.haber,
                    Remunerativo: c.remunerativo,
                    Sbasico: c.sbasico,
                    Sbruto: c.sbruto,
                    Sremun: c.sremun,
                    Obligatorio: c.obligatorio
                })
            );
            var json = JSON.stringify(lm);
            dispatch(CompositionJornalesInsert(json));
            actualizarTablas();
            setSelectedConceptos([]);
            fetchConceptosJornales(model.id);
            setDisplayconceptos(false);

        } catch (error) {
            messageService(true, error.message, 500)
        }
        toast.current.show({ severity: 'info', summary: 'Confirma', detail: 'En proceso...', life: 3000 });
    }

    const confirmElimina = () => {
        confirmDialog({
            message: 'Eliminaremos la Agrupación ' + model.detalle,
            header: 'Confirma Eliminacion',
            icon: 'pi pi-info-circle',
            position: 'top',
            accept,
            reject
        });
    };

    const accept = () => {
        try {
            dispatch(DeleteAgrupamiento(model.id));
            actualizarTablas();

        } catch (error) {
            messageService(true, error.message, 500)
        }
        toast.current.show({ severity: 'info', summary: 'Confirma', detail: 'En proceso...', life: 3000 });
    }

    const reject = () => {
        toast.current.show({ severity: 'info', summary: 'Anula', detail: 'Anulando...', life: 3000 });
    }

    const establecerDatosAgrupamiento = (dataRow) => {
        setModel(dataRow);
    }

    const agregarConceptos = () => {
        fetchConceptosJornales(model.id);
        setDisplayconceptos(true);
    }

    const altaConceptos = () => {
        setEditar(false);
        setModelConcepto({
            agrupacion: model.id,
            codigo: '',
            concepto: '',
            monto: 0,
            fijo: false,
            haber: false,
            remunerativo: false,
            sbasico: false,
            sbruto: false,
            sremun: false,
            obligatorio: false
        })
        setDisplayAltaconceptos(true);
    }

    const onSubmitAgrupamiento = (e) => {
        e.preventDefault()
        dispatch(UpdateAgrupamiento(model));
        e.target.reset();
        setDisplayagrupamiento(false);
        actualizarTablas();
    }

    const onSubmitAddConcepto = (e) => {
        e.preventDefault()
        try {
            let lm = []
            lm.push({
                Agrupacion: modelConcepto.agrupacion,
                Codigo: modelConcepto.codigo,
                Concepto: modelConcepto.concepto,
                Monto: modelConcepto.monto,
                Fijo: modelConcepto.fijo,
                Haber: modelConcepto.haber,
                Remunerativo: modelConcepto.remunerativo,
                Sbasico: modelConcepto.sbasico,
                Sbruto: modelConcepto.sbruto,
                Sremun: modelConcepto.sremun,
                Obligatorio: modelConcepto.obligatorio
            });
            var json = JSON.stringify(lm);
            dispatch(CompositionJornalesInsert(json));
            actualizarTablas();
            setSelectedConceptos([]);
            fetchConceptosJornales(model.id);
            setDisplayAltaconceptos(false);
        } catch (error) {
            messageService(true, error.message, 500)
        }
        toast.current.show({ severity: 'info', summary: 'Confirma', detail: 'En proceso...', life: 3000 });
    }

    const onSubmitEliminarConcepto = (e) => { 
        try {
            e.preventDefault();
            dispatch(CompositionJornalesDelete(modelConcepto.id));
            fetchConceptosJornales(modelConcepto.agrupacion);
            actualizarTablas();
            setEliminar(false);
        } catch (error) {
            messageService(true, error.message, 500)
        }
        toast.current.show({ severity: 'info', summary: 'Confirma', detail: 'En proceso...', life: 3000 });
    }

    const onSubmitUpdateConcepto = (e) => {
        try {
            e.preventDefault();
            dispatch(CompositionJornalesUpdate(modelConcepto));
            actualizarTablas();
            setSelectedConceptos([]);
            fetchConceptosJornales(modelConcepto.agrupacion);
            setDisplayAltaconceptos(false);
            setEditar(false);
        } catch (error) {
            messageService(true, error.message, 500)
        }
        toast.current.show({ severity: 'info', summary: 'Confirma', detail: 'En proceso...', life: 3000 });
    }

    const actualizarDatosAgrupamiento = (nombre, valor) => {
        let _data = { ...model };
        _data[`${nombre}`] = valor.toUpperCase();
        setModel(_data);
    }

    const actualizarDatosConcepto = (nombre, valor) => {
        if (nombre === 'codigo') {
            valor = valor.toUpperCase();
        }
        if (nombre === 'monto' && valor < 0) {
            toast.current.show({ severity: 'warn', summary: 'Verifique', detail: 'Siempre positivo', life: 3000 });
            valor = 0;
        }
        let _data = { ...modelConcepto };
        _data[`${nombre}`] = valor;
        setModelConcepto(_data);
    }

    const editarConcepto = (data) => {
        setEditar(true);
        setModelConcepto(data);
        setDisplayAltaconceptos(true);
    }

    const eliminarConcepto = (data) => {
        setModelConcepto(data);
        setEliminar(true);
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <Button icon="pi pi-plus" label="Ver Conceptos" onClick={expandAll} className="mr-2 mb-2" />
            <Button icon="pi pi-minus" label="Ocultar Conceptos" onClick={collapseAll} className="mb-2" />
            <AgrupamientoAdd></AgrupamientoAdd>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setAgrupamientosFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const headerConceptos = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setConceptosFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const headerConceptosJornales = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <Button onClick={() => confirmConceptos()} icon="pi pi-arrow-circle-right" label="Insertar Conceptos" className="p-button-help"></Button>
            <Button onClick={() => altaConceptos()} icon="pi pi-arrow-circle-up" label="Nuevo Concepto" className="p-button-success"></Button>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setConceptosFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const actionAgrupamientosBodyTemplate = (rowData) => {
        return <SplitButton icon="pi pi-cog" model={agrupamientosItems} menuStyle={{ width: '12rem' }} className="p-button-success mr-2 mb-2" onShow={() => establecerDatosAgrupamiento(rowData)} ></SplitButton>;
    }

    const actionConceptosBodyTemplate = (rowData) => {
        return (<>
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-text mr-2 mb-2" onClick={() => editarConcepto(rowData)} />
            <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-text mr-2 mb-2" onClick={() => eliminarConcepto(rowData)} />
        </>
        )
    }

    const fijoBodyTemplate = (rowData) => {
        return <i className={classNames('pi', { 'text-green-500 pi-check-circle': rowData.fijo, 'text-pink-500 pi-times-circle': !rowData.fijo })}></i>;
    }

    const haberBodyTemplate = (rowData) => {
        return <i className={classNames('pi', { 'text-green-500 pi-check-circle': rowData.haber, 'text-pink-500 pi-times-circle': !rowData.haber })}></i>;
    }

    const remunerativoBodyTemplate = (rowData) => {
        return <i className={classNames('pi', { 'text-green-500 pi-check-circle': rowData.remunerativo, 'text-pink-500 pi-times-circle': !rowData.remunerativo })}></i>;
    }

    const sbasicoBodyTemplate = (rowData) => {
        return <i className={classNames('pi', { 'text-green-500 pi-check-circle': rowData.sbasico, 'text-pink-500 pi-times-circle': !rowData.sbasico })}></i>;
    }

    const sbrutoBodyTemplate = (rowData) => {
        return <i className={classNames('pi', { 'text-green-500 pi-check-circle': rowData.sbruto, 'text-pink-500 pi-times-circle': !rowData.sbruto })}></i>;
    }

    const sremunBodyTemplate = (rowData) => {
        return <i className={classNames('pi', { 'text-green-500 pi-check-circle': rowData.sremun, 'text-pink-500 pi-times-circle': !rowData.sremun })}></i>;
    }

    const obligatorioBodyTemplate = (rowData) => {
        return <i className={classNames('pi', { 'text-green-500 pi-check-circle': rowData.obligatorio, 'text-pink-500 pi-times-circle': !rowData.obligatorio })}></i>;
    }

    const conceptosTemplate = (data) => {
        return (
            <div className="orders-subtable">
                <h5>Conceptos de {data.detalle}</h5>
                <DataTable value={compoJornales.filter(m => m.agrupacion === data.id)} responsiveLayout="scroll" header={headerConceptos} loading={loadingCj}
                    globalFilter={conceptosFilter} emptyMessage="Sin Datos." >
                    <Column field="codigo" header="Codigo" sortable></Column>
                    <Column field="concepto" header="Concepto" sortable></Column>
                    <Column field="monto" header="Monto" sortable ></Column>
                    <Column field="fijo" header="Fijo" sortable body={fijoBodyTemplate}></Column>
                    <Column field="haber" header="Haber" sortable body={haberBodyTemplate}></Column>
                    <Column field="remunerativo" header="Rem" sortable body={remunerativoBodyTemplate}></Column>
                    <Column field="sbasico" header="S/Bas." sortable body={sbasicoBodyTemplate}></Column>
                    <Column field="sbruto" header="S/Br" sortable body={sbrutoBodyTemplate}></Column>
                    <Column field="sremun" header="S/Re" sortable body={sremunBodyTemplate}></Column>
                    <Column field="obligatorio" header="Obl" sortable body={obligatorioBodyTemplate}></Column>
                    <Column headerStyle={{ width: '4rem' }} body={actionConceptosBodyTemplate}></Column>
                </DataTable>
            </div >
        );
    }

    useEffect(() => {
        if (activo && perfil> 2) {
            fetchAgrupamientos();
            fetchComposicionJornales();
        }
    }, [activo, perfil]);

    return (
        activo && perfil > 2 ? (
            <div className="col-12">
                <div className="card">
                    <h5>Agrupamientos</h5>
                    <DataTable value={agrupamientos} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)} responsiveLayout="scroll"
                        rowExpansionTemplate={conceptosTemplate} dataKey="id" header={header} loading={loadingAg} paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} agrupamientos"
                        globalFilter={agrupamientosFilter} emptyMessage="Sin Datos." >
                        <Column expander style={{ width: '3em' }} />
                        <Column field="detalle" header="Agrupación" sortable />
                        <Column headerStyle={{ width: '4rem' }} body={actionAgrupamientosBodyTemplate}></Column>
                    </DataTable>
                    {model ? (<Dialog header="Agrupamientos" className="card p-fluid" visible={displayagrupamiento} style={{ width: '30vw' }} position="left" modal onHide={() => setDisplayagrupamiento(false)}>
                        <Fragment>
                            <form className="field grid" onSubmit={onSubmitAgrupamiento}>
                                <input hidden readOnly value={model.id} />
                                <div className="formgroup-inline">
                                    <h5>Agrupamiento</h5>
                                    <div className="field col-12"  >
                                        <label htmlFor="detalle" className="p-sr-only">Agrupamiento</label>
                                        <InputText type="text" value={model.detalle} placeholder="Agrupamiento" onChange={(e) => actualizarDatosAgrupamiento("detalle", e.target.value)} />
                                    </div>
                                    <Button label="Actualiza"></Button>
                                </div>
                            </form>
                        </Fragment>
                    </Dialog>) : <></>}
                    {conceptosJornales ? <Sidebar visible={displayconceptos} position="left" style={{ width: '100em' }} onHide={() => setDisplayconceptos(false)}>
                        <DataTable ref={dt} value={conceptosJornales} selection={selectedConceptos} onSelectionChange={(e) => setSelectedConceptos(e.value)}
                            dataKey="codigo" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} conceptos"
                            globalFilter={conceptosFilter} emptyMessage="Sin Datos." header={headerConceptosJornales} responsiveLayout="scroll">
                            <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                            <Column field="codigo" header="Codigo" sortable></Column>
                            <Column field="concepto" header="Concepto" sortable></Column>
                            <Column field="monto" header="Monto" sortable ></Column>
                            <Column field="fijo" header="Fijo" sortable body={fijoBodyTemplate}></Column>
                            <Column field="haber" header="Haber" sortable body={haberBodyTemplate}></Column>
                            <Column field="remunerativo" header="Rem" sortable body={remunerativoBodyTemplate}></Column>
                            <Column field="sbasico" header="S/Bas." sortable body={sbasicoBodyTemplate}></Column>
                            <Column field="sbruto" header="S/Br" sortable body={sbrutoBodyTemplate}></Column>
                            <Column field="sremun" header="S/Re" sortable body={sremunBodyTemplate}></Column>
                            <Column field="obligatorio" header="Obl" sortable body={obligatorioBodyTemplate}></Column>
                        </DataTable>
                    </Sidebar> : <></>}
                    {modelConcepto ? <Dialog header="Conceptos de Jornales" className="card p-fluid" visible={displayAltaconceptos} style={{ width: '30em' }} position="top" modal onHide={() => setDisplayAltaconceptos(false)}>
                        <Fragment>
                            <form className="field grid" onSubmit={editar ? onSubmitUpdateConcepto : onSubmitAddConcepto}>
                                <input hidden readOnly value={modelConcepto.id} />
                                <input hidden readOnly value={modelConcepto.agrupacion} />
                                <div className="formgroup-inline">
                                    <h5>Codigo</h5>
                                    <div className="field col-12"  >
                                        <label htmlFor="codigo" className="p-sr-only">Codigo</label>
                                        <InputText type="text" value={modelConcepto.codigo} placeholder="Codigo" onChange={(e) => actualizarDatosConcepto("codigo", e.target.value)} />
                                    </div>
                                    <h5>Concepto</h5>
                                    <div className="field col-12"  >
                                        <label htmlFor="concepto" className="p-sr-only">Concepto</label>
                                        <InputText type="text" value={modelConcepto.concepto} placeholder="Concepto" onChange={(e) => actualizarDatosConcepto("concepto", e.target.value)} />
                                    </div>
                                    <h5>Monto</h5>
                                    <div className="field col-12"  >
                                        <label htmlFor="monto" className="p-sr-only">Monto</label>
                                        <InputText type="number" value={modelConcepto.monto} placeholder="Monto" onChange={(e) => actualizarDatosConcepto("monto", e.target.value)} />

                                    </div>
                                    <div className="field col-3">
                                        <h5>Fijo</h5>
                                        <InputSwitch checked={modelConcepto.fijo} onChange={(e) => actualizarDatosConcepto("fijo", e.value)} />
                                    </div>
                                    <div className="field col-3">
                                        <h5>Haber</h5>
                                        <InputSwitch checked={modelConcepto.haber} onChange={(e) => actualizarDatosConcepto("haber", e.value)} />
                                    </div>
                                    <div className="field col-3">
                                        <h5>Remun</h5>
                                        <InputSwitch checked={modelConcepto.remunerativo} onChange={(e) => actualizarDatosConcepto("remunerativo", e.value)} />
                                    </div>
                                    <div className="field col-3">
                                        <h5>S/Basico</h5>
                                        <InputSwitch checked={modelConcepto.sbasico} onChange={(e) => actualizarDatosConcepto("sbasico", e.value)} />
                                    </div>
                                    <div className="field col-3">
                                        <h5>S/Bruto</h5>
                                        <InputSwitch checked={modelConcepto.sbruto} onChange={(e) => actualizarDatosConcepto("sbruto", e.value)} />
                                    </div>
                                    <div className="field col-3">
                                        <h5>S/Remun</h5>
                                        <InputSwitch checked={modelConcepto.sremun} onChange={(e) => actualizarDatosConcepto("sremun", e.value)} />
                                    </div>
                                    <div className="field col-3">
                                        <h5>Oblig</h5>
                                        <InputSwitch checked={modelConcepto.obligatorio} onChange={(e) => actualizarDatosConcepto("obligatorio", e.value)} />
                                    </div>
                                    <Button label={editar ? "Actualizar" : "Alta"}></Button>
                                </div>
                            </form>
                        </Fragment>
                    </Dialog> : <></>}
                    {modelConcepto ? <Dialog header="Eliminar Conceptos" className="card p-fluid" visible={eliminar} style={{ width: '30em' }} position="top" modal onHide={() => setEliminar(false)}>
                        <div className="formgroup-inline">
                            <h5>{modelConcepto.concepto}</h5> 
                            <hr></hr>
                            <Button label="Si" className="p-button-rounded p-button-danger p-button-text mr-2 mb-2" icon="pi pi-check" onClick={onSubmitEliminarConcepto} />
                            <Button label="No" className="p-button-rounded p-button-success p-button-text mr-2 mb-2" icon="pi pi-times" onClick={() => setEliminar(false)} />
                        </div>

                    </Dialog> : <></>}
                    <Toast ref={toast} />
                </div>
            </div>
        )
            : (<div className="card">
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

export default React.memo(Agrupamientos, comparisonFn);  