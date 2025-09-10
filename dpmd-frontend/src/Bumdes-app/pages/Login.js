import React, { useState } from 'react';
import axios from 'axios';
import './bumdes.css';

function Login({ onLoginSuccess }) {
    const [desa, setDesa] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.get(`/api/bumdes/search?q=${desa}`);
            if (response.data.length > 0) {
                const bumdes = response.data.find(b => b.desa.toLowerCase() === desa.toLowerCase());
                if (bumdes) {
                    onLoginSuccess(bumdes.id);
                } else {
                    setError('Nama desa tidak ditemukan.');
                }
            } else {
                setError('Nama desa tidak ditemukan.');
            }
        } catch (err) {
            setError('Terjadi kesalahan saat login.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="text-4xl font-bold">Masuk</h2>
                <p className="text-gray-500 mt-2">Akses data BUMDes Anda.</p>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <label>Nama Desa</label>
                    <input type="text" value={desa} onChange={e => setDesa(e.target.value)} required />
                    <button type="submit">Masuk</button>
                </form>
            </div>
        </div>
    );
}

export default Login;