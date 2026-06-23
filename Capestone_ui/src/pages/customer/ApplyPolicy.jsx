import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useApp } from '../../context/AppContext';

export default function ApplyPolicy() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { showToast } = useApp();
    
    const [vehicles, setVehicles] = useState([]);
    const [addons, setAddons] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Selection state
    const [selectedVehicleId, setSelectedVehicleId] = useState('');
    const [chosenAddonIds, setChosenAddonIds] = useState([]);
    const [files, setFiles] = useState([]);

    // Review Modal States
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [rating, setRating] = useState(5);
    const [reviewContent, setReviewContent] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);

    const policyId = searchParams.get('policyId');
    const policyName = searchParams.get('policyName');

    const config = {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        }
    };

    useEffect(() => {
        if (!policyId) {
            showToast("No policy selected. Please select a policy first.", "warning");
            navigate('/policies');
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch vehicles
                const vRes = await axios.get('http://localhost:8080/api/vehicles/getbycustomer', config);
                setVehicles(vRes.data || []);
                if (vRes.data && vRes.data.length > 0) {
                    setSelectedVehicleId(vRes.data[0].id);
                }

                // Fetch addons
                const aRes = await axios.get('http://localhost:8080/api/addon/all');
                setAddons(aRes.data || []);
            } catch (err) {
                console.error("Error fetching data:", err);
                showToast("Failed to load necessary data.", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [policyId]);

    const handleAddonToggle = (addonId) => {
        if (chosenAddonIds.includes(addonId)) {
            setChosenAddonIds(chosenAddonIds.filter(id => id !== addonId));
        } else {
            setChosenAddonIds([...chosenAddonIds, addonId]);
        }
    };

    const handleFileChange = (e) => {
        setFiles(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedVehicleId) {
            showToast("Please register and select a vehicle first.", "warning");
            return;
        }

        if (!files || files.length === 0) {
            showToast("Please upload the required documents.", "warning");
            return;
        }

        const proposalDto = {
            vehicleId: parseInt(selectedVehicleId),
            policyId: parseInt(policyId),
            addOnIds: chosenAddonIds
        };

        const formData = new FormData();
        
        // Append all selected files
        for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i]);
        }
        
        formData.append(
            "proposal",
            new Blob([JSON.stringify(proposalDto)], { type: "application/json" })
        );

        try {
            await axios.post('http://localhost:8080/api/policyproposal/create', formData, config);
            showToast("Insurance policy proposal submitted successfully!", "success");
            setShowReviewModal(true);
        } catch (err) {
            console.error("Submit error:", err);
            showToast(err.response?.data?.message || "Failed to submit proposal.", "error");
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!reviewContent.trim()) {
            showToast("Please enter some feedback.", "warning");
            return;
        }
        setSubmittingReview(true);
        try {
            await axios.post('http://localhost:8080/api/review/add', {
                reviewContent: reviewContent,
                rating: rating
            }, config);
            showToast("Thank you for your feedback!", "success");
            setShowReviewModal(false);
            navigate('/customer/proposals');
        } catch (err) {
            console.error(err);
            showToast("Failed to submit review.", "error");
        } finally {
            setSubmittingReview(false);
        }
    };

    const handleReviewCancel = () => {
        setShowReviewModal(false);
        navigate('/customer/proposals');
    };

    if (loading) {
        return (
            <div className="text-center py-5 my-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (vehicles.length === 0) {
        return (
            <div className="bg-white border rounded-3 p-5 text-center shadow-sm max-w-md mx-auto my-5">
                <i className="bi bi-car-front display-1 text-muted opacity-40 d-block mb-3"></i>
                <h4 className="text-uppercase fw-black">No Vehicle Registered</h4>
                <p className="text-secondary small mb-4">
                    You must register a vehicle in your profile dashboard before applying for an insurance policy proposal.
                </p>
                <button onClick={() => navigate('/customer/vehicles')} className="btn btn-primary text-uppercase fw-bold px-4 py-2">
                    Register Vehicle Now
                </button>
            </div>
        );
    }

    return (
        <div className="row justify-content-center">
            <div className="col-lg-8">
                <div className="premium-card p-5 bg-white border shadow-sm">
                    <header className="mb-4">
                        <h2 className="h4 text-uppercase m-0">Apply for Insurance Policy</h2>
                        <div className="bg-primary mt-2" style={{ height: '3px', width: '40px' }}></div>
                    </header>

                    <form onSubmit={handleSubmit} className="row g-4">
                        
                        {/* Policy Display */}
                        <div className="col-12">
                            <label className="form-label small fw-bold text-uppercase">1. Selected Policy Package</label>
                            <div className="p-3 bg-light border rounded">
                                <h5 className="m-0 text-primary fw-bold">{policyName || `Policy ID: ${policyId}`}</h5>
                            </div>
                        </div>

                        {/* Vehicle Selection */}
                        <div className="col-12">
                            <label className="form-label small fw-bold text-uppercase">2. Select Registered Asset (Vehicle)</label>
                            <select
                                className="form-select form-select-lg"
                                value={selectedVehicleId}
                                onChange={(e) => setSelectedVehicleId(e.target.value)}
                                required
                            >
                                {vehicles.map(v => (
                                    <option key={v.id} value={v.id}>
                                        {v.category} (Reg: {v.registrationNumber}) - {v.manufacturer} {v.model}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Addon Selection */}
                        <div className="col-12">
                            <label className="form-label small fw-bold text-uppercase mb-3">3. Customize Optional Add-ons</label>
                            <div className="row g-3">
                                {addons.length === 0 ? (
                                    <div className="col-12 text-muted small italic">No addons available.</div>
                                ) : (
                                    addons.map(a => (
                                        <div className="col-md-6" key={a.id}>
                                            <div className={`p-3 border rounded d-flex align-items-start gap-3 cursor-pointer transition-all ${chosenAddonIds.includes(a.id) ? 'border-primary bg-primary-subtle shadow-sm' : 'bg-white'}`}
                                                 onClick={() => handleAddonToggle(a.id)}>
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input mt-1"
                                                    checked={chosenAddonIds.includes(a.id)}
                                                    onChange={() => {}} // handled by parent div click
                                                />
                                                <div>
                                                    <div className="small fw-bold text-dark">{a.name}</div>
                                                    <p className="text-secondary mb-0" style={{ fontSize: '0.75rem' }}>{a.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Documents Upload */}
                        <div className="col-12">
                            <label className="form-label small fw-bold text-uppercase">4. Upload Required Documents</label>
                            <input 
                                type="file" 
                                className="form-control form-control-lg" 
                                multiple 
                                onChange={handleFileChange}
                                required 
                            />
                            <div className="form-text text-muted">
                                Please upload all relevant documents (e.g. ID proof, previous policy, inspection photos). You can select multiple files.
                            </div>
                        </div>

                        <div className="col-12 pt-3">
                            <button type="submit" className="btn btn-primary text-uppercase fw-bold py-3 w-100">
                                Submit Insurance Proposal
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            {showReviewModal && (
                <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content border-0 shadow-lg rounded-3">
                            <div className="modal-header border-bottom-0 pt-4 px-4">
                                <h5 className="modal-title text-uppercase fw-black text-dark">Share Your Experience</h5>
                                <button type="button" className="btn-close" onClick={handleReviewCancel} aria-label="Close"></button>
                            </div>
                            <form onSubmit={handleReviewSubmit}>
                                <div className="modal-body px-4 pb-4">
                                    <p className="text-secondary small mb-4">
                                        Your policy proposal has been submitted! Please take a moment to rate our onboarding process.
                                    </p>
                                    
                                    <div className="mb-4 text-center">
                                        <label className="form-label d-block small fw-bold text-uppercase text-muted mb-2">Rating</label>
                                        <div className="d-flex justify-content-center gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <i 
                                                    key={star} 
                                                    className={`bi bi-star${star <= rating ? '-fill text-warning' : ''} fs-3 cursor-pointer`}
                                                    onClick={() => setRating(star)}
                                                    style={{ transition: 'transform 0.1s ease' }}
                                                ></i>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-uppercase text-muted">Feedback / Remarks</label>
                                        <textarea 
                                            className="form-control" 
                                            rows="4" 
                                            placeholder="Write your review here..." 
                                            value={reviewContent}
                                            onChange={(e) => setReviewContent(e.target.value)}
                                            required
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer border-top-0 px-4 pb-4 pt-0 gap-2">
                                    <button type="button" className="btn btn-outline-secondary text-uppercase fw-bold flex-grow-1" onClick={handleReviewCancel}>
                                        Skip
                                    </button>
                                    <button type="submit" className="btn btn-primary text-uppercase fw-bold flex-grow-1" disabled={submittingReview}>
                                        {submittingReview ? (
                                            <><span className="spinner-border spinner-border-sm me-2"></span>Submitting...</>
                                        ) : (
                                            'Submit Review'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
