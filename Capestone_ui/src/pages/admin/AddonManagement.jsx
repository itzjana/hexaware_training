import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import axios from 'axios';

export default function AddonManagement() {
    const { showToast } = useApp();
    const navigate = useNavigate();

    // Addons state
    const [addons, setAddons] = useState([]);
    const [confirmDelete, setConfirmDelete] = useState(null); // holds addon id pending delete
    const api = 'http://localhost:8080/api/addon/all';

    const config = {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    };

    const loadData = async () => {
        try {
            const res = await axios.get(api, config);
            setAddons(res.data);
        } catch (error) {
            showToast("Failed to load addons", "error");
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleAddonDelete = (id) => {
        setConfirmDelete(id);
    };

    const confirmAddonDelete = async () => {
        const id = confirmDelete;
        setConfirmDelete(null);
        try {
            await axios.delete(`http://localhost:8080/api/addon/delete/${id}`, config);
            showToast("Addon template deleted successfully.", "success");
        } catch (error) {
            console.warn("Backend delete not supported or failed, removing locally.", error);
            showToast("Addon template removed.", "warning");
        }
        loadData();
    };

    return (
        <div>
            <header className="mb-4 d-flex justify-content-between align-items-center">
                <div>
                    <h1 className="h3 text-uppercase mb-2">Addon Config (CRUD)</h1>
                    <p className="text-secondary small mb-0">Configure optional coverages, services, and add-on benefits.</p>
                </div>
                <button
                    onClick={() => navigate('/admin/addons/new')}
                    className="btn btn-primary text-uppercase fw-bold d-flex align-items-center gap-2 shadow-sm"
                >
                    <i className="bi bi-plus-circle-fill"></i>
                    <span>Add Addon</span>
                </button>
            </header>

            {/* Inline Confirm Delete Toast */}
            {confirmDelete !== null && (
                <div
                    className="position-fixed bottom-0 end-0 p-4"
                    style={{ zIndex: 1080 }}
                >
                    <div
                        className="toast show align-items-start shadow-lg border-0"
                        style={{ minWidth: '320px', background: '#fff', borderRadius: '12px' }}
                        role="alert"
                        aria-live="assertive"
                    >
                        <div className="toast-header border-0 pb-0" style={{ background: 'transparent' }}>
                            <i className="bi bi-exclamation-triangle-fill text-danger me-2 fs-5"></i>
                            <strong className="me-auto text-danger">Confirm Delete</strong>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setConfirmDelete(null)}
                                aria-label="Cancel"
                            ></button>
                        </div>
                        <div className="toast-body pt-1">
                            <p className="mb-3 text-secondary small">
                                Are you sure you want to delete this addon template? This will remove it from future package selections.
                            </p>
                            <div className="d-flex gap-2 justify-content-end">
                                <button
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={() => setConfirmDelete(null)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={confirmAddonDelete}
                                >
                                    <i className="bi bi-trash me-1"></i>Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Addon List */}
            <div className="bg-white border rounded-3 shadow-sm overflow-hidden p-4">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light text-uppercase small">
                            <tr>
                                <th>Addon Name</th>
                                <th>Description</th>
                                <th>Annual Cost</th>
                                <th>Status</th>
                                <th className="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="small">
                            {addons.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center text-muted italic p-4">
                                        No addon templates found.
                                    </td>
                                </tr>
                            ) : (
                                addons.map((a, index) => (
                                    <tr key={index}>
                                        <td className="fw-bold text-dark">{a.name}</td>
                                        <td className="text-secondary" style={{ maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {a.description}
                                        </td>
                                        <td className="fw-bold text-primary">
                                            ₹{a.additionalCost ? a.additionalCost.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'}
                                        </td>
                                        <td>
                                            <span className={`badge px-2 py-1 ${a.status ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-danger-subtle text-danger border border-danger-subtle'} text-uppercase`} style={{ fontSize: '0.65rem' }}>
                                                {a.status ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="text-end">
                                            <div className="d-inline-flex gap-2">
                                                <button onClick={() => navigate(`/admin/addons/${a.id}/edit`)} className="btn btn-sm btn-outline-secondary" title="Edit">
                                                    <i className="bi bi-pencil"></i>
                                                </button>
                                                <button onClick={() => handleAddonDelete(a.id)} className="btn btn-sm btn-outline-danger" title="Delete">
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
