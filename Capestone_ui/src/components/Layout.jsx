import React, { useState } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Layout() {
    const { currentUser, logout, notifications } = useApp();
    const [sidebarShow, setSidebarShow] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const unreadCount = notifications.length;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getLinkClass = (path) => {
        const base = "d-flex align-items-center gap-3 px-4 py-3 text-decoration-none rounded-2 ";
        return location.pathname === path
            ? base + "bg-primary text-white font-weight-bold"
            : base + "text-secondary hover-bg-light";
    };

    // Render Side Menu based on user role
    const renderSidebarLinks = () => {
        if (!currentUser) return null;

        switch (currentUser.role) {
            case 'ADMIN':
                return (
                    <>
                        <Link className={getLinkClass('/admin/dashboard')} to="/admin/dashboard" onClick={() => setSidebarShow(false)}>
                            <i className="bi bi-grid-fill"></i>
                            <span>Admin Dashboard</span>
                        </Link>
                        <Link className={getLinkClass('/admin/policies')} to="/admin/policies" onClick={() => setSidebarShow(false)}>
                            <i className="bi bi-file-earmark-text-fill"></i>
                            <span>Policy Config (CRUD)</span>
                        </Link>
                        <Link className={getLinkClass('/admin/addons')} to="/admin/addons" onClick={() => setSidebarShow(false)}>
                            <i className="bi bi-plus-square-fill"></i>
                            <span>Addon Config (CRUD)</span>
                        </Link>
                        <Link className={getLinkClass('/admin/onboard')} to="/admin/onboard" onClick={() => setSidebarShow(false)}>
                            <i className="bi bi-person-plus-fill"></i>
                            <span>Onboard Officer</span>
                        </Link>
                        <Link className={getLinkClass('/admin/officers')} to="/admin/officers" onClick={() => setSidebarShow(false)}>
                            <i className="bi bi-shield-lock-fill"></i>
                            <span> Officers</span>
                        </Link>
                        <Link className={getLinkClass('/admin/reviews')} to="/admin/reviews" onClick={() => setSidebarShow(false)}>
                            <i className="bi bi-star-fill"></i>
                            <span>User Reviews</span>
                        </Link>

                        <Link className={getLinkClass('/admin/proposals')} to="/admin/proposals" onClick={() => setSidebarShow(false)}>
                            <i className="bi bi-file-earmark-ruled-fill"></i>
                            <span>All Proposals</span>
                        </Link>
                    </>
                );
            case 'INSURANCE_OFFICER':
                return (
                    <>
                        <Link className={getLinkClass('/officer/dashboard')} to="/officer/dashboard" onClick={() => setSidebarShow(false)}>
                            <i className="bi bi-grid-fill"></i>
                            <span>Officer Overview</span>
                        </Link>
                        <Link className={getLinkClass('/officer/proposals')} to="/officer/proposals" onClick={() => setSidebarShow(false)}>
                            <i className="bi bi-file-earmark-check-fill"></i>
                            <span>Initiated Proposals</span>
                        </Link>
                        <Link className={getLinkClass('/officer/officerproposal')} to="/officer/officerproposal" onClick={() => setSidebarShow(false)}>
                            <i className="bi bi-file-earmark-check-fill"></i>
                            <span>Officer Proposals</span>
                        </Link>
                        <Link className={getLinkClass('/officer/claims')} to="/officer/claims" onClick={() => setSidebarShow(false)}>
                            <i className="bi bi-file-earmark-medical-fill"></i>
                            <span>Initiated Claims</span>
                        </Link>
                        <Link className={getLinkClass('/officer/claims/byofficer')} to="/officer/claims/byofficer" onClick={() => setSidebarShow(false)}>
                            <i className="bi bi-file-earmark-medical-fill"></i>
                            <span>Officer Claims</span>
                        </Link>
                        <Link className={getLinkClass('/officer/profile')} to="/officer/profile" onClick={() => setSidebarShow(false)}>
                            <i className="bi bi-person-fill-gear"></i>
                            <span>My Profile</span>
                        </Link>
                    </>
                );
            case 'CUSTOMER':
            default:
                return (
                    <>
                        <Link className={getLinkClass('/customer/dashboard')} to="/customer/dashboard" onClick={() => setSidebarShow(false)}>
                            <i className="bi bi-grid-fill"></i>
                            <span>Customer Dashboard</span>
                        </Link>
                        <Link className={getLinkClass('/customer/vehicles')} to="/customer/vehicles" onClick={() => setSidebarShow(false)}>
                            <i className="bi bi-car-front-fill"></i>
                            <span>My Vehicles</span>
                        </Link>
                        <Link className={getLinkClass('/customer/policies')} to="/customer/policies" onClick={() => setSidebarShow(false)}>
                            <i className="bi bi-shield-fill"></i>
                            <span>My Policies</span>
                        </Link>
                        <Link className={getLinkClass('/customer/proposals')} to="/customer/proposals" onClick={() => setSidebarShow(false)}>
                            <i className="bi bi-file-earmark-check-fill"></i>
                            <span>My Proposals</span>
                        </Link>
                        <Link className={getLinkClass('/customer/apply')} to="/customer/apply" onClick={() => setSidebarShow(false)}>
                            <i className="bi bi-plus-circle-fill"></i>
                            <span>Apply for Policy</span>
                        </Link>
                        <Link className={getLinkClass('/customer/claims')} to="/customer/claims" onClick={() => setSidebarShow(false)}>
                            <i className="bi bi-file-earmark-medical-fill"></i>
                            <span>My Claims</span>
                        </Link>
                        <Link className={getLinkClass('/customer/profile')} to="/customer/profile" onClick={() => setSidebarShow(false)}>
                            <i className="bi bi-person-fill-gear"></i>
                            <span>My Profile</span>
                        </Link>
                    </>
                );
        }
    };

    return (
        <div className="d-flex flex-column min-h-screen">
            {/* Top Navigation */}
            <nav className="navbar navbar-expand-lg navbar-light bg-white border-b fixed-top shadow-sm px-3" style={{ height: '64px', zIndex: 1030 }}>
                <div className="container-fluid d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-2">
                        {currentUser && (
                            <button className="btn d-lg-none p-0 me-2" onClick={() => setSidebarShow(!sidebarShow)}>
                                <i className="bi bi-list fs-3"></i>
                            </button>
                        )}
                        <Link className="navbar-brand fs-4 fw-black text-primary text-uppercase tracking-wider m-0" to="/">
                            AutoGuard
                        </Link>
                    </div>

                    <div className="d-none d-lg-flex align-items-center gap-4">
                        <Link className="text-secondary text-decoration-none small fw-semibold hover-text-primary" to="/">Home</Link>
                        <Link className="text-secondary text-decoration-none small fw-semibold hover-text-primary" to="/policies">Policies</Link>
                        {currentUser ? (
                            <>
                                {currentUser.role === 'CUSTOMER' && <Link className="text-secondary text-decoration-none small fw-semibold hover-text-primary" to="/customer/dashboard">Dashboard</Link>}
                                {currentUser.role === 'INSURANCE_OFFICER' && <Link className="text-secondary text-decoration-none small fw-semibold hover-text-primary" to="/officer/dashboard">Dashboard</Link>}
                                {currentUser.role === 'ADMIN' && <Link className="text-secondary text-decoration-none small fw-semibold hover-text-primary" to="/admin/dashboard">Dashboard</Link>}
                                <button onClick={handleLogout} className="btn btn-link text-secondary text-decoration-none small fw-semibold hover-text-primary p-0">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link className="text-secondary text-decoration-none small fw-semibold hover-text-primary" to="/login">Login</Link>
                                <Link className="btn btn-dark btn-sm text-white px-3 font-weight-bold" to="/register">Register</Link>
                            </>
                        )}
                    </div>

                    <div className="d-flex align-items-center gap-3">
                        {currentUser && (
                            <div className="position-relative">
                                <Link className="text-secondary" to={currentUser.role === 'CUSTOMER' ? '/customer/dashboard#notifications' : currentUser.role === 'INSURANCE_OFFICER' ? '/officer/dashboard#notifications' : '/admin/dashboard'}>
                                    <i className="bi bi-bell fs-5"></i>
                                    {unreadCount > 0 && (
                                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                                            {unreadCount}
                                        </span>
                                    )}
                                </Link>
                            </div>
                        )}
                        {currentUser ? (
                            <div className="d-flex align-items-center gap-2">
                                <i className="bi bi-person-circle fs-5 text-secondary"></i>
                                <span className="small d-none d-md-inline-block fw-semibold text-primary">{currentUser.name} ({currentUser.role.replace('_', ' ')})</span>
                            </div>
                        ) : (
                            <Link to="/login" className="d-lg-none btn btn-dark btn-sm px-3">Login</Link>
                        )}
                    </div>
                </div>
            </nav>

            <div className="d-flex flex-row flex-grow-1" style={{ paddingTop: '64px' }}>
                {/* Responsive Sidebar for Logged-In Roles */}
                {currentUser && (
                    <aside className={`dashboard-sidebar bg-white border-end ${sidebarShow ? 'show' : ''}`} style={{ transition: 'transform 0.3s ease' }}>
                        <div className="p-4 d-flex flex-column h-100">
                            <div className="d-flex align-items-center gap-3 mb-4 p-2 bg-light rounded-3">
                                <i className="bi bi-shield-lock-fill fs-3 text-primary"></i>
                                <div>
                                    <div className="small fw-bold text-truncate" style={{ maxWidth: '140px' }}>{currentUser.name}</div>
                                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>{currentUser.role.replace('_', ' ')}</div>
                                </div>
                            </div>
                            
                            <nav className="nav flex-column gap-1 flex-grow-1">
                                {renderSidebarLinks()}
                            </nav>

                            <div className="mt-auto pt-3 border-top">
                                <button onClick={handleLogout} className="btn btn-outline-danger w-full d-flex align-items-center justify-content-center gap-2">
                                    <i className="bi bi-box-arrow-right"></i>
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    </aside>
                )}

                {/* Main Content Area */}
                <main className={currentUser ? 'dashboard-content w-100' : 'container py-5 w-100 flex-grow-1'}>
                    <Outlet />
                </main>
            </div>

            {/* Sticky Mobile Navigation for Customers */}
            {currentUser && currentUser.role === 'CUSTOMER' && (
                <div className="d-lg-none bg-white border-top fixed-bottom py-2 d-flex justify-content-around align-items-center shadow-lg" style={{ zIndex: 1020, height: '60px' }}>
                    <Link to="/customer/dashboard" className={`text-decoration-none d-flex flex-column align-items-center ${location.pathname === '/customer/dashboard' ? 'text-primary' : 'text-secondary'}`}>
                        <i className="bi bi-grid fs-5"></i>
                        <span style={{ fontSize: '0.65rem', fontWeight: '600' }}>HOME</span>
                    </Link>
                    <Link to="/customer/vehicles" className={`text-decoration-none d-flex flex-column align-items-center ${location.pathname === '/customer/vehicles' ? 'text-primary' : 'text-secondary'}`}>
                        <i className="bi bi-car-front fs-5"></i>
                        <span style={{ fontSize: '0.65rem', fontWeight: '600' }}>VEHICLES</span>
                    </Link>
                    <Link to="/customer/apply" className={`text-decoration-none d-flex flex-column align-items-center ${location.pathname === '/customer/apply' ? 'text-primary' : 'text-secondary'}`}>
                        <i className="bi-plus-circle fs-5"></i>
                        <span style={{ fontSize: '0.65rem', fontWeight: '600' }}>APPLY</span>
                    </Link>
                    <Link to="/customer/policies" className={`text-decoration-none d-flex flex-column align-items-center ${location.pathname === '/customer/policies' ? 'text-primary' : 'text-secondary'}`}>
                        <i className="bi bi-shield fs-5"></i>
                        <span style={{ fontSize: '0.65rem', fontWeight: '600' }}>POLICIES</span>
                    </Link>
                </div>
            )}
        </div>
    );
}
