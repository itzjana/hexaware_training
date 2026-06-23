import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useApp } from '../../context/AppContext';



export default function ProposalList() {
    const navigate = useNavigate();
    const { showToast } = useApp();
    const [proposals, setProposals] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const config = {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
    };

    const fetchProposals = async () => {
        try {
            const res = await axios.get(
                'http://localhost:8080/api/policyproposal/officer/all',
                config
            );
            // Expects a list of OfficerProposalListDTO
            setProposals(res.data);
        } catch (error) {
            showToast('Failed to fetch submitted proposals.', 'error');
        }
    };

    useEffect(() => {
        fetchProposals();
    }, []);

    const statusBadge = (status) => {
        const map = {
            PROPOSAL_SUBMITTED: { label: 'Submitted', cls: 'bg-warning text-dark' },
            UNDER_REVIEW: { label: 'Under Review', cls: 'bg-info text-dark' },
            VERIFIED: { label: 'Verified', cls: 'bg-info text-dark' },
            QUOTE_GENERATED: { label: 'Quote Sent', cls: 'bg-primary' },
            ACTIVE: { label: 'Active', cls: 'bg-success' },
            REJECTED: { label: 'Rejected', cls: 'bg-danger' },
            ADDITIONAL_DETAILS_REQUIRED: { label: 'Info Needed', cls: 'bg-secondary' },
        };
        const badge = map[status] || { label: status, cls: 'bg-dark' };
        return (
            <span
                className={`badge ${badge.cls} px-3 py-2`}
                style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}
            >
                {badge.label}
            </span>
        );
    };

    if (!proposals) return <div>Loading...</div>;

    return (
        <div>
            <header className="mb-4">
                <h1 className="h3 text-uppercase mb-1">Proposals Queue</h1>
                <p className="text-secondary small">
                    Review submitted insurance proposals, assess risk, and generate quotes.
                </p>
            </header>



            {/* Proposals Table */}
            <div className="bg-white border rounded-3 shadow-sm overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">

                                {/* {
        "proposalId": 1,
        "policyName": "Comprensive Insurance",
        "vehicleNumber": "TN 27 AS 3456",
        "vehicleModel": "Swift",
        "manufacturer": "Honda",
        "status": "ACTIVE",
        "submittedAt": "2026-06-17T09:39:20.097245Z"
    } */}
                            <tr>
                                <th className="text-uppercase small fw-bold text-muted px-4 py-3" >Proposal ID</th>
                                <th className="text-uppercase small fw-bold text-muted px-4 py-3" >policyName</th>
                                <th className="text-uppercase small fw-bold text-muted px-4 py-3" >vehicleModel</th>
                                <th className="text-uppercase small fw-bold text-muted px-4 py-3" >manufacturer</th>
                                <th className="text-uppercase small fw-bold text-muted px-4 py-3" >submittedAt</th>
                                <th className="text-uppercase small fw-bold text-muted px-4 py-3" >Status</th>
                                <th className="text-uppercase small fw-bold text-muted px-4 py-3 text-end" >Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                proposals.map((p, index) => (
                                    <tr key={index} className="border-bottom">
                                        <td className="px-4 py-3 fw-bold small text-danger">#{p.proposalId}</td>
                                        <td className="px-4 py-3 small">{p.policyName}</td>
                                        <td className="px-4 py-3 small text-truncate">{p.vehicleModel}</td>
                                        <td className="px-4 py-3 small text-muted">{p.manufacturer}</td>
                                        <td className="px-4 py-3 small text-muted">{new Date(p.submittedAt).toLocaleDateString()}</td>
                                        <td className="px-4 py-3">{statusBadge(p.status)}</td>
                                        <td className="px-4 py-3 text-end">
                                            <button
                                                className="btn btn-sm btn-outline-dark text-uppercase fw-bold px-3"
                                                style={{ fontSize: '0.7rem' }}
                                                onClick={() => navigate(`/officer/proposals/${p.proposalId}`)}
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
