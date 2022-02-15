import React, { useState} from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { useDispatch } from 'react-redux'
import { logout } from '../redux/usersducks'

const Logout = () => {

    const [displayConfirmation, setDisplayConfirmation] = useState(false);
    const dispatch = useDispatch()

    const onLogout = () => {
        dispatch(logout());
        setDisplayConfirmation(false);
    }
    const confirmationDialogFooter = (
        <>
            <Button type="button" label="No" icon="pi pi-times" onClick={() => setDisplayConfirmation(false)} className="p-button-text" />
            <Button type="button" label="Si" icon="pi pi-check" onClick={() => onLogout()} className="p-button-text" autoFocus />
        </>
    );

    return <>
        <button onClick={() => setDisplayConfirmation(true)} className="p-link layout-topbar-button" >
            <i className="pi pi-sign-out" />
            <span>Logout</span></button>
        <Dialog header="Confirmar" visible={displayConfirmation} onHide={() => setDisplayConfirmation(false)} style={{ width: '350px' }} modal footer={confirmationDialogFooter}>
            <div className="flex align-items-center justify-content-center">
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                <span>Estás seguro de Salir?</span>
            </div>
        </Dialog>
    </>;
};

export default Logout;




