import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useApp } from '../../context/AppContext';

export default function OfficerDashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        officerClaimsCount: 0,
        officerProposalsCount: 0,
        initiatedProposalsCount: 0,
        initiatedClaimsCount: 0
    });

    const config = {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
    };

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const res = await axios.get('http://localhost:8080/api/stat/officerstats', config);
                setStats(res.data);
            } catch (err) {
                console.error('Failed to fetch dashboard counts', err);
            }
        };
        fetchCounts();
    }, []);

    return (
        <div>
            <header className="mb-4">
                <h1 className="h3 text-uppercase mb-2">Officer Overview</h1>
                <p className="text-secondary small">Review underwriting applications and assess filed vehicle damage claims.</p>
            </header>

            {/* Bento Statistics Grid */}
            <div className="row g-4 mb-4">
                <div className="col-md-3">
                    <div className="bg-white border rounded-3 p-4 hover-lift shadow-sm">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="text-muted text-uppercase m-0" style={{ fontSize: '0.75rem' }}>Assigned Proposals</h6>
                            <i className="bi bi-file-earmark-text-fill text-warning fs-4"></i>
                        </div>
                        <h2 className="fw-black text-dark m-0">{stats.officerProposalsCount}</h2>
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>Your proposals queue</span>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="bg-white border rounded-3 p-4 hover-lift shadow-sm">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="text-muted text-uppercase m-0" style={{ fontSize: '0.75rem' }}>Assigned Claims</h6>
                            <i className="bi bi-exclamation-triangle-fill text-danger fs-4"></i>
                        </div>
                        <h2 className="fw-black text-dark m-0">{stats.officerClaimsCount}</h2>
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>Your claims queue</span>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="bg-white border rounded-3 p-4 hover-lift shadow-sm">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="text-muted text-uppercase m-0" style={{ fontSize: '0.75rem' }}>New Proposals</h6>
                            <i className="bi bi-folder-plus text-primary fs-4"></i>
                        </div>
                        <h2 className="fw-black text-dark m-0">{stats.initiatedProposalsCount}</h2>
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>Awaiting assignment</span>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="bg-white border rounded-3 p-4 hover-lift shadow-sm">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="text-muted text-uppercase m-0" style={{ fontSize: '0.75rem' }}>New Claims</h6>
                            <i className="bi bi-file-earmark-medical-fill text-info fs-4"></i>
                        </div>
                        <h2 className="fw-black text-dark m-0">{stats.initiatedClaimsCount}</h2>
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>Awaiting assessment</span>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                {/* Main panel: Queues links */}
                <div className="col-lg-12">
                    <div className="bg-white border rounded-3 p-4 shadow-sm">
                        <h5 className="text-uppercase fw-bold mb-3 small tracking-wider">Underwriting &amp; Claims Queues</h5>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <div className="p-4 border rounded-3 text-center bg-light">
                                    <i className="bi bi-file-earmark-check-fill text-primary display-6 d-block mb-3"></i>
                                    <h6 className="text-uppercase fw-bold">Proposals Review Queue</h6>
                                    <p className="text-secondary small mb-4">Assess submissions, review vehicle categories, and underwrite premiums.</p>
                                    <button onClick={() => navigate('/officer/proposals')} className="btn btn-dark text-uppercase fw-bold btn-sm px-4 py-2">
                                        Open Proposals
                                    </button>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="p-4 border rounded-3 text-center bg-light">
                                    <i className="bi bi-file-earmark-medical-fill text-danger display-6 d-block mb-3"></i>
                                    <h6 className="text-uppercase fw-bold">Claims Review Queue</h6>
                                    <p className="text-secondary small mb-4">Inspect damage descriptions, view document files, and adjudicate claims.</p>
                                    <button onClick={() => navigate('/officer/claims')} className="btn btn-dark text-uppercase fw-bold btn-sm px-4 py-2">
                                        Open Claims
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
