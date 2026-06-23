import React, { useState } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';

export default function PremiumEstimator() {
    const { showToast } = useApp();

    const [formData, setFormData] = useState({
        category: '',
        manufactureYear: new Date().getFullYear(),
        currentIdv: '',
        fuelType: '',
        vehicleUsage: '',
        ownerCount: 1,
        accidentHistory: false,
        accidentCount: 0,
        noClaimBonusPercentage: 0
    });

    const [loading, setLoading] = useState(false);
    const [estimateResult, setEstimateResult] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setEstimateResult(null);

        if (!formData.category || !formData.fuelType || !formData.vehicleUsage) {
            showToast("Please fill all required fields", "warning");
            setLoading(false);
            return;
        }

        try {
            const payload = {
                ...formData,
                manufactureYear: parseInt(formData.manufactureYear, 10),
                currentIdv: parseFloat(formData.currentIdv),
                ownerCount: parseInt(formData.ownerCount, 10),
                accidentCount: parseInt(formData.accidentCount, 10) || 0,
                noClaimBonusPercentage: parseInt(formData.noClaimBonusPercentage, 10) || 0
            };

            const res = await axios.post('http://localhost:8080/api/estimate', payload);
            
            const estimateValue = typeof res.data === 'object' && res.data !== null 
                ? res.data.estimatedPremium || res.data.estimate || res.data.premium || JSON.stringify(res.data)
                : res.data;
            
            setEstimateResult(estimateValue);
            showToast("Premium estimate generated!", "success");
        } catch (error) {
            console.error("Error generating estimate:", error);
            showToast(error.response?.data?.message || "Failed to generate premium estimate.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="bg-white rounded-3 border p-4 mb-5 shadow-sm position-relative overflow-hidden">
            <div className="row g-4 align-items-center">
                <div className="col-lg-4 text-center text-lg-start">
                    <span className="text-uppercase text-primary fw-bold small tracking-wider">Quick Quote</span>
                    <h2 className="display-6 fw-black mb-3">Premium Estimator</h2>
                    <p className="text-secondary small mb-4">
                        Get an instant indicative premium for your vehicle. Fill in a few details to see how much you could save.
                    </p>
                    
                    {estimateResult !== null && (
                        <div className="bg-primary-subtle text-primary border border-primary p-3 rounded-3 mt-4 text-center shadow-sm">
                            <span className="small text-uppercase fw-bold d-block mb-1">Estimated Annual Premium</span>
                            <h3 className="fw-black m-0 display-6">
                                ₹{typeof estimateResult === 'number' || !isNaN(estimateResult) ? Number(estimateResult).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : estimateResult}
                            </h3>
                        </div>
                    )}
                </div>
                
                <div className="col-lg-8">
                    <form onSubmit={handleSubmit} className="row g-2 p-3 bg-light rounded-3 border">
                        <div className="col-md-4">
                            <label className="form-label mb-1" style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Category *</label>
                            <select className="form-select form-select-sm" name="category" value={formData.category} onChange={handleChange} required>
                                <option value="">Select...</option>
                                <option value="CAR">Car</option>
                                <option value="MOTORCYCLE">Motorcycle</option>
                                <option value="TRUCK">Truck</option>
                                <option value="BIKE">Bike</option>
                                <option value="CAMPER_VAN">Camper Van</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label mb-1" style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Fuel Type *</label>
                            <select className="form-select form-select-sm" name="fuelType" value={formData.fuelType} onChange={handleChange} required>
                                <option value="">Select...</option>
                                <option value="PETROL">Petrol</option>
                                <option value="DIESEL">Diesel</option>
                                <option value="CNG">CNG</option>
                                <option value="LPG">LPG</option>
                                <option value="ELECTRIC">Electric</option>
                                <option value="HYBRID">Hybrid</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label mb-1" style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Usage *</label>
                            <select className="form-select form-select-sm" name="vehicleUsage" value={formData.vehicleUsage} onChange={handleChange} required>
                                <option value="">Select...</option>
                                <option value="PRIVATE">Private</option>
                                <option value="COMMERCIAL">Commercial</option>
                            </select>
                        </div>

                        <div className="col-md-4">
                            <label className="form-label mb-1" style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Year *</label>
                            <input type="number" className="form-control form-control-sm" name="manufactureYear" min="1990" max={new Date().getFullYear()} value={formData.manufactureYear} onChange={handleChange} required />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label mb-1" style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Current IDV (₹) *</label>
                            <input type="number" className="form-control form-control-sm" name="currentIdv" placeholder="e.g. 500000" min="0" step="0.01" value={formData.currentIdv} onChange={handleChange} required />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label mb-1" style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Owners</label>
                            <input type="number" className="form-control form-control-sm" name="ownerCount" min="1" value={formData.ownerCount} onChange={handleChange} required />
                        </div>

                        <div className="col-md-4 d-flex align-items-center pt-3">
                            <div className="form-check form-switch mb-0">
                                <input className="form-check-input" type="checkbox" id="accidentHistorySwitch" name="accidentHistory" checked={formData.accidentHistory} onChange={handleChange} />
                                <label className="form-check-label mb-1" style={{ fontSize: '0.75rem', fontWeight: 'bold' }} htmlFor="accidentHistorySwitch">Accident History?</label>
                            </div>
                        </div>

                        {formData.accidentHistory ? (
                            <div className="col-md-4">
                                <label className="form-label mb-1" style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Accident Count</label>
                                <input type="number" className="form-control form-control-sm" name="accidentCount" min="0" value={formData.accidentCount} onChange={handleChange} />
                            </div>
                        ) : (
                            <div className="col-md-4"></div> // placeholder to keep grid aligned if needed
                        )}

                        <div className="col-md-4">
                            <label className="form-label mb-1" style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>NCB (%)</label>
                            <select className="form-select form-select-sm" name="noClaimBonusPercentage" value={formData.noClaimBonusPercentage} onChange={handleChange}>
                                <option value="0">0%</option>
                                <option value="20">20%</option>
                                <option value="25">25%</option>
                                <option value="35">35%</option>
                                <option value="45">45%</option>
                                <option value="50">50%</option>
                            </select>
                        </div>

                        <div className="col-12 mt-3 text-end">
                            <button type="submit" className="btn btn-primary btn-sm text-uppercase fw-bold px-4" disabled={loading}>
                                {loading ? (
                                    <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Calculating...</>
                                ) : (
                                    <>Calculate Premium <i className="bi bi-arrow-right ms-1"></i></>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
