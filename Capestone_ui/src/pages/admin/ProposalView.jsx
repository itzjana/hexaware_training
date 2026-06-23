import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useApp } from '../../context/AppContext';

export default function AdminProposalView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showToast } = useApp();
    const [proposal, setProposal] = useState(null);

    const config = {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
    };

    useEffect(() => {
        const fetchProposal = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:8080/api/policyproposal/${id}`,
                    config
                );
                setProposal(res.data);
            } catch (error) {
                showToast('Failed to load proposal details.', 'error');
            } 
        };
        fetchProposal();
    }, [id]);

    const statusBadge = (status) => {
        const map = {
            PROPOSAL_SUBMITTED: { label: 'Submitted', cls: 'bg-warning text-dark' },
            UNDER_REVIEW: { label: 'Under Review', cls: 'bg-info text-dark' },
            VERIFIED: { label: 'Verified', cls: 'bg-info text-dark' },
            QUOTE_GENERATED: { label: 'Quote Generated', cls: 'bg-primary' },
            ACTIVE: { label: 'Active', cls: 'bg-success' },
            REJECTED: { label: 'Rejected', cls: 'bg-danger' },
            EXPIRED: { label: 'Expired', cls: 'bg-secondary' },
            CANCELLED: { label: 'Cancelled', cls: 'bg-secondary' },
        };
        const badge = map[status] || { label: status, cls: 'bg-dark' };
        return (
            <span className={`badge ${badge.cls} px-3 py-2`} style={{ fontSize: '0.75rem' }}>
                {badge.label}
            </span>
        );
    };

    const InfoRow = ({ label, value }) => (
        <div className="col-sm-6">
            <div className="text-muted small text-uppercase fw-bold mb-1" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>
                {label}
            </div>
            <div className="fw-semibold">{value ?? '—'}</div>
        </div>
    );

    const calculateAge = () => {
        const dob = new Date(proposal.dob);
        const diff = Date.now() - dob.getTime();
        const ageDate = new Date(diff);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }


    if (!proposal) {
        return (
            <div className="text-center py-5">
                <i className="bi bi-exclamation-triangle display-3 text-warning d-block mb-3"></i>
                <p className="text-muted">Proposal not found.</p>
                <button className="btn btn-dark btn-sm" onClick={() => navigate('/admin/proposals')}>
                    Back to Proposals
                </button>
            </div>
        );
    }
    
    return (
        <div>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <div>
                    <button
                        className="btn btn-link text-secondary text-decoration-none p-0 mb-2 small text-uppercase fw-bold"
                        onClick={() => navigate('/admin/proposals')}
                    >
                        <i className="bi bi-arrow-left me-1"></i>Back to All Proposals
                    </button>
                    <h1 className="h3 text-uppercase mb-1">Proposal Details</h1>
                    <p className="text-muted small mb-0">
                        Viewing proposal{' '}
                        <span className="fw-bold text-primary">#{proposal.proposalId}</span>
                    </p>
                </div>
                <div>{statusBadge(proposal.status)}</div>
            </div>

            <div className="row g-4">
                {/* Proposal Overview */}
                <div className="col-lg-8">
                    <div className="bg-white border rounded-3 p-4 mb-4 shadow-sm">
                        <h5 className="text-uppercase fw-bold small mb-3 pb-2 border-bottom">
                            <i className="bi bi-file-earmark-text me-2 text-primary"></i>Proposal Details
                        </h5>
                        <div className="row g-3">
                            <InfoRow label="Proposal ID" value={`#${proposal.proposalId}`} />
                            <InfoRow label="Policy Name" value={proposal.policyName} />
                            <InfoRow label="Submitted On" value={proposal.submittedAt} />
                            <InfoRow label="Coverage Start" value={proposal.startDate} />
                            <InfoRow label="Coverage End" value={proposal.endDate} />
                            <InfoRow
                                label="Premium"
                                value={ `₹${Number(proposal.policyPrice).toFixed(2)}`}
                            />
                            <InfoRow label="Sum Insured" value={`₹${Number(proposal.currentIdv).toLocaleString()}`} />
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-white border rounded-3 p-4 mb-4 shadow-sm">
                        <h5 className="text-uppercase fw-bold small mb-3 pb-2 border-bottom">
                            <i className="bi bi-person me-2 text-primary"></i>Customer Information
                        </h5>
                        <div className="row g-3">
                            <InfoRow label="Full Name" value={proposal.customerName} />
                            <InfoRow label="Aadhaar" value={proposal.customerAadhaar} />
                            <InfoRow label="PAN" value={proposal.customerPan} />
                            <InfoRow label="Date of Birth" value={proposal.dob} />
                            <InfoRow label="Age" value={calculateAge()} />
                            <InfoRow label="Address" value={proposal.customerAddress} />
                        </div>
                    </div>

                    {/* Vehicle Info */}
                    
                        <div className="bg-white border rounded-3 p-4 shadow-sm">
                            <h5 className="text-uppercase fw-bold small mb-3 pb-2 border-bottom">
                                <i className="bi bi-car-front me-2 text-primary"></i>Vehicle Information
                            </h5>
                            <div className="row g-3">
                                <InfoRow label="Category" value={proposal.category} />
                                <InfoRow label="Registration No." value={proposal.vehicleNumber} />
                                <InfoRow label="Manufacture Year" value={proposal.manufactureYear} />
                                <InfoRow label="Fuel Type" value={proposal.fuelType} />
                                <InfoRow label="Condition" value={proposal.condition} />
                                <InfoRow label="Usage" value={proposal.usage} />
                            </div>
                        </div>
                </div>

                {/* Right Panel: Officer Remark & Read-only Notice */}
                <div className="col-lg-4">
                    {/* Officer Remark */}
                    {proposal.officerRemark && (
                        <div className="bg-white border rounded-3 p-4 shadow-sm mb-4">
                            <h5 className="text-uppercase fw-bold small mb-3 pb-2 border-bottom">
                                <i className="bi bi-chat-quote me-2 text-primary"></i>Officer Remark
                            </h5>
                            <p className="small mb-0 text-muted">{proposal.officerRemark}</p>
                        </div>
                    )}

                    {/* Add-ons */}
                    {proposal.addons && proposal.addons.length > 0 && (
                        <div className="bg-white border rounded-3 p-4 shadow-sm mb-4">
                            <h5 className="text-uppercase fw-bold small mb-3 pb-2 border-bottom">
                                <i className="bi bi-plus-circle me-2 text-primary"></i>Add-ons
                            </h5>
                            <div className="d-flex flex-wrap gap-2">
                                {proposal.addons.map((addon, i) => (
                                    <span key={i} className="badge bg-light text-dark border px-3 py-2" style={{ fontSize: '0.7rem' }}>
                                        {addon}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Read-only notice */}
                    <div className="alert alert-info border-0 small">
                        <i className="bi bi-info-circle-fill me-2"></i>
                        Admin view is <strong>read-only</strong>. Proposal actions are managed by Insurance Officers.
                    </div>
                </div>
            </div>
        </div>
    );
}
