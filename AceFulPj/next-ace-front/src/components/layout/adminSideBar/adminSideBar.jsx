import '@coreui/coreui/dist/css/coreui.min.css';
import { cilCarAlt, cilWarning, cilBell, cilUser, cilExitToApp } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import Cookies from "js-cookie";

export default function AdminSideBar() {

    const handleLogout = () => {
        Cookies.remove("loggedin");
        window.location.href = "/";
    };

    const menuItems = [
        { href: "/admin/car", label: "Car", icon: cilCarAlt },
        { href: "/admin/anomalieMap", label: "AnomalieMap", icon: cilWarning },
        { href: "/admin/anomalie", label: "TrajectoireList", icon: cilWarning },
        { href: "/admin/alert", label: "Alert", icon: cilBell },
        { href: "/admin/user", label: "User", icon: cilUser },
    ];

    return (
        <div className="sidebar sidebar-narrow-unfoldable border-end">
            <div className="sidebar-header border-bottom">
                <div className="sidebar-brand">3B</div>
            </div>
            <ul className="sidebar-nav">
                <li className="nav-title">My Website</li>
                {menuItems.map((item, index) => (
                    <li key={index} className="nav-item">
                        <a className="nav-link" href={item.href}>
                            <CIcon icon={item.icon} className="nav-icon" /> {item.label}
                        </a>
                    </li>
                ))}
                <li className="nav-item mt-auto">
                    <a
                        className="nav-link"
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            handleLogout();
                        }}
                    >
                        <CIcon icon={cilExitToApp} className="nav-icon" /> Logout
                    </a>
                </li>
            </ul>
        </div>
    );
}
