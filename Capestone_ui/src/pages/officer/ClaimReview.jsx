import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useApp } from '../../context/AppContext';

export default function ClaimReview() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showToast } = useApp();

    const [claim, setClaim] = useState(null);
    const [officerNote, setOfficerNote] = useState('');
    const [status, setStatus] = useState('');
    const [offeredAmount, setOfferedAmount] = useState('');
    const [saving, setSaving] = useState(false);

    const config = {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
    };

    const fetchClaim = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/api/claim/${id}`, config);
            setClaim(res.data);
            setOfficerNote(res.data.officerNote || '');
            setStatus(res.data.claimStatus || '');
            setOfferedAmount(res.data.offeredAmount || res.data.suggestedAmount || '');
        } catch (err) {
            console.error(err);
            showToast('Failed to load claim details.', 'error');
        }
    };

    useEffect(() => {
        fetchClaim();
    }, [id]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const req = {
                status: status,
                officerNote: officerNote,
                offeredAmount: status === 'OFFERED' ? parseFloat(offeredAmount) : (claim.offeredAmount || null)
            };
            await axios.post(`http://localhost:8080/api/claim/updatestatus/${id}`, req, config);
            showToast('Claim updated successfully.', 'success');
            await fetchClaim();
        } catch (err) {
            console.error(err);
            showToast(err.response?.data?.message || 'Failed to update claim.', 'error');
        } finally {
            setSaving(false);
        }
    };

    const statusBadge = (s) => {
        const map = {
            'SUBMITTED': { label: 'Submitted', cls: 'bg-warning text-dark' },
            'INITIATED': { label: 'Initiated', cls: 'bg-warning text-dark' },
            'UNDER_REVIEW': { label: 'Under Review', cls: 'bg-info text-dark' },
            'OFFERED': { label: 'Offered', cls: 'bg-primary' },
            'ACCEPTED': { label: 'Accepted', cls: 'bg-success' },
            'REJECTED': { label: 'Rejected', cls: 'bg-danger' },
            'SETTLED': { label: 'Settled', cls: 'bg-success' },
            'APPROVED': { label: 'Approved', cls: 'bg-success' }
        };
        const badge = map[s] || { label: s, cls: 'bg-dark' };
        return <span className={`badge ${badge.cls} px-3 py-2`} style={{ fontSize: '0.75rem' }}>{badge.label}</span>;
    };

    if (!claim) {
        return <div className="text-center mt-5">Loading claim details...</div>;
    }

    const isTerminal = claim.claimStatus === 'SETTLED' || claim.claimStatus === 'REJECTED';

    const originalName = (path) => {
        return path.indexOf("_") !== -1
            ? path.substring(path.indexOf("_") + 1)
            : path;
    }

    return (
        <div>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <div>
                    <button className="btn btn-link text-secondary text-decoration-none p-0 mb-2 small text-uppercase fw-bold" onClick={() => navigate('/officer/claims')}>
                        <i className="bi bi-arrow-left me-1"></i> Back to Claims Queue
                    </button>
                    <h1 className="h3 text-uppercase mb-1">Claim Review</h1>
                    <p className="text-muted small mb-0">Assess and adjudicate claim <span className="fw-bold text-danger">#{claim.claimId}</span></p>
                </div>
                <div>{statusBadge(claim.claimStatus)}</div>
            </div>

            <div className="row g-4">
                {/* Left Column: Claim, Policy, Customer Details */}
                <div className="col-lg-8">
                    {/* Claim Overview */}
                    <div className="bg-white border rounded-3 p-4 mb-4 shadow-sm">
                        <h5 className="text-uppercase fw-bold small tracking-wider mb-3 pb-2 border-bottom">
                            <i className="bi bi-file-earmark-medical me-2 text-danger"></i>Claim Details
                        </h5>
                        <div className="row g-3">
                            <div className="col-sm-6">
                                <div className="text-muted small text-uppercase fw-bold" style={{ fontSize: '0.65rem' }}>Claim ID</div>
                                <div className="fw-bold">#{claim.claimId}</div>
                            </div>
                            <div className="col-sm-6">
                                <div className="text-muted small text-uppercase fw-bold" style={{ fontSize: '0.65rem' }}>Policy Reference</div>
                                <div className="fw-semibold text-primary">{claim.policyName}</div>
                            </div>
                            <div className="col-sm-6">
                                <div className="text-muted small text-uppercase fw-bold" style={{ fontSize: '0.65rem' }}>Odometer KM at Incident</div>
                                <div className="fw-semibold">{claim.currentOdometerKm ? Number(claim.currentOdometerKm).toLocaleString() : '—'} KM</div>
                            </div>
                            <div className="col-sm-6">
                                <div className="text-muted small text-uppercase fw-bold" style={{ fontSize: '0.65rem' }}>Current Status</div>
                                <div>{statusBadge(claim.claimStatus)}</div>
                            </div>
                            <div className="col-sm-6">
                                <div className="text-muted small text-uppercase fw-bold" style={{ fontSize: '0.65rem' }}>Estimated Cover Amount</div>
                                <div className="fw-semibold text-danger">₹{claim.estimatedAmount ? Number(claim.estimatedAmount).toLocaleString() : '—'}</div>
                            </div>
                            <div className="col-sm-6">
                                <div className="text-muted small text-uppercase fw-bold" style={{ fontSize: '0.65rem' }}>Suggested Settlement (Calculated)</div>
                                <div className="fw-semibold text-primary">₹{claim.suggestedAmount ? Number(claim.suggestedAmount).toLocaleString() : '—'}</div>
                            </div>
                            {claim.offeredAmount && (
                                <div className="col-sm-6">
                                    <div className="text-muted small text-uppercase fw-bold" style={{ fontSize: '0.65rem' }}>Offered Settlement</div>
                                    <div className="fw-semibold text-success">₹{Number(claim.offeredAmount).toLocaleString()}</div>
                                </div>
                            )}
                            <div className="col-12">
                                <div className="text-muted small text-uppercase fw-bold mb-1" style={{ fontSize: '0.65rem' }}>Damage Description</div>
                                <div className="p-3 bg-light border rounded-3">{claim.incidentDescription}</div>
                            </div>
                        </div>
                    </div>

                    {/* Linked Policy Details */}
                    <div className="bg-white border rounded-3 p-4 mb-4 shadow-sm">
                        <h5 className="text-uppercase fw-bold small tracking-wider mb-3 pb-2 border-bottom">
                            <i className="bi bi-shield-check me-2 text-primary"></i>Linked Policy Details
                        </h5>
                        <div className="row g-3">
                            <div className="col-sm-6">
                                <div className="text-muted small text-uppercase fw-bold" style={{ fontSize: '0.65rem' }}>Policy Name</div>
                                <div className="fw-semibold">{claim.policyName}</div>
                            </div>
                            <div className="col-sm-6">
                                <div className="text-muted small text-uppercase fw-bold" style={{ fontSize: '0.65rem' }}>Vehicle Category</div>
                                <div>{claim.vehicleCategory}</div>
                            </div>
                            <div className="col-sm-6">
                                <div className="text-muted small text-uppercase fw-bold" style={{ fontSize: '0.65rem' }}>Coverage Period</div>
                                <div>{claim.policyStartDate} → {claim.policyEndDate}</div>
                            </div>
                            <div className="col-sm-6">
                                <div className="text-muted small text-uppercase fw-bold" style={{ fontSize: '0.65rem' }}>Vehicle Registration</div>
                                <div>{claim.registrationNumber} ({claim.manufacturer} {claim.model})</div>
                            </div>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-white border rounded-3 p-4 mb-4 shadow-sm">
                        <h5 className="text-uppercase fw-bold small tracking-wider mb-3 pb-2 border-bottom">
                            <i className="bi bi-person me-2 text-primary"></i>Claimant Information
                        </h5>
                        <div className="row g-3">
                            <div className="col-sm-6">
                                <div className="text-muted small text-uppercase fw-bold" style={{ fontSize: '0.65rem' }}>Full Name</div>
                                <div className="fw-semibold">{claim.customerName}</div>
                            </div>
                            <div className="col-sm-6">
                                <div className="text-muted small text-uppercase fw-bold" style={{ fontSize: '0.65rem' }}>Address</div>
                                <div>{claim.customerAddress}</div>
                            </div>
                            <div className="col-sm-6">
                                <div className="text-muted small text-uppercase fw-bold" style={{ fontSize: '0.65rem' }}>Aadhaar</div>
                                <div>{claim.aadharNumber}</div>
                            </div>
                            <div className="col-sm-6">
                                <div className="text-muted small text-uppercase fw-bold" style={{ fontSize: '0.65rem' }}>PAN</div>
                                <div>{claim.panNumber}</div>
                            </div>
                        </div>
                    </div>

                    {/* Uploaded Documents */}
                    {claim.documentPaths && claim.documentPaths.length > 0 && (
                        <div className="bg-white border rounded-3 p-4 mb-4 shadow-sm">
                            <h5 className="text-uppercase fw-bold small mb-3 pb-2 border-bottom">
                                <i className="bi bi-file-earmark me-2 text-primary"></i>
                                Uploaded Documents
                            </h5>

                            <div className="d-flex flex-column gap-2">
                                {claim.documentPaths.map((path, idx) => (
                                        <div
                                            key={idx}
                                            className="d-flex justify-content-between align-items-center border rounded p-2"
                                        >
                                            <span className="text-truncate me-3">
                                                <i className="bi bi-file-earmark-text me-2"></i>
                                                {originalName(path)}
                                            </span>

                                            <a
                                                href={`/assets/${path}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-sm btn-outline-primary"
                                            >
                                                <i className="bi bi-eye me-1"></i>
                                                View
                                            </a>
                                        </div>
                                    
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Officer Actions */}
                <div className="col-lg-4">
                    <div className="bg-white border rounded-3 p-4 shadow-sm sticky-top" style={{ top: '80px' }}>
                        <h5 className="text-uppercase fw-bold small tracking-wider mb-3 pb-2 border-bottom">
                            <i className="bi bi-pencil-square me-2 text-danger"></i>Officer Actions
                        </h5>

                        {isTerminal ? (
                            <div className="alert alert-secondary small mb-0">
                                <i className="bi bi-lock-fill me-2"></i>
                                This claim is <strong>{status?.replace(/_/g, ' ')}</strong> and requires no further action.
                            </div>
                        ) : (
                            <>
                                <div className="mb-3">
                                    <label className="form-label small text-uppercase fw-bold text-muted" style={{ fontSize: '0.65rem' }}>
                                        Claim Status
                                    </label>
                                    <select
                                        className="form-select text-uppercase"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        disabled={saving}
                                    >
                                        <option value="">Select Status</option>
                                        {claim.claimStatus !== 'OFFERED' && claim.claimStatus !== 'ACCEPTED' && (
                                            <option value="UNDER_REVIEW">Under Review</option>
                                        )}
                                        {claim.claimStatus !== 'ACCEPTED' && (
                                            <option value="OFFERED">Offered</option>
                                        )}
                                        {claim.claimStatus === 'ACCEPTED' && (
                                            <option value="ACCEPTED" disabled>Accepted (Customer Response)</option>
                                        )}
                                        <option value="REJECTED">Rejected</option>
                                        <option value="SETTLED">Settled</option>
                                    </select>
                                </div>

                                {status === 'OFFERED' && (
                                    <>
                                        <div className="mb-3">
                                            <label className="form-label small text-uppercase fw-bold text-muted" style={{ fontSize: '0.65rem' }}>
                                                Suggested Cover Amount (₹)
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control bg-light"
                                                value={claim.suggestedAmount ? `₹${Number(claim.suggestedAmount).toLocaleString()}` : '—'}
                                                disabled
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label small text-uppercase fw-bold text-muted" style={{ fontSize: '0.65rem' }}>
                                                Officer Offer Amount (₹)
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={offeredAmount}
                                                onChange={(e) => setOfferedAmount(e.target.value)}
                                                disabled={saving}
                                            />
                                        </div>
                                    </>
                                )}

                                <div className="mb-4">
                                    <label className="form-label small text-uppercase fw-bold text-muted" style={{ fontSize: '0.65rem' }}>
                                        Assessment Remarks / Notes
                                    </label>
                                    <textarea
                                        className="form-control"
                                        rows="4"
                                        placeholder="Assessment notes, inspection results..."
                                        value={officerNote}
                                        onChange={e => setOfficerNote(e.target.value)}
                                        disabled={saving}
                                    ></textarea>
                                </div>

                                <div className="d-grid">
                                    <button
                                        className="btn btn-danger fw-bold text-uppercase btn-sm py-2"
                                        onClick={handleSave}
                                        disabled={saving || !status}
                                    >
                                        {saving
                                            ? <span className="spinner-border spinner-border-sm me-1"></span>
                                            : <i className="bi bi-save me-1"></i>
                                        }
                                        Save Review & Status
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
