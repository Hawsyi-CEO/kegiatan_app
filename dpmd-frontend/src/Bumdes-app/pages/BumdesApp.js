import React, { useState } from 'react';
import BumdesForm from './BumdesForm';
import BumdesDashboard from './BumdesDashboard';
import Login from './Login';
import BumdesEditDashboard from './BumdesEditDashboard';
import { FaPlus, FaChartBar, FaUserEdit, FaSignOutAlt } from 'react-icons/fa';
import './bumdes.css';

function BumdesApp() {
    const [view, setView] = useState('form');
    const [bumdesData, setBumdesData] = useState(null); // Ubah dari bumdesId menjadi bumdesData

    const handleNavClick = (newView) => {
        // Jika navigasi ke halaman lain saat sudah login, reset data
        if (view !== 'login' && view !== 'edit') {
            setBumdesData(null);
        }
        setView(newView);
    };

    // Terima data lengkap setelah login berhasil
    const handleLoginSuccess = (data) => {
        setBumdesData(data);
        setView('edit');
    };

    const handleLogout = () => {
        setBumdesData(null);
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
                // Teruskan data lengkap ke BumdesEditDashboard
                if (!bumdesData) {
                    return (
                        <div className="loading-message">
                            Data BUMDes tidak ditemukan. Silakan login kembali.
                        </div>
                    );
                }
                return <BumdesEditDashboard initialData={bumdesData} onLogout={handleLogout} />;
            default:
                return <BumdesForm />;
        }
    };

    return (
        <div className="app-container">
            <div className="main-content-wrapper">
                <div className="header-card">
                    <div className="header-content">
                        <div>
                            <h1 className="header-title">Data BUMDes</h1>
                            <p className="header-subtitle">Aplikasi Pengelolaan Data BUMDes</p>
                        </div>
                    </div>
                    {view === 'edit' && (
                        <button onClick={handleLogout} className="logout-button">
                            <FaSignOutAlt /> Keluar
                        </button>
                    )}
                </div>

                <div className="nav-buttons-container">
                    <button
                        onClick={() => handleNavClick('form')}
                        className={`nav-button ${view === 'form' ? 'active' : ''}`}
                    >
                        <FaPlus className="nav-icon" /> Formulir
                    </button>
                    <button
                        onClick={() => handleNavClick('statistik')}
                        className={`nav-button ${view === 'statistik' ? 'active' : ''}`}
                    >
                        <FaChartBar className="nav-icon" /> Statistik
                    </button>
                    <button
                        onClick={() => handleNavClick('login')}
                        className={`nav-button ${view === 'login' || view === 'edit' ? 'active' : ''}`}
                    >
                        <FaUserEdit className="nav-icon" /> Login & Edit
                    </button>
                </div>

                <div className="content-card">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

export default BumdesApp;