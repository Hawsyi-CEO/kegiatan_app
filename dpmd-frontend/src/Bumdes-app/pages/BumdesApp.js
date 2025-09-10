import React, { useState } from 'react';
import BumdesForm from './BumdesForm';
import BumdesDashboard from './BumdesDashboard';
import Login from './Login';
import BumdesEditDashboard from './BumdesEditDashboard'; // Pastikan nama ini sudah benar
import './bumdes.css';

function BumdesApp() {
    const [view, setView] = useState('form');
    const [bumdesId, setBumdesId] = useState(null);

    const handleNavClick = (newView) => {
        setView(newView);
    };

    const handleLoginSuccess = (id) => {
        setBumdesId(id);
        setView('edit');
    };

    const handleLogout = () => {
        setBumdesId(null);
        setView('login');
    };

    const renderContent = () => {
        switch (view) {
            case 'form':
                return <BumdesForm />;
            case 'statistik':
                return <BumdesDashboard />;
            case 'login':
                return <Login onLoginSuccess={handleLoginSuccess} />;
            case 'edit':
                return <BumdesEditDashboard bumdesId={bumdesId} onLogout={handleLogout} />;
            default:
                return <BumdesForm />;
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="custom-container">
                <div className="header-card">
                    <div className="header-content">
                        <div>
                            <h1 className="header-title">Data BUMDes</h1>
                            <p className="header-subtitle">Aplikasi Pengelolaan Data BUMDes</p>
                        </div>
                    </div>
                </div>

                <div className="nav-buttons-container">
                    <button
                        onClick={() => handleNavClick('form')}
                        className={`nav-button ${view === 'form' ? 'active' : ''}`}
                    >
                        Formulir
                    </button>
                    <button
                        onClick={() => handleNavClick('statistik')}
                        className={`nav-button ${view === 'statistik' ? 'active' : ''}`}
                    >
                        Statistik
                    </button>
                    <button
                        onClick={() => handleNavClick('login')}
                        className={`nav-button ${view === 'login' || view === 'edit' ? 'active' : ''}`}
                    >
                        Login & Edit
                    </button>
                </div>

                {renderContent()}
            </div>
        </div>
    );
}

export default BumdesApp;