import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import axios from 'axios';

export default function MyProfile() {
    const { showToast } = useApp();
    const [editing, setEditing] = useState(false);

    const [name, setName] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [userName, setUserName] = useState('');
    const [id, setId] = useState('');

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [saving, setSaving] = useState(false);
    const [showPasswordSection, setShowPasswordSection] = useState(false);

    const config = {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        }
    };

    const loadProfile = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/officer/me', config);
            setName(res.data.name || '');
            setJobTitle(res.data.jobTitle || '');
            setId(res.data.id || '');
            setUserName(localStorage.getItem('username') || '');
        } catch (error) {
            console.error(error);
            showToast("Failed to load officer profile information.", "error");
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const handleSave = async () => {
        if (!name.trim()) {
            showToast("Name cannot be empty.", "warning");
            return;
        }

        if (showPasswordSection) {
            if (!newPassword) {
                showToast("Please enter a new password.", "warning");
                return;
            }
            if (newPassword !== confirmPassword) {
                showToast("Passwords do not match.", "warning");
                return;
            }
        }

        try {
            setSaving(true);
            const payload = {
                name: name
            };

            if (showPasswordSection && newPassword) {
                payload.password = newPassword;
            }

            await axios.patch('http://localhost:8080/api/officer/me/update', payload, config);
            showToast("Profile updated successfully.", "success");
            setEditing(false);
            setNewPassword('');
            setConfirmPassword('');
            setShowPasswordSection(false);
            loadProfile();
        } catch (error) {
            console.error(error);
            showToast(error?.response?.data?.message || "Failed to update profile.", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setEditing(false);
        setNewPassword('');
        setConfirmPassword('');
        setShowPasswordSection(false);
        loadProfile();
    };

    return (
        <div>
            <header className="mb-4">
                <h1 className="h3 text-uppercase mb-2">Officer Profile</h1>
                <p className="text-secondary small m-0">View and manage your underwriting profile details and account settings.</p>
            </header>

            <div className="row g-4">
                {/* Profile Header Card */}
                <div className="col-12">
                    <div className="bg-white border rounded-3 shadow-sm overflow-hidden">
                        <div className="bg-primary pt-4 px-4 pb-3"></div>
                        <div className="px-4 pb-4 mt-3">
                            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-end gap-3">
                                <div className="d-flex align-items-center justify-content-center bg-white border border-3 border-primary rounded-circle shadow"
                                    style={{ width: '80px', height: '80px', flexShrink: 0 }}>
                                    <i className="bi bi-person-fill text-primary fs-1"></i>
                                </div>
                                <div className="flex-grow-1 pt-2">
                                    <h4 className="fw-bold mb-0">{name}</h4>
                                    <span className="text-muted small">
                                        <i className="bi bi-envelope-fill me-1"></i>{userName}
                                    </span>
                                    <span className="badge bg-primary bg-opacity-10 text-primary ms-2 small">Insurance Officer</span>
                                </div>
                                <div className="pt-2">
                                    {!editing ? (
                                        <button onClick={() => setEditing(true)}
                                            className="btn btn-primary text-uppercase fw-bold rounded-2 shadow-sm px-4">
                                            <i className="bi bi-pencil-fill me-2"></i>Edit Profile
                                        </button>
                                    ) : (
                                        <div className="d-flex gap-2">
                                            <button onClick={handleCancel}
                                                className="btn btn-outline-secondary text-uppercase fw-bold rounded-2 px-3"
                                                disabled={saving}>
                                                Cancel
                                            </button>
                                            <button onClick={handleSave}
                                                className="btn btn-primary text-uppercase fw-bold rounded-2 shadow-sm px-4"
                                                disabled={saving}>
                                                {saving ? (
                                                    <><span className="spinner-border spinner-border-sm me-2"></span>Saving…</>
                                                ) : (
                                                    <><i className="bi bi-check-lg me-2"></i>Save Changes</>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Details (Left Column) */}
                <div className="col-lg-8">
                    <div className="bg-white border rounded-3 p-4 shadow-sm">
                        <div className="d-flex align-items-center gap-2 mb-4 pb-2 border-bottom">
                            <i className="bi bi-person-vcard-fill text-primary fs-5"></i>
                            <h5 className="text-uppercase fw-bold m-0 small tracking-wider">Account Information</h5>
                        </div>

                        <div className="row g-4">
                            {/* Full Name */}
                            <div className="col-md-6">
                                <label className="form-label text-muted text-uppercase small fw-semibold">
                                    Full Name
                                </label>
                                {editing ? (
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                                        className="form-control"
                                        placeholder="Enter your full name" />
                                ) : (
                                    <p className="fw-semibold mb-0">{name || '—'}</p>
                                )}
                            </div>

                            {/* Username / Email */}
                            <div className="col-md-6">
                                <label className="form-label text-muted text-uppercase small fw-semibold">
                                    Username / Email
                                </label>
                                <p className="fw-semibold mb-0 d-flex align-items-center gap-2">
                                    <i className="bi bi-envelope text-primary"></i>
                                    {userName}
                                    <i className="bi bi-lock-fill text-muted" title="Cannot be changed"></i>
                                </p>
                            </div>

                            {/* Job Title */}
                            <div className="col-md-6">
                                <label className="form-label text-muted text-uppercase small fw-semibold">
                                    Job Title
                                </label>
                                <p className="fw-semibold mb-0 d-flex align-items-center gap-2">
                                    <i className="bi bi-briefcase text-primary"></i>
                                    {jobTitle ? jobTitle.replace(/_/g, ' ') : '—'}
                                    <i className="bi bi-lock-fill text-muted" title="Cannot be changed by officer"></i>
                                </p>
                            </div>

                            {/* Officer ID */}
                            <div className="col-md-6">
                                <label className="form-label text-muted text-uppercase small fw-semibold">
                                    Officer ID Ref
                                </label>
                                <p className="fw-semibold mb-0 font-monospace">
                                    #{id || '—'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Change Password Panel */}
                    {editing && (
                        <div className="bg-white border rounded-3 p-4 shadow-sm mt-4">
                            <div className="d-flex align-items-center justify-content-between gap-2 mb-3 pb-2 border-bottom">
                                <div className="d-flex align-items-center gap-2">
                                    <i className="bi bi-shield-lock-fill text-warning fs-5"></i>
                                    <h5 className="text-uppercase fw-bold m-0 small tracking-wider">Change Password</h5>
                                </div>
                                <button className="btn btn-sm btn-outline-secondary"
                                    onClick={() => {
                                        setShowPasswordSection(!showPasswordSection);
                                        if (showPasswordSection) {
                                            setNewPassword('');
                                            setConfirmPassword('');
                                        }
                                    }}>
                                    {showPasswordSection ? 'Cancel' : 'Change Password'}
                                </button>
                            </div>

                            {showPasswordSection ? (
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label text-muted text-uppercase small fw-semibold">
                                            New Password
                                        </label>
                                        <input type="password" value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="form-control"
                                            placeholder="Enter new password" />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label text-muted text-uppercase small fw-semibold">
                                            Confirm New Password
                                        </label>
                                        <input type="password" value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="form-control"
                                            placeholder="Confirm new password" />
                                    </div>
                                </div>
                            ) : (
                                <p className="text-muted small mb-0">
                                    <i className="bi bi-info-circle me-1"></i>
                                    Click "Change Password" to update your account password.
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Column Details */}
                <div className="col-lg-4">
                    <div className="bg-white border rounded-3 p-4 shadow-sm">
                        <div className="d-flex align-items-center gap-2 mb-4 pb-2 border-bottom">
                            <i className="bi bi-shield-check text-primary fs-5"></i>
                            <h5 className="text-uppercase fw-bold m-0 small tracking-wider">Security Badging</h5>
                        </div>
                        <div className="mb-3 text-center">
                            <i className="bi bi-patch-check-fill text-success fs-1"></i>
                            <div className="fw-bold mt-2 text-uppercase text-dark">Authorized Underwriter</div>
                            <p className="text-muted small mt-1 mb-0">
                                Certified to review risk assessments, set policy quotes, and settle claims logs.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
