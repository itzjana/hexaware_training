import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useApp } from '../../context/AppContext';

export default function PublicPolicies() {
    const navigate = useNavigate();
    const { showToast } = useApp();

    // Data states
    const [policies, setPolicies] = useState([]);
    const [addons, setAddons] = useState([]);
    const [loading, setLoading] = useState(true);

    // Suggestion Form states
    const [vehicleCategory, setVehicleCategory] = useState('');
    const [vehicleUsage, setVehicleUsage] = useState('');
    const [fuelType, setFuelType] = useState('');
    const [suggestions, setSuggestions] = useState(null); // null means not searched yet, array means results
    const [suggestLoading, setSuggestLoading] = useState(false);

    // Fetch initial data
    const loadData = async () => {
        setLoading(true);
        try {
            // Fetch policies (fully - page=0 and size=100)
            const policiesRes = await axios.get('http://localhost:8080/api/insurance/all/public?page=0&size=100');
            setPolicies(policiesRes.data?.list || []);

            // Fetch addons
            const addonsRes = await axios.get('http://localhost:8080/api/addon/all');
            setAddons(addonsRes.data || []);
        } catch (error) {
            console.error("Error loading public policies/addons:", error);
            showToast("Failed to load insurance data.", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Handle suggestion search
    const handleSuggest = async (e) => {
        e.preventDefault();
        if (!vehicleCategory || !vehicleUsage || !fuelType) {
            showToast("Please select all three criteria to get suggestions.", "warning");
            return;
        }

        setSuggestLoading(true);
        setSuggestions(null);

        const requestBody = {
            vehicleCategory,
            vehicleUsage,
            fuelType
        };

        try {
            const res = await axios.post('http://localhost:8080/api/insurance/suggest', requestBody);
            // Suggestion endpoint can return directly a list, handle fallback
            const dataList = Array.isArray(res.data) ? res.data : (res.data?.list || []);
            setSuggestions(dataList);
            if (dataList.length === 0) {
                showToast("No direct policy matching found. Try modifying filters.", "info");
            } else {
                showToast(`Found ${dataList.length} matching policy suggestions!`, "success");
            }
        } catch (error) {
            console.error("Error getting policy suggestions:", error);
            showToast("Failed to fetch suggestions.", "error");
            setSuggestions([]);
        } finally {
            setSuggestLoading(false);
        }
    };

    return (
        <div className="container py-4">
            <header className="mb-5 text-center">
                <span className="badge bg-light text-primary border text-uppercase px-3 py-2 mb-2 fw-bold">Protection Tiers</span>
                <h1 className="display-5 fw-black text-uppercase tracking-tight">Our Insurance Policies</h1>
                <p className="text-secondary lead max-w-lg mx-auto">
                    Explore available baseline packages and customizable additions to fit your vehicle's risk configuration.
                </p>
            </header>

            {/* Policy Finder / Suggestion Tool */}
            <div className="card border-primary-subtle bg-light-subtle rounded-4 p-4 p-md-5 mb-5 shadow-sm">
                <div className="row align-items-center g-4">
                    <div className="col-lg-5">
                        <span className="text-uppercase text-primary fw-bold tracking-wide small mb-1 d-block">Smart Matcher</span>
                        <h3 className="fw-black text-uppercase text-dark mb-3">Policy Suggestion Tool</h3>
                        <p className="text-secondary small mb-0">
                            Select your vehicle specifications below, and our system will match you with the optimal baseline package for your risk config.
                        </p>
                    </div>
                    <div className="col-lg-7">
                        <form onSubmit={handleSuggest} className="row g-3">
                            <div className="col-md-4">
                                <label className="form-label small fw-bold text-uppercase text-secondary">Vehicle Category</label>
                                <select 
                                    className="form-select"
                                    value={vehicleCategory}
                                    onChange={(e) => setVehicleCategory(e.target.value)}
                                    required
                                >
                                    <option value="">--Select--</option>
                                    <option value="CAR">Car</option>
                                    <option value="MOTORCYCLE">Motorcycle</option>
                                    <option value="TRUCK">Truck</option>
                                    <option value="BIKE">Bike</option>
                                    <option value="CAMPER_VAN">Camper Van</option>
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label small fw-bold text-uppercase text-secondary">Vehicle Usage</label>
                                <select 
                                    className="form-select"
                                    value={vehicleUsage}
                                    onChange={(e) => setVehicleUsage(e.target.value)}
                                    required
                                >
                                    <option value="">--Select--</option>
                                    <option value="PRIVATE">Private</option>
                                    <option value="COMMERCIAL">Commercial</option>
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label small fw-bold text-uppercase text-secondary">Fuel Type</label>
                                <select 
                                    className="form-select"
                                    value={fuelType}
                                    onChange={(e) => setFuelType(e.target.value)}
                                    required
                                >
                                    <option value="">--Select--</option>
                                    <option value="PETROL">Petrol</option>
                                    <option value="DIESEL">Diesel</option>
                                    <option value="CNG">CNG</option>
                                    <option value="LPG">LPG</option>
                                    <option value="ELECTRIC">Electric</option>
                                    <option value="HYBRID">Hybrid</option>
                                </select>
                            </div>
                            <div className="col-12 mt-4 text-end">
                                <button 
                                    type="submit" 
                                    className="btn btn-primary text-uppercase fw-bold px-4"
                                    disabled={suggestLoading}
                                >
                                    {suggestLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Matching...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-search me-2"></i>
                                            Get Suggestion
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Suggestions Result Drawer */}
                {suggestions !== null && (
                    <div className="mt-4 pt-4 border-top">
                        <h5 className="text-uppercase fw-bold text-dark mb-4">
                            <i className="bi bi-lightning-charge-fill text-warning me-2"></i>
                            Suggested Policies ({suggestions.length})
                        </h5>
                        {suggestions.length === 0 ? (
                            <div className="alert alert-secondary text-center small rounded-3 p-4">
                                <i className="bi bi-info-circle fs-4 mb-2 d-block text-muted"></i>
                                No matching packages found for the selected configurations.
                            </div>
                        ) : (
                            <div className="row g-4">
                                {suggestions.map((p) => (
                                    <div className="col-md-6 col-lg-4" key={p.id}>
                                        <div className="premium-card h-100 p-4 d-flex flex-column border-primary bg-white shadow-sm">
                                            <div className="d-flex justify-content-between align-items-start mb-3">
                                                <h4 className="text-uppercase text-primary m-0 fs-5">{p.policyName}</h4>
                                                <span className="badge bg-success-subtle text-success border border-success-subtle text-uppercase" style={{ fontSize: '0.65rem' }}>
                                                    Match
                                                </span>
                                            </div>
                                            <p className="small text-muted flex-grow-1 mb-3">{p.description}</p>
                                            <div className="mb-3">
                                                <span className="fs-4 fw-black">₹{p.baseRate ? p.baseRate.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'}</span>
                                                <span className="text-muted small"> / {p.validityMonths} months</span>
                                            </div>
                                            <div className="small text-secondary mb-3 pt-2 border-top">
                                                <div className="mb-1"><i className="bi bi-car-front-fill me-1"></i> Class: <strong>{p.vehicleCategory}</strong></div>
                                                <div className="mb-1"><i className="bi bi-fuel-pump-fill me-1"></i> Fuel: <strong>{p.fuelType}</strong></div>
                                                <div><i className="bi bi-briefcase-fill me-1"></i> Usage: <strong>{p.vehicleUsage}</strong></div>
                                            </div>
                                            <button onClick={() => {
                                                if (localStorage.getItem('token')) {
                                                    navigate(`/customer/apply?policyId=${p.id}&policyName=${encodeURIComponent(p.policyName)}`);
                                                } else {
                                                    navigate('/login');
                                                }
                                            }} className="btn btn-primary w-100 mt-auto text-uppercase fw-bold btn-sm">
                                                Apply For policy
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading policies...</span>
                    </div>
                </div>
            ) : (
                <>
                    {/* Policies Grid */}
                    <h3 className="text-uppercase fw-bold mb-4">Select a Base Package</h3>
                    <div className="row g-4 mb-5">
                        {policies.length === 0 ? (
                            <div className="col-12 text-center text-muted italic py-5">No baseline policies available at the moment.</div>
                        ) : (
                            policies.map((p) => (
                                <div className="col-lg-4 col-md-6" key={p.id}>
                                    <div className="premium-card h-100 p-4 d-flex flex-column">
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <h4 className="text-uppercase text-primary m-0 fs-5">{p.policyName}</h4>
                                            <span className="badge bg-light text-dark border text-uppercase" style={{ fontSize: '0.65rem' }}>
                                                {p.vehicleCategory}
                                            </span>
                                        </div>
                                        <p className="small text-muted flex-grow-1 mb-4">{p.description}</p>
                                        <div className="mb-4">
                                            <span className="display-6 fw-black">₹{p.baseRate ? p.baseRate.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'}</span>
                                            <span className="text-muted small"> / {p.validityMonths} months</span>
                                        </div>
                                        <div className="small text-secondary mb-4 pt-2 border-top">
                                            <div className="mb-1"><i className="bi bi-fuel-pump-fill me-1"></i> Fuel Type: <strong>{p.fuelType}</strong></div>
                                            <div><i className="bi bi-briefcase-fill me-1"></i> Vehicle Usage: <strong>{p.vehicleUsage}</strong></div>
                                        </div>
                                        <button onClick={() => {
                                            if (localStorage.getItem('token')) {
                                                navigate(`/customer/apply?policyId=${p.id}&policyName=${encodeURIComponent(p.policyName)}`);
                                            } else {
                                                navigate('/login');
                                            }
                                        }} className="btn btn-outline-dark w-100 mt-auto text-uppercase fw-bold">
                                            Select {p.policyName}
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Addons Grid */}
                    <h3 className="text-uppercase fw-bold mb-4">Optional Add-ons Available</h3>
                    <div className="row g-4">
                        {addons.length === 0 ? (
                            <div className="col-12 text-center text-muted italic py-4">No addon packages available.</div>
                        ) : (
                            addons.map((a) => (
                                <div className="col-md-4" key={a.id}>
                                    <div className="premium-card p-4 h-100 bg-white">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h5 className="text-uppercase m-0 fs-6">{a.name}</h5>
                                            <span className="badge bg-light text-primary border fw-bold">
                                                +₹{a.additionalCost ? a.additionalCost.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'} / yr
                                            </span>
                                        </div>
                                        <p className="small text-secondary mb-0">{a.description}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
