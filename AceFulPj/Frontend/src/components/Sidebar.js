import React from 'react';
import './Sidebar.css';
import { FaBell, FaCar, FaUser } from 'react-icons/fa';

function Sidebar() {
    return (
        <div className="sidebar bg-light">
            <ul className="list-group">
                <li className="list-group-item">
                    <FaBell className="me-2" /> Alert Service
                </li>
                <li className="list-group-item">
                    <FaCar className="me-2" /> Car Service
                </li>
                <li className="list-group-item active">
                    <FaUser className="me-2" /> User Service
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;
