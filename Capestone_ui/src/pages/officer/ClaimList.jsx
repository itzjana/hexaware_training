import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useApp } from '../../context/AppContext';


    // {
    //     "claimId": 2,
    //     "incidentDescription": "descrptiomdescrptiomdescrptiomdescrptiomdescrptiomdescrptiomdescrptiomdescrptiomdescrptiomdescrptiomdescrptiomdescrptiom",
    //     "policyName": "Comprensive Insurance",
    //     "StartDate": "2026-06-17",
    //     "vehicleCategory": "CAMPER_VAN",
    //     "customerName": "jana"
    // }

export default function ClaimList() {
    const navigate = useNavigate();
    const { showToast } = useApp();
    const [claims, setClaims] = useState([]);

    const config = {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
    };

    const fetchClaims = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/claim/getinitiated', config);
            setClaims(res.data);
        } catch (error) {
            showToast('Failed to fetch initiated claims.', 'error');
        } 
    };

    useEffect(() => {
        fetchClaims();
    }, []);

    const statusBadge = (status) => {
        const map = {
            'INITIATED': { label: 'Initiated', cls: 'bg-warning text-dark' },
            'UNDER_REVIEW': { label: 'Under Review', cls: 'bg-info text-dark' },
            'APPROVED': { label: 'Approved', cls: 'bg-success' },
            'REJECTED': { label: 'Rejected', cls: 'bg-danger' }
        };
        const badge = map[status] || { label: status, cls: 'bg-dark' };
        return <span className={`badge ${badge.cls} px-3 py-2`} style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}>{badge.label}</span>;
    };


    return (
        <div>
            <header className="mb-4">
                <h1 className="h3 text-uppercase mb-1">Claims Queue</h1>
                <p className="text-secondary small">Inspect damage claims, review documentation, and provide assessment decisions.</p>
            </header>

            {/* Claims Table */}
            <div className="bg-white border rounded-3 shadow-sm overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="text-uppercase small fw-bold text-muted px-4 py-3" >ID</th>
                                <th className="text-uppercase small fw-bold text-muted px-4 py-3" >Customer Name</th>
                                <th className="text-uppercase small fw-bold text-muted px-4 py-3" >Vehicle Category</th>
                                <th className="text-uppercase small fw-bold text-muted px-4 py-3" >Description</th>
                                <th className="text-uppercase small fw-bold text-muted px-4 py-3" >Policy Start Date</th>
                                <th className="text-uppercase small fw-bold text-muted px-4 py-3" >Status</th>
                                <th className="text-uppercase small fw-bold text-muted px-4 py-3 text-end" >Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            claims.map((c,index) => (
                                    <tr key={c.claimId} className="border-bottom">
                                        <td className="px-4 py-3 fw-bold small text-danger">#{c.claimId}</td>
                                        <td className="px-4 py-3 small">{c.customerName}</td>
                                        <td className="px-4 py-3 small text-muted">{c.vehicleCategory}</td>
                                        <td className="px-4 py-3 small text-truncate" style={{ maxWidth: '260px' }}>{c.incidentDescription}</td>
                                        <td className="px-4 py-3 small text-muted">{new Date(c.StartDate).toLocaleDateString()}</td>
                                        <td className="px-4 py-3">{statusBadge("INITIATED")}</td>
                                        <td className="px-4 py-3 text-end">
                                            <button
                                                className="btn btn-sm btn-outline-dark text-uppercase fw-bold px-3"
                                                style={{ fontSize: '0.7rem' }}
                                                onClick={() => navigate(`/officer/claims/${c.claimId}`)}
                                            >
                                                <i className="bi bi-eye me-1"></i> Review
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
