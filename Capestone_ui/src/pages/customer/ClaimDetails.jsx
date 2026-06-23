import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useApp } from '../../context/AppContext';

export default function ClaimDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showToast } = useApp();
    const [claim, setClaim] = useState(null);

    const config = {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
    };

    useEffect(() => {
        const fetchClaimDetails = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/claim/${id}`, config);
                setClaim(res.data);
            } catch (err) {
                console.error(err);
                showToast("Failed to load claim details.", "error");
            }
        };
        fetchClaimDetails();
    }, [id]);

    if (!claim) {
        return null;
    }

    const handleRespond = async (action) => {
        try {
            await axios.post(`http://localhost:8080/api/claim/${id}/respond`, { action }, config);
            showToast(`Claim offer ${action.toLowerCase()}ed.`, 'success');
            const res = await axios.get(`http://localhost:8080/api/claim/${id}`, config);
            setClaim(res.data);
        } catch (err) {
            console.error(err);
            showToast(err.response?.data?.message || 'Failed to submit offer response.', 'error');
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'APPROVED': return 'bg-success';
            case 'ACCEPTED': return 'bg-success';
            case 'SETTLED': return 'bg-success';
            case 'OFFERED': return 'bg-primary';
            case 'UNDER_REVIEW': return 'bg-warning text-dark';
            case 'REJECTED': return 'bg-danger';
            case 'INITIATED':
            case 'SUBMITTED':
            default: return 'bg-secondary';
        }
    };

    const originalName = (path) => {
        return path.indexOf("_") !== -1
            ? path.substring(path.indexOf("_") + 1)
            : path;
    }

    return (
        <div>
            <header className="mb-4 d-flex align-items-center gap-3">
                <button onClick={() => navigate('/customer/claims')} className="btn btn-outline-dark btn-sm rounded-circle" style={{ width: '36px', height: '36px' }}>
                    <i className="bi bi-arrow-left"></i>
                </button>
                <div>
                    <h1 className="h3 text-uppercase m-0">Claim Assessment Details</h1>
                    <p className="text-secondary small m-0">Case Code: #{claim.claimId}</p>
                </div>
            </header>

            <div className="row g-4">
                <div className="col-lg-8">
                    {/* Main Details Card */}
                    <div className="premium-card p-5 bg-white border shadow-sm mb-4">
                        <div className="d-flex justify-content-between align-items-start mb-4">
                            <div>
                                <h3 className="text-uppercase m-0">Loss Settlement Filing</h3>
                                <span className="small text-muted font-monospace">Associated Policy: {claim.policyName}</span>
                            </div>
                            <span className={`badge ${getStatusBadgeClass(claim.claimStatus)} text-uppercase px-3 py-2 fs-6`}>
                                {claim.claimStatus?.replace('_', ' ')}
                            </span>
                        </div>

                        <hr />

                        <div className="row g-3 mb-4 small">
                            <div className="col-md-6">
                                <div className="text-muted fw-bold text-uppercase">Policy Duration</div>
                                <div className="fs-6 mt-1 text-secondary">
                                    {claim.policyStartDate} to {claim.policyEndDate}
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="text-muted fw-bold text-uppercase">Odometer KM at Incident</div>
                                <div className="fs-6 mt-1 font-monospace fw-bold">{claim.currentOdometerKm ? Number(claim.currentOdometerKm).toLocaleString() : '—'} KM</div>
                            </div>
                            <div className="col-md-6">
                                <div className="text-muted fw-bold text-uppercase">Estimated Cover Amount</div>
                                <div className="fs-6 mt-1 fw-bold text-danger">₹{claim.estimatedAmount ? Number(claim.estimatedAmount).toLocaleString() : '—'}</div>
                            </div>
                            {claim.offeredAmount && (
                                <div className="col-md-6">
                                    <div className="text-muted fw-bold text-uppercase">Offered Settlement Amount</div>
                                    <div className="fs-6 mt-1 fw-bold text-success">₹{Number(claim.offeredAmount).toLocaleString()}</div>
                                </div>
                            )}
                        </div>

                        {/* Vehicle details */}
                        <div className="mb-4">
                            <h6 className="text-muted text-uppercase fw-bold small mb-2">Registered Vehicle Asset:</h6>
                            <div className="p-3 bg-light border rounded small">
                                <div className="row g-2">
                                    <div className="col-6"><strong>Manufacturer:</strong> {claim.manufacturer}</div>
                                    <div className="col-6"><strong>Model:</strong> {claim.model}</div>
                                    <div className="col-6"><strong>Registration Number:</strong> <span className="font-monospace fw-bold">{claim.registrationNumber}</span></div>
                                    <div className="col-6"><strong>Category:</strong> {claim.vehicleCategory}</div>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h6 className="text-muted text-uppercase fw-bold small">Incident Damage Report: </h6>
                            <div className="p-3 border bg-light rounded" style={{whiteSpace: "pre-wrap", overflowWrap: "break-word", wordBreak: "break-word"}}>{claim.incidentDescription}</div>
                        </div>

                        {/* Attachments */}
                        {claim.documentPaths && claim.documentPaths.length > 0 && (
                            <div className="bg-white border rounded-3 p-4 mb-4 shadow-sm">
                                <h5 className="text-uppercase fw-bold small mb-3 pb-2 border-bottom">
                                    <i className="bi bi-file-earmark me-2 text-primary"></i>
                                    Uploaded Documents
                                </h5>

                                <div className="d-flex flex-column gap-2">
                                    {claim.documentPaths.map((path, idx) => (
                                        <div key={idx} className="d-flex justify-content-between align-items-center border rounded p-2">
                                            <span className="text-truncate me-3">
                                                <i className="bi bi-file-earmark-text me-2"></i> {originalName(path)}
                                            </span>
                                            <a href={`/assets/${path}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                                                <i className="bi bi-eye me-1"></i> View
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {claim.officerNote && (
                            <div className="alert alert-light border p-3 mb-0">
                                <div className="fw-bold text-uppercase small text-primary mb-1">
                                    <i className="bi bi-chat-left-dots-fill me-1"></i> Officer Underwriter assessment:
                                </div>
                                <div className="text-secondary small">{claim.officerNote}</div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="bg-white border rounded-3 p-4 shadow-sm text-center">
                        <h5 className="text-uppercase fw-bold mb-3 small tracking-wider">Status Summary</h5>
                        <hr />
                        {(claim.claimStatus === 'INITIATED' || claim.claimStatus === 'SUBMITTED') && (
                            <div className="text-muted small py-3">
                                <i className="bi bi-hourglass display-6 d-block mb-2 text-black-50"></i>
                                Your claim has been logged and queued. A claims adjuster will be assigned shortly to inspect damage files.
                            </div>
                        )}
                        {claim.claimStatus === 'UNDER_REVIEW' && (
                            <div className="text-warning small py-3">
                                <i className="bi bi-search display-6 d-block mb-2 text-warning"></i>
                                Claims adjuster is reviewing accident logs. Settle decision pending further medical/damage reports.
                            </div>
                        )}
                        {claim.claimStatus === 'OFFERED' && (
                            <div className="py-3">
                                <i className="bi bi-info-circle display-6 d-block mb-2 text-primary"></i>
                                <div className="text-primary fw-bold text-uppercase small mb-1">Settlement Offer Received</div>
                                <h3 className="fw-black text-dark mb-3">₹{Number(claim.offeredAmount).toLocaleString()}</h3>
                                <p className="text-muted small mb-4">
                                    The claims adjuster has offered a settlement of <strong>₹{Number(claim.offeredAmount).toLocaleString()}</strong>.
                                    Please accept or reject the offer below.
                                </p>
                                <div className="d-grid gap-2">
                                    <button
                                        className="btn btn-success fw-bold text-uppercase btn-sm py-2"
                                        onClick={() => handleRespond('ACCEPT')}
                                    >
                                        <i className="bi bi-check-circle me-1"></i> Accept Offer
                                    </button>
                                    <button
                                        className="btn btn-outline-danger fw-bold text-uppercase btn-sm py-2"
                                        onClick={() => handleRespond('REJECT')}
                                    >
                                        <i className="bi bi-x-circle me-1"></i> Reject Offer
                                    </button>
                                </div>
                            </div>
                        )}
                        {claim.claimStatus === 'ACCEPTED' && (
                            <div className="text-success small py-3">
                                <i className="bi bi-check-circle-fill display-6 d-block mb-2 text-success"></i>
                                You have accepted the settlement offer of <strong>₹{Number(claim.offeredAmount).toLocaleString()}</strong>.
                                The claim status is now <strong>Accepted</strong> (awaiting final settlement).
                            </div>
                        )}
                        {claim.claimStatus === 'SETTLED' && (
                            <div className="text-success small py-3">
                                <i className="bi bi-shield-fill-check display-6 d-block mb-2 text-success"></i>
                                This claim has been fully <strong>Settled</strong> for <strong>₹{Number(claim.offeredAmount).toLocaleString()}</strong>.
                            </div>
                        )}
                        {claim.claimStatus === 'APPROVED' && (
                            <div className="text-success small py-3">
                                <i className="bi bi-check-circle-fill display-6 d-block mb-2 text-success"></i>
                                Claim approved. Settlement amount is being dispatched.
                            </div>
                        )}
                        {claim.claimStatus === 'REJECTED' && (
                            <div className="text-danger small py-3">
                                <i className="bi bi-x-circle-fill display-6 d-block mb-2 text-danger"></i>
                                Claim rejected. Please contact support hotline for appeal parameters.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
