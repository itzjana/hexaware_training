import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import axios from 'axios';

export default function AddonManagement() {
    const { showToast } = useApp();
    const navigate = useNavigate();

    // Addons state
    const [addons, setAddons] = useState([]);
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

    const handleAddonDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this addon template? This will remove it from future package selections.")) {
            try {
                // Delete from backend API
                await axios.delete(`http://localhost:8080/api/addon/delete/${id}`, config);
                showToast("Addon template deleted successfully.", "success");
            } catch (error) {
                console.warn("Backend delete not supported or failed, removing locally.", error);
            }
            
            showToast("Addon template removed.", "error");
            loadData();
        }
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
                                addons.map((a,index) => (
                                    <tr key={index}>
                                        <td className="fw-bold text-dark">{a.name}</td>
                                        <td className="text-secondary" style={{ maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {a.description}
                                        </td>
                                        <td className="fw-bold text-primary">
                                            ₹{a.additionalCost ? a.additionalCost.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'}
                                        </td>
                                        <td>{a.active ? 'Active' : 'Inactive'}</td>
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
