import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { ConfirmPopup } from 'primereact/confirmpopup';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Skeleton } from 'primereact/skeleton';
import { Toast } from 'primereact/toast';
import { default as React, useEffect, useRef, useState } from 'react';
import { Moment } from 'react-moment';
import { useDispatch, useSelector } from 'react-redux';
import { autorizarEmbargo, eliminarEmbargo } from '../redux/empleadosducks';
import { messageService } from '../redux/messagesducks';
import { EmpleadoService } from '../service/EmpleadoService';

const Embargos = () => {
    const dispatch = useDispatch();

    const empleadoService = new EmpleadoService();

    const activo = useSelector(store => store.users.activo);

    const toast = useRef();

    const [embargos, setEmbargos] = useState([]);
    const [visible, setVisible] = useState(false);
    const [loadingEmbargos, setLoadingEmbargos] = useState(true);
    const [embargosFilter, setEmbargosFilter] = useState(null);

    const fetchEmbargos = async () => {
        setLoadingEmbargos();
        await empleadoService.getEmbargos().then(data => { setEmbargos(data); setLoadingEmbargos(false) }).catch((error) => dispatch(messageService(false, error.response.data.message, error.response.status)));
    }

    const actionEmbargoBodyTemplate = (rowData) => {
        return (<>
            <ConfirmPopup target={document.getElementById('button')} visible={visible} onHide={() => setVisible(false)} message="Confirma?"
                icon="pi pi-exclamation-triangle" accept={() => accept(rowData.id)} reject={() => reject(rowData.id)} />
            <Button icon="pi pi-check" id="button" className="p-button-rounded p-button-info p-button-text mr-2 mb-2" onClick={() => setVisible(true)} />
        </>
        )
    }

    const headerEmbargos = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setEmbargosFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const fechaFinTemplate = (rowData) => {
        return <Moment format='D/MM/yyyy'>{rowData.fin}</Moment>
    }

    const accept = (data) => {
        dispatch(autorizarEmbargo(data)).then(
            fetchEmbargos());
        toast.current.show({ severity: 'info', summary: 'Confirmando...', detail: 'En proceso...', life: 3000 });
    };

    const reject = (data) => {
        dispatch(eliminarEmbargo(data)).then(
            fetchEmbargos());
        toast.current.show({ severity: 'info', summary: 'Rechazando...', detail: 'En proceso...', life: 3000 });
    };

    useEffect(() => {
        if (activo) {
            fetchEmbargos();
        }
    }, [setEmbargos, activo]);

    return (
        activo ? (
            <div className="col-12">
                <div className="card">
                    <h5>Autorizar Embargos</h5>
                    <DataTable value={embargos} dataKey="id" loading={loadingEmbargos}
                        paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} embargos"
                        globalFilter={embargosFilter} emptyMessage="Sin Datos." header={headerEmbargos} responsiveLayout="scroll">
                        <Column field="nombre" header="Nombre" sortable />
                        <Column field="cuil" header="Cuil" sortable />
                        <Column field="monto" header="Monto %" sortable />
                        <Column field="total" header="Total" sortable />
                        <Column field="concepto" header="Concepto" sortable />
                        <Column field="fin" header="Finaliza" sortable body={fechaFinTemplate} />
                        <Column field="operador" header="Operador" sortable />
                        <Column headerStyle={{ width: '4rem' }} body={actionEmbargoBodyTemplate}></Column>
                    </DataTable>
                </div>
                <Toast ref={toast} />
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

export default React.memo(Embargos, comparisonFn);  