import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_URL = 'http://localhost:8000/api';

const Dashboard = ({ onFilterClick }) => {
  const [data, setData] = useState({
    mingguan: 0,
    bulanan: 0,
    per_bidang: [],
  });
  const [weeklySchedule, setWeeklySchedule] = useState([]);
  const [activeActivityIndex, setActiveActivityIndex] = useState({});
  const carouselIntervals = useRef({});

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`${API_URL}/dashboard`);
        setData(response.data);
      } catch (error) {
        Swal.fire('Error', 'Gagal memuat data dashboard.', 'error');
      }
    };
    fetchDashboardData();
  }, []);
  
  useEffect(() => {
    const fetchWeeklySchedule = async () => {
      try {
        const response = await axios.get(`${API_URL}/dashboard/weekly-schedule`);
        setWeeklySchedule(response.data);
      } catch (error) {
        console.error('Failed to fetch weekly schedule', error);
      }
    };
    fetchWeeklySchedule();
  }, []);

  // Logika carousel
  useEffect(() => {
    // Bersihkan semua interval yang ada sebelum membuat yang baru
    Object.values(carouselIntervals.current).forEach(clearInterval);
    
    weeklySchedule.forEach((day, dayIndex) => {
      if (day.kegiatan && day.kegiatan.length > 1) {
        // Buat interval baru untuk setiap hari dengan lebih dari 1 kegiatan
        const intervalId = setInterval(() => {
          setActiveActivityIndex(prev => ({
            ...prev,
            [dayIndex]: ((prev[dayIndex] || 0) + 1) % day.kegiatan.length,
          }));
        }, 5000);
        
        carouselIntervals.current[dayIndex] = intervalId;
      }
    });

    // Fungsi cleanup untuk membersihkan interval saat komponen di-unmount
    return () => {
      Object.values(carouselIntervals.current).forEach(clearInterval);
    };
  }, [weeklySchedule]);

  const renderPersonilList = (personilString) => {
    if (!personilString) return <p className="no-activity-message">Tidak ada personel.</p>;
    
    const personilNames = personilString.split(',').map(name => name.trim()).filter(Boolean);

    return (
      <ul className="list-disc list-inside ml-4 text-gray-600 text-sm">
        {personilNames.map((person, index) => (
          <li key={index}>{person}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className="fade-in">
      <h3 className="dashboard-heading">Ringkasan Kegiatan</h3>
      <div className="dashboard-summary-grid">
        <div className="dashboard-card" onClick={() => onFilterClick('mingguan')}>
          <div className="dashboard-card-header">
            <i className="fas fa-calendar-week dashboard-card-icon"></i>
            <h4 className="dashboard-card-title">Minggu Ini</h4>
          </div>
          <p className="dashboard-card-value">{data.mingguan}</p>
          <p className="dashboard-card-label">Kegiatan</p>
        </div>
        <div className="dashboard-card" onClick={() => onFilterClick('bulanan')}>
          <div className="dashboard-card-header">
            <i className="fas fa-calendar-day dashboard-card-icon"></i>
            <h4 className="dashboard-card-title">Bulan Ini</h4>
          </div>
          <p className="dashboard-card-value">{data.bulanan}</p>
          <p className="dashboard-card-label">Kegiatan</p>
        </div>
        <div className="dashboard-bidang-card">
          <h4 className="dashboard-bidang-header"><i className="fas fa-project-diagram"></i> Per Bidang</h4>
          <ul className="dashboard-bidang-list">
            {data.per_bidang.map(b => (
              <li key={b.id_bidang} className="dashboard-bidang-item" onClick={() => onFilterClick('', b.id_bidang)}>
                {b.nama_bidang}
                <span>{b.total}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <h3 className="weekly-schedule-heading">Jadwal Mingguan</h3>
      <div id="jadwal-mingguan-container" className="weekly-schedule-grid">
        {weeklySchedule.length > 0 ? weeklySchedule.map((day, dayIndex) => (
          <div key={day.tanggal} className="day-container">
            <div className="day-header">
              <span className="day-title"><i className="fas fa-calendar-day"></i>{day.hari}</span>
              <span className="day-date">{new Date(day.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
            </div>
            {day.kegiatan && day.kegiatan.length > 0 ? (
              day.kegiatan.map((keg, index) => (
                <div 
                  key={index} 
                  className={`activity-card-new ${index === (activeActivityIndex[dayIndex] || 0) ? 'active-activity' : 'hidden-activity'}`}
                >
                  <h5>
                    <i className="fas fa-clipboard-list"></i>{keg.nama_kegiatan}
                  </h5>
                  <p className="location">
                    <i className="fas fa-map-marker-alt"></i> {keg.lokasi}
                  </p>
                  <div className="activity-card-details">
                    {keg.details && keg.details.length > 0 ? (
                      keg.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="activity-card-detail-item">
                          <span>{detail.nama_bidang}:</span>
                          {renderPersonilList(detail.personil)}
                        </div>
                      ))
                    ) : (
                      <p className="no-activity-message">Tidak ada personel.</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-activity-message">Tidak ada kegiatan.</p>
            )}
          </div>
        )) : <p className="no-activity-message">Tidak ada kegiatan terjadwal minggu ini.</p>}
      </div>
    </div>
  );
};

export default Dashboard;