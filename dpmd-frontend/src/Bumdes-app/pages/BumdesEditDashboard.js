import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './bumdes.css';

function BumdesEditDashboard({ bumdesId, onLogout }) {
    const [bumdesData, setBumdesData] = useState(null);
    const [formData, setFormData] = useState({});
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        if (bumdesId) {
            const fetchBumdesData = async () => {
                try {
                    const response = await axios.get(`/api/bumdes/${bumdesId}`);
                    setBumdesData(response.data);
                    setFormData(response.data);
                } catch (error) {
                    console.error('Error fetching BUMDes data:', error);
                    onLogout('login');
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
        
        const dataToSend = new FormData();
        for (const key in formData) {
            if (formData[key] instanceof File) {
                dataToSend.append(key, formData[key]);
            } else if (typeof formData[key] === 'string' || typeof formData[key] === 'number') {
                dataToSend.append(key, formData[key]);
            }
        }
        
        try {
            const response = await axios.post(`/api/bumdes/${bumdesId}?_method=PUT`, dataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMessage({ text: response.data.message, type: 'success' });
            setBumdesData(response.data.data);
        } catch (error) {
            setMessage({ text: 'Gagal memperbarui data: ' + (error.response?.data?.message || error.message), type: 'error' });
        }
    };

    if (!bumdesData) {
        return <div>Memuat...</div>;
    }

    const fileFields = ['LaporanKeuangan2021', 'LaporanKeuangan2022', 'LaporanKeuangan2023', 'LaporanKeuangan2024',
        'Perdes', 'ProfilBUMDesa', 'BeritaAcara', 'AnggaranDasar', 'AnggaranRumahTangga',
        'ProgramKerja', 'SK_BUM_Desa'];

    return (
        <div className="container">
            <header>
                <h2>Dashboard BUMDes {bumdesData.namabumdesa}</h2>
                <button onClick={() => onLogout('login')}>Keluar</button>
            </header>
            
            <main>
                <div className="card">
                    <h4>Data BUMDes Anda</h4>
                    <p><strong>Desa:</strong> {bumdesData.desa}</p>
                    <p><strong>Kecamatan:</strong> {bumdesData.kecamatan}</p>
                </div>
                
                <div className="card">
                    <h3>Edit Data dan Unggah Dokumen</h3>
                    <form onSubmit={handleSubmit}>
                        <h4>Informasi Umum</h4>
                        <label>Nama BUMDes <input type="text" name="namabumdesa" value={formData.namabumdesa || ''} onChange={handleChange} /></label>
                        {fileFields.map(field => (
                            <div key={field}>
                                <label>{field.replace(/([A-Z])/g, ' $1').trim()}</label>
                                <input type="file" name={field} onChange={handleFileChange} />
                                <span className={bumdesData[field] ? 'file-uploaded' : 'file-not-uploaded'}>
                                    {bumdesData[field] ? 'Sudah Diunggah' : 'Belum Diunggah'}
                                </span>
                            </div>
                        ))}
                        <button type="submit">Simpan Perubahan</button>
                    </form>
                </div>
            </main>
            
            {message.text && (
                <div className={`message ${message.type}`}>
                    <p>{message.text}</p>
                </div>
            )}
        </div>
    );
}

export default BumdesEditDashboard;