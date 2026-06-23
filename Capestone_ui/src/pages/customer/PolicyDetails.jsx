import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useApp } from '../../context/AppContext';

export default function PolicyDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [proposal, setProposal] = useState(null);
    const [error, setError] = useState(null);
    const [quote, setQuote] = useState(null);

    const [files, setFiles] = useState([]);
    const [resubmitting, setResubmitting] = useState(false);
    const { showToast } = useApp();

    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    };

    const handleFileChange = (e) => {
        setFiles(e.target.files);
    };

    const handleResubmit = async (e) => {
        e.preventDefault();
        if (!files || files.length === 0) {
            showToast('Please select at least one document to upload.', 'warning');
            return;
        }

        setResubmitting(true);
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }

        try {
            await axios.patch(`http://localhost:8080/api/policyproposal/${id}/resubmit`, formData, config);
            showToast('Documents resubmitted successfully!', 'success');
            // Re-fetch details to update UI state
            const res = await axios.get(`http://localhost:8080/api/policyproposal/${id}`, config);
            setProposal(res.data);
            setFiles([]);
        } catch (err) {
            console.error(err);
            showToast(err.response?.data?.message || 'Failed to resubmit documents.', 'error');
        } finally {
            setResubmitting(false);
        }
    };

    const handlePayment = async () => {
        if (!quote) return;
        try {
            await axios.post('http://localhost:8080/api/payment', { quoteId: quote.quoteId }, config);
            showToast('Payment processed successfully! Your policy is now active.', 'success');
            // Re-fetch proposal details to update UI state
            const res = await axios.get(`http://localhost:8080/api/policyproposal/${id}`, config);
            setProposal(res.data);
        } catch (err) {
            console.error(err);
            showToast(err.response?.data?.message || 'Payment processing failed.', 'error');
        }
    };

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/policyproposal/${id}`, config);
                setProposal(res.data);

                if (res.data.status === 'QUOTE_GENERATED') {
                    const quoteRes = await axios.get(`http://localhost:8080/api/quote/${id}`, config);
                    setQuote(quoteRes.data);
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load proposal details.');
            }
        };
        fetchDetail();
    }, [id]);

    const calculateAge = (dob) => {
        if (!dob) return '—';
        const today = new Date();
        const birth = new Date(dob);
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
        return age;
    };

    const statusBadge = (s) => {
        const map = {
            PROPOSAL_SUBMITTED: { label: 'Submitted', cls: 'bg-warning text-dark' },
            UNDER_REVIEW: { label: 'Under Review', cls: 'bg-info text-dark' },
            VERIFIED: { label: 'Verified', cls: 'bg-info text-dark' },
            QUOTE_GENERATED: { label: 'Quote Generated', cls: 'bg-primary' },
            ACTIVE: { label: 'Active', cls: 'bg-success' },
            REJECTED: { label: 'Rejected', cls: 'bg-danger' },
            ADDITIONAL_DETAILS_REQUIRED: { label: 'Info Needed', cls: 'bg-secondary' },
            EXPIRED: { label: 'Expired', cls: 'bg-dark' },
            CANCELLED: { label: 'Cancelled', cls: 'bg-dark' },
        };
        const badge = map[s] || { label: s ? s.replace(/_/g, ' ') : '', cls: 'bg-dark' };
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

    if (error) {
        return (
            <div className="alert alert-danger my-4">
                {error}{' '}
                <button onClick={() => navigate('/customer/proposals')} className="btn btn-link p-0">Back to Proposals</button>
            </div>
        );
    }

    if (!proposal) {
        return null;
    }

    return (
        <div>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <div>
                    <button
                        className="btn btn-link text-secondary text-decoration-none p-0 mb-2 small text-uppercase fw-bold"
                        onClick={() => navigate('/customer/proposals')}
                    >
                        <i className="bi bi-arrow-left me-1"></i> Back to Proposals
                    </button>
                    <h1 className="h3 text-uppercase mb-1">Policy / Proposal Details</h1>
                    <p className="text-muted small mb-0">
                        Reference ID:{' '}
                        <span className="fw-bold text-primary">#{proposal?.proposalId}</span>
                    </p>
                </div>
                <div>{statusBadge(proposal?.status)}</div>
            </div>

            <div className="row g-4">
                {/* Main Details (Left Column) */}
                <div className="col-lg-8">
                    {/* Action Required: Upload Additional Documents */}
                    {proposal.status === 'ADDITIONAL_DETAILS_REQUIRED' && (
                        <div className="bg-warning bg-opacity-10 border border-warning rounded-3 p-4 mb-4 shadow-sm">
                            <h5 className="text-uppercase fw-bold text-warning mb-3 small d-flex align-items-center gap-2">
                                <i className="bi bi-exclamation-triangle-fill fs-5"></i>
                                Action Required: Upload Additional Documents
                            </h5>
                            <p className="small text-secondary mb-3">
                                The underwriting officer has requested additional details/documents for your proposal. Please upload the requested files below.
                            </p>
                            <form onSubmit={handleResubmit}>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-uppercase text-muted">Select Files to Upload</label>
                                    <input 
                                        type="file" 
                                        className="form-control" 
                                        multiple 
                                        onChange={handleFileChange}
                                        required 
                                    />
                                    <div className="form-text text-muted small">
                                        You can select multiple files at once.
                                    </div>
                                </div>
                                <button 
                                    type="submit" 
                                    className="btn btn-warning text-dark text-uppercase fw-bold py-2 px-4"
                                    disabled={resubmitting}
                                >
                                    {resubmitting ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Resubmitting...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-cloud-arrow-up-fill me-2"></i>Resubmit Documents
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Proposal Details Card */}
                    <div className="bg-white border rounded-3 p-4 mb-4 shadow-sm">
                        <h5 className="text-uppercase fw-bold small mb-3 pb-2 border-bottom">
                            <i className="bi bi-file-earmark-text me-2 text-primary"></i>Proposal Details
                        </h5>
                        <div className="row g-3">
                            <InfoRow label="Proposal ID" value={`#${proposal?.proposalId}`} />
                            <InfoRow label="Policy Name" value={proposal?.policyName} />
                            <InfoRow label="Policy Price" value={proposal?.policyPrice != null ? `₹${Number(proposal.policyPrice).toFixed(2)}` : '—'} />
                            <InfoRow label="Submitted On" value={proposal?.submittedAt ? new Date(proposal.submittedAt).toLocaleDateString() : '—'} />
                            <InfoRow label="Coverage Start" value={proposal?.startDate} />
                            <InfoRow label="Coverage End" value={proposal?.endDate} />

                            <div className="col-12">
                                <div className="text-muted small text-uppercase fw-bold mb-2" style={{ fontSize: '0.65rem' }}>
                                    Add-ons
                                </div>
                                <div className="d-flex flex-wrap gap-2">
                                    {proposal?.addOns && proposal.addOns.length > 0 ? (
                                        proposal.addOns.map((addon, i) => (
                                            <span key={i} className="badge bg-light text-dark border px-3 py-2" style={{ fontSize: '0.7rem' }}>
                                                <i className="bi bi-plus-circle me-1"></i>{addon.name || addon.addOnName || addon} (₹{addon.additionalCost ?? addon.cost ?? '—'})
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-muted italic small">No optional add-ons selected for this coverage.</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Customer Info Card */}
                    <div className="bg-white border rounded-3 p-4 mb-4 shadow-sm">
                        <h5 className="text-uppercase fw-bold small mb-3 pb-2 border-bottom">
                            <i className="bi bi-person me-2 text-primary"></i>Customer Information
                        </h5>
                        <div className="row g-3">
                            <InfoRow label="Full Name" value={proposal?.customerName} />
                            <InfoRow label="Aadhaar" value={proposal?.customerAadhaar} />
                            <InfoRow label="PAN" value={proposal?.customerPan} />
                            <InfoRow label="Date of Birth" value={proposal?.dob} />
                            <InfoRow label="Age" value={calculateAge(proposal?.dob)} />
                            <InfoRow label="Address" value={proposal?.customerAddress} />
                        </div>
                    </div>

                    {/* Vehicle Info Card */}
                    <div className="bg-white border rounded-3 p-4 mb-4 shadow-sm">
                        <h5 className="text-uppercase fw-bold small mb-3 pb-2 border-bottom">
                            <i className="bi bi-car-front me-2 text-primary"></i>Vehicle Information
                        </h5>
                        <div className="row g-3">
                            <InfoRow label="Category" value={proposal?.category} />
                            <InfoRow label="Registration No." value={proposal?.vehicleNumber} />
                            <InfoRow label="Manufacturer" value={proposal?.manufacturer} />
                            <InfoRow label="Model" value={proposal?.model} />
                            <InfoRow label="Variant" value={proposal?.variant} />
                            <InfoRow label="Manufacture Year" value={proposal?.manufactureYear} />
                            <InfoRow label="Fuel Type" value={proposal?.fuelType} />
                            <InfoRow label="Condition" value={proposal?.condition} />
                            <InfoRow label="Usage" value={proposal?.usage} />
                            <InfoRow label="Engine (cc)" value={proposal?.engineCapacityCc} />
                            <InfoRow label="Seating Capacity" value={proposal?.seatingCapacity} />
                            <InfoRow label="Odometer (km)" value={proposal?.currentOdometerKm != null ? Number(proposal.currentOdometerKm).toLocaleString() : '—'} />
                            <InfoRow label="Owner Count" value={proposal?.ownerCount} />
                            <InfoRow label="Current IDV" value={proposal?.currentIdv != null ? `₹${Number(proposal.currentIdv).toFixed(2)}` : '—'} />
                            <InfoRow label="Modified Vehicle" value={proposal?.modifiedVehicle != null ? (proposal.modifiedVehicle ? 'Yes' : 'No') : '—'} />
                            <InfoRow label="Accident History" value={proposal?.accidentHistory != null ? (proposal.accidentHistory ? 'Yes' : 'No') : '—'} />
                            {proposal?.accidentHistory && (
                                <InfoRow label="Accident Count" value={proposal?.accidentCount} />
                            )}
                            <InfoRow label="Previous Insurer" value={proposal?.previousInsurer} />
                            <InfoRow label="No Claim Bonus (%)" value={proposal?.noClaimBonusPercentage != null ? `${proposal.noClaimBonusPercentage}%` : '—'} />
                            <InfoRow label="Registration Date" value={proposal?.registrationDate} />
                        </div>
                    </div>

                    {/* Uploaded Documents Card */}
                    <div className="bg-white border rounded-3 p-4 mb-4 shadow-sm">
                        <h5 className="text-uppercase fw-bold small mb-3 pb-2 border-bottom">
                            <i className="bi bi-file-earmark me-2 text-primary"></i>
                            Uploaded Documents
                        </h5>
                        <div className="d-flex flex-column gap-2">
                            {proposal?.documentPaths && proposal.documentPaths.length > 0 ? (
                                proposal.documentPaths.map((path, idx) => {
                                    const originalNameStr =
                                        path.indexOf("_") !== -1
                                            ? path.substring(path.indexOf("_") + 1)
                                            : path;

                                    return (
                                        <div
                                            key={idx}
                                            className="d-flex justify-content-between align-items-center border rounded p-2"
                                        >
                                            <span className="text-truncate me-3">
                                                <i className="bi bi-file-earmark-text me-2"></i>
                                                {originalNameStr}
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
                                    );
                                })
                            ) : (
                                <span className="text-muted italic small">No documents uploaded.</span>
                            )}
                        </div>
                    </div>

                    {/* Officer Remark Card */}
                    {proposal?.officerRemark && (
                        <div className="bg-white border rounded-3 p-4 mb-4 shadow-sm">
                            <h5 className="text-uppercase fw-bold small mb-3 pb-2 border-bottom">
                                <i className="bi bi-chat-left-text me-2 text-primary"></i>Officer Remarks
                            </h5>
                            <div className="p-3 bg-warning bg-opacity-10 border border-warning rounded-3">
                                <p className="mb-0 small text-secondary">{proposal.officerRemark}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions & Quick Summary (Right Column) */}
                <div className="col-lg-4">
                    {/* Customer Actions Card */}
                    <div className="bg-white border rounded-3 p-4 shadow-sm mb-4 sticky-top" style={{ top: '80px' }}>
                        <h5 className="text-uppercase fw-bold small mb-3 pb-2 border-bottom">
                            <i className="bi bi-pencil-square me-2 text-primary"></i>Customer Actions
                        </h5>
                        <div className="d-grid gap-2">
                            {proposal.status === 'QUOTE_GENERATED' && quote && (
                                <div className="p-3 bg-primary bg-opacity-10 border border-primary rounded mb-3 text-start">
                                    <h6 className="text-uppercase fw-bold text-primary mb-2 small">
                                        <i className="bi bi-file-earmark-ruled-fill me-2"></i>Official Premium Quote
                                    </h6>
                                    <ul className="list-unstyled mb-3 small">
                                        <li className="d-flex justify-content-between py-1 border-bottom">
                                            <span className="text-muted">Quote Ref</span>
                                            <span className="fw-bold font-monospace">#{quote.quoteId}</span>
                                        </li>
                                        <li className="d-flex justify-content-between py-1">
                                            <span className="text-muted">Premium Price</span>
                                            <span className="fw-bold text-primary fs-5">₹{Number(quote.quotedPrice).toFixed(2)}</span>
                                        </li>
                                    </ul>
                                    <button
                                        onClick={handlePayment}
                                        className="btn btn-success text-uppercase fw-bold py-3 w-100"
                                    >
                                        <i className="bi bi-credit-card-fill me-2"></i>Make Payment
                                    </button>
                                </div>
                            )}
                            {proposal.status === 'ACTIVE' && (
                                <button
                                    onClick={() => navigate(`/customer/claim?policyId=${proposal.proposalId}`)}
                                    className="btn btn-danger text-uppercase fw-bold py-3"
                                >
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i> File a Loss Claim
                                </button>
                            )}
                            <button
                                onClick={() => navigate('/customer/claims')}
                                className="btn btn-outline-dark text-uppercase fw-bold py-3"
                            >
                                Track Loss Incidents
                            </button>
                            <button
                                onClick={() => navigate('/customer/proposals')}
                                className="btn btn-outline-secondary text-uppercase fw-bold py-3"
                            >
                                Back to Proposals
                            </button>
                        </div>
                    </div>

                    {/* Quick Summary Card */}
                    <div className="bg-white border rounded-3 p-4 shadow-sm mb-4 sticky-top" style={{ top: '400px' }}>
                        <h5 className="text-uppercase fw-bold mb-3 pb-2 border-bottom">
                            <i className="bi bi-info-circle me-2 text-primary"></i>Quick Summary
                        </h5>
                        <ul className="list-unstyled mb-0 small">
                            <li className="d-flex justify-content-between py-2 border-bottom">
                                <span className="text-muted">Proposal ID</span>
                                <span className="fw-bold font-monospace">#{proposal.proposalId}</span>
                            </li>
                            <li className="d-flex justify-content-between py-2 border-bottom">
                                <span className="text-muted">Policy</span>
                                <span className="fw-bold">{proposal.policyName}</span>
                            </li>
                            <li className="d-flex justify-content-between py-2 border-bottom">
                                <span className="text-muted">Vehicle</span>
                                <span className="fw-bold font-monospace">{proposal.vehicleNumber}</span>
                            </li>
                            <li className="d-flex justify-content-between py-2 border-bottom">
                                <span className="text-muted">Status</span>
                                <span className="fw-bold">{statusBadge(proposal.status)}</span>
                            </li>
                            <li className="d-flex justify-content-between py-2">
                                <span className="text-muted">Price</span>
                                <span className="fw-bold">₹{proposal.policyPrice != null ? Number(proposal.policyPrice).toFixed(2) : '—'}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
