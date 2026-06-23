import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useApp } from '../../context/AppContext';

export default function CustomerDashboard() {
    const navigate = useNavigate();
    const { currentUser, showToast, refreshNotifications } = useApp();
    const [proposals, setProposals] = useState([]);
    const [claims, setClaims] = useState([]);
    const [notificationsList, setNotificationsList] = useState([]);

    const config = {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
    };

    const loadData = async () => {
        if (!currentUser) return;
        try {
            // Fetch real customer proposals
            const proposalsRes = await axios.get('http://localhost:8080/api/policyproposal/customer/all', config);
            setProposals(proposalsRes.data || []);

            // Fetch real customer claims
            const claimsRes = await axios.get('http://localhost:8080/api/claim/getbycustomer', config);
            setClaims(claimsRes.data || []);

            // Fetch real notifications
            const notifRes = await axios.get('http://localhost:8080/api/notification/fetch', config);
            setNotificationsList(notifRes.data || []);
        } catch (err) {
            console.error("Error loading dashboard data:", err);
            showToast("Failed to fetch dashboard overview data.", "error");
        }
    };

    useEffect(() => {
        loadData();
    }, [currentUser]);

    const handleDismissNotification = async (notifId) => {
        try {
            await axios.delete(`http://localhost:8080/api/notification/delete/${notifId}`, config);
            showToast("Notification dismissed.", "success");
            loadData();
            refreshNotifications();
        } catch (err) {
            console.error(err);
            showToast("Failed to dismiss notification.", "error");
        }
    };

    const handleMarkAllRead = async () => {
        if (notificationsList.length === 0) return;
        try {
            const promises = notificationsList.map(n =>
                axios.delete(`http://localhost:8080/api/notification/delete/${n.id}`, config)
            );
            await Promise.all(promises);
            showToast("All notifications dismissed.", "success");
            loadData();
            refreshNotifications();
        } catch (err) {
            console.error(err);
            showToast("Failed to clear notifications.", "error");
        }
    };

    const getNotificationDetails = (type) => {
        switch (type) {
            case 'NEW_PROPOSAL_SUBMITTED':
                return { title: 'Proposal Submitted', message: 'Your policy proposal has been successfully submitted and is under review.', icon: 'info-circle-fill text-primary' };
            case 'PROPOSAL_APPROVED':
                return { title: 'Proposal Approved', message: 'Your policy proposal has been approved!', icon: 'check-circle-fill text-success' };
            case 'PROPOSAL_REJECTED':
                return { title: 'Proposal Rejected', message: 'Your policy proposal has been rejected.', icon: 'exclamation-circle-fill text-danger' };
            case 'ADDITIONAL_DETAILS_REQUIRED':
                return { title: 'Additional Details Needed', message: 'The underwriting officer requested additional details for your proposal.', icon: 'exclamation-triangle-fill text-warning' };
            case 'QUOTE_GENERATED':
                return { title: 'Quote Generated', message: 'A premium quote has been generated for your policy proposal.', icon: 'tag-fill text-warning' };
            case 'POLICY_ACTIVATED':
                return { title: 'Policy Activated', message: 'Your auto insurance policy is now fully active.', icon: 'shield-fill-check text-success' };
            case 'CLAIM_SUBMITTED':
                return { title: 'Claim Filed', message: 'Your loss claim has been filed successfully.', icon: 'info-circle-fill text-primary' };
            case 'CLAIM_APPROVED':
                return { title: 'Claim Approved', message: 'Your loss claim has been approved and processed.', icon: 'check-circle-fill text-success' };
            case 'CLAIM_REJECTED':
                return { title: 'Claim Rejected', message: 'Your loss claim has been rejected.', icon: 'exclamation-circle-fill text-danger' };
            case 'CLAIM_ADDITIONAL_DETAILS_REQUIRED':
                return { title: 'Claim Details Needed', message: 'Additional documents or details are required for your claim.', icon: 'exclamation-triangle-fill text-warning' };
            default:
                return { title: 'Alert Logged', message: type.replace(/_/g, ' '), icon: 'info-circle-fill text-primary' };
        }
    };

    const pendingProposalsCount = proposals.filter(p => p.status === 'PROPOSAL_SUBMITTED').length;
    const quotesCount = proposals.filter(p => p.status === 'QUOTE_GENERATED').length;
    const activePoliciesCount = proposals.filter(p => p.status === 'ACTIVE').length;
    const openClaimsCount = claims.filter(c => c.status !== 'APPROVED' && c.status !== 'REJECTED' && c.status !== 'SETTLED').length;

    // Filter recent active policies
    const recentPolicies = proposals.filter(p => p.status === 'ACTIVE').slice(0, 5);

    return (
        <div>
            <header className="mb-4">
                <h1 className="h3 text-uppercase mb-2">Customer Dashboard</h1>
                <p className="text-secondary small">Welcome back, {currentUser?.name}. Overview of your vehicle coverages and filings.</p>
            </header>

            {/* Bento Statistics Grid */}
            <div className="row g-4 mb-4">
                <div className="col-md-3">
                    <div className="bg-white border rounded-3 p-4 hover-lift shadow-sm">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="text-muted text-uppercase m-0" style={{ fontSize: '0.8rem' }}>Submitted Proposals</h6>
                            <i className="bi bi-file-earmark-arrow-up-fill text-secondary fs-4"></i>
                        </div>
                        <h2 className="fw-black text-dark m-0">{pendingProposalsCount}</h2>
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>Under review</span>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="bg-white border rounded-3 p-4 hover-lift shadow-sm">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="text-muted text-uppercase m-0" style={{ fontSize: '0.8rem' }}>Quotes Generated</h6>
                            <i className="bi bi-tag-fill text-warning fs-4"></i>
                        </div>
                        <h2 className="fw-black text-dark m-0">{quotesCount}</h2>
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>Awaiting payments</span>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="bg-white border rounded-3 p-4 hover-lift shadow-sm border-primary">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="text-primary text-uppercase m-0" style={{ fontSize: '0.8rem' }}>Active Policies</h6>
                            <i className="bi bi-shield-fill-check text-primary fs-4"></i>
                        </div>
                        <h2 className="fw-black text-primary m-0">{activePoliciesCount}</h2>
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>Currently in force</span>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="bg-white border rounded-3 p-4 hover-lift shadow-sm">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="text-muted text-uppercase m-0" style={{ fontSize: '0.8rem' }}>Pending Claims</h6>
                            <i className="bi bi-exclamation-octagon-fill text-danger fs-4"></i>
                        </div>
                        <h2 className="fw-black text-dark m-0">{openClaimsCount}</h2>
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>Under investigation</span>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                {/* Main panel: Quick Actions + Recent Policies */}
                <div className="col-lg-8">
                    {/* Quick Actions */}
                    <div className="bg-white border rounded-3 p-4 mb-4 shadow-sm">
                        <h5 className="text-uppercase fw-bold mb-3 small tracking-wider">Quick Actions</h5>
                        <div className="row g-3">
                            <div className="col-md-4">
                                <button onClick={() => navigate('/customer/apply')} className="btn btn-outline-dark w-100 py-3 text-uppercase fw-bold d-flex flex-column align-items-center gap-2">
                                    <i className="bi bi-plus-circle-fill fs-4 text-primary"></i>
                                    <span style={{ fontSize: '0.75rem' }}>Create Proposal</span>
                                </button>
                            </div>
                            <div className="col-md-4">
                                <button onClick={() => navigate('/customer/vehicles')} className="btn btn-outline-dark w-100 py-3 text-uppercase fw-bold d-flex flex-column align-items-center gap-2">
                                    <i className="bi bi-car-front-fill fs-4 text-primary"></i>
                                    <span style={{ fontSize: '0.75rem' }}>My Vehicles</span>
                                </button>
                            </div>
                            <div className="col-md-4">
                                <button onClick={() => navigate('/customer/claims')} className="btn btn-outline-dark w-100 py-3 text-uppercase fw-bold d-flex flex-column align-items-center gap-2">
                                    <i className="bi bi-file-earmark-medical-fill fs-4 text-primary"></i>
                                    <span style={{ fontSize: '0.75rem' }}>File a Claim</span>
                                </button>
                            </div>
                        </div>
                    </div>
                        {/* {
        "proposalId": 1,
        "policyName": "Policy 1",
        "vehicleNumber": "TN 23 A 1234",
        "vehicleModel": "Msd",
        "manufacturer": "Maruthi",
        "status": "ACTIVE",
        "submittedAt": "2026-06-20T15:39:45.032559Z"
    } */}

                    {/* Table Widget: Recent Policies */}
                    <div className="bg-white border rounded-3 shadow-sm overflow-hidden">
                        <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
                            <h5 className="text-uppercase fw-bold m-0 small tracking-wider">Recent Active Policies</h5>
                            <button onClick={() => navigate('/customer/policies')} className="btn btn-link btn-sm text-decoration-underline text-secondary p-0">View All</button>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light text-uppercase small">
                                    <tr>
                                        <th className="px-4 py-3">Proposal ID</th>
                                        <th className="px-4 py-3">Policy Name</th>
                                        <th className="px-4 py-3">Vehicle Model</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Submitted At</th>
                                        <th className="px-4 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="small">
                                    {recentPolicies.length === 0 ? (
                                        <tr><td colSpan="6" className="text-center text-muted italic p-4">No active insurance policies.</td></tr>
                                    ) : (
                                        recentPolicies.map(p => (
                                            <tr key={p.proposalId}>
                                                <td className="px-4 py-3 font-monospace fw-bold">#{p.proposalId}</td>
                                                <td className="px-4 py-3 text-secondary">{p.policyName}</td>
                                                <td className="px-4 py-3 fw-bold">{p.vehicleModel}</td>
                                                <td className="px-4 py-3 text-secondary">
                                                    <span className={`badge ${p.status === 'ACTIVE' ? 'bg-success' : p.status === 'PENDING' ? 'bg-warning' : 'bg-secondary'}`}>
                                                        {p.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-secondary">{p.submittedAt ? new Date(p.submittedAt).toLocaleDateString() : '—'}</td>
                                                <td className="px-4 py-3 text-end">
                                                    <button onClick={() => navigate(`/customer/policies/${p.proposalId}`)} className="btn btn-sm btn-outline-dark text-uppercase fw-bold">
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Sidebar Panel: Notifications */}
                <div className="col-lg-4" id="notifications">
                    <div className="bg-white border rounded-3 p-4 shadow-sm h-100 d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                            <h5 className="text-uppercase fw-bold m-0 small tracking-wider">Alerts & Notifications</h5>
                            {notificationsList.length > 0 && (
                                <button onClick={handleMarkAllRead} className="btn btn-link btn-sm p-0 small text-decoration-none text-uppercase fw-bold">
                                    Dismiss All
                                </button>
                            )}
                        </div>
                        
                        <div className="d-flex flex-column gap-3 overflow-auto flex-grow-1" style={{ maxHeight: '380px' }}>
                            {notificationsList.length === 0 ? (
                                <div className="text-center text-muted italic small py-5">
                                    <i className="bi bi-bell-slash display-6 d-block mb-2 text-black-50"></i>
                                    No alerts on file.
                                </div>
                            ) : (
                                notificationsList.map(n => {
                                    const details = getNotificationDetails(n.notificationType);
                                    return (
                                        <div className="p-3 border rounded-3 d-flex justify-content-between align-items-start bg-white shadow-sm" key={n.id}>
                                            <div className="d-flex gap-3 align-items-start">
                                                <i className={`bi bi-${details.icon} fs-5`}></i>
                                                <div>
                                                    <div className="fw-bold small">{details.title}</div>
                                                    <p className="text-secondary mb-1" style={{ fontSize: '0.75rem' }}>{details.message}</p>
                                                    <span className="text-muted" style={{ fontSize: '0.65rem' }}>{n.sendAt ? new Date(n.sendAt).toLocaleString() : '—'}</span>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => handleDismissNotification(n.id)} 
                                                className="btn-close ms-2" 
                                                style={{ fontSize: '0.65rem', flexShrink: 0 }}
                                                title="Dismiss notification"
                                            ></button>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
