import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import axios from 'axios';

export default function MyProfile() {
    const { showToast } = useApp();
    const [editing, setEditing] = useState(false)

    const [name, setName] = useState()
    const [address, setAddress] = useState()
    const [dob, setDob] = useState()
    const [aadhaarNumber, setAadhaarNumber] = useState()
    const [panNumber, setPanNumber] = useState()
    const [currentPassword, setCurrentPassword] = useState()
    const [newPassword, setNewPassword] = useState()
    const [userName, setUserName] = useState()
    const [id, setId] = useState()

    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [showPasswordSection, setShowPasswordSection] = useState(false);

    const config = {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        }
    };

    const loadProfile = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/customers/me', config);
            setName(res.data.name)
            setAddress(res.data.address)
            setDob(res.data.dob)
            setAadhaarNumber(res.data.aadhaarNumber)
            setPanNumber(res.data.panNumber)
            setUserName(res.data.userName)
            setId(res.data.id)
        } catch (error) {
            showToast("Failed to load profile information.", "error");
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const handleSave = async () => {
        try {
            setSaving(true);
            const payload = {
                name: name,
                address: address,
                dob: dob,
                aadhaarNumber: aadhaarNumber,
                panNumber: panNumber,
                currentPassword: currentPassword,
                newPassword: newPassword
            }

            await axios.patch('http://localhost:8080/api/customers/me/update', payload, config)
            showToast("Profile updated successfully.", "success")
            setEditing(false)
            setCurrentPassword('')
            setNewPassword('')
            setShowPasswordSection(false)
            loadProfile()
        } catch (error) {
            console.error(error);
            showToast(error?.response?.data?.message || "Failed to update profile.", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setEditing(false);
        setCurrentPassword('');
        setNewPassword('');
        setShowPasswordSection(false);
        loadProfile();
    };

    return (
        <div>
            <header className="mb-4">
                <h1 className="h3 text-uppercase mb-2">My Profile</h1>
                <p className="text-secondary small m-0">View and manage your personal details and account settings.</p>
            </header>

            <div className="row g-4">
                {/* Profile Header Card */}
                <div className="col-12">
                    <div className="bg-white border rounded-3 shadow-sm overflow-hidden">
                        <div className="bg-primary pt-4 px-4 pb-3">
                        </div>
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
                                    <span className="badge bg-primary bg-opacity-10 text-primary ms-2 small">Customer</span>
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

                {/* Personal Information */}
                <div className="col-lg-8">
                    <div className="bg-white border rounded-3 p-4 shadow-sm">
                        <div className="d-flex align-items-center gap-2 mb-4 pb-2 border-bottom">
                            <i className="bi bi-person-vcard-fill text-primary fs-5"></i>
                            <h5 className="text-uppercase fw-bold m-0 small tracking-wider">Personal Information</h5>
                        </div>

                        <div className="row g-4">
                            {/* Full Name */}
                            <div className="col-md-6">
                                <label className="form-label text-muted text-uppercase small fw-semibold">
                                    Full Name
                                </label>
                                {editing ? (
                                    <>
                                        <input type="text" value={name || ''} onChange={(e) => setName(e.target.value)}
                                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                            placeholder="Enter your full name" />
                                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                    </>
                                ) : (
                                    <p className="fw-semibold mb-0">{name || '—'}</p>
                                )}
                            </div>

                            {/* Username (Email) - Read only */}
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

                            {/* Date of Birth */}
                            <div className="col-md-6">
                                <label className="form-label text-muted text-uppercase small fw-semibold">
                                    Date of Birth
                                </label>
                                {editing ? (
                                    <>
                                        <input type="date" value={dob || ''} onChange={(e) => setDob(e.target.value)}
                                            className={`form-control ${errors.dob ? 'is-invalid' : ''}`} />
                                        {errors.dob && <div className="invalid-feedback">{errors.dob}</div>}
                                    </>
                                ) : (
                                    <p className="fw-semibold mb-0 d-flex align-items-center gap-2">
                                        <i className="bi bi-calendar-event text-primary"></i>
                                        {dob || '—'}
                                    </p>
                                )}
                            </div>

                            {/* Address */}
                            <div className="col-md-6">
                                <label className="form-label text-muted text-uppercase small fw-semibold">
                                    Address
                                </label>
                                {editing ? (
                                    <>
                                        <textarea value={address || ''} onChange={(e) => setAddress(e.target.value)}
                                            className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                            rows="2" placeholder="Enter your address" />
                                        {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                                    </>
                                ) : (
                                    <p className="fw-semibold mb-0 d-flex align-items-start gap-2">
                                        <i className="bi bi-geo-alt-fill text-primary"></i>
                                        {address || '—'}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Password Change — Only visible in edit mode */}
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
                                            setCurrentPassword('');
                                            setNewPassword('');
                                            setErrors(prev => {
                                                const { currentPassword, newPassword, ...rest } = prev;
                                                return rest;
                                            });
                                        }
                                    }}>
                                    {showPasswordSection ? 'Cancel' : 'Change Password'}
                                </button>
                            </div>

                            {showPasswordSection ? (
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label text-muted text-uppercase small fw-semibold">
                                            Current Password
                                        </label>
                                        <input type="password" value={currentPassword || ''}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            className={`form-control ${errors.currentPassword ? 'is-invalid' : ''}`}
                                            placeholder="Enter current password" />
                                        {errors.currentPassword && <div className="invalid-feedback">{errors.currentPassword}</div>}
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label text-muted text-uppercase small fw-semibold">
                                            New Password
                                        </label>
                                        <input type="password" value={newPassword || ''}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
                                            placeholder="Enter new password" />
                                        {errors.newPassword && <div className="invalid-feedback">{errors.newPassword}</div>}
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

                {/* Identity Documents Sidebar */}
                <div className="col-lg-4">
                    <div className="bg-white border rounded-3 p-4 shadow-sm">
                        <div className="d-flex align-items-center gap-2 mb-4 pb-2 border-bottom">
                            <i className="bi bi-fingerprint text-primary fs-5"></i>
                            <h5 className="text-uppercase fw-bold m-0 small tracking-wider">Identity Documents</h5>
                        </div>

                        {/* Aadhaar */}
                        <div className="mb-4">
                            <label className="form-label text-muted text-uppercase small fw-semibold d-flex align-items-center gap-1">
                                <i className="bi bi-credit-card-2-front"></i> Aadhaar Number
                            </label>
                            {editing ? (
                                <>
                                    <input type="text" value={aadhaarNumber || ''}
                                        onChange={(e) => setAadhaarNumber(e.target.value)} maxLength={12}
                                        className="form-control"
                                        placeholder="Enter 12-digit Aadhaar" />
                                    {errors.aadhaarNumber && <div className="invalid-feedback">{errors.aadhaarNumber}</div>}
                                </>
                            ) : (
                                <div className="d-flex align-items-center gap-2">
                                    <span className="fw-bold font-monospace">
                                        {aadhaarNumber}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* PAN */}
                        <div className="mb-4">
                            <label className="form-label text-muted text-uppercase small fw-semibold d-flex align-items-center gap-1">
                                <i className="bi bi-card-text"></i> PAN Number
                            </label>
                            {editing ? (
                                <>
                                    <input type="text" value={panNumber || ''}
                                        onChange={(e) => setPanNumber(e.target.value)} maxLength={10}
                                        className="form-control text-uppercase "
                                        placeholder="Enter PAN (e.g. ABCDE1234F)" />
                                    {errors.panNumber && <div className="invalid-feedback">{errors.panNumber}</div>}
                                </>
                            ) : (
                                <div className="d-flex align-items-center gap-2">
                                    <span className="fw-bold font-monospace text-uppercase">
                                        {panNumber || '—'}
                                    </span>
                                    {panNumber && (
                                        <span className="badge bg-success bg-opacity-10 text-success">
                                            <i className="bi bi-check-circle-fill me-1"></i>Verified
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        <hr />
                    </div>

                </div>
            </div>
        </div>
    );
}
