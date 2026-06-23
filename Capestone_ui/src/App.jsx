import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getEnums } from './store/action/enumsAction';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// ── Common Pages ───────────────────────────────────────────────────────────────
import Home          from './pages/common/Home';
import Login         from './pages/common/Login';
import Register      from './pages/common/Register';
import PublicPolicies from './pages/common/PublicPolicies';

// ── Admin Pages ────────────────────────────────────────────────────────────────
import AdminDashboard    from './pages/admin/AdminDashboard';
import PolicyManagement  from './pages/admin/PolicyManagement';
import PolicyForm        from './pages/admin/PolicyForm';
import AdminPolicyDetails from './pages/admin/PolicyDetails';
import AddonManagement   from './pages/admin/AddonManagement';
import AddonForm         from './pages/admin/AddonForm';
import OnboardOfficer    from './pages/admin/OnboardOfficer';
import OfficerManagement from './pages/admin/OfficerManagement';
import UserReviews       from './pages/admin/UserReviews';
import AdminProposalList from './pages/admin/ProposalList';
import AdminProposalView from './pages/admin/ProposalView';

// ── Customer Pages ─────────────────────────────────────────────────────────────
import CustomerDashboard    from './pages/customer/CustomerDashboard';
import MyVehicles           from './pages/customer/MyVehicles';
import MyPolicies           from './pages/customer/MyPolicies';
import CustomerPolicyDetails from './pages/customer/PolicyDetails';
import MyProposals          from './pages/customer/MyProposals';
import ApplyPolicy          from './pages/customer/ApplyPolicy';
import Claim                from './pages/customer/ClaimForm';
import ClaimTracking        from './pages/customer/ClaimTracking';
import ClaimDetails         from './pages/customer/ClaimDetails';
import MyProfile            from './pages/customer/MyProfile';

// ── Officer Pages ──────────────────────────────────────────────────────────────
import OfficerDashboard  from './pages/officer/OfficerDashboard';
import ProposalList      from './pages/officer/ProposalList';
import ProposalReview    from './pages/officer/ProposalReview';
import OfficerProposals  from './pages/officer/OfficerProposals';
import ClaimList         from './pages/officer/ClaimList';
import ClaimReview       from './pages/officer/ClaimReview';
import OfficerClaims     from './pages/officer/OfficerClaim';
import OfficerProfile     from './pages/officer/MyProfile';

function App() {
    const dispatch = useDispatch();
    useEffect(() => {
        if (localStorage.getItem('token')) {
            dispatch(getEnums());
        }
    }, []);

    return (
        <AppProvider>
            <Routes>
                <Route element={<Layout />}>

                    {/* ── Public Routes ────────────────────────────────────── */}
                    <Route path="/"          element={<Home />} />
                    <Route path="/login"     element={<Login />} />
                    <Route path="/register"  element={<Register />} />
                    <Route path="/policies"  element={<PublicPolicies />} />

                    {/* ── Admin Routes (role: ADMIN) ────────────────────────── */}
                    <Route path="/admin/dashboard"         element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
                    <Route path="/admin/policies"          element={<ProtectedRoute allowedRoles={['ADMIN']}><PolicyManagement /></ProtectedRoute>} />
                    <Route path="/admin/policies/new"      element={<ProtectedRoute allowedRoles={['ADMIN']}><PolicyForm /></ProtectedRoute>} />
                    <Route path="/admin/policies/:id/edit" element={<ProtectedRoute allowedRoles={['ADMIN']}><PolicyForm /></ProtectedRoute>} />
                    <Route path="/admin/policies/:id"      element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminPolicyDetails /></ProtectedRoute>} />
                    <Route path="/admin/addons"            element={<ProtectedRoute allowedRoles={['ADMIN']}><AddonManagement /></ProtectedRoute>} />
                    <Route path="/admin/addons/new"        element={<ProtectedRoute allowedRoles={['ADMIN']}><AddonForm /></ProtectedRoute>} />
                    <Route path="/admin/addons/:id/edit"   element={<ProtectedRoute allowedRoles={['ADMIN']}><AddonForm /></ProtectedRoute>} />
                    <Route path="/admin/onboard"           element={<ProtectedRoute allowedRoles={['ADMIN']}><OnboardOfficer /></ProtectedRoute>} />
                    <Route path="/admin/officers"          element={<ProtectedRoute allowedRoles={['ADMIN']}><OfficerManagement /></ProtectedRoute>} />
                    <Route path="/admin/reviews"           element={<ProtectedRoute allowedRoles={['ADMIN']}><UserReviews /></ProtectedRoute>} />
                    <Route path="/admin/proposals"         element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminProposalList /></ProtectedRoute>} />
                    <Route path="/admin/proposals/:id"     element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminProposalView /></ProtectedRoute>} />

                    {/* ── Customer Routes (role: CUSTOMER) ─────────────────── */}
                    <Route path="/customer/dashboard"       element={<ProtectedRoute allowedRoles={['CUSTOMER']}><CustomerDashboard /></ProtectedRoute>} />
                    <Route path="/customer/vehicles"        element={<ProtectedRoute allowedRoles={['CUSTOMER']}><MyVehicles /></ProtectedRoute>} />
                    <Route path="/customer/policies"        element={<ProtectedRoute allowedRoles={['CUSTOMER']}><MyPolicies /></ProtectedRoute>} />
                    <Route path="/customer/policies/:id"    element={<ProtectedRoute allowedRoles={['CUSTOMER']}><CustomerPolicyDetails /></ProtectedRoute>} />
                    <Route path="/customer/proposals"       element={<ProtectedRoute allowedRoles={['CUSTOMER']}><MyProposals /></ProtectedRoute>} />
                    <Route path="/customer/apply"           element={<ProtectedRoute allowedRoles={['CUSTOMER']}><ApplyPolicy /></ProtectedRoute>} />
                    <Route path="/customer/claim"           element={<ProtectedRoute allowedRoles={['CUSTOMER']}><Claim /></ProtectedRoute>} />
                    <Route path="/customer/claims"          element={<ProtectedRoute allowedRoles={['CUSTOMER']}><ClaimTracking /></ProtectedRoute>} />
                    <Route path="/customer/claims/:id"      element={<ProtectedRoute allowedRoles={['CUSTOMER']}><ClaimDetails /></ProtectedRoute>} />
                    <Route path="/customer/profile"         element={<ProtectedRoute allowedRoles={['CUSTOMER']}><MyProfile /></ProtectedRoute>} />

                    {/* ── Officer Routes (role: INSURANCE_OFFICER) ──────────── */}
                    <Route path="/officer/dashboard"            element={<ProtectedRoute allowedRoles={['INSURANCE_OFFICER']}><OfficerDashboard /></ProtectedRoute>} />
                    {/* Submitted proposals queue — proposals pending review */}
                    <Route path="/officer/proposals"            element={<ProtectedRoute allowedRoles={['INSURANCE_OFFICER']}><ProposalList /></ProtectedRoute>} />
                    {/* Officer's own assigned proposals */}
                    <Route path="/officer/officerproposal"      element={<ProtectedRoute allowedRoles={['INSURANCE_OFFICER']}><OfficerProposals /></ProtectedRoute>} />
                    <Route path="/officer/proposals/:id"        element={<ProtectedRoute allowedRoles={['INSURANCE_OFFICER']}><ProposalReview /></ProtectedRoute>} />
                    {/* All submitted/initiated claims queue */}
                    <Route path="/officer/claims"               element={<ProtectedRoute allowedRoles={['INSURANCE_OFFICER']}><ClaimList /></ProtectedRoute>} />
                    {/* Officer's own assigned claims */}
                    <Route path="/officer/claims/byofficer"     element={<ProtectedRoute allowedRoles={['INSURANCE_OFFICER']}><OfficerClaims /></ProtectedRoute>} />
                    <Route path="/officer/claims/:id"           element={<ProtectedRoute allowedRoles={['INSURANCE_OFFICER']}><ClaimReview /></ProtectedRoute>} />
                    <Route path="/officer/profile"              element={<ProtectedRoute allowedRoles={['INSURANCE_OFFICER']}><OfficerProfile /></ProtectedRoute>} />

                    {/* ── Catch-all ─────────────────────────────────────────── */}
                    <Route path="*" element={<Navigate to="/" replace />} />

                </Route>
            </Routes>
        </AppProvider>
    );
}

export default App;
