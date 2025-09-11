import React, { useState } from 'react';
import axios from 'axios';
import { FaUserShield, FaSignInAlt, FaExclamationCircle } from 'react-icons/fa';
import './bumdes.css';

function Login({ onLoginSuccess }) {
    const [desa, setDesa] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await axios.get(`/api/bumdes/search?q=${desa}`);
            if (response.data.length > 0) {
                const bumdes = response.data.find(b => b.desa?.toLowerCase() === desa.toLowerCase());
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
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container-wrapper">
            <div className="login-card">
                <div className="login-header">
                    <FaUserShield className="login-icon" />
                    <h2 className="login-title">Masuk</h2>
                    <p className="login-subtitle">Akses data BUMDes Anda.</p>
                </div>
                {error && (
                    <div className="login-error-message">
                        <FaExclamationCircle className="error-icon" /> {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="login-form">
                    <label className="form-group">
                        Nama Desa
                        <input
                            type="text"
                            value={desa}
                            onChange={e => setDesa(e.target.value)}
                            required
                            className="form-input"
                            placeholder="Contoh: Desa A"
                        />
                    </label>
                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? <FaSpinner className="spinner" /> : <FaSignInAlt />}
                        {loading ? 'Memuat...' : 'Masuk'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;