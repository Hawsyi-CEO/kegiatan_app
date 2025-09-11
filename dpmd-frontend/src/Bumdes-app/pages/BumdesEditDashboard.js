import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSave, FaSignOutAlt, FaTimesCircle, FaCheckCircle, FaUpload } from 'react-icons/fa';
import { initialFormData } from './BumdesForm';
import './bumdes.css';

function BumdesEditDashboard({ bumdesId, onLogout }) {
    const [formData, setFormData] = useState({});
    const [originalData, setOriginalData] = useState({});
    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (bumdesId) {
            const fetchBumdesData = async () => {
                try {
                    setLoading(true);
                    const response = await axios.get(`/api/bumdes/${bumdesId}`);
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
        }
    }, [bumdesId, onLogout]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData(prev => ({ ...prev, [name]: files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });

        const dataToSend = new FormData();
        for (const key in formData) {
            if (formData[key] instanceof File || formData[key] !== originalData[key]) {
                 dataToSend.append(key, formData[key]);
            }
        }
        
        try {
            const response = await axios.post(`/api/bumdes/${bumdesId}?_method=PUT`, dataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' }
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

    return (
        <div className="edit-container">
            <h2 className="edit-title">Edit Data BUMDes: {originalData.namabumdesa}</h2>
            
            <form onSubmit={handleSubmit} className="edit-form">
                <div className="form-grid">
                    {Object.keys(initialFormData).map(key => {
                        if (!originalData.hasOwnProperty(key)) return null;
                        
                        const label = key.replace(/([A-Z])/g, ' $1').trim().replace(/_/g, ' ');
                        
                        if (typeof initialFormData[key] === 'string' || initialFormData[key] === null) {
                            return (
                                <div key={key} className="form-group">
                                    <label className="input-label">{label}</label>
                                    <input
                                        type="text"
                                        name={key}
                                        value={formData[key] || ''}
                                        onChange={handleChange}
                                        className="form-input"
                                    />
                                </div>
                            );
                        } else if (initialFormData[key] instanceof File) {
                            const fileName = originalData[key];
                            return (
                                <div key={key} className="form-group-file">
                                    <label className="input-label">{label}</label>
                                    <div className="file-input-wrapper">
                                        <input type="file" name={key} onChange={handleFileChange} className="file-input-custom" />
                                        <span className="file-status">
                                            {fileName ? <><FaCheckCircle className="status-icon success" /> Sudah Diunggah</> : <><FaTimesCircle className="status-icon error" /> Belum Diunggah</>}
                                        </span>
                                    </div>
                                </div>
                            );
                        }
                        return null;
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