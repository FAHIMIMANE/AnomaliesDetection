import React, { useState } from 'react';
import Hero from './components/Hero';
import Features from './components/Features';
import Footer from './components/Footer';
import Header from './components/Header';
import Login from './components/login/login';
import AnimatedBackground from './components/AnimatedBackground';
import './App.css';

function App() {
    const [currentPage, setCurrentPage] = useState('home'); // State to manage navigation

    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return (
                    <>
                        <Hero />
                        <div id="features">
                            <Features />
                        </div>
                        <Footer />
                    </>
                );
            case 'login':
                return <Login />;
            default:
                return null;
        }
    };

    return (
        <div className="app-container">
            {/* Animated Background */}
            <div id="animated-bg">
                <AnimatedBackground />
            </div>

            {/* Header */}
            <Header onNavigate={setCurrentPage} />

            {/* Main Content */}
            <main>{renderPage()}</main>
        </div>
    );
}

export default App;
