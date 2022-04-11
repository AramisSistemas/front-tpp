import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Skeleton } from 'primereact/skeleton';
import { default as React, Fragment, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CompositionAdd from '../components/CompositionAdd';
import EsquemaAdd from '../components/EsquemaAdd';
import ManiobraAdd from '../components/ManiobraAdd';
import PuestoAdd from '../components/PuestoAdd';
import { updateComposition, UpdateEsquema,UpdateManiobra,UpdatePuesto } from '../redux/compositionsducks';
import { messageService } from '../redux/messagesducks';
import { CompositionService } from '../service/CompositionService';
const Composition = () => {

    const dispatch = useDispatch();

    const compositionService = new CompositionService();

    const activo = useSelector(store => store.users.activo);
    const perfil = useSelector(store => store.users.perfil);

    const man = useRef(null);
    const esq = useRef(null);
    const pues = useRef(null);

    const [compositions, setCompositions] = useState([]);
    const [esquemas, setEsquemas] = useState([]);
    const [esquema, setEsquema] = useState(null);
    const [esquemaVisible, setEsquemaVisible] = useState(false);
    const [maniobras, setManiobras] = useState([]);
    const [maniobra, setManiobra] = useState(null);
    const [maniobraVisible, setManiobraVisible] = useState(false);
    const [puestos, setPuestos] = useState([]);
    const [puesto, setPuesto] = useState(null);
    const [puestoVisible, setPuestoVisible] = useState(false); 
    const [loadingCompositions, setLoadingCompositions] = useState(true);
    const [compositionsFilter, setCompositionsFilter] = useState(null);
    const [esquemasFilter, setEsquemasFilter] = useState(null);
    const [maniobrasFilter, setManiobrasFilter] = useState(null);
    const [puestosFilter, setPuestosFilter] = useState(null);
    const [visible, setVisible] = useState(false);
    const [compositionModel, setCompositionModel] = useState([]);

    const fetchCompositions = () => {
        setLoadingCompositions(true);
        compositionService.getCompositions().then(data => {
            setCompositions(data);
            setLoadingCompositions(false);
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

    const fetchPuestos = async () => {
        await compositionService.getPuestos().then(data => {
            setPuestos(data);
        }).catch((error) => dispatch(messageService(false, error.response.data.message, error.response.status)));
    }
 
    const actionPuestoBodyTemplate = () => {
        return (<>
            <Button icon="pi pi-sitemap" id="button" className="p-button-rounded p-button-info p-button-text mr-2 mb-2" onClick={(e) => pues.current.toggle(e)} />
        </>
        )
    }

    const editPuesto =(data)=>{ 
        setPuesto(data);
        setPuestoVisible(true);
    }

    const onSubmitPuesto = (e) => {
        e.preventDefault()
        let data = { ...puesto };
        dispatch(UpdatePuesto(data));
        fetchPuestos();
        setPuesto(null);
        setPuestoVisible(false);
    }

    const actualizarDatosPuesto = (nombre, valor) => { 
        let _puesto = { ...puesto };
        _puesto[`${nombre}`] = valor;
        setPuesto(_puesto);
    }

    const actionPuestoEditTemplate = (rowData) => {
        return (<>
            <Button icon="pi pi-paperclip" id="button" className="p-button-rounded p-button-info p-button-text mr-2 mb-2" onClick={(e) => editPuesto(rowData)} />
        </>
        )
    }

    const actionManiobraBodyTemplate = () => {
        return (<>
            <Button icon="pi pi-table" id="button" className="p-button-rounded p-button-info p-button-text mr-2 mb-2" onClick={(e) => man.current.toggle(e)} />
        </>
        )
    }

    const editManiobra =(data)=>{
        setManiobra(data);
        setManiobraVisible(true);
    }

    const onSubmitManiobra = (e) => {
        e.preventDefault()
        let data = { ...maniobra };
        dispatch(UpdateManiobra(data));
        fetchManiobras();
        setManiobra(null);
        setManiobraVisible(false);
    }

    const actualizarDatosManiobra = (nombre, valor) => { 
        let _maniobra = { ...maniobra };
        _maniobra[`${nombre}`] = valor;
        setManiobra(_maniobra);
    }

    const actionManiobraEditTemplate = (rowData) => {
        return (<>
            <Button icon="pi pi-paperclip" id="button" className="p-button-rounded p-button-info p-button-text mr-2 mb-2" onClick={()=> editManiobra(rowData) } />
        </>
        )
    }

    const actionEsquemaBodyTemplate = (rowData) => {
        return (<>
            <Button icon="pi pi-cog" id="button" className="p-button-rounded p-button-info p-button-text mr-2 mb-2"onClick={(e) => esq.current.toggle(e)} />
        </>
        )
    } 

    const editEsquema =(data)=>{
        setEsquema(data);
        setEsquemaVisible(true);
    }

    const onSubmitEsquema = (e) => {
        e.preventDefault()
        let data = { ...esquema };
        dispatch(UpdateEsquema(data));
        fetchEsquemas();
        setEsquema(null);
        setEsquemaVisible(false);
    }

    const actualizarDatosEsquema = (nombre, valor) => { 
        let _esquema = { ...esquema };
        _esquema[`${nombre}`] = valor;
        setEsquema(_esquema);
    }

    const actionEsquemaEditTemplate = (rowData) => {
        return (<>
            <Button icon="pi pi-paperclip" id="button" className="p-button-rounded p-button-info p-button-text mr-2 mb-2" onClick={()=> editEsquema(rowData) }/>
        </>
        )
    }

    const actionCompositionBodyTemplate = (rowData) => {
        return (<>
            <Button icon="pi pi-users" id="button" className="p-button-rounded p-button-info p-button-text mr-2 mb-2" onClick={() => onSubmitPreUpdate(rowData)} />
        </>
        )
    }

    const headerCompositions = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <CompositionAdd></CompositionAdd>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setCompositionsFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const headerEsquemas = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <EsquemaAdd></EsquemaAdd>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setEsquemasFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const headerManiobras = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <ManiobraAdd></ManiobraAdd>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setManiobrasFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const headerPuestos = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <PuestoAdd></PuestoAdd>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setPuestosFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const onSubmitPreUpdate = (rowData) => {
        setCompositionModel(rowData);
        setVisible(true);
    }

    const actualizarDatosComposition = (nombre, valor) => {
        if (nombre === 'cantidad' && valor <= 0) {
            dispatch(messageService(false, 'Las cantidad debe ser mayor a 0', 400))
            valor = 1;
        }
        let _compositionModel = { ...compositionModel };
        _compositionModel[`${nombre}`] = valor;
        setCompositionModel(_compositionModel);
    }

    const onSubmitUpdate = (e) => {
        e.preventDefault()
        let data = { ...compositionModel };
        dispatch(updateComposition(data));
        fetchCompositions();
        setCompositionModel([]);
        setVisible(false);
    }

    useEffect(() => {
        if (activo && perfil === 3) {
            fetchCompositions();
        }
    }, [activo, perfil]);

    useEffect(() => {
        if (activo && perfil === 3) {
            fetchEsquemas();
        }
    }, [activo, perfil]);

    useEffect(() => {
        if (activo && perfil === 3) {
            fetchManiobras();
        }
    }, [activo, perfil]);

    useEffect(() => {
        if (activo && perfil === 3) {
            fetchPuestos(); 
        }
    }, [activo, perfil]);

    return (
        activo && perfil === 3 ? (
            <div className="col-12">
                <div className="card">
                    <h5>Composición Maniobras</h5>
                    <DataTable value={compositions} dataKey="id" loading={loadingCompositions}
                        paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Modelos"
                        globalFilter={compositionsFilter} emptyMessage="Sin Datos." header={headerCompositions} responsiveLayout="scroll">
                        <Column field="esquemaStr" header="Esquema" sortable />
                        <Column headerStyle={{ width: '4rem' }} body={actionEsquemaBodyTemplate}></Column>
                        <Column field="maniobraStr" header="Maniobra" sortable />
                        <Column headerStyle={{ width: '4rem' }} body={actionManiobraBodyTemplate}></Column>
                        <Column field="puestoStr" header="Puesto" sortable />
                        <Column headerStyle={{ width: '4rem' }} body={actionPuestoBodyTemplate}></Column>
                        <Column field="cantidad" header="Cantidad" sortable />
                        <Column headerStyle={{ width: '4rem' }} body={actionCompositionBodyTemplate}></Column>
                    </DataTable>
                    {esquema ? (<Dialog header="Actualizar Esquema" className="card p-fluid" visible={esquemaVisible} style={{ width: '30vw' }} position="top" modal onHide={() => setEsquemaVisible(false)}>
                        <Fragment>
                            <form className="field grid" onSubmit={onSubmitEsquema}>
                                <input hidden readOnly value={esquema.id} /> 
                                <div className="formgroup-inline">
                                    <h5>Esquema</h5>
                                    <div className="field col-12"  >
                                        <label htmlFor="detalle" className="p-sr-only">Esquema</label>
                                        <InputText type="text" value={esquema.detalle} placeholder="Esquema" onChange={(e) => actualizarDatosEsquema('detalle',e.target.value)} />
                                    </div>
                                    <Button label="Actualizar"></Button>
                                </div>
                            </form>
                        </Fragment>
                    </Dialog>) : <></>}
                    {maniobra ? (<Dialog header="Actualizar Maniobra" className="card p-fluid" visible={maniobraVisible} style={{ width: '30vw' }} position="top" modal onHide={() => setManiobraVisible(false)}>
                        <Fragment>
                            <form className="field grid" onSubmit={onSubmitManiobra}>
                                <input hidden readOnly value={maniobra.id} /> 
                                <div className="formgroup-inline">
                                    <h5>Maniobra</h5>
                                    <div className="field col-12"  >
                                        <label htmlFor="detalle" className="p-sr-only">Maniobra</label>
                                        <InputText type="text" value={maniobra.detalle} placeholder="Maniobra" onChange={(e) => actualizarDatosManiobra('detalle',e.target.value)} />
                                    </div>
                                    <Button label="Actualizar"></Button>
                                </div>
                            </form>
                        </Fragment>
                    </Dialog>) : <></>}
                    {puesto ? (<Dialog header="Actualizar Puesto" className="card p-fluid" visible={puestoVisible} style={{ width: '30vw' }} position="top" modal onHide={() => setPuestoVisible(false)}>
                        <Fragment>
                            <form className="field grid" onSubmit={onSubmitPuesto}>
                                <input hidden readOnly value={puesto.id} /> 
                                <div className="formgroup-inline">
                                    <h5>Puesto</h5>
                                    <div className="field col-12"  >
                                        <label htmlFor="detalle" className="p-sr-only">Puesto</label>
                                        <InputText type="text" value={puesto.detalle} placeholder="Puesto" onChange={(e) => actualizarDatosPuesto('detalle',e.target.value)} />
                                    </div>
                                    <Button label="Actualizar"></Button>
                                </div>
                            </form>
                        </Fragment>
                    </Dialog>) : <></>}
                </div>

                <OverlayPanel ref={esq} showCloseIcon dismissable onShow={fetchEsquemas}>
                    <DataTable value={esquemas} dataKey="id"
                        paginator rows={5} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Esquemas"
                        globalFilter={esquemasFilter} emptyMessage="Sin Datos." header={headerEsquemas} responsiveLayout="scroll">
                        <Column field="detalle" header="Esquema" sortable />
                        <Column headerStyle={{ width: '4rem' }} body={actionEsquemaEditTemplate}></Column>
                    </DataTable>
                </OverlayPanel>

                <OverlayPanel ref={man} showCloseIcon dismissable onShow={fetchManiobras}>
                    <DataTable value={maniobras} dataKey="id"
                        paginator rows={5} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Esquemas"
                        globalFilter={maniobrasFilter} emptyMessage="Sin Datos." header={headerManiobras} responsiveLayout="scroll">
                        <Column field="detalle" header="Maniobra" sortable />
                        <Column headerStyle={{ width: '4rem' }} body={actionManiobraEditTemplate}></Column>
                    </DataTable>
                </OverlayPanel>

                <OverlayPanel ref={pues} showCloseIcon dismissable onShow={fetchPuestos}>
                    <DataTable value={puestos} dataKey="id"
                        paginator rows={5} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Puestos"
                        globalFilter={puestosFilter} emptyMessage="Sin Datos." header={headerPuestos} responsiveLayout="scroll">
                        <Column field="detalle" header="Puesto" sortable />
                        <Column field="agrupacionStr" header="Agrupacion" sortable />
                        <Column headerStyle={{ width: '4rem' }} body={actionPuestoEditTemplate}></Column>
                    </DataTable>
                </OverlayPanel>
                {compositionModel ? (<Dialog header="Cantidad de Operarios" className="card p-fluid" visible={visible} style={{ width: '30vw' }} modal onHide={() => setVisible(false)}>
                    <Fragment>
                        <form className="field grid" onSubmit={onSubmitUpdate}>
                            <input hidden readOnly value={compositionModel.id} />
                            <div className="formgroup-inline">
                                <div className="field col-12"  >
                                    <label htmlFor="cantidad" className="p-sr-only">Cantidad</label>
                                    <InputText type="number" placeholder="Cantidad" value={compositionModel.cantidad} onChange={(e) => actualizarDatosComposition("cantidad", e.target.value)} />
                                </div>
                                <Button label="Actualizar"></Button>
                            </div>
                        </form>
                    </Fragment>
                </Dialog>) : <></>}
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

export default React.memo(Composition, comparisonFn);  