import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useApp } from '../../context/AppContext';

export default function PolicyDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showToast } = useApp();
    const [policy, setPolicy] = useState();

    const getByIDApi = `http://localhost:8080/api/insurance/getbyid/${id}`;

    const handlegetPolicyByID = async () => {
        try {
            const res = await axios.get(getByIDApi);
            console.log(res.data);
            setPolicy(res.data);
        } catch (error) {
            console.log(error);
            showToast("Failed to load policy", "error");
        }
    };

    useEffect(() => {
        handlegetPolicyByID();
    }, [id]);

    if (!policy) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger shadow-sm border-0 rounded-3 d-flex align-items-center gap-3">
                    <i className="bi bi-exclamation-triangle-fill fs-4"></i>
                    <div>
                        <strong>Policy not found.</strong> It might have been removed or the ID is invalid. 
                        <button onClick={() => navigate('/admin/policies')} className="btn btn-link text-decoration-none fw-bold p-0 ms-2">Back to Policies</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-2" style={{ maxWidth: '850px' }}>
            <header className="mb-4 d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-3">
                    <button 
                        onClick={() => navigate('/admin/policies')} 
                        className="btn btn-outline-dark btn-sm rounded-circle d-flex align-items-center justify-content-center" 
                        style={{ width: '38px', height: '38px' }}
                        title="Back to List"
                    >
                        <i className="bi bi-arrow-left fs-5"></i>
                    </button>
                    <div>
                        <h1 className="h3 text-uppercase m-0">Policy Detail View</h1>
                        <p className="text-secondary small m-0">System Reference ID: <code className="text-dark fw-semibold">{policy.id}</code></p>
                    </div>
                </div>
                <button 
                    onClick={() => navigate(`/admin/policies/${policy.id}/edit`)} 
                    className="btn btn-dark text-uppercase fw-bold btn-sm px-3 py-2 d-flex align-items-center gap-2 shadow-sm"
                >
                    <i className="bi bi-pencil-square"></i>
                    <span>Edit Policy</span>
                </button>
            </header>

            <div className="bg-white border rounded-4 shadow-sm overflow-hidden mb-4">
                {/* Header Banner */}
                <div className="bg-light p-4 p-md-5 border-bottom d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4">
                    <div>
                        <span className="text-uppercase text-primary fw-bold tracking-wide small d-block mb-1">Insurance Template</span>
                        <h2 className="fw-black text-dark m-0 fs-3">{policy.policyName}</h2>
                    </div>
                    <div>
                        <span className={`badge px-3 py-2 rounded-pill fs-6 ${policy.active ? 'bg-success-subtle text-success border border-success' : 'bg-danger-subtle text-danger border border-danger'} text-uppercase`}>
                            <i className={`bi ${policy.active ? 'bi-check-circle-fill' : 'bi-x-circle-fill'} me-1`}></i>
                            {policy.active ? 'Active Package' : 'Inactive Package'}
                        </span>
                    </div>
                </div>

                <div className="p-4 p-md-5">
                    {/* Description Section */}
                    <div className="mb-5">
                        <h5 className="text-uppercase fw-bold text-muted small tracking-wide mb-3">Coverage & Details Description</h5>
                        <div className="p-4 bg-light rounded-3 border-start border-primary border-4 text-secondary leading-relaxed">
                            {policy.description || 'No description provided for this policy.'}
                        </div>
                    </div>

                    {/* Main Details Grid */}
                    <div className="mb-5">
                        <h5 className="text-uppercase fw-bold text-muted small tracking-wide mb-4">Core Specifications</h5>
                        <div className="row g-4">
                            {/* Base Rate */}
                            <div className="col-md-6">
                                <div className="card h-100 border rounded-3 p-3 hover-bg-light transition-all">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="bg-primary-subtle text-primary rounded-3 p-3 d-flex align-items-center justify-content-center" style={{ width: '54px', height: '54px' }}>
                                            <i className="bi bi-currency-rupee fs-3"></i>
                                        </div>
                                        <div>
                                            <span className="text-muted small text-uppercase fw-semibold d-block">Base Rate Cost</span>
                                            <h4 className="fw-black text-dark m-0 mt-1">₹{policy.baseRate ? policy.baseRate.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'}</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Validity */}
                            <div className="col-md-6">
                                <div className="card h-100 border rounded-3 p-3 hover-bg-light transition-all">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="bg-info-subtle text-info rounded-3 p-3 d-flex align-items-center justify-content-center" style={{ width: '54px', height: '54px' }}>
                                            <i className="bi bi-calendar-range-fill fs-3"></i>
                                        </div>
                                        <div>
                                            <span className="text-muted small text-uppercase fw-semibold d-block">Validity Duration</span>
                                            <h4 className="fw-black text-dark m-0 mt-1">{policy.validityMonths} Months</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Vehicle Category */}
                            <div className="col-md-4">
                                <div className="card h-100 border rounded-3 p-3 text-center hover-bg-light transition-all">
                                    <div className="text-secondary mb-2">
                                        <i className="bi bi-car-front-fill fs-2"></i>
                                    </div>
                                    <span className="text-muted small text-uppercase fw-semibold d-block">Vehicle Class</span>
                                    <h5 className="fw-bold text-dark m-0 mt-2">{policy.vehicleCategory || 'N/A'}</h5>
                                </div>
                            </div>

                            {/* Vehicle Usage */}
                            <div className="col-md-4">
                                <div className="card h-100 border rounded-3 p-3 text-center hover-bg-light transition-all">
                                    <div className="text-secondary mb-2">
                                        <i className="bi bi-briefcase-fill fs-2"></i>
                                    </div>
                                    <span className="text-muted small text-uppercase fw-semibold d-block">Intended Usage</span>
                                    <h5 className="fw-bold text-dark m-0 mt-2">{policy.vehicleUsage || 'N/A'}</h5>
                                </div>
                            </div>

                            {/* Fuel Type */}
                            <div className="col-md-4">
                                <div className="card h-100 border rounded-3 p-3 text-center hover-bg-light transition-all">
                                    <div className="text-secondary mb-2">
                                        <i className="bi bi-fuel-pump-fill fs-2"></i>
                                    </div>
                                    <span className="text-muted small text-uppercase fw-semibold d-block">Fuel Compatibility</span>
                                    <h5 className="fw-bold text-dark m-0 mt-2">{policy.fuelType || 'N/A'}</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
