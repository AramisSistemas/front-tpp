import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { InputSwitch } from 'primereact/inputswitch';
import { InputText } from 'primereact/inputtext';
import { Skeleton } from 'primereact/skeleton';
import { SplitButton } from 'primereact/splitbutton';
import { classNames } from 'primereact/utils';
import { default as React, Fragment, useEffect, useState } from 'react';
import Moment from 'react-moment';
import { useDispatch, useSelector } from 'react-redux';
import { messageService } from '../redux/messagesducks';
import { actualizarManiobra, ingresarManiobra } from '../redux/operationsducks';
import { OperationService } from '../service/OperationService';

const Operations = () => {
    const dispatch = useDispatch();

    const operationService = new OperationService();

    const activo = useSelector(store => store.users.activo);

    //genericas
    const [turnos, setTurnos] = useState({ value: null, label: null });
    const [maniobras, setManiobras] = useState(null);

    //llenado de tablas activas
    const [operations, setOperations] = useState([]);
    const [maniobrasActivas, setManiobrasActivas] = useState([]);
    const [loadingOp, setLoadingOp] = useState(true);

    //FORMULARIO PARA MANIOBRAS
    const [displayIngresaManiobra, setDisplayIngresaManiobra] = useState(false);
    const [displayActualizaManiobra, setDisplayActualizaManiobra] = useState(false);
    const [datosOperacion, setDatosOperacion] = useState(null);
    const [datosManiobra, setDatosManiobra] = useState([]);
    const [turnomaniobra, setTurnomaniobra] = useState(null);
    const [fechamaniobra, setFechamaniobra] = useState(null);
    const [maniobraOperacion, setManiobraOperacion] = useState(null);

    const [expandedRows, setExpandedRows] = useState(null);

    const operacionesItems = [
        {
            label: 'Maniobra',
            icon: 'pi pi-upload',
            command: () => { setDisplayIngresaManiobra(true) }
        },
        {
            label: 'Update',
            icon: 'pi pi-upload'
        },
        {
            label: 'Delete',
            icon: 'pi pi-trash'
        },
        {
            label: 'Home Page',
            icon: 'pi pi-home'
        },
    ];

    const fetchOperations = () => { 
            setLoadingOp(true)
            operationService.getAll().then(data => { setOperations(data) }).catch((error) => dispatch(messageService(false, error.response.data.message, error.response.status)));
            //      if (operations.length > 0) {
            operationService.getManiobrasActivas(false).then(data => { setManiobrasActivas(data) });
            //  }    
            setLoadingOp(false);       
    }

    const onSubmitManiobra = (e) => {
        var options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        e.preventDefault()
        dispatch(ingresarManiobra(maniobraOperacion, turnomaniobra, fechamaniobra.toLocaleDateString("es-ES", options), datosOperacion.id)).then(
            fetchOperations()
        );
        // limpiar campos
        e.target.reset();
        setDisplayIngresaManiobra(false);
    }

    const onSubmitActualizaManiobra = (e) => {
        e.preventDefault()
        dispatch(actualizarManiobra(datosManiobra));
        // limpiar campos
        e.target.reset();
        fetchOperations();
        setDisplayActualizaManiobra(false);
    }

    const inicioBodyTemplate = (rowData) => {
        return <Moment format='D/MM/yyyy'>{rowData.inicio}</Moment>
    }

    const destinoBodyTemplate = (rowData) => {
        return <span className={`order-badge order-${rowData.destino.toLowerCase()}`}>{rowData.destino}</span>;
    }

    const clienteBodyTemplate = (rowData) => {
        return <span className={`order-badge order-${rowData.cliente.toLowerCase()}`}>{rowData.cliente}</span>;
    }

    const esquemaBodyTemplate = (rowData) => {
        return <span className={`order-badge order-${rowData.esquema.toLowerCase()}`}>{rowData.esquema}</span>;
    }

    const fechaManiobraBodyTemplate = (rowData) => {
        return <Moment format='D/MM/yyyy'>{rowData.fecha}</Moment>
    }

    const lluviaBodyTemplate = (rowData) => {
        return <i className={classNames('pi', { 'text-green-500 pi-check-circle': rowData.lluvia, 'text-pink-500 pi-times-circle': !rowData.lluvia })}></i>;
    }

    const insalubreBodyTemplate = (rowData) => {
        return <i className={classNames('pi', { 'text-green-500 pi-check-circle': rowData.insalubre, 'text-pink-500 pi-times-circle': !rowData.insalubre })}></i>;
    }

    const sobrepesoBodyTemplate = (rowData) => {
        return <i className={classNames('pi', { 'text-green-500 pi-check-circle': rowData.sobrepeso, 'text-pink-500 pi-times-circle': !rowData.sobrepeso })}></i>;
    }

    const produccionBodyTemplate = (rowData) => {
        return <span className="p-tag">{rowData.produccion}</span>;
    }

    const actionManiobraBodyTemplate = (rowData) => {
        return (
            <div className="card">
                <Button icon="pi pi-check" className="p-button-rounded p-button-text mr-2 mb-2" onClick={() => { establecerDatosManiobra(rowData) }} />
                <Button icon="pi pi-user" className="p-button-rounded p-button-info p-button-text mr-2 mb-2" />
                <Button icon="pi pi-times" className="p-button-rounded p-button-danger p-button-text mr-2 mb-2" />

            </div>
        )
    }

    const actionOperationBodyTemplate = (rowData) => {
        return <SplitButton icon="pi pi-cog" model={operacionesItems} menuStyle={{ width: '12rem' }} className="p-button-success mr-2 mb-2" onShow={() => establecerDatosOperacion(rowData)} ></SplitButton>;
    }

    const establecerDatosOperacion = (dataRow) => {
        setDatosOperacion(dataRow);
        operationService.getTurnos(dataRow.idEsquema).then(data => {
            setTurnos(data)
        }).then(
            operationService.getManiobrasAll().then(data => {
                setManiobras(data)
            }));
    }

    const establecerDatosManiobra = (rowData) => {
        setDatosManiobra(rowData);
        setDisplayActualizaManiobra(true)
    }

    const actualizarDatosManiobra = (nombre, valor) => {
        let _datosManiobras = { ...datosManiobra };
        _datosManiobras[`${nombre}`] = valor;
        setDatosManiobra(_datosManiobras);
    }

    const expandAll = () => {
        let _expandedRows = {};
        operations.forEach(p => _expandedRows[`${p.id}`] = true);
        setExpandedRows(_expandedRows);
    }

    const collapseAll = () => {
        setExpandedRows(null);
    }

    useEffect(() => {
     if(activo)
      fetchOperations();

    }, [activo, dispatch])

    const header = (
        <div className="table-header-container">
            <Button icon="pi pi-plus" label="Expand All" onClick={expandAll} className="mr-2 mb-2" />
            <Button icon="pi pi-minus" label="Collapse All" onClick={collapseAll} className="mb-2" />
        </div>
    );

    const maniobrasTemplate = (data) => {
        return (
            <div className="orders-subtable">
                <h5>Maniobras en {data.destino}</h5>
                <DataTable value={maniobrasActivas.filter(m => m.operacion === data.id)} responsiveLayout="scroll"  >
                    <Column field="fecha" header="Fecha" sortable body={fechaManiobraBodyTemplate}></Column>
                    <Column field="turnoDesc" header="Turno" sortable></Column>
                    <Column field="maniobraNombre" header="Maniobra" sortable></Column>
                    <Column field="produccion" header="Prod" sortable body={produccionBodyTemplate}></Column>
                    <Column field="lluvia" header="Ll." sortable body={lluviaBodyTemplate}></Column>
                    <Column field="insalubre" header="In." sortable body={insalubreBodyTemplate}></Column>
                    <Column field="sobrepeso" header="SoP." sortable body={sobrepesoBodyTemplate}></Column>
                    <Column headerStyle={{ width: '4rem' }} body={actionManiobraBodyTemplate}></Column>
                </DataTable>
                {datosManiobra ? <Dialog className="card p-fluid" header="Maniobra" visible={displayActualizaManiobra} style={{ width: '30vw' }} modal onHide={() => setDisplayActualizaManiobra(false)}>
                    <Fragment>
                        <form className="card" onSubmit={onSubmitActualizaManiobra}>
                            <div className="p-fluid formgrid grid">
                                <input hidden readOnly value={datosManiobra.id} />
                                <input hidden readOnly value={datosManiobra.turno} />
                                <input hidden readOnly value={datosManiobra.maniobra} />
                                <div className="field col-4">
                                    <label htmlFor="turnoDesc">Turno</label>
                                    <InputText readOnly value={datosManiobra.turnoDesc} />
                                </div>
                                <div className="field col-8">
                                    <label htmlFor="maniobraNombre">Maniobra</label>
                                    <InputText readOnly value={datosManiobra.maniobraNombre} />
                                </div>
                                <div className="field col-12">
                                    <label htmlFor="produccion">Producción</label>
                                    <InputNumber min={0} max={260} value={datosManiobra.produccion} onChange={(e) => actualizarDatosManiobra("produccion", e.value)} step={10} showButtons buttonLayout="horizontal"
                                        decrementButtonClassName="p-button-danger" incrementButtonClassName="p-button-success" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />
                                </div>
                                <div className="field col-4">
                                    <h5>Lluvia</h5>
                                    <InputSwitch checked={datosManiobra.lluvia} onChange={(e) => actualizarDatosManiobra("lluvia", e.value)} />
                                </div>
                                <div className="field col-4">
                                    <h5>Insalubre</h5>
                                    <InputSwitch checked={datosManiobra.insalubre} onChange={(e) => actualizarDatosManiobra("insalubre", e.value)} />
                                </div>
                                <div className="field col-4">
                                    <h5>Sobrepeso</h5>
                                    <InputSwitch checked={datosManiobra.sobrepeso} onChange={(e) => actualizarDatosManiobra("sobrepeso", e.value)} />
                                </div>
                                <Button label="Actualizar Maniobra"></Button>
                            </div>
                        </form>
                    </Fragment>

                </Dialog>
                    : <></>}
            </div >
        );
    }

    return (
        activo ? (
            <div className="col-12">
                <div className="card">
                    <h5>Row Expand</h5>
                    <DataTable value={operations} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)} responsiveLayout="scroll"
                        rowExpansionTemplate={maniobrasTemplate} dataKey="id" header={header} loading={loadingOp}  >
                        <Column expander style={{ width: '3em' }} />
                        <Column field="id" header="Op" sortable />
                        <Column field="inicio" header="Inicio" filterField="inicio" dataType="date" style={{ minWidth: '10rem' }} body={inicioBodyTemplate} />
                        <Column field="cliente" header="Cliente" sortable body={clienteBodyTemplate} />
                        <Column field="destino" header="Destino" sortable body={destinoBodyTemplate} />
                        <Column field="esquema" header="Esquema" sortable body={esquemaBodyTemplate} />
                        <Column headerStyle={{ width: '4rem' }} body={actionOperationBodyTemplate}></Column>
                    </DataTable>
                </div>
                {datosOperacion ? <Dialog className="card p-fluid" header="Maniobra" visible={displayIngresaManiobra} style={{ width: '30vw' }} modal onHide={() => setDisplayIngresaManiobra(false)}>
                    <Fragment>
                        <form className="card" onSubmit={onSubmitManiobra}>
                            <div className="p-fluid formgrid grid">
                                <h5>Fecha</h5>
                                <div className="field col-12">
                                    <label htmlFor="fecha" className="p-sr-only">Fecha</label>
                                    <Calendar name="fecha" value={fechamaniobra} onChange={(e) => setFechamaniobra(e.value)} showIcon showButtonBar dateFormat='dd/mm/yy' required
                                    />
                                </div>
                                <div className="field col-12">
                                    <h5>Turno</h5>
                                    <Dropdown name="turno" onChange={(e) => setTurnomaniobra(e.value)} value={turnomaniobra} options={turnos} optionValue="id" optionLabel="horario" placeholder="Seleccione Turno"
                                        required={true} />
                                </div>

                                <div className="field col-12">
                                    <h5>Maniobra</h5>
                                    <Dropdown name="maniobra" onChange={(e) => setManiobraOperacion(e.value)} value={maniobraOperacion} options={maniobras} optionValue="id" optionLabel="detalle" placeholder="Seleccione Maniobra"
                                        required={true} />
                                </div>
                                <Button label="Agregar Maniobra"></Button>
                            </div>
                        </form>
                    </Fragment>
                </Dialog> : <></>}
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

export default React.memo(Operations, comparisonFn);