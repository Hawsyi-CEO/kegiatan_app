import React, { useState } from 'react';
import axios from 'axios';
import { FaSignInAlt, FaSpinner } from 'react-icons/fa';
import './bumdes.css'; // Perubahan di sini

function Login({ onLoginSuccess }) {
    const [desa, setDesa] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('/api/login/desa', { desa });
            onLoginSuccess(response.data);
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Gagal masuk. Nama desa tidak ditemukan atau terjadi kesalahan server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Masuk untuk Mengedit Data</h2>
            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                    <label className="form-label">Nama Desa:</label>
                    <input
                        type="text"
                        name="desa"
                        value={desa}
                        onChange={(e) => setDesa(e.target.value)}
                        placeholder="Masukkan nama desa"
                        required
                        className="form-input"
                    />
                </div>
                {error && <p className="error-message-login">{error}</p>}
                <button type="submit" disabled={loading} className="login-button">
                    {loading ? <FaSpinner className="spinner" /> : <FaSignInAlt />}
                    {loading ? 'Memuat...' : 'Masuk'}
                </button>
            </form>
        </div>
    );
}

export default Login;