import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PremiumEstimator from '../../components/PremiumEstimator';

export default function Home() {
    const navigate = useNavigate();
    
    const [policies, setPolicies] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const polRes = await axios.get('http://localhost:8080/api/insurance/all/public?page=0&size=3');
                setPolicies(polRes.data?.list || []);
                
                const revRes = await axios.get('http://localhost:8080/api/review/all');
                setReviews(revRes.data || []);
            } catch (error) {
                console.error("Error fetching homepage data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="container py-4">
            {/* Hero Section */}
            <section className="row align-items-center justify-content-between py-5 mb-5 g-5">
                <div className="col-lg-6">
                    <span className="badge bg-light text-primary text-uppercase px-3 py-2 mb-3 fw-bold border">AutoGuard Portal</span>
                    <h1 className="display-4 fw-black text-dark mb-4 text-uppercase tracking-tight" style={{ fontSize: '3rem', lineHeight: '1.1' }}>
                        Radical Transparency in Vehicle Coverage.
                    </h1>
                    <p className="lead text-secondary mb-4">
                        AutoGuard is a neutral, data-driven insurance infrastructure. We remove the complex branding of traditional insurers to provide functional, high-fidelity coverage that prioritizes claims processing speed over visual marketing.
                    </p>
                    <div className="d-flex flex-wrap gap-3">
                        <button onClick={() => navigate('/login')} className="btn btn-primary btn-lg px-4 py-3 text-uppercase fw-bold rounded-2">
                            Get Started
                        </button>
                        <button onClick={() => navigate('/policies')} className="btn btn-outline-dark btn-lg px-4 py-3 text-uppercase fw-bold rounded-2">
                            View All Policies
                        </button>
                    </div>
                </div>
                <div className="col-lg-5">
                    <div className="premium-card p-4 text-center border-2 shadow-sm rounded-3">
                        <div className="wireframe-placeholder rounded-3 mb-4" style={{ height: '200px', display: 'flex', alignItems: 'center', justify: 'center' }}>
                            <i className="bi bi-car-front-fill fs-1 text-secondary opacity-70"></i>
                        </div>
                        <span className="badge bg-dark text-uppercase px-3 py-2">Asset Protection Network</span>
                    </div>
                </div>
            </section>

            {/* Statistics Counters */}
            <section className="bg-white rounded-3 border p-4 mb-5 shadow-sm">
                <div className="row text-center g-4">
                    <div className="col-6 col-md-3">
                        <h2 className="display-6 fw-black text-primary mb-1">128K+</h2>
                        <span className="text-uppercase text-muted small fw-bold tracking-wider">Active Policies</span>
                    </div>
                    <div className="col-6 col-md-3">
                        <h2 className="display-6 fw-black text-primary mb-1">94.2%</h2>
                        <span className="text-uppercase text-muted small fw-bold tracking-wider">Claims Approval</span>
                    </div>
                    <div className="col-6 col-md-3">
                        <h2 className="display-6 fw-black text-primary mb-1">12M+</h2>
                        <span className="text-uppercase text-muted small fw-bold tracking-wider">Payouts Served</span>
                    </div>
                    <div className="col-6 col-md-3">
                        <h2 className="display-6 fw-black text-primary mb-1">&lt; 4hr</h2>
                        <span className="text-uppercase text-muted small fw-bold tracking-wider">Response Time</span>
                    </div>
                </div>
            </section>

            {/* Premium Estimator Section */}
            <PremiumEstimator />

            {/* Policy Tiers Section */}
            <section className="mb-5">
                <div className="d-flex justify-content-between align-items-end mb-4">
                    <div>
                        <span className="text-uppercase text-muted small fw-bold">Available Options</span>
                        <h2 className="text-uppercase fw-black mt-1">Policy Packages</h2>
                    </div>
                    <button onClick={() => navigate('/policies')} className="btn btn-sm btn-outline-primary text-uppercase fw-bold">
                        Browse Full Tiers
                    </button>
                </div>
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading policies...</span>
                        </div>
                    </div>
                ) : (
                    <div className="row g-4">
                        {policies.length === 0 ? (
                            <div className="col-12 text-center text-muted italic py-5">No policies available at the moment.</div>
                        ) : (
                            policies.map((p, index) => (
                                <div className="col-md-4" key={p.id}>
                                    <div className={`premium-card h-100 p-4 d-flex flex-column ${index === 1 ? 'border-primary shadow' : ''}`} style={index === 1 ? { transform: 'scale(1.02)' } : {}}>
                                        <div className="d-flex justify-content-between align-items-start mb-4">
                                            <i className={`bi bi-shield-${index === 1 ? 'check' : 'fill'} fs-1 text-primary`}></i>
                                            <span className={`badge ${index === 1 ? 'bg-primary text-white' : 'bg-light text-dark border'} px-2 py-1 text-uppercase`}>
                                                Tier 0{index + 1}
                                            </span>
                                        </div>
                                        <h4 className="text-uppercase mb-3">{p.policyName}</h4>
                                        <p className="text-muted mb-4 small flex-grow-1">
                                            {p.description}
                                        </p>
                                        <div className="mb-3">
                                            <span className="fs-4 fw-black">₹{p.baseRate ? p.baseRate.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'}</span>
                                            <span className="text-muted small"> / {p.validityMonths} months</span>
                                        </div>
                                        <hr className="my-3 text-muted opacity-25" />
                                        <ul className="list-unstyled mb-4 small text-secondary">
                                            <li className="mb-2"><i className="bi bi-car-front-fill text-primary me-2"></i><strong>{p.vehicleCategory}</strong> Category</li>
                                            <li className="mb-2"><i className="bi bi-fuel-pump-fill text-primary me-2"></i><strong>{p.fuelType}</strong> Engine</li>
                                            <li className="mb-2"><i className="bi bi-briefcase-fill text-primary me-2"></i><strong>{p.vehicleUsage}</strong> Usage</li>
                                        </ul>
                                        <button onClick={() => {
                                            if (localStorage.getItem('token')) {
                                                navigate(`/customer/apply?policyId=${p.id}&policyName=${encodeURIComponent(p.policyName)}`);
                                            } else {
                                                navigate('/login');
                                            }
                                        }} className={`btn ${index === 1 ? 'btn-primary' : 'btn-outline-primary'} w-100 py-2 text-uppercase fw-bold mt-auto`}>
                                            Select Plan
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </section>

            {/* Customer Reviews Section */}
            <section className="bg-white rounded-3 border p-5 mb-4 shadow-sm">
                <div className="text-center mb-5">
                    <span className="text-uppercase text-muted small fw-bold">Testimonials</span>
                    <h2 className="text-uppercase fw-black mt-1">User Feedback</h2>
                    <div className="bg-primary mx-auto mt-2" style={{ height: '3px', width: '50px' }}></div>
                </div>
                <div className="row g-4">
                    {reviews.slice(0, 3).map((r, i) => (
                        <div className="col-md-4" key={i}>
                            <div className="p-3 border rounded-3 h-100 bg-light">
                                <div className="d-flex text-warning gap-1 mb-2">
                                    {[...Array(5)].map((_, idx) => (
                                        <i key={idx} className={`bi bi-star${idx < r.rating ? '-fill' : ''}`}></i>
                                    ))}
                                </div>
                                <p className="small text-secondary mb-3 italic">"{r.reviewContent}"</p>
                                <div className="fw-bold small text-uppercase">— {r.name}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
