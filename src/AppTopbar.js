import classNames from 'classnames';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ChangePass from './components/ChangePass';
import Login from './components/Login';
import Logout from './components/Logout';
import Register from './components/Register';
import { logout } from './redux/usersducks';

export const AppTopbar = (props) => {
    const dispatch = useDispatch();
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
                    dispatch(logout);
                    break;
                default: toast.current.show({ severity: 'info', summary: 'Atendeme', detail: message, life: 3000 });
            }
        }
    }, [message, status, dispatch])

    return (
        <div className="layout-topbar">
            <Link to="/" className="layout-topbar-logo">
                <img src={props.layoutColorMode === 'light' ? 'assets/layout/images/logo-dark.svg' : 'assets/layout/images/logo-white.svg'} alt="logo" />
                <span>SAKAI</span>
            </Link>

            <button type="button" className="p-link  layout-menu-button layout-topbar-button" onClick={props.onToggleMenuClick}>
                <i className="pi pi-bars" />
            </button>

            <button type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={props.onMobileTopbarMenuClick}>
                <i className="pi pi-ellipsis-v" />
            </button>

            <ul className={classNames("layout-topbar-menu lg:flex origin-top", { 'layout-topbar-menu-mobile-active': props.mobileTopbarMenuActive })}>
                <li>
                    <button className="p-link layout-topbar-button" onClick={props.onMobileSubTopbarMenuClick}>
                        <i className="pi pi-calendar" />
                        <span>Events</span>
                    </button>
                </li>
                <li>
                    <ChangePass />
                </li>
                <li>
                    <Register />
                </li>
                <li>
                    <Login />
                </li>
                <li>
                    <Logout />
                </li>
            </ul>
            <Toast ref={toast} />
        </div>
    );
}
