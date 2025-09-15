import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSave, FaSignOutAlt, FaTimesCircle, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import './bumdes.css';

// Fungsi helper tetap sama
const isFileKey = (key) => {
    const fileKeys = [
        'LaporanKeuangan2021', 'LaporanKeuangan2022', 'LaporanKeuangan2023', 'LaporanKeuangan2024',
        'Perdes', 'ProfilBUMDesa', 'BeritaAcara', 'AnggaranDasar', 'AnggaranRumahTangga',
        'ProgramKerja', 'SK_BUM_Desa'
    ];
    return fileKeys.includes(key);
};

const isNumericKey = (key) => {
    return key.includes('Omset') || key.includes('Laba') || key.includes('Modal') || key.includes('Kontribusi') || key.includes('NilaiAset') || key.includes('SumberLain');
};

const formatRupiah = (angka) => {
    if (angka === null || angka === undefined || isNaN(angka)) return "";
    let numberString = String(angka).replace(/[^,\d]/g, "").toString();
    if (!numberString) return "";
    return "Rp. " + numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const parseRupiah = (rupiah) => {
    return parseInt(String(rupiah).replace(/[^0-9]/g, ''), 10) || 0;
};

function BumdesEditDashboard({ bumdesId, onLogout }) {
    const [formData, setFormData] = useState({});
    const [originalData, setOriginalData] = useState({});
    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBumdesData = async () => {
            const token = localStorage.getItem('token');
            if (!bumdesId || !token) {
                setMessage({ text: 'ID BUMDes atau token otentikasi tidak ditemukan. Silakan login ulang.', type: 'error' });
                setLoading(false);
                onLogout();
                return;
            }

            try {
                setLoading(true);
                const response = await axios.get(`/api/bumdes/${bumdesId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOriginalData(response.data);
                setFormData(response.data);
            } catch (error) {
                console.error('Error fetching BUMDes data:', error);
                setMessage({ text: 'Gagal memuat data. Mohon login ulang.', type: 'error' });
                onLogout();
            } finally {
                setLoading(false);
            }
        };

        fetchBumdesData();
    }, [bumdesId, onLogout]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (isNumericKey(name)) {
            const parsedValue = parseRupiah(value);
            setFormData(prev => ({ ...prev, [name]: parsedValue }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData(prev => ({ ...prev, [name]: files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });

        const token = localStorage.getItem('token');
        if (!token) {
            setMessage({ text: 'Token otentikasi tidak ditemukan. Silakan login ulang.', type: 'error' });
            setLoading(false);
            onLogout();
            return;
        }

        const dataToSend = new FormData();
        for (const key in formData) {
            const value = formData[key];
            if (isFileKey(key) && value instanceof File) {
                dataToSend.append(key, value);
            } else if (!isFileKey(key) && value !== null && value !== undefined) {
                dataToSend.append(key, value);
            }
        }
        
        dataToSend.append('_method', 'PUT');

        try {
            const response = await axios.post(`/api/bumdes/${bumdesId}`, dataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            setMessage({ text: response.data.message, type: 'success' });
            setOriginalData(response.data.data);
            setFormData(response.data.data);
        } catch (error) {
            setMessage({ text: 'Gagal memperbarui data: ' + (error.response?.data?.message || error.message), type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading-message">Memuat data... 🔄</div>;
    }

    if (!originalData || Object.keys(originalData).length === 0) {
        return (
            <div className="error-message">
                <FaExclamationCircle className="error-icon" /> Data BUMDes tidak ditemukan atau gagal dimuat.
                <button onClick={onLogout} className="logout-button" style={{ marginLeft: '10px' }}>
                    <FaSignOutAlt /> Kembali ke Login
                </button>
            </div>
        );
    }
    
    const allKeys = Object.keys(originalData);

    return (
        <div className="edit-container">
            <h2 className="edit-title">Edit Data BUMDes: {originalData.namabumdesa}</h2>
            
            <form onSubmit={handleSubmit} className="edit-form">
                <div className="form-grid">
                    {allKeys.map(key => {
                        const label = key.replace(/([A-Z])/g, ' $1').trim().replace(/_/g, ' ');
                        const value = formData[key];
                        
                        if (['id', 'created_at', 'updated_at', 'password', 'bumdes_id'].includes(key)) {
                            return null;
                        }

                        if (isFileKey(key)) {
                            const fileName = originalData[key];
                            return (
                                <div key={key} className="form-group-file">
                                    <label className="input-label">{label}</label>
                                    <div className="file-input-wrapper">
                                        <input
                                            type="file"
                                            name={key}
                                            onChange={handleFileChange}
                                            className="file-input-custom"
                                        />
                                        <span className="file-status">
                                            {fileName ? (
                                                <div className="file-uploaded-info">
                                                    <FaCheckCircle className="status-icon success" />
                                                    <a href={`/storage/${fileName}`} target="_blank" rel="noopener noreferrer">
                                                        Lihat Berkas
                                                    </a>
                                                </div>
                                            ) : (
                                                <div className="file-not-uploaded-info">
                                                    <FaTimesCircle className="status-icon error" />
                                                    Belum Diunggah
                                                </div>
                                            )}
                                        </span>
                                    </div>
                                </div>
                            );
                        } else {
                            return (
                                <div key={key} className="form-group">
                                    <label className="input-label">{label}</label>
                                    <input
                                        type="text"
                                        name={key}
                                        value={isNumericKey(key) ? formatRupiah(value) : (value || '')}
                                        onChange={handleChange}
                                        className="form-input"
                                        disabled={key === 'desa' || key === 'kecamatan'}
                                    />
                                </div>
                            );
                        }
                    })}
                </div>
                
                <div className="form-actions">
                    <button type="submit" className="save-button" disabled={loading}>
                        <FaSave className="button-icon" /> {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </div>
            </form>

            {message.text && (
                <div className={`message-alert ${message.type}`}>
                    <p>{message.text}</p>
                </div>
            )}
        </div>
    );
}

export default BumdesEditDashboard;