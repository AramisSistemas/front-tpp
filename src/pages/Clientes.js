import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Skeleton } from 'primereact/skeleton';
import { default as React, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomerAdd from '../components/CustomerAdd';
import { messageService } from '../redux/messagesducks';
import { CustomerService } from '../service/CustomerService';

const Clientes = () => {
    const dispatch = useDispatch();

    const customerService = new CustomerService();

    const activo = useSelector(store => store.users.activo);
    const perfil = useSelector(store => store.users.perfil); 
    const load = useSelector(store => store.clientes.loading); 

    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState(null);

    const fetchCustomers = async () => {
        setLoading(true);
        await customerService.GetClientes().then(
            data => { setCustomers(data); setLoading(false) })
            .catch((error) => dispatch(messageService(false, error.response.data.message, error.response.status)));
    }

    useEffect(() => {
        if (activo && perfil > 1) {
            fetchCustomers();
        } 
    }, [activo, perfil]);

    useEffect(() => {
        if (!load) {
            fetchCustomers();
        } 
    }, [load]);

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <CustomerAdd></CustomerAdd>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );
    return (
        activo ? (
            <div className="col-12">
                <div className="card">
                    <h5>Clientes</h5>
                    <DataTable value={customers} dataKey="id" loading={loading}
                        paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} clientes"
                        globalFilter={filter} emptyMessage="Sin Datos." header={header} responsiveLayout="scroll">
                        <Column field="nombre" header="R.Social" sortable />
                        <Column field="cuit" header="Cuit" sortable />
                        <Column field="responsabilidad" header="Iva" sortable />
                        <Column field="domicilio" header="Domicilio" sortable />
                        <Column field="telefono" header="Contacto" sortable />
                        <Column headerStyle={{ width: '4rem' }}  ></Column>
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

export default React.memo(Clientes, comparisonFn);  