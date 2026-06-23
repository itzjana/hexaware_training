import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useApp } from '../../context/AppContext';

export default function Claim() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { showToast } = useApp();
    const [policies, setPolicies] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [policyId, setPolicyId] = useState('');
    const [description, setDescription] = useState('');
    const [odometer, setOdometer] = useState('');
    const [estimatedAmount, setEstimatedAmount] = useState('');
    const [files, setFiles] = useState([]);

    const preselectedPolicyId = searchParams.get('policyId');

    const config = {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
    };

    useEffect(() => {
        const fetchPolicies = async () => {
            try {
                const res = await axios.get('http://localhost:8080/api/policyproposal/customer/all', config);
                const activeList = (res.data || []).filter(p => p.status === 'ACTIVE');
                setPolicies(activeList);
                if (activeList.length > 0) {
                    setPolicyId(preselectedPolicyId || activeList[0].proposalId);
                }
            } catch (err) {
                console.error(err);
                showToast('Failed to fetch active policies.', 'error');
            }
        };
        fetchPolicies();
    }, [preselectedPolicyId]);

    const handleFileChange = (e) => {
        setFiles(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!odometer) {
            showToast('Please provide current odometer reading.', 'warning');
            return;
        }

        if (!estimatedAmount) {
            showToast('Please provide an estimated cover amount.', 'warning');
            return;
        }

        if (!files || files.length === 0) {
            showToast('At least one supporting document file is required.', 'warning');
            return;
        }

        setSubmitting(true);

        try {
            const claimDto = {
                policyId: parseInt(policyId),
                incidentDescription: description.trim(),
                currentOdometerKm: parseInt(odometer),
                estimatedAmount: parseFloat(estimatedAmount),
            };

            const formData = new FormData();

            // Append files under "files" key — matches @RequestPart("files")
            for (let i = 0; i < files.length; i++) {
                formData.append('files', files[i]);
            }

            // Append claim JSON as Blob — matches @RequestPart("claim")
            formData.append(
                'claim',
                new Blob([JSON.stringify(claimDto)], { type: 'application/json' })
            );

            await axios.post('http://localhost:8080/api/claim/add', formData, config);
            showToast('Loss claim filed successfully!', 'success');
            navigate('/customer/claims');
        } catch (err) {
            console.error(err);
            showToast(err.response?.data?.message || 'Failed to submit loss claim.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    if (policies.length === 0) {
        return (
            <div className="bg-white border rounded-3 p-5 text-center shadow-sm max-w-md mx-auto my-5">
                <i className="bi bi-file-earmark-lock display-1 text-muted opacity-40 d-block mb-3"></i>
                <h4 className="text-uppercase fw-black">No Active Policy</h4>
                <p className="text-secondary small mb-4">
                    You do not have any active insurance policies to file a claim. Please submit a policy proposal first.
                </p>
                <button onClick={() => navigate('/customer/apply')} className="btn btn-primary text-uppercase fw-bold px-4 py-2">
                    Apply for Policy
                </button>
            </div>
        );
    }

    return (
        <div className="row justify-content-center">
            <div className="col-lg-8">
                <div className="premium-card p-5 bg-white border shadow-sm">
                    <header className="mb-4">
                        <h2 className="h4 text-uppercase m-0">File a Loss / Accident Claim</h2>
                        <div className="bg-primary mt-2" style={{ height: '3px', width: '40px' }}></div>
                    </header>

                    <form onSubmit={handleSubmit} className="row g-3">
                        {/* Policy selection */}
                        <div className="col-12">
                            <label className="form-label small fw-bold text-uppercase">1. Select Policy Coverage</label>
                            <select
                                className="form-select"
                                value={policyId}
                                onChange={(e) => setPolicyId(e.target.value)}
                                required
                            >
                                {policies.map(p => (
                                    <option key={p.proposalId} value={p.proposalId}>
                                        {p.policyName} (ID: {p.proposalId})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Description */}
                        <div className="col-12">
                            <label className="form-label small fw-bold text-uppercase">2. Incident Description &amp; Loss Details</label>
                            <textarea
                                className="form-control"
                                rows="4"
                                placeholder="Describe what happened (location, date/time, damage details)..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            ></textarea>
                        </div>

                        {/* Odometer */}
                        <div className="col-12">
                            <label className="form-label small fw-bold text-uppercase">3. Current Odometer KM</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Enter vehicle current odometer reading..."
                                value={odometer}
                                onChange={(e) => setOdometer(e.target.value)}
                                required
                            />
                        </div>

                        {/* Estimated Cover Amount */}
                        <div className="col-12">
                            <label className="form-label small fw-bold text-uppercase">4. Estimated Cover Amount (₹)</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Enter estimated amount to be covered..."
                                value={estimatedAmount}
                                onChange={(e) => setEstimatedAmount(e.target.value)}
                                required
                            />
                        </div>

                        {/* Document upload */}
                        <div className="col-12">
                            <label className="form-label small fw-bold text-uppercase">5. Upload Supporting Documents</label>
                            <input
                                type="file"
                                className="form-control"
                                multiple
                                onChange={handleFileChange}
                                required
                            />
                            <div className="form-text text-muted">
                                Upload accident site photos, FIR, Licence, or Aadhaar. You can select multiple files.
                            </div>
                        </div>

                        <div className="col-12 pt-3">
                            <button type="submit" className="btn btn-danger text-uppercase fw-bold py-3 w-100" disabled={submitting}>
                                {submitting ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Submitting Claim...
                                    </>
                                ) : (
                                    <>Submit Loss Claim</>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
