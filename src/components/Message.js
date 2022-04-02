import { Toast } from 'primereact/toast';
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
const Message = () => {

    const message = useSelector(store => store.messages.message)
    const status = useSelector(store => store.messages.status)
    const toast = useRef();

    useEffect(() => {
        if (message !== '' && message !== null) {
            switch (status) {
                case 200: toast.current.show({ severity: 'success', summary: 'Correcto', detail: message, life: 3000 });
                    break;
                case 400: toast.current.show({ severity: 'warn', summary: 'Verifique', detail: message, life: 3000 });
                    break;
                case 401: toast.current.show({ severity: 'error', summary: 'Autenticacion', detail: message, life: 3000 });
                    break;
                default: toast.current.show({ severity: 'info', summary: 'Atendeme', detail: message, life: 3000 });
            }
        }
    }, [message, status]);

    return (
        <><Toast ref={toast} /></>
    )
}

export default Message