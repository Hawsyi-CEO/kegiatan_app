import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import KegiatanList from './components/KegiatanList';
import BumdesApp from './Bumdes-app/pages/BumdesApp'; 
import './kegiatan.css'; // Pastikan file ini ada di folder src

function App() {
  const [view, setView] = useState('dashboard');
  const [refreshKey, setRefreshKey] = useState(0);
  const [dateFilter, setDateFilter] = useState('');
  const [bidangFilter, setBidangFilter] = useState('');

  const handleNavClick = (newView) => {
    setView(newView);
    setRefreshKey(prevKey => prevKey + 1);
    setDateFilter('');
    setBidangFilter('');
  };

  const handleDashboardFilter = (filterType, id_bidang = '') => {
    setView('list');
    setDateFilter(filterType);
    setBidangFilter(id_bidang);
  };

  // Komponen utama untuk aplikasi Perjalanan Dinas
  const MainApp = () => (
    <>
      <div className="header-card">
        <div className="header-content">
          <div className="header-icon-container">
            <i className="fas fa-plane-departure text-xl"></i>
          </div>
          <div>
            <h1 className="header-title">DPMD</h1>
            <p className="header-subtitle">Aplikasi Perjalanan Dinas</p>
          </div>
        </div>
      </div>
      <div className="nav-buttons-container">
        <button
          onClick={() => handleNavClick('dashboard')}
          className={`nav-button ${view === 'dashboard' ? 'active' : ''}`}
        >
          <i className="fas fa-home mr-2"></i> Dashboard
        </button>
        <button
          onClick={() => handleNavClick('list')}
          className={`nav-button ${view === 'list' ? 'active' : ''}`}
        >
          <i className="fas fa-list-ul mr-2"></i> Daftar Kegiatan
        </button>
      </div>

      {view === 'dashboard' ? (
        <Dashboard 
          key={refreshKey}
          onFilterClick={handleDashboardFilter}
        />
      ) : (
        <KegiatanList 
          key={refreshKey}
          initialDateFilter={dateFilter}
          initialBidangFilter={bidangFilter}
        />
      )}
    </>
  );

  return (
    <Router>
      <div className="bg-gray-100 p-0">
        <div className="custom-container">
          <Routes>
            {/* Rute untuk aplikasi Perjalanan Dinas di jalur utama */}
            <Route path="/" element={<MainApp />} />
            
            {/* Rute khusus untuk aplikasi BUMDes */}
            {/* Semua rute di dalam BumdesApp akan diawali dengan /bumdes */}
            <Route path="/bumdes/*" element={<BumdesApp />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;