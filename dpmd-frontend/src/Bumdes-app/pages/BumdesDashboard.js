import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Doughnut, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { FaSearch, FaFilter, FaRedoAlt } from 'react-icons/fa';
import './bumdes.css';

function BumdesDashboard() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState({ search: '', kecamatan: '' });
    const [kecamatanList, setKecamatanList] = useState([]);
    const [modal, setModal] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/bumdes');
                setData(response.data);
                setFilteredData(response.data);
                const uniqueKecamatan = [...new Set(response.data.map(item => item.kecamatan).filter(Boolean))];
                setKecamatanList(uniqueKecamatan.sort());
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Gagal memuat data dari server. 😔');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        let temp = data.filter(item => {
            const matchesSearch = (item.namabumdesa?.toLowerCase().includes(filter.search.toLowerCase()) || item.desa?.toLowerCase().includes(filter.search.toLowerCase()));
            const matchesKecamatan = !filter.kecamatan || item.kecamatan === filter.kecamatan;
            return matchesSearch && matchesKecamatan;
        });
        setFilteredData(temp);
    }, [filter, data]);

    const getChartData = (key) => {
        const counts = filteredData.reduce((acc, item) => {
            const value = item[key] || 'Tidak Diketahui';
            acc[value] = (acc[value] || 0) + 1;
            return acc;
        }, {});
        
        const generateColors = (count) => {
            const colors = [];
            const baseHue = 200; // Blue-green
            for (let i = 0; i < count; i++) {
                const hue = (baseHue + (360 / count) * i) % 360;
                colors.push(`hsl(${hue}, 70%, 60%)`);
            }
            return colors;
        };

        const labels = Object.keys(counts);
        const values = Object.values(counts);
        const colors = generateColors(labels.length);

        return {
            labels: labels,
            datasets: [{
                label: `Jumlah BUMDes`,
                data: values,
                backgroundColor: colors,
                hoverBackgroundColor: colors.map(c => c.replace('70%', '80%')),
                borderColor: colors.map(c => c.replace('70%', '50%')),
                borderWidth: 1,
            }],
        };
    };

    const showDetails = (bumdes) => {
        setModal(bumdes);
    };

    const closeDetails = () => {
        setModal(null);
    };

    if (loading) {
        return <div className="loading-message">Memuat data... 🔄</div>;
    }
    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="dashboard-container">
            <h2 className="dashboard-title">Dashboard Statistik BUMDes</h2>
            
            <div className="chart-grid">
                <div className="chart-card-item">
                    <h3 className="chart-title-item">Status BUMDes</h3>
                    <Bar data={getChartData('status')} />
                </div>
                <div className="chart-card-item">
                    <h3 className="chart-title-item">Jenis Usaha</h3>
                    <Doughnut data={getChartData('JenisUsaha')} />
                </div>
                <div className="chart-card-item">
                    <h3 className="chart-title-item">Status Badan Hukum</h3>
                    <Pie data={getChartData('badanhukum')} />
                </div>
            </div>
            
            <div className="data-table-card">
                <div className="filter-container">
                    <div className="input-with-icon">
                        <FaSearch className="icon" />
                        <input
                            type="text"
                            placeholder="Cari Nama BUMDes atau Desa..."
                            value={filter.search}
                            onChange={e => setFilter({ ...filter, search: e.target.value })}
                            className="filter-input"
                        />
                    </div>
                    <div className="input-with-icon">
                        <FaFilter className="icon" />
                        <select
                            value={filter.kecamatan}
                            onChange={e => setFilter({ ...filter, kecamatan: e.target.value })}
                            className="filter-select"
                        >
                            <option value="">Semua Kecamatan</option>
                            {kecamatanList.map(kec => <option key={kec} value={kec}>{kec}</option>)}
                        </select>
                    </div>
                    <button onClick={() => setFilter({ search: '', kecamatan: '' })} className="reset-button">
                        <FaRedoAlt className="icon" /> Reset
                    </button>
                </div>
                
                <div className="bumdes-card-grid">
                    {filteredData.length > 0 ? (
                        filteredData.map(bumdes => (
                            <div className="bumdes-card-item" key={bumdes.id} onClick={() => showDetails(bumdes)}>
                                <h3 className="bumdes-card-title">{bumdes.namabumdesa || 'Nama Tidak Tersedia'}</h3>
                                <p><strong>Desa:</strong> {bumdes.desa || '-'}</p>
                                <p><strong>Kecamatan:</strong> {bumdes.kecamatan || '-'}</p>
                                <p><strong>Status:</strong> <span className={bumdes.status === 'aktif' ? 'status-active' : 'status-inactive'}>{bumdes.status || '-'}</span></p>
                            </div>
                        ))
                    ) : (
                        <div className="no-data-message">Tidak ada data yang ditemukan.</div>
                    )}
                </div>
            </div>

            {modal && (
                <div className="overlay" onClick={closeDetails}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close-button" onClick={closeDetails}>&times;</button>
                        <h3 className="modal-title">Detail BUMDes - {modal.namabumdesa || '-'}</h3>
                        <div className="modal-details-grid">
                            {Object.entries(modal).map(([key, value]) => {
                                if (key.includes('id') || key.includes('_id')) return null;
                                const label = key.replace(/([A-Z])/g, ' $1').trim().replace(/_/g, ' ');
                                return (
                                    <div key={key} className="detail-item">
                                        <span className="detail-label">{label}:</span>
                                        <span className="detail-value">{value || '-'}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BumdesDashboard;