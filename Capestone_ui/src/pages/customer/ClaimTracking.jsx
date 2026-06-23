import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useApp } from '../../context/AppContext';

export default function ClaimTracking() {
    const navigate = useNavigate();
    const { showToast } = useApp();
    const [claims, setClaims] = useState([]);

    const config = {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
    };

    useEffect(() => {
        const fetchClaims = async () => {
            try {
                const res = await axios.get('http://localhost:8080/api/claim/getbycustomer', config);
                setClaims(res.data);
            } catch (err) {
                console.error(err);
                showToast("Failed to load claims list.", "error");
            }
        };
        fetchClaims();
    }, []);

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'APPROVED': return 'bg-success';
            case 'UNDER_REVIEW': return 'bg-warning text-dark';
            case 'REJECTED': return 'bg-danger';
            case 'INITIATED':
            default: return 'bg-secondary';
        }
    };

    return (
        <div>
            <header className="mb-4 d-flex justify-content-between align-items-center">
                <div>
                    <h1 className="h3 text-uppercase mb-2">Claim Incident Tracking</h1>
                    <p className="text-secondary small m-0">Track loss assessments and review notes from claims officers.</p>
                </div>
                <button onClick={() => navigate('/customer/claim')} className="btn btn-danger text-uppercase fw-bold rounded-2">
                    <i className="bi bi-exclamation-triangle me-2"></i> File New Claim
                </button>
            </header>

            <div className="bg-white border rounded-3 shadow-sm overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light text-uppercase small">
                            <tr>
                                <th className="px-4 py-3">Claim ID</th>
                                <th className="px-4 py-3">Associated Policy</th>
                                <th className="px-4 py-3">Vehicle Number</th>
                                <th className="px-4 py-3">Incident Description</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-end">Details</th>
                            </tr>
                        </thead>
                        <tbody className="small">
                            {claims.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center text-muted italic p-4">
                                        No claim incidents logged. File a claim if your vehicle met with an accident.
                                    </td>
                                </tr>
                            ) : (
                                claims.map(c => (
                                    <tr key={c.claimId}>
                                        <td className="px-4 py-3 font-monospace fw-bold">{c.claimId}</td>
                                        <td className="px-4 py-3 fw-bold">{c.policyName}</td>
                                        <td className="px-4 py-3 font-monospace text-secondary">{c.vehicleNumber}</td>
                                        <td className="px-4 py-3 text-secondary text-truncate" style={{ maxWidth: '240px' }}>
                                            {c.incidentDescription}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`badge ${getStatusBadgeClass(c.status)} text-uppercase`}>
                                                {c.status?.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-end">
                                            <button 
                                                onClick={() => navigate(`/customer/claims/${c.claimId}`)} 
                                                className="btn btn-sm btn-outline-dark text-uppercase fw-bold"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
