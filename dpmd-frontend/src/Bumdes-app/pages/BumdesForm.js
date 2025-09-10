import React, { useState } from 'react';
import axios from 'axios';
import './bumdes.css';

const formSections = [
    { id: 'identitas', title: 'Identitas BUMDes' },
    { id: 'status', title: 'Status BUMDes' },
    { id: 'legalitas', title: 'Legalitas' },
    { id: 'pengurus', title: 'Profil Pengurus' },
    { id: 'organisasi', title: 'Profil Organisasi' },
    { id: 'usaha', title: 'Usaha BUMDes' },
    { id: 'permodalan', title: 'Permodalan dan Aset' },
    { id: 'kemitraan', title: 'Kemitraan' },
    { id: 'kontribusi', title: 'Kontribusi PADes' },
    { id: 'peran', title: 'Peran BUMDes' },
    { id: 'bantuan', title: 'Bantuan' },
    { id: 'laporan', title: 'Laporan Keuangan' },
    { id: 'dokumen', title: 'Dokumen Pendirian' },
];

const initialFormData = {
    kecamatan: '', desa: '', namabumdesa: '', status: 'aktif', keterangan_tidak_aktif: '', NIB: '', LKPP: '', NPWP: '', badanhukum: '',
    NamaPenasihat: '', JenisKelaminPenasihat: '', HPPenasihat: '', NamaPengawas: '', JenisKelaminPengawas: '', HPPengawas: '',
    NamaDirektur: '', JenisKelaminDirektur: '', HPDirektur: '', NamaSekretaris: '', JenisKelaminSekretaris: '', HPSekretaris: '',
    NamaBendahara: '', JenisKelaminBendahara: '', HPBendahara: '', TahunPendirian: '', AlamatBumdesa: '', Alamatemail: '',
    TotalTenagaKerja: '', TelfonBumdes: '', JenisUsaha: '', JenisUsahaUtama: '', JenisUsahaLainnya: '', Omset2023: '', Laba2023: '',
    Omset2024: '', Laba2024: '', PenyertaanModal2019: '', PenyertaanModal2020: '', PenyertaanModal2021: '', PenyertaanModal2022: '',
    PenyertaanModal2023: '', PenyertaanModal2024: '', SumberLain: '', JenisAset: '', NilaiAset: '', KerjasamaPihakKetiga: '',
    'TahunMulai-TahunBerakhir': '', KontribusiTerhadapPADes2021: '', KontribusiTerhadapPADes2022: '', KontribusiTerhadapPADes2023: '',
    KontribusiTerhadapPADes2024: '', Ketapang2024: '', Ketapang2025: '', BantuanKementrian: '', BantuanLaptopShopee: '',
    NomorPerdes: '',
    LaporanKeuangan2021: null, LaporanKeuangan2022: null, LaporanKeuangan2023: null, LaporanKeuangan2024: null,
    Perdes: null, ProfilBUMDesa: null, BeritaAcara: null, AnggaranDasar: null, AnggaranRumahTangga: null,
    ProgramKerja: null, SK_BUM_Desa: null,
};

const optionsData = {
    kecamatan: [{ id: 1, nama: 'Cibinong' }],
    desa: [{ id: 1, nama: 'Desa A' }],
};

const formatRupiah = (angka) => {
    let numberString = angka.replace(/[^,\d]/g, "").toString();
    if (!numberString) return "";
    return "Rp. " + numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const parseRupiah = (rupiah) => {
    return parseInt(rupiah.replace(/[^0-9]/g, ''), 10) || 0;
};

function BumdesForm() {
    const [formData, setFormData] = useState(initialFormData);
    const [activeSection, setActiveSection] = useState('identitas');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('Omset') || name.includes('Laba') || name.includes('Modal') || name.includes('Kontribusi') || name.includes('NilaiAset')) {
            setFormData({ ...formData, [name]: parseRupiah(value) });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const dataToSend = new FormData();
        for (const key in formData) {
            dataToSend.append(key, formData[key]);
        }
        
        try {
            const response = await axios.post('/api/bumdes', dataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMessage({ text: response.data.message, type: 'success' });
            setFormData(initialFormData);
        } catch (error) {
            console.error(error);
            setMessage({ text: 'Gagal mengirim data: ' + (error.response?.data?.message || error.message), type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const renderSection = () => {
        switch (activeSection) {
            case 'identitas':
                return (
                    <div id="identitas" className="form-section">
                        <div className="card">
                            <h2>Identitas BUMDes</h2>
                            <label>Nama BUMDesa: <input type="text" name="namabumdesa" value={formData.namabumdesa} onChange={handleChange} required /></label>
                            <label>Kecamatan: <input type="text" name="kecamatan" value={formData.kecamatan} onChange={handleChange} /></label>
                            <label>Desa: <input type="text" name="desa" value={formData.desa} onChange={handleChange} required /></label>
                        </div>
                    </div>
                );
            case 'status':
                return (
                    <div id="status" className="form-section">
                        <div className="card">
                            <h2>Status BUMDesa</h2>
                            <label>Status 2025: 
                                <select name="status" value={formData.status} onChange={handleChange}>
                                    <option value="aktif">Aktif</option>
                                    <option value="tidak aktif">Tidak Aktif</option>
                                </select>
                            </label>
                            <label>Keterangan Tidak Aktif:
                                <select name="keterangan_tidak_aktif" value={formData.keterangan_tidak_aktif} onChange={handleChange}>
                                    <option value="">-</option>
                                    <option value="Ada pengurus, tidak ada usaha">Ada pengurus, tidak ada usaha</option>
                                    <option value="Tidak ada pengurus, ada usaha">Tidak ada pengurus, ada usaha</option>
                                    <option value="Tidak ada keduanya">Tidak ada keduanya</option>
                                </select>
                            </label>
                        </div>
                    </div>
                );
            case 'legalitas':
                return (
                    <div id="legalitas" className="form-section">
                        <div className="card">
                            <h2>Legalitas</h2>
                            <label>NIB: <input type="text" name="NIB" value={formData.NIB} onChange={handleChange} placeholder="masukan nomor NIB.." /></label>
                            <label>LKPP: <input type="text" name="LKPP" value={formData.LKPP} onChange={handleChange} placeholder="masukan nomor LKPP.." /></label>
                            <label>NPWP: <input type="text" name="NPWP" value={formData.NPWP} onChange={handleChange} placeholder="masukan nomor NPWP.." /></label>
                            <label>Status Badan Hukum:
                                <select name="badanhukum" value={formData.badanhukum} onChange={handleChange}>
                                    <option value="">-</option>
                                    <option value="Belum Melakukan Proses">Belum Melakukan Proses</option>
                                    <option value="Nama Terverifikasi">Nama Terverifikasi</option>
                                    <option value="Perbaikan Dokumen">Perbaikan Dokumen</option>
                                    <option value="Terbit Sertifikat Badan Hukum">Terbit Sertifikat Badan Hukum</option>
                                </select>
                            </label>
                        </div>
                    </div>
                );
            case 'pengurus':
                return (
                    <div id="pengurus" className="form-section">
                        <div className="card">
                            <h2>Profil Pengurus</h2>
                            <label>Nama Penasihat: <input type="text" name="NamaPenasihat" value={formData.NamaPenasihat} onChange={handleChange} /></label>
                            <label>Jenis Kelamin Penasihat: <select name="JenisKelaminPenasihat" value={formData.JenisKelaminPenasihat} onChange={handleChange}> <option value="">-</option> <option value="laki-laki">Laki-Laki</option> <option value="perempuan">Perempuan</option> </select></label>
                            <label>HP Penasihat: <input type="text" name="HPPenasihat" value={formData.HPPenasihat} onChange={handleChange} /></label>
                            <label>Nama Pengawas: <input type="text" name="NamaPengawas" value={formData.NamaPengawas} onChange={handleChange} /></label>
                            <label>Jenis Kelamin Pengawas: <select name="JenisKelaminPengawas" value={formData.JenisKelaminPengawas} onChange={handleChange}> <option value="">-</option> <option value="laki-laki">Laki-Laki</option> <option value="perempuan">Perempuan</option> </select></label>
                            <label>HP Pengawas: <input type="text" name="HPPengawas" value={formData.HPPengawas} onChange={handleChange} /></label>
                            <label>Nama Direktur: <input type="text" name="NamaDirektur" value={formData.NamaDirektur} onChange={handleChange} /></label>
                            <label>Jenis Kelamin Direktur: <select name="JenisKelaminDirektur" value={formData.JenisKelaminDirektur} onChange={handleChange}> <option value="">-</option> <option value="laki-laki">Laki-Laki</option> <option value="perempuan">Perempuan</option> </select></label>
                            <label>HP Direktur: <input type="text" name="HPDirektur" value={formData.HPDirektur} onChange={handleChange} /></label>
                            <label>Nama Sekretaris: <input type="text" name="NamaSekretaris" value={formData.NamaSekretaris} onChange={handleChange} /></label>
                            <label>Jenis Kelamin Sekretaris: <select name="JenisKelaminSekretaris" value={formData.JenisKelaminSekretaris} onChange={handleChange}> <option value="">-</option> <option value="laki-laki">Laki-Laki</option> <option value="perempuan">Perempuan</option> </select></label>
                            <label>HP Sekretaris: <input type="text" name="HPSekretaris" value={formData.HPSekretaris} onChange={handleChange} /></label>
                            <label>Nama Bendahara: <input type="text" name="NamaBendahara" value={formData.NamaBendahara} onChange={handleChange} /></label>
                            <label>Jenis Kelamin Bendahara: <select name="JenisKelaminBendahara" value={formData.JenisKelaminBendahara} onChange={handleChange}> <option value="">-</option> <option value="laki-laki">Laki-Laki</option> <option value="perempuan">Perempuan</option> </select></label>
                            <label>HP Bendahara: <input type="text" name="HPBendahara" value={formData.HPBendahara} onChange={handleChange} /></label>
                        </div>
                    </div>
                );
            case 'organisasi':
                return (
                    <div id="organisasi" className="form-section">
                        <div className="card">
                            <h2>Profil Organisasi BUMDesa</h2>
                            <label>Tahun Pendirian: <input type="text" name="TahunPendirian" value={formData.TahunPendirian} onChange={handleChange} /></label>
                            <label>Alamat Bumdesa: <input type="text" name="AlamatBumdesa" value={formData.AlamatBumdesa} onChange={handleChange} /></label>
                            <label>Alamat email: <input type="text" name="Alamatemail" value={formData.Alamatemail} onChange={handleChange} /></label>
                            <label>Total Tenaga Kerja: <input type="text" name="TotalTenagaKerja" value={formData.TotalTenagaKerja} onChange={handleChange} /></label>
                            <label>No Telfon BUMDesa: <input type="text" name="TelfonBumdes" value={formData.TelfonBumdes} onChange={handleChange} /></label>
                        </div>
                    </div>
                );
            case 'usaha':
                return (
                    <div id="usaha" className="form-section">
                        <div className="card">
                            <h2>Usaha BUMDesa</h2>
                            <label>Jenis Usaha:
                                <select name="JenisUsaha" value={formData.JenisUsaha} onChange={handleChange}>
                                    <option value="">-</option>
                                    <option value="BudidayadanPertambangan">Budidaya dan Pertambangan</option>
                                    <option value="BudidayaPertanian">Budidaya Pertanian</option>
                                    <option value="BudidayaPerikanan">Budidaya Perikanan</option>
                                    <option value="BudidayaPeternakan">Budidaya Peternakan</option>
                                    <option value="BudidayaPertanianPeternakanPerikanan">Budidaya Pertanian, Budidaya Peternakan, Budidaya Perikanan</option>
                                    <option value="BudidayaPertanianPerdagangandanJasaUmumPariwisata">Budidaya Pertanian, Perdagangan dan Jasa Umum, Pariwisata</option>
                                    <option value="BudidayaPertanianPerdagangandanJasaUmumPariwisataKeuangan/LKD">Budidaya Pertanian,Perdagangan dan Jasa Umum, Pariwisata, Keuangan/LKD</option>
                                    <option value="BudidayaPertanianPerdagangandanJasaUmumPelayananPublikKeuangan/LKD">Budidaya Pertanian, Perdagangan dan, Jasa Umum, Pelayanan Publik Keuangan/LKD</option>
                                    <option value="BudidayaPertanianPerdagangandanJasaUmumPengolahandanManufaktur">Budidaya Pertanian, Perdagangan dan Jasa Umum, Pengolahan dan Manufaktur</option>
                                    <option value="Keuangan/LKD">Keuangan/LKD</option>
                                    <option value="Pariwisata">Pariwisaata</option>
                                    <option value="PelayananPublik">Pelayanan Publik</option>
                                    <option value="PelayananPublikKeuangan/LKD">Pelayanan Publik, Keuangan/LKD</option>
                                    <option value="PengolahandanManufaktur">Pengolahan dan Manufaktur</option>
                                    <option value="PerdagangandanJasaUmum">Perdagangan dan Jasa Umum</option>
                                    <option value="PerdagangandanJasaUmumKeuangan/LKD">Perdagangan dan Jasa Umum, Keuangan/LKD</option>
                                    <option value="PerdagangandanJasaUmum,Pariwisata">Perdagangan dan Jasa Umum, Pariwisata</option>
                                    <option value="PerdagangandanJasaUmum,PelayananPublik">Perdagangan dan Jasa Umum, Pelayanan Publik</option>
                                    <option value="PerdagangandanJasaUmum,PengolahandanManufaktur">Perdagangan dan Jasa Umum, Pengolahan dan Manufaktur</option>
                                    <option value="BelumAdaKeterangan">Belum Ada Keterangan</option>
                                </select>
                            </label>
                            <label>Keterangan Jenis Usaha Utama: <input type="text" name="JenisUsahaUtama" value={formData.JenisUsahaUtama} onChange={handleChange} /></label>
                            <label>Jenis Usaha Lainnya: <input type="text" name="JenisUsahaLainnya" value={formData.JenisUsahaLainnya} onChange={handleChange} /></label>
                            <label>Omset 2023: <input type="text" name="Omset2023" value={formatRupiah(String(formData.Omset2023))} onChange={handleChange} className="rupiah" /></label>
                            <label>Laba 2023: <input type="text" name="Laba2023" value={formatRupiah(String(formData.Laba2023))} onChange={handleChange} className="rupiah" /></label>
                            <label>Omset 2024: <input type="text" name="Omset2024" value={formatRupiah(String(formData.Omset2024))} onChange={handleChange} className="rupiah" /></label>
                            <label>Laba 2024: <input type="text" name="Laba2024" value={formatRupiah(String(formData.Laba2024))} onChange={handleChange} className="rupiah" /></label>
                        </div>
                    </div>
                );
            case 'permodalan':
                return (
                    <div id="permodalan" className="form-section">
                        <div className="card">
                            <h2>Permodalan dan Aset</h2>
                            <label>Penyertaan Modal 2019: <input type="text" name="PenyertaanModal2019" value={formatRupiah(String(formData.PenyertaanModal2019))} onChange={handleChange} className="rupiah" /></label>
                            <label>Penyertaan Modal 2020: <input type="text" name="PenyertaanModal2020" value={formatRupiah(String(formData.PenyertaanModal2020))} onChange={handleChange} className="rupiah" /></label>
                            <label>Penyertaan Modal 2021: <input type="text" name="PenyertaanModal2021" value={formatRupiah(String(formData.PenyertaanModal2021))} onChange={handleChange} className="rupiah" /></label>
                            <label>Penyertaan Modal 2022: <input type="text" name="PenyertaanModal2022" value={formatRupiah(String(formData.PenyertaanModal2022))} onChange={handleChange} className="rupiah" /></label>
                            <label>Penyertaan Modal 2023: <input type="text" name="PenyertaanModal2023" value={formatRupiah(String(formData.PenyertaanModal2023))} onChange={handleChange} className="rupiah" /></label>
                            <label>Penyertaan Modal 2024: <input type="text" name="PenyertaanModal2024" value={formatRupiah(String(formData.PenyertaanModal2024))} onChange={handleChange} className="rupiah" /></label>
                            <label>Modal dari Sumber Lain: <input type="text" name="SumberLain" value={formatRupiah(String(formData.SumberLain))} onChange={handleChange} className="rupiah" /></label>
                            <label>Jenis Aset: <input type="text" name="JenisAset" value={formData.JenisAset} onChange={handleChange} /></label>
                            <label>Nilai Aset: <input type="text" name="NilaiAset" value={formatRupiah(String(formData.NilaiAset))} onChange={handleChange} className="rupiah" /></label>
                        </div>
                    </div>
                );
            case 'kemitraan':
                return (
                    <div id="kemitraan" className="form-section">
                        <div className="card">
                            <h2>Kemitraan/Kerjasama</h2>
                            <label>Kemitraan/Kerjasama Pihak Ketiga: <input type="text" name="KerjasamaPihakKetiga" value={formData.KerjasamaPihakKetiga} onChange={handleChange} /></label>
                            <label>Tahun Mulai-Tahun Berakhir: <input type="text" name="TahunMulai-TahunBerakhir" value={formData['TahunMulai-TahunBerakhir']} onChange={handleChange} /></label>
                        </div>
                    </div>
                );
            case 'kontribusi':
                return (
                    <div id="kontribusi" className="form-section">
                        <div className="card">
                            <h2>Kontribusi PADES</h2>
                            <label>Kontribusi PADes 2021: <input type="text" name="KontribusiTerhadapPADes2021" value={formatRupiah(String(formData.KontribusiTerhadapPADes2021))} onChange={handleChange} className="rupiah" /></label>
                            <label>Kontribusi PADes 2022: <input type="text" name="KontribusiTerhadapPADes2022" value={formatRupiah(String(formData.KontribusiTerhadapPADes2022))} onChange={handleChange} className="rupiah" /></label>
                            <label>Kontribusi PADes 2023: <input type="text" name="KontribusiTerhadapPADes2023" value={formatRupiah(String(formData.KontribusiTerhadapPADes2023))} onChange={handleChange} className="rupiah" /></label>
                            <label>Kontribusi PADes 2024: <input type="text" name="KontribusiTerhadapPADes2024" value={formatRupiah(String(formData.KontribusiTerhadapPADes2024))} onChange={handleChange} className="rupiah" /></label>
                        </div>
                    </div>
                );
            case 'peran':
                return (
                    <div id="peran" className="form-section">
                        <div className="card">
                            <h2>Peran BUMDesa pada Program Pemerintah</h2>
                            <label>Peran Program Ketahanan Pangan 2024:
                                <select name="Ketapang2024" value={formData.Ketapang2024} onChange={handleChange}>
                                    <option value="">-</option>
                                    <option value="Pengelola">Pengelola</option>
                                    <option value="Distribusi">Distribusi</option>
                                    <option value="Pemasaran">Pemasaran</option>
                                    <option value="tidakadaperan">tidak ada peran</option>
                                </select>
                            </label>
                            <label>Peran Program Ketahanan Pangan 2025:
                                <select name="Ketapang2025" value={formData.Ketapang2025} onChange={handleChange}>
                                    <option value="">-</option>
                                    <option value="Pengelola">Pengelola</option>
                                    <option value="Distribusi">Distribusi</option>
                                    <option value="Pemasaran">Pemasaran</option>
                                    <option value="tidakadaperan">tidak ada peran</option>
                                </select>
                            </label>
                            <label>Peran Pada Desa Wisata:
                                <select name="DesaWisata" value={formData.DesaWisata} onChange={handleChange}>
                                    <option value="">-</option>
                                    <option value="PengelolaUtama">Pengelola Utama</option>
                                    <option value="Pengelola Pendukung">Pengelola Pendukung</option>
                                </select>
                            </label>
                        </div>
                    </div>
                );
            case 'bantuan':
                return (
                    <div id="bantuan" className="form-section">
                        <div className="card">
                            <h2>Bantuan</h2>
                            <label>Bantuan Kementrian: <input type="text" name="BantuanKementrian" value={formData.BantuanKementrian} onChange={handleChange} /></label>
                            <label>Bantuan Lainnya: <input type="text" name="BantuanLaptopShopee" value={formData.BantuanLaptopShopee} onChange={handleChange} /></label>
                        </div>
                    </div>
                );
            case 'laporan':
                return (
                    <div id="laporan" className="form-section">
                        <div className="card">
                            <h2>Laporan Pertanggung Jawaban</h2>
                            <label>Laporan Keuangan 2021 (Maks: 5MB): <input type="file" name="LaporanKeuangan2021" onChange={handleFileChange} className="file-input" /></label><br />
                            <label>Laporan Keuangan 2022 (Maks: 5MB): <input type="file" name="LaporanKeuangan2022" onChange={handleFileChange} className="file-input" /></label><br />
                            <label>Laporan Keuangan 2023 (Maks: 5MB): <input type="file" name="LaporanKeuangan2023" onChange={handleFileChange} className="file-input" /></label><br />
                            <label>Laporan Keuangan 2024 (Maks: 5MB): <input type="file" name="LaporanKeuangan2024" onChange={handleFileChange} className="file-input" /></label><br />
                        </div>
                    </div>
                );
            case 'dokumen':
                return (
                    <div id="dokumen" className="form-section">
                        <div className="card">
                            <h2>Dokumen Pendirian</h2>
                            <label>Nomor Perdes: <input type="text" name="NomorPerdes" value={formData.NomorPerdes} onChange={handleChange} /></label><br />
                            <label>Perdes (Maks: 5MB): <input type="file" name="Perdes" onChange={handleFileChange} className="file-input" /></label><br />
                            <label>Profil BUM Desa (Maks: 5MB): <input type="file" name="ProfilBUMDesa" onChange={handleFileChange} className="file-input" /></label><br />
                            <label>Berita Acara (Maks: 5MB): <input type="file" name="BeritaAcara" onChange={handleFileChange} className="file-input" /></label><br />
                            <label>Anggaran Dasar (Maks: 5MB): <input type="file" name="AnggaranDasar" onChange={handleFileChange} className="file-input" /></label><br />
                            <label>Anggaran Rumah Tangga (Maks: 5MB): <input type="file" name="AnggaranRumahTangga" onChange={handleFileChange} className="file-input" /></label><br />
                            <label>Program Kerja (Maks: 5MB): <input type="file" name="ProgramKerja" onChange={handleFileChange} className="file-input" /></label><br />
                            <label>SK BUM Desa (Maks: 5MB): <input type="file" name="SK_BUM_Desa" onChange={handleFileChange} className="file-input" required /></label><br />
                        </div>
                        <button type="submit" disabled={loading}>{loading ? 'Mengirim...' : 'Simpan'}</button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="container">
            <nav className="sidebar">
                {formSections.map(section => (
                    <h3 key={section.id} data-section={section.id} onClick={() => setActiveSection(section.id)} className={activeSection === section.id ? 'active' : ''}>
                        {section.title}
                    </h3>
                ))}
            </nav>
            <form onSubmit={handleSubmit} id="bumdesForm">
                <div className="logo"><img src="/logo.png" alt="Logo" /></div>
                {renderSection()}
            </form>

            {loading && <div className="overlay"><div className="spinner"></div><p>Mohon tunggu...</p></div>}
            {message.text && (
                <div className={`overlay ${message.type}`}>
                    <div className="message-box">
                        <p>{message.text}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BumdesForm;