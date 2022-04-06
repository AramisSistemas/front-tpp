import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { confirmDialog } from 'primereact/confirmdialog';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Skeleton } from 'primereact/skeleton';
import { default as React, useEffect, useRef, useState } from 'react';
import Moment from 'react-moment';
import { useDispatch, useSelector } from 'react-redux';
import { liquidacionesPay } from '../redux/liquidacionesducks';
import { messageService } from '../redux/messagesducks';
import { OperationService } from '../service/OperationService';

const Pagos = () => {
    const dispatch = useDispatch();

    const operationService = new OperationService();

    const activo = useSelector(store => store.users.activo);
    const perfil = useSelector(store => store.users.perfil);

    const toast = useRef();
    const dt = useRef(null);

    const [pagos, setPagos] = useState([]);
    const [liquidaciones, setLiquidaciones] = useState([]);
    const [selectedPagos, setSelectedPagos] = useState([]);
    const [pagosRows, setPagosRows] = useState(null);
    const [loadingPagos, setLoadingPagos] = useState(true);
    const [pagosFilter, setPagosFilter] = useState(null);

    const fetchPagos = async () => {
        setLoadingPagos(true);
        await operationService.GetLiquidacionPayPendientes().then(data => {
            setPagos(data.liquidacionesPagos);
            setLiquidaciones(data.liquidacionModel);
            setLoadingPagos(false)
        }).catch((error) => dispatch(messageService(false, error.response.data.message, error.response.status)));
    }

    const headerPagos = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <Button onClick={() => confirmPago()} icon="pi pi-dollar" label="Generar Pago" className="p-button-help"></Button>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setPagosFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const jornalesTemplate = (data) => {
        return (
            <DataTable value={liquidaciones.filter(l => l.idEmpleado === data.idEmpleado)} dataKey="liquidacion" responsiveLayout="scroll">
                <Column field="liquidacion" header="Nro" sortable />
                <Column field="fecha" header="Fecha" sortable body={fechaTemplate} />
                <Column field="destino" header="Destino" sortable />
                <Column field="puesto" header="Puesto" sortable />
                <Column field="turno" header="Turno" sortable />
                <Column field="llave" header="Llave" sortable body={llaveBodyTemplate} />
                <Column field="neto" header="Neto" sortable />
            </DataTable>
        )
    }

    const llaveBodyTemplate = (rowData) => {
        return <Badge size="medium" value={rowData.llave} severity={rowData.llave > 1 ? 'danger' :
            rowData.llave === 1 ? 'success' : 'warning'}
            style={{ textAlign: 'center' }}></Badge>
    }

    const fechaTemplate = (rowData) => {
        return <Moment format='D/MM/yyyy'>{rowData.fecha}</Moment>
    }

    const confirmPago = () => {
        let total = 0;
        let cantidad = 0;
        selectedPagos.forEach(x => {
            total = total + x.total;
            cantidad = cantidad + 1;
        });
        confirmDialog({
            message: 'Genera el pago por un TOTAL de $ ' + total,
            header: 'Confirma Pago',
            icon: 'pi pi-info-circle',
            position: 'top',
            accept,
            reject
        });
    };

    const accept = () => {
        try {
            let lm = []
            selectedPagos.forEach(e =>
                liquidaciones.filter(liq => liq.idEmpleado === e.idEmpleado).forEach(l =>
                    lm.push({
                        liquidacion: l.liquidacion
                    })
                )
            );
            var json = JSON.stringify(lm);
            dispatch(liquidacionesPay(json, selectedPagos)).then(
                fetchPagos())
        } catch (error) {
            messageService(true, error.message, 500)
        }
        toast.current.show({ severity: 'info', summary: 'Confirma', detail: 'En proceso...', life: 3000 });
    }

    const reject = () => {
        toast.current.show({ severity: 'info', summary: 'Anula', detail: 'Anulando...', life: 3000 });
        setSelectedPagos([]);
    }

    useEffect(() => {
        if (activo === true && perfil > 1) {
            fetchPagos();
        }
    }, [activo,perfil, setPagos]);

    return (
        activo && perfil > 1 ? (
            <div className="col-12">
                <div className="card">
                    <h5>Pagos Pendientes</h5>
                    <DataTable value={pagos} dataKey="idEmpleado" loading={loadingPagos}
                        paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} pagos"
                        globalFilter={pagosFilter} emptyMessage="Sin Datos." header={headerPagos} responsiveLayout="scroll"
                        rowExpansionTemplate={jornalesTemplate}
                        expandedRows={pagosRows} onRowToggle={(e) => setPagosRows(e.data)}
                        ref={dt} selection={selectedPagos} onSelectionChange={(e) => setSelectedPagos(e.value)}                    >
                        <Column expander style={{ width: '3em' }} />
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                        <Column field="nombre" header="Nombre" sortable />
                        <Column field="cuit" header="Cuil" sortable />
                        <Column field="cbu" header="Cbu" sortable />
                        <Column field="total" header="Total" sortable />
                    </DataTable>
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

export default React.memo(Pagos, comparisonFn);  