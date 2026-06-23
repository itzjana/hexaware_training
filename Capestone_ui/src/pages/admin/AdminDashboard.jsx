import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import axios from 'axios';
import AdminPieChart from '../../components/AdminPieChart';
import AdminBarGraph from '../../components/AdminBarGrapgh';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { showToast } = useApp();
    const [stats, setStats] = useState();

    const statApi = 'http://localhost:8080/api/stat/adminstats';

    const config = {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
    };

    const fetchStats = async () => {
        try {
            const response = await axios.get(statApi, config);
            setStats(response.data);
        } catch (error) {
            showToast('Error fetching stats', 'error');
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return (
        <div>
            <header className="mb-4">
                <h1 className="h3 text-uppercase mb-2">Admin Dashboard</h1>
                <p className="text-secondary small">System statistics, user credentials registry, and configurations overview.</p>
            </header>

                        {/* Quick Actions Panel */}
            <div className="bg-white border rounded-3 p-4 mb-4 shadow-sm">
                <h5 className="text-uppercase fw-bold mb-3">Quick Actions</h5>
                <div className="d-flex flex-wrap gap-3">
                    <button onClick={() => navigate('/admin/policies')} className="btn btn-outline-dark text-uppercase fw-bold rounded-2">
                        <i className="bi bi-gear-fill me-2"></i>Configure Policies
                    </button>
                    <button onClick={() => navigate('/admin/onboard')} className="btn btn-outline-dark text-uppercase fw-bold rounded-2">
                        <i className="bi bi-person-plus-fill me-2"></i>Onboard Officer
                    </button>
                    <button onClick={() => navigate('/admin/reviews')} className="btn btn-outline-dark text-uppercase fw-bold rounded-2">
                        <i className="bi bi-star-fill me-2"></i>View User Reviews
                    </button>
                    <button onClick={() => navigate('/admin/proposals')} className="btn btn-outline-dark text-uppercase fw-bold rounded-2">
                        <i className="bi bi-file-earmark-text-fill me-2"></i>All Proposals
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="row g-4 mb-4">
                <div className="col-md-3">
                    <div className="bg-white border rounded-3 p-4 hover-lift shadow-sm">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="text-muted text-uppercase m-0">Customers</h6>
                            <i className="bi bi-people-fill text-primary fs-4"></i>
                        </div>
                        <h2 className="fw-black text-dark m-0">{stats?.customerCount}</h2>
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>Registered accounts</span>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="bg-white border rounded-3 p-4 hover-lift shadow-sm">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="text-muted text-uppercase m-0">Officers</h6>
                            <i className="bi bi-shield-lock-fill text-primary fs-4"></i>
                        </div>
                        <h2 className="fw-black text-dark m-0">{stats?.officerCount}</h2>
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>Claims underwriting staff</span>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="bg-white border rounded-3 p-4 hover-lift shadow-sm">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="text-muted text-uppercase m-0">Active Coverages</h6>
                            <i className="bi bi-file-earmark-check-fill text-primary fs-4"></i>
                        </div>
                        <h2 className="fw-black text-dark m-0">{stats?.activePolicyCount}</h2>
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>In force policies</span>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="bg-white border rounded-3 p-4 hover-lift shadow-sm">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="text-muted text-uppercase m-0">Claims Count</h6>
                            <i className="bi bi-exclamation-triangle-fill text-danger fs-4"></i>
                        </div>
                        <h2 className="fw-black text-dark m-0">{stats?.openClaims}</h2>
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>Total claims registered</span>
                    </div>
                </div>
            </div>

            {/* Analytics Charts */}
            <div className="mb-3">
                <h5 className="text-uppercase fw-bold mb-0"
                    style={{ fontSize: '0.8rem', letterSpacing: '0.07em', color: '#475569' }}>
                    Analytics &amp; Insights
                </h5>
            </div>

            <div className="row g-4 mb-4">
                <div className="col-lg-7">
                    <AdminBarGraph />
                </div>
                <div className="col-lg-5">
                    <AdminPieChart />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;