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
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { default as React, Fragment, useEffect, useRef, useState } from 'react';
import { set } from 'react-hook-form';
import Moment from 'react-moment';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { liquidacionDelete, liquidacionesAdd, liquidacionesDelete } from '../redux/liquidacionesducks';
import { messageService } from '../redux/messagesducks';
import { actualizarManiobra, cerrarManiobra, confirmarManiobra, eliminarManiobra, finalizarManiobra, ingresarManiobra, llaveManiobra, pasarDatosManiobra, reabrirManiobra } from '../redux/operationsducks';
import { logout } from '../redux/usersducks';
import { EmpleadoService } from '../service/EmpleadoService';
import { OperationService } from '../service/OperationService';
import _ from "lodash";

const Jornales = () => {
  const dispatch = useDispatch();
  const operationService = new OperationService();

  const activo = useSelector(store => store.users.activo);
  const operacion = useSelector(store => store.operations.datosManiobra)
  const message = useSelector(store => store.messages.message)
  const status = useSelector(store => store.messages.status)
  const toast = useRef();


  const [jornales, setJornales] = useState([]);
  const [selectedJornales, setSelectedJornales] = useState([])
  const [jornalesFilter, setJornalesFilter] = useState(null);
  const [expandedRows, setExpandedRows] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchLiquidaciones = async (operacion) => { 
    await operationService.GetLiquidacionesByOp(operacion)
      .then(data => { 
           setJornales(data); setLoading(false)
        }) 
      .catch((error) => dispatch(messageService(false, error.response.data.message, error.response.status)));

  }

  const expandAll = () => {
    let _expandedRows = {};
    jornales.forEach(p => _expandedRows[`${p.id}`] = true);
    setExpandedRows(_expandedRows);
  }

  const collapseAll = () => {
    setExpandedRows(null);
  }

  const headerJornales = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <div className="table-header-container">
        <Button icon="pi pi-plus" label="Ver Maniobras" onClick={expandAll} className="mr-2 mb-2" />
        <Button icon="pi pi-minus" label="Ocultar Maniobras" onClick={collapseAll} className="mb-2" />
      </div>
      <span className="block mt-2 md:mt-0 p-input-icon-left">
        <i className="pi pi-search" />
        <InputText type="search" onInput={(e) => setJornalesFilter(e.target.value)} placeholder="Buscar..." />
      </span>
    </div>
  );

  const jornalesTemplate = (jornales) => {
    return (
      <div className="orders-subtable">
        <h5>Jornales</h5>

      </div>)
  }

  useEffect(() => {
    if (activo === true && operacion !== null) {
      fetchLiquidaciones(operacion.id).catch((error) => error.response.status === 401 ? dispatch(logout()) : dispatch(messageService(false, error.response.data.message, error.response.status)));
      if (message !== '' && message !== null) {
        switch (status) {
          case 200: toast.current.show({ severity: 'success', summary: 'Correcto', detail: message, life: 3000 });
            break;
          case 400: toast.current.show({ severity: 'warn', summary: 'Verifique', detail: message, life: 3000 });
            break;
          case 401: toast.current.show({ severity: 'error', summary: 'Autenticacion', detail: message, life: 3000 });
            dispatch(logout());
            break;
          default: toast.current.show({ severity: 'info', summary: 'Atendeme', detail: message, life: 3000 });
        }
      }
    }
  }, [activo, message, status, dispatch]);

  return (
    activo ? (
      <div className="col-12">
        <div className="card">
          <h5>Jornales</h5>
          <DataTable value={jornales.filter(j => j.codigo === 'BAS')} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)} responsiveLayout="scroll"
            rowExpansionTemplate={jornalesTemplate} dataKey="id" header={headerJornales} loading={loading}
            paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} jornales"
            globalFilter={jornalesFilter} emptyMessage="Sin Datos."
          >
            <Column expander style={{ width: '3em' }} />
            <Column field="liquidacion" header="Nro" sortable />
            <Column field="fecha" header="Fecha" filterField="fecha" dataType="date" style={{ minWidth: '10rem' }} />
            <Column field="cuit" header="Cuit" sortable />
            <Column field="nombre" header="Nombre" sortable />
            <Column field="neto" header="Neto" />
            <Column headerStyle={{ width: '4rem' }} ></Column>
          </DataTable>
        </div>
        <Toast ref={toast} />
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

export default React.memo(Jornales, comparisonFn);   