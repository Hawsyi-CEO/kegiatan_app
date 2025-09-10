import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Doughnut, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
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
                setError('Gagal memuat data dari server.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        let temp = data.filter(item => {
            const matchesSearch = item.namabumdesa?.toLowerCase().includes(filter.search.toLowerCase()) || item.desa?.toLowerCase().includes(filter.search.toLowerCase());
            const matchesKecamatan = !filter.kecamatan || item.kecamatan === filter.kecamatan;
            return matchesSearch && matchesKecamatan;
        });
        setFilteredData(temp);
    }, [filter, data]);

    // Function to safely get chart data, handling null values
    const getChartData = (key) => {
        const counts = filteredData.reduce((acc, item) => {
            // Use 'Tidak Diketahui' as a fallback for null or empty values
            const value = item[key] || 'Tidak Diketahui';
            acc[value] = (acc[value] || 0) + 1;
            return acc;
        }, {});
        
        // Generate a random color for each data point
        const generateColors = (count) => {
            const colors = [];
            for (let i = 0; i < count; i++) {
                const hue = (360 / count) * i;
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
        return <div className="text-center text-xl font-semibold text-gray-600">Memuat data...</div>;
    }
    if (error) {
        return <div className="text-center text-xl font-semibold text-red-600">{error}</div>;
    }

    return (
        <div className="container">
            <h2 className="header-title" style={{ textAlign: 'center' }}>Dashboard Statistik BUMDes</h2>
            <div className="chart-container">
                <div className="chart-box"><Bar data={getChartData('status')} /></div>
                <div className="chart-box"><Doughnut data={getChartData('JenisUsaha')} /></div>
                <div className="chart-box"><Pie data={getChartData('badanhukum')} /></div>
            </div>
            
            <div className="card mt-8">
                <div className="flex flex-wrap gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Cari Nama BUMDes..."
                        value={filter.search}
                        onChange={e => setFilter({ ...filter, search: e.target.value })}
                        className="flex-1 min-w-[200px] p-2 border rounded"
                    />
                    <select
                        value={filter.kecamatan}
                        onChange={e => setFilter({ ...filter, kecamatan: e.target.value })}
                        className="flex-1 min-w-[200px] p-2 border rounded"
                    >
                        <option value="">Semua Kecamatan</option>
                        {kecamatanList.map(kec => <option key={kec} value={kec}>{kec}</option>)}
                    </select>
                    <button onClick={() => setFilteredData(data)} className="p-2 bg-blue-500 text-white rounded">
                        Lihat Semua
                    </button>
                </div>
                
                <div className="grid-container">
                    {filteredData.map(bumdes => (
                        <div className="card" key={bumdes.id} onClick={() => showDetails(bumdes)}>
                            <h3>{bumdes.namabumdesa || 'Nama Tidak Tersedia'}</h3>
                            <p><strong>Desa:</strong> {bumdes.desa || '-'}</p>
                            <p><strong>Kecamatan:</strong> {bumdes.kecamatan || '-'}</p>
                            <p><strong>Status:</strong> {bumdes.status || '-'}</p>
                        </div>
                    ))}
                </div>
            </div>

            {modal && (
                <>
                    <div className="overlay" onClick={closeDetails}></div>
                    <div className="message-box details-container">
                        <button className="close-btn" onClick={closeDetails}>Tutup</button>
                        <h3>Detail BUMDes - {modal.namabumdesa || '-'}</h3>
                        {Object.entries(modal).map(([key, value]) => (
                            <p key={key}><strong>{key}:</strong> {value || '-'}</p>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default BumdesDashboard;