import React from 'react';
import './Header.css';

function Header({ onNavigate }) {
    return (
        <nav className="navbar">
            <a
                className="navbar-brand"
                href="/"
                onClick={(e) => {
                    e.preventDefault();
                    onNavigate('home');
                }}
            >
                Trajectory App
            </a>
            <div className="navbar-links">
                <a
                    href="#features"
                    onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
                    }}
                >
                    Features
                </a>
                <a
                    href="/login"
                    onClick={(e) => {
                        e.preventDefault();
                        onNavigate('login');
                    }}
                >
                    Login
                </a>
            </div>
        </nav>
    );
}

export default Header;
