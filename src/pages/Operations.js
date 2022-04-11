import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { InputSwitch } from 'primereact/inputswitch';
import { InputText } from 'primereact/inputtext';
import { ProgressBar } from 'primereact/progressbar';
import { Sidebar } from 'primereact/sidebar';
import { Skeleton } from 'primereact/skeleton';
import { SplitButton } from 'primereact/splitbutton';
import { classNames } from 'primereact/utils';
import { default as React, Fragment, useEffect, useRef, useState } from 'react';
import Moment from 'react-moment';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import EmpleadoAdd from '../components/EmpleadoAdd';
import { liquidacionDelete, liquidacionesAdd, liquidacionesDelete } from '../redux/liquidacionesducks';
import { messageService } from '../redux/messagesducks';
import { actualizarManiobra, cerrarManiobra, confirmarManiobra, eliminarManiobra, finalizarManiobra, ingresarManiobra, llaveManiobra, pasarDatosManiobra, reabrirManiobra } from '../redux/operationsducks';
import { logout } from '../redux/usersducks';
import { EmpleadoService } from '../service/EmpleadoService';
import { OperationService } from '../service/OperationService';

const Operations = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const operationService = new OperationService();
    const empleadoService = new EmpleadoService();

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
    const [displaymenuManiobra, setDisplaymenuManiobra] = useState(false);
    const [datosOperacion, setDatosOperacion] = useState(null);
    const [datosManiobra, setDatosManiobra] = useState([]);
    const [turnomaniobra, setTurnomaniobra] = useState(null);
    const [fechamaniobra, setFechamaniobra] = useState(null);
    const [maniobraOperacion, setManiobraOperacion] = useState(null);

    //composicion
    const [composicionManiobra, setComposicion] = useState([]);
    const [liquidaciones, setLiquidaciones] = useState([])
    const [liquidacionesVisibles, setLiquidacionesVisibles] = useState(false)
    const [empleados, setEmpleados] = useState([]);
    const [empleadosVisibles, setEmpleadosVisibles] = useState(false);
    const [selectedEmpleados, setSelectedEmpleados] = useState([])
    const [empleadosFilter, setEmpleadosFilter] = useState(null);
    const [cierreVisible, setCierreVisible] = useState(false);
    const [datosCierre, setDatosCierre] = useState([]);
    const [llave, setLlave] = useState(100);
    const [llaveVisible, setLlaveVisible] = useState(false);
    const dt = useRef(null);

    const [expandedRows, setExpandedRows] = useState(null);

    const operacionesItems = [
        {
            label: 'Maniobra',
            icon: 'pi pi-upload',
            command: () => { setDisplayIngresaManiobra(true) }
        },
        {
            label: 'Jornales',
            icon: 'pi pi-dollar',
            command: () => { menuJornales(datosOperacion) }
        },
        {
            label: 'Eliminar',
            icon: 'pi pi-trash'
        },
        {
            label: 'Informes',
            icon: 'pi pi-chart-line'
        },
    ];

    const menuJornales = (datosOperacion) => {
        dispatch(pasarDatosManiobra(datosOperacion));
        history.push("/jornales");
    }

    const abreMenuManiobra = async (rowData) => {
        await fetchComposicion(rowData.id).then(
            fetchEmpleados(true)).then
            (setDisplaymenuManiobra(true));
    };

    const abreLiquidaciones = async (rowData) => {
        await fetchLiquidacionesByManiobra(rowData.operacion, rowData.idPuesto).then(
            setLiquidacionesVisibles(true));
    }

    const fetchEmpleados = async (activos) => {
        await empleadoService.getAll(activos).then(data => { setEmpleados(data) }).catch((error) => dispatch(messageService(false, error.response.data.message, error.response.status)))
    }

    const fetchLiquidacionesByManiobra = async (id, puesto) => {
        await operationService.GetLiquidacionByManiobra(id, puesto).then(data => { setLiquidaciones(data) }).catch((error) => dispatch(messageService(false, error.response.data.message, error.response.status)));
    }

    const fetchComposicion = async (id) => {
        await operationService.getComposicionByManiobra(id).then(data => { setComposicion(data) }).catch((error) => dispatch(messageService(false, error.response.data.message, error.response.status)));
    }

    const fetchOperations = async () => {
        setLoadingOp(true)
        await operationService.getAll().then(data => { setOperations(data) }).catch((error) => error.response.status === 401 ? dispatch(logout()) : dispatch(messageService(false, error.response.data.message, error.response.status)));
        setLoadingOp(false);
    }

    const fetchManiobras = async () => {
        await operationService.getManiobrasActivas(false).then(data => { setManiobrasActivas(data) }).catch((error) => error.response.status === 401 ? dispatch(logout()) : dispatch(messageService(false, error.response.data.message, error.response.status)));
    }

    const actualizarTablas = () => {
        let _expandedRows = expandedRows;
        collapseAll();
        fetchOperations();
        fetchManiobras();
        setExpandedRows(_expandedRows);
    }

    const actualizarLiquidaciones = (op, puesto) => {
        fetchLiquidacionesByManiobra(op, puesto).then(
            fetchComposicion(op));
        setSelectedEmpleados(null);
    }

    const onSubmitCerrarManiobra = () => {
        let datosComposicion = composicionManiobra.filter(c => c.idPuesto === liquidaciones.filter(l => l.tipo === "Actual").map(l => l.idPuesto)[0]);
        let datosManiobra = maniobrasActivas.filter(l => l.id === composicionManiobra.map(l => l.operacion)[0]);
        let estadoLiquidacion = liquidaciones.filter(l => l.tipo === "Actual");
        setDatosCierre({
            minima: datosComposicion[0].cantidad,
            idManiobra: datosComposicion[0].idManiobra,
            idPuesto: datosComposicion[0].idPuesto,
            liquidadas: datosComposicion[0].liquidadas,
            operacion: datosComposicion[0].operacion,
            puesto: datosComposicion[0].puesto,
            fecha: datosManiobra[0].fecha,
            insalubre: datosManiobra[0].insalubre,
            lluvia: datosManiobra[0].lluvia,
            maniobra: datosManiobra[0].maniobra,
            maniobraNombre: datosManiobra[0].maniobraNombre,
            produccion: datosManiobra[0].produccion,
            sobrepeso: datosManiobra[0].sobrepeso,
            turno: datosManiobra[0].turno,
            turnoDesc: datosManiobra[0].turnoDesc,
            abierta: estadoLiquidacion.length !== 0 ? estadoLiquidacion[0].abierta : true,
            confirmada: estadoLiquidacion.length !== 0 ? estadoLiquidacion[0].confirmada : true,
            pagado: estadoLiquidacion.length !== 0 ? estadoLiquidacion[0].pagado : true,
        });
        estadoLiquidacion[0].nombre !== 'Sin Datos' ? setCierreVisible(!cierreVisible) :
            messageService(false, 'No hay liquidaciones para trabajar', 500)
    }

    const onSubmitFinalizarCierreManiobra = (e) => {
        e.preventDefault();
        dispatch(cerrarManiobra(datosCierre.operacion, datosCierre.idPuesto)).then(
            setCierreVisible(!cierreVisible)
        );
    }

    const onSubmitFinalizarConfirmarManiobra = (e) => {
        e.preventDefault();
        dispatch(confirmarManiobra(datosCierre.operacion, datosCierre.idPuesto)).then(
            setCierreVisible(!cierreVisible)
        );
    }

    const onSubmitFinalizarManiobra = (id) => {
        dispatch(finalizarManiobra(id)).then(
            setDisplayActualizaManiobra(false)
        );
    }

    const onSubmitLlaveManiobra = (e) => {
        e.preventDefault();
        dispatch(llaveManiobra(liquidaciones.filter(l => l.tipo === "Actual").map(m => m.operacion)[0], liquidaciones.filter(l => l.tipo === "Actual").map(m => m.idPuesto)[0], llave)).then(
            setLlaveVisible(false)
        );
    }

    const onSubmitReabrirManiobra = (e) => {
        e.preventDefault();
        dispatch(reabrirManiobra(datosCierre.operacion, datosCierre.idPuesto)).then(
            setCierreVisible(!cierreVisible)
        );
    }

    const onSubmitEliminarLiquidaciones = (operacion, puesto, opAnterior) => {
        try {
            dispatch(liquidacionesDelete(operacion, puesto)).then(
                actualizarLiquidaciones(opAnterior, puesto));
        } catch (error) {
            messageService(false, error.message, error.status)
        }
    }

    const onSubmitEliminarLiquidacion = (liquidacion, operacion, puesto) => {
        try {
            dispatch(liquidacionDelete(liquidacion)).then(
                actualizarLiquidaciones(operacion, puesto));
        } catch (error) {
            messageService(false, error.message, error.status)
        }
    }

    const onSubmitLiquidacionesByTurno = (empleados, op, puesto, opAnterior) => {
        try {
            let lm = []
            empleados.forEach(e =>
                lm.push({
                    Empleado: e.idEmpleado,
                    Operacion: op,
                    Puesto: puesto,
                    Abierta: true,
                    Pagado: false,
                    Operador: ''
                }));
            var json = JSON.stringify(lm);
            dispatch(liquidacionesAdd(json)).then(
                actualizarLiquidaciones(opAnterior, puesto));
        } catch (error) {
            messageService(true, error.message, 500)
        }
    }

    const onSubmitLiquidaciones = (op, puesto, opAnterior) => {
        try {
            let lm = []
            selectedEmpleados.forEach(e =>
                lm.push({
                    Empleado: e.id,
                    Operacion: op,
                    Puesto: puesto,
                    Abierta: true,
                    Pagado: false,
                    Operador: ''
                }));
            var json = JSON.stringify(lm);
            dispatch(liquidacionesAdd(json)).then(
                actualizarLiquidaciones(opAnterior, puesto)).then(
                    setEmpleadosVisibles(false));
        } catch (error) {
            messageService(true, error.message, 500)
        }
    }

    const onSubmitLiquidacion = (op, puesto, empleado, opAnterior) => {
        let lm = [];
        lm.push({
            Empleado: empleado,
            Operacion: op,
            Puesto: puesto,
            Abierta: true,
            Pagado: false,
            Operador: ''
        });
        var json = JSON.stringify(lm);
        dispatch(liquidacionesAdd(json)).then(
            actualizarLiquidaciones(opAnterior, puesto));
    }

    const onSubmitManiobra = (e) => {
        e.preventDefault()
        dispatch(ingresarManiobra(maniobraOperacion, turnomaniobra, fechamaniobra.toDateString(), datosOperacion.id));
        e.target.reset();
        setDisplayIngresaManiobra(false);
        actualizarTablas();
    }

    const onSubmitActualizaManiobra = (e) => {
        e.preventDefault()
        if (datosManiobra.produccion > 130) {
            dispatch(messageService(false, 'La producción no puede ser superior a 130 Tn', 400));
            return;
        }
        dispatch(actualizarManiobra(datosManiobra));
        e.target.reset();
        setDisplayActualizaManiobra(false);
        actualizarTablas();
    }

    const onSubmitEliminarManiobra = (id) => {
        dispatch(eliminarManiobra(id));
        actualizarTablas();
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
                <Button icon="pi pi-user" className="p-button-rounded p-button-info p-button-text mr-2 mb-2" onClick={() => abreMenuManiobra(rowData)} />
                <Button icon="pi pi-times" className="p-button-rounded p-button-danger p-button-text mr-2 mb-2" onClick={() => { onSubmitEliminarManiobra(rowData.id) }} />
            </div>
        )
    }

    const actionOperationBodyTemplate = (rowData) => {
        return <SplitButton icon="pi pi-cog" model={operacionesItems} menuStyle={{ width: '12rem' }} className="p-button-success mr-2 mb-2" onShow={() => establecerDatosOperacion(rowData)} ></SplitButton>;
    }

    const progressbarTemplate = (rowData) => {
        return <ProgressBar color={rowData.liquidadas / rowData.cantidad * 100 <= 50 ? 'yellow' :
            rowData.liquidadas / rowData.cantidad * 100 > 50 && rowData.liquidadas / rowData.cantidad * 100 <= 100 ? 'green' :
                'red'
        } value={Math.round(rowData.liquidadas / rowData.cantidad * 100)} />
    }

    const accionComposicionTemplate = (rowData) => {
        return (
            <Button icon="pi pi-user" className="p-button-rounded p-button-info p-button-text mr-2 mb-2" onClick={() => abreLiquidaciones(rowData)} />
        )
    }

    const empleadosActionTemplate = (data) => {
        return (
            <Button icon="pi pi-arrow-circle-right" className="p-button-rounded p-button-info p-button-text mr-2 mb-2" onClick={() => onSubmitLiquidacion(liquidaciones.filter(l => l.tipo === "Actual").map(m => m.operacion)[0], liquidaciones.filter(l => l.tipo === "Actual").map(m => m.idPuesto)[0], data.id, liquidaciones.filter(l => l.tipo === "Actual").map(m => m.operacion)[0])} />
        )
    }

    const empleadoNombreTemplate = (rowData) => {
        return <Badge size="large" value={rowData.nombre} severity={rowData.color} style={{ textAlign: 'left' }}></Badge>
    }

    const empleadoLlaveTemplate = (rowData) => {
        return <Badge size="medium" value={rowData.llave} severity={rowData.llave > 1 ? 'danger' :
            rowData.llave === 1 ? 'success' : 'warning'}
            style={{ textAlign: 'center' }}></Badge>
    }

    const liquidacionesActionTemplate = (data) => {
        return (
            <>
                <Button icon="pi pi-arrow-circle-right" className="p-button-rounded p-button-success p-button-outlined mr-2 mb-2" onClick={() => onSubmitLiquidacion(liquidaciones.filter(l => l.tipo === "Posterior").map(m => m.operacion)[0], data.idPuesto, data.idEmpleado, liquidaciones.filter(l => l.tipo === "Actual").map(m => m.operacion)[0])} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-outlined mr-2 mb-2" onClick={() => onSubmitEliminarLiquidacion(data.liquidacion, liquidaciones.filter(l => l.tipo === "Actual").map(m => m.operacion)[0], data.idPuesto)} />
            </>
        )
    }

    const liquidacionesAnteriorActionTemplate = (data) => {
        return (
            <>
                <Button icon="pi pi-arrow-circle-right" className="p-button-rounded p-button-success p-button-outlined mr-2 mb-2" onClick={() => onSubmitLiquidacion(liquidaciones.filter(l => l.tipo === "Actual").map(m => m.operacion)[0], data.idPuesto, data.idEmpleado, liquidaciones.filter(l => l.tipo === "Actual").map(m => m.operacion)[0])} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-outlined mr-2 mb-2" onClick={() => onSubmitEliminarLiquidacion(data.liquidacion, liquidaciones.filter(l => l.tipo === "Actual").map(m => m.operacion)[0], data.idPuesto)} />
            </>
        )
    }

    const liquidacionesSiguienteActionTemplate = (data) => {
        return (
            <>
                <Button icon="pi pi-arrow-circle-left" className="p-button-rounded p-button-success p-button-outlined mr-2 mb-2" onClick={() => onSubmitLiquidacion(liquidaciones.filter(l => l.tipo === "Actual").map(m => m.operacion)[0], data.idPuesto, data.idEmpleado, liquidaciones.filter(l => l.tipo === "Actual").map(m => m.operacion)[0])} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-outlined mr-2 mb-2" onClick={() => onSubmitEliminarLiquidacion(data.liquidacion, liquidaciones.filter(l => l.tipo === "Actual").map(m => m.operacion)[0], data.idPuesto)} />
            </>
        )
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

    const header = (
        <div className="table-header-container">
            <Button icon="pi pi-plus" label="Ver Maniobras" onClick={expandAll} className="mr-2 mb-2" />
            <Button icon="pi pi-minus" label="Ocultar Maniobras" onClick={collapseAll} className="mb-2" />
        </div>
    );

    const headerTurnoActual = (
        <>
            <div className="table-header-container">
                <label>{liquidaciones.length > 0 ? liquidaciones.filter(l => l.tipo === "Actual").map(m => m.puesto)[0] + " " + liquidaciones.filter(l => l.tipo === "Actual").map(m => m.horario)[0] : 'Sin Datos'} </label>
                <Button icon="pi pi-user-plus" className="p-button-rounded p-button-outlined p-button-success mr-2 mb-2" onClick={() => setEmpleadosVisibles(true)} />
                <Button icon="pi pi-angle-double-right" className="p-button-rounded p-button-outlined mr-2 mb-2" onClick={() => onSubmitLiquidacionesByTurno(liquidaciones.filter(l => l.tipo === "Actual"), liquidaciones.filter(l => l.tipo === "Posterior").map(m => m.operacion)[0], liquidaciones.filter(l => l.tipo === "Actual").map(m => m.idPuesto)[0], liquidaciones.filter(l => l.tipo === "Actual").map(m => m.operacion)[0])} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-outlined p-button-danger mr-2 mb-2" onClick={() => onSubmitEliminarLiquidaciones(liquidaciones.filter(l => l.tipo === "Actual").map(m => m.operacion)[0], liquidaciones.filter(l => l.tipo === "Actual").map(m => m.idPuesto)[0], liquidaciones.filter(l => l.tipo === "Actual").map(m => m.operacion)[0])} />
                <Button icon="pi pi-dollar" className="p-button-rounded p-button-outlined p-button-info mr-2 mb-2" onClick={() => onSubmitCerrarManiobra()} />
                <Button icon="pi pi-key" className="p-button-rounded p-button-outlined p-button-warning mr-2 mb-2" onClick={() => setLlaveVisible(true)} />
            </div>
            {datosCierre ? <Dialog className="card p-fluid" header="Maniobra" visible={cierreVisible} style={{ width: '30vw' }} modal onHide={() => setCierreVisible(false)}>
                <Fragment>
                    <div>
                        {(!datosCierre.abierta || datosCierre.confirmada) && !datosCierre.pagado ? (<Button className="p-button-raised p-button-danger mr-2 mb-2" label='Reabrir Maniobra' onClick={onSubmitReabrirManiobra}></Button>) :
                            <></>}
                    </div>
                    <form className="card" onSubmit={!datosCierre.abierta && !datosCierre.confirmada ? onSubmitFinalizarConfirmarManiobra : onSubmitFinalizarCierreManiobra}>
                        <div className="p-fluid formgrid grid">
                            <input readOnly hidden value={datosCierre.operacion} />
                            <input readOnly hidden value={datosCierre.idPuesto} />
                            <div className="field col-8">
                                <label htmlFor="fecha">Fecha</label>
                                <InputText readOnly value={datosCierre.fecha !== undefined ? (datosCierre.fecha).replace('T00:00:00', '') : ''} />
                            </div>
                            <div className="field col-8">
                                <label htmlFor="maniobraNombre">Operación</label>
                                <InputText readOnly value={datosCierre.maniobraNombre} />
                            </div>
                            <div className="field col-12">
                                <label htmlFor="puesto">Maniobra</label>
                                <InputText readOnly value={datosCierre.puesto} />
                            </div>
                            <div className="field col-12">
                                <label htmlFor="turnoDesc">Turno</label>
                                <InputText readOnly value={datosCierre.turnoDesc} />
                            </div>
                            <div className="field col-4">
                                <label htmlFor="minima">Mínima</label>
                                <InputText readOnly value={datosCierre.minima} />
                            </div>
                            <div className="field col-4">
                                <label htmlFor="liquidadas">Liquidaciones</label>
                                <InputText readOnly value={datosCierre.liquidadas} />
                            </div>
                            <div className="field col-4">
                                <label htmlFor="produccion">Producción</label>
                                <InputText readOnly value={datosCierre.produccion} />
                            </div>
                            <div className="field col-4">
                                <i className={classNames('pi', { 'text-green-500 pi-check-circle': datosCierre.lluvia, 'text-pink-500 pi-times-circle': !datosCierre.lluvia })}> Lluvia</i>
                            </div>
                            <div className="field col-4">
                                <i className={classNames('pi', { 'text-green-500 pi-check-circle': datosCierre.insalubre, 'text-pink-500 pi-times-circle': !datosCierre.insalubre })}> Insalubre</i>
                            </div>
                            <div className="field col-4">
                                <i className={classNames('pi', { 'text-green-500 pi-check-circle': datosCierre.sobrepeso, 'text-pink-500 pi-times-circle': !datosCierre.sobrepeso })}> Sobrepeso</i>
                            </div>
                            {datosCierre.abierta ? (<Button type='submit' label='Cerrar Maniobra' ></Button>) :
                                !datosCierre.abierta && !datosCierre.confirmada ? (<Button className="p-button-raised p-button-warning mr-2 mb-2" label='Confirmar Maniobra'></Button>)
                                    : <></>}
                        </div>
                    </form>
                </Fragment>
            </Dialog>
                : <></>}
            {liquidaciones ? <Dialog className="card p-fluid" header="Llaves" visible={llaveVisible} style={{ width: '30vw' }} modal onHide={() => setLlaveVisible(false)}>
                <Fragment>
                    <form className="card" onSubmit={onSubmitLlaveManiobra}>
                        <div className="p-fluid formgrid grid">
                            <input readOnly hidden value={liquidaciones.filter(l => l.tipo === "Actual").map(m => m.operacion)[0]} />
                            <input readOnly hidden value={liquidaciones.filter(l => l.tipo === "Actual").map(m => m.idPuesto)[0]} />
                            <div className="field col-12">
                                <InputNumber value={llave} onValueChange={(e) => setLlave(e.value)} min={0} step={25} showButtons buttonLayout="horizontal"
                                    decrementButtonClassName="p-button-secondary" incrementButtonClassName="p-button-secondary" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />
                            </div>
                            <Button label='Establecer Llave' ></Button>
                        </div>
                    </form>
                </Fragment>
            </Dialog>
                : <></>}
        </>
    );

    const headerTurnoSiguiente = (
        <div className="table-header-container">
            <label>{liquidaciones.filter(l => l.tipo === "Posterior").length > 0 ? liquidaciones.filter(l => l.tipo === "Posterior").map(m => m.puesto)[0] + " " + liquidaciones.filter(l => l.tipo === "Posterior").map(m => m.horario)[0] : 'Sin Datos'} </label>
            <Button icon="pi pi-angle-double-left" className="p-button-rounded p-button-outlined mr-2 mb-2" onClick={() => onSubmitLiquidacionesByTurno(liquidaciones.filter(l => l.tipo === "Posterior"), liquidaciones.filter(l => l.tipo === "Actual").map(m => m.operacion)[0], liquidaciones.filter(l => l.tipo === "Actual").map(m => m.idPuesto)[0], liquidaciones.filter(l => l.tipo === "Actual").map(m => m.operacion)[0])} />
            <Button icon="pi pi-trash" className="p-button-rounded p-button-outlined p-button-danger mr-2 mb-2" onClick={() => onSubmitEliminarLiquidaciones(liquidaciones.filter(l => l.tipo === "Posterior").map(m => m.operacion)[0], liquidaciones.filter(l => l.tipo === "Posterior").map(m => m.idPuesto)[0], liquidaciones.filter(l => l.tipo === "Actual").map(m => m.operacion)[0])} />
        </div>
    );

    const headerTurnoAnterior = (
        <div className="table-header-container">
            <label>{liquidaciones.filter(l => l.tipo === "Anterior").length > 0 ? liquidaciones.filter(l => l.tipo === "Anterior").map(m => m.puesto)[0] + " " + liquidaciones.filter(l => l.tipo === "Anterior").map(m => m.horario)[0] : 'Sin Datos'} </label>
            <Button icon="pi pi-angle-double-right" className="p-button-rounded p-button-outlined mr-2 mb-2" onClick={() => onSubmitLiquidacionesByTurno(liquidaciones.filter(l => l.tipo === "Anterior"), liquidaciones.filter(l => l.tipo === "Actual").map(m => m.operacion)[0], liquidaciones.filter(l => l.tipo === "Actual").map(m => m.idPuesto)[0], liquidaciones.filter(l => l.tipo === "Actual").map(m => m.operacion)[0])} />
            <Button icon="pi pi-trash" className="p-button-rounded p-button-outlined p-button-danger mr-2 mb-2" onClick={() => onSubmitEliminarLiquidaciones(liquidaciones.filter(l => l.tipo === "Anterior").map(m => m.operacion)[0], liquidaciones.filter(l => l.tipo === "Anterior").map(m => m.idPuesto)[0], liquidaciones.filter(l => l.tipo === "Actual").map(m => m.operacion)[0])} />
        </div>
    );

    const headerEmpleados = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <EmpleadoAdd></EmpleadoAdd>
            <Button icon="pi pi-angle-double-right" onClick={() => onSubmitLiquidaciones(liquidaciones.filter(l => l.tipo === "Actual").map(m => m.operacion)[0], liquidaciones.filter(l => l.tipo === "Actual").map(m => m.idPuesto)[0], liquidaciones.filter(l => l.tipo === "Actual").map(m => m.operacion)[0])} label={"Liquidar Los Seleccionados"} className="p-button-rounded p-button-success mr-2 mb-2" />
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setEmpleadosFilter(e.target.value)} placeholder="Buscar..." />
            </span>
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
                        <Button className="p-button-raised p-button-danger mr-2 mb-2" label='Finalizar Maniobra' onClick={() => onSubmitFinalizarManiobra(datosManiobra.id)}></Button>
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
                                    <InputText value={datosManiobra.produccion} onChange={(e) => actualizarDatosManiobra("produccion", e.target.value)} />
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
                <Dialog className="card p-fluid" header="Puestos de la Operacion" style={{ width: '70vw' }} visible={displaymenuManiobra} modal onHide={() => setDisplaymenuManiobra(false)}>
                    <DataTable value={composicionManiobra} responsiveLayout="scroll"  >
                        <Column field="puesto" header="Puesto" sortable></Column>
                        <Column field="cantidad" header="Mínima" sortable></Column>
                        <Column field="liquidadas" header="Liquidadas" sortable></Column>
                        <Column field="progreso" header="Progreso" body={progressbarTemplate} sortable></Column>
                        <Column headerStyle={{ width: '4rem' }} body={accionComposicionTemplate}></Column>
                    </DataTable>
                </Dialog>
                <Sidebar visible={liquidacionesVisibles} header={"Liquidacion de jornales"} fullScreen onHide={() => setLiquidacionesVisibles(false)}>
                    <div className="flex">
                        {liquidaciones.filter(l => l.tipo === "Anterior").length > 0 ? <DataTable header={headerTurnoAnterior} value={liquidaciones.filter(m => m.tipo === 'Anterior')} responsiveLayout="scroll"  >
                            <Column field="nombre" header="Nombre" sortable body={empleadoNombreTemplate}></Column>
                            <Column field="empleado" header="Cuil" sortable></Column>
                            <Column field="llave" header="Llave" sortable body={empleadoLlaveTemplate}></Column>
                            <Column headerStyle={{ width: '4rem' }} body={liquidacionesAnteriorActionTemplate}></Column>
                        </DataTable>
                            : <div className="border-round border-1 surface-border p-4">
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
                            </div>}
                        <Divider layout="vertical" />
                        <DataTable header={headerTurnoActual} value={liquidaciones.filter(m => m.tipo === 'Actual')} responsiveLayout="scroll"  >
                            <Column field="nombre" header="Nombre" sortable body={empleadoNombreTemplate}></Column>
                            <Column field="empleado" header="Cuil" sortable></Column>
                            <Column field="llave" header="Llave" sortable body={empleadoLlaveTemplate}></Column>
                            <Column headerStyle={{ width: '4rem' }} body={liquidacionesActionTemplate}></Column>
                        </DataTable>
                        <Divider layout="vertical" />
                        {liquidaciones.filter(l => l.tipo === "Posterior").length > 0 ? <DataTable header={headerTurnoSiguiente} value={liquidaciones.filter(m => m.tipo === 'Posterior')} responsiveLayout="scroll"  >
                            <Column field="nombre" header="Nombre" sortable body={empleadoNombreTemplate}></Column>
                            <Column field="empleado" header="Cuil" sortable></Column>
                            <Column field="llave" header="Llave" sortable body={empleadoLlaveTemplate}></Column>
                            <Column headerStyle={{ width: '4rem' }} body={liquidacionesSiguienteActionTemplate}></Column>
                        </DataTable>
                            : <div className="border-round border-1 surface-border p-4">
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
                            </div>}
                    </div>
                    <Sidebar visible={empleadosVisibles} position="left" style={{ width: '60em' }} onHide={() => setEmpleadosVisibles(false)}>
                        <DataTable ref={dt} value={empleados} selection={selectedEmpleados} onSelectionChange={(e) => setSelectedEmpleados(e.value)}
                            dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} empleados"
                            globalFilter={empleadosFilter} emptyMessage="Sin Datos." header={headerEmpleados} responsiveLayout="scroll">
                            <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                            <Column field="nombre" header="Nombre" sortable></Column>
                            <Column field="cuil" header="Cuil" sortable></Column>
                            <Column field="puestoDetalle" header="Puesto" sortable></Column>
                            <Column headerStyle={{ width: '4rem' }} body={empleadosActionTemplate}></Column>
                        </DataTable>
                    </Sidebar>
                </Sidebar>
            </div >

        );
    }

    useEffect(() => {
        if (activo === true) {
            fetchOperations();
            fetchManiobras();
        }
    }, [activo,setOperations,setManiobrasActivas]);

    return (
        activo ? (
            <div className="col-12">
                <div className="card">
                    <h5>Operaciones</h5>
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