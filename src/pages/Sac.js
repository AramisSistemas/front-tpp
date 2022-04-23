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
import { ToggleButton } from 'primereact/togglebutton';

const Sac = () => {
    //CONSTANTES
    const dispatch = useDispatch();
    const dt = useRef(null);
    const operationService = new OperationService();

    const activo = useSelector(store => store.users.activo);

    //liquidaciones const
    const [empresa, setEmpresa] = useState([]);
    const [periodos, setPeriodos] = useState([]);
    const [liquidaciones, setLiquidaciones] = useState([]);
    const [liquidacionesDet, setLiquidacionesDet] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedRows, setExpandedRows] = useState(null);

    //jornales
    const [jornalesFilter, setJornalesFilter] = useState(null);
    const [jornalesRows, setJornalesRows] = useState(null);
    const [selectedJornales, setSelectedJornales] = useState([]);
    const [jornalActivo, setJornalActivo] = useState(null);
    const jornalesItems = [
        {
            label: 'Pdf',
            icon: 'pi pi-file-pdf',
            command: () => { }//exportarJornalPdf() }
        },
        {
            label: 'Excel',
            icon: 'pi pi-file-excel',
            command: () => { }// console.log(jornalActivo) }
        },
        {
            label: 'Txt',
            icon: 'pi pi-file',
            command: () => { console.log(selectedJornales) }
        },
    ];

    //detalleliquidaciones
    const [detalleLiquidaciones, setDetalleLiquidaciones] = useState([]);

    //METODOS
    const fetchSac = async (año) => {
        await operationService.GetSacByPeriodo(año).then(data => {
            setEmpresa(data.empresaDtos);
            setPeriodos(data.sacPeriods);
            setLiquidaciones(data.sacModels);
            setLiquidacionesDet(data.liquidacionDetalleModel);
            setLoading(false);
        })
            .catch((error) => dispatch(messageService(false, error.response.data.message, error.response.status)));
    }

    //FUNCTIONS 

    useEffect(() => {
        if (activo === true) {
            fetchSac();
        }
    }, [activo]);

    //TEMPLATES 

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">

        </div>
    );

    const headerJornalesTemplate = () => {
        return (
            <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                <span className="image-text font-bold">Listado de Jornales</span>
                <span className="block mt-2 md:mt-0 p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText type="search" onInput={(e) => setJornalesFilter(e.target.value)} placeholder="Buscar..." />
                </span>
            </div>
        );
    }

    const actionJornalesBodyTemplate = (rowData) => {
        return <SplitButton icon="pi pi-print" model={jornalesItems} menuStyle={{ width: '12rem' }} onShow={() => setJornalActivo(rowData)} className="p-button-success mr-2 mb-2" ></SplitButton>;
    }

    const liquidacionesTemplate = (data) => {
        return (
            <DataTable value={liquidaciones.filter(l => l.semestre === data.semestre && l.año ===data.año)} dataKey="liquidacion" responsiveLayout="scroll"
                header={headerJornalesTemplate} rowExpansionTemplate={detallesTemplate}
                expandedRows={jornalesRows} onRowToggle={(e) => setJornalesRows(e.data)}
                ref={dt} globalFilter={jornalesFilter}
                selection={selectedJornales} onSelectionChange={(e) => setSelectedJornales(e.value)}
            >
                <Column expander style={{ width: '3em' }} />
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                <Column field="liquidacion" header="Nro" sortable />
                <Column field="cuil" header="Cuil" sortable />
                <Column field="nombre" header="Nombre" sortable />
                <Column field="neto" header="Neto" sortable />
                <Column headerStyle={{ width: '4rem' }} body={actionJornalesBodyTemplate} ></Column>
            </DataTable>
        )
    }

    const headerDetallesTemplate = (
        <span className="image-text font-bold">Detalles del Jornal</span>
    )

    const haberesDetalleTemplate = (rowData) => {
        return (
            rowData.haber ? <Badge className="mr-2" value={rowData.monto} severity={'success'} ></Badge> : ''
        )
    }

    const descuentosDetalleTemplate = (rowData) => {
        return (
            !rowData.haber ? <Badge className="mr-2" value={rowData.monto} severity={'warning'} ></Badge> : ''
        )
    }

    const detallesTemplate = (data) => {
        return (
            <DataTable value={liquidacionesDet.filter(l => l.liquidacion === data.liquidacion)} dataKey="id" responsiveLayout="scroll"
                header={headerDetallesTemplate}
                expandedRows={jornalesRows} onRowToggle={(e) => setJornalesRows(e.data)}
            >
                <Column field="codigo" header="Codigo" sortable />
                <Column field="concepto" header="Concepto" sortable />
                <Column field="cantidad" header="Un. %" sortable />
                <Column field="monto" header="Haberes" sortable body={haberesDetalleTemplate} />
                <Column field="monto" header="Descuentos" sortable body={descuentosDetalleTemplate} />
                <Column headerStyle={{ width: '4rem' }} ></Column>
            </DataTable>
        )
    }

    const fechaTemplate = (rowData) => {
        return <Moment format='D/MM/yyyy'>{rowData.fecha}</Moment>
    }
    return (
        activo ? (
            <div className="col-12">
                <div className="card">
                    <h5>Liquidaciones SAC</h5>
                    <DataTable value={periodos} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)} responsiveLayout="scroll"
                        rowExpansionTemplate={liquidacionesTemplate} dataKey="semestre" header={header} loading={loading}
                        paginator rows={5} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} semestres"
                        emptyMessage="Sin Datos." >
                        <Column expander style={{ width: '3em' }} />
                        <Column field="año" header="Año" sortable />
                        <Column field="semestre" header="Semestre" />
                    </DataTable>
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

export default React.memo(Sac, comparisonFn);