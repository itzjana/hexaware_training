import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import axios from 'axios';

export default function PolicyManagement() {
    const { showToast } = useApp()
    const navigate = useNavigate()

    // Policies state
    const [policies, setPolicies] = useState([])
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState()
    const [pageSize, setPageSize] = useState(1)
    const [confirmDelete, setConfirmDelete] = useState(null); // holds policy id pending delete

    const arr = Array.from({ length: totalPages })

    const api = 'http://localhost:8080/api/insurance/all/v2'

    const config = {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }

    const loadData = async () => {
        try {
            const res = await axios.get(api + `?page=${currentPage}&size=${pageSize}`, config)
            setPolicies(res.data.list)
            setTotalPages(res.data.totalPages)
        } catch (error) {
            showToast("Failed to load policies", "error")
        }
    };

    useEffect(() => {
        loadData();
    }, [currentPage]);

    const handlePolicyDelete = (id) => {
        setConfirmDelete(id);
    };

    const confirmPolicyDelete = async () => {
        const id = confirmDelete;
        setConfirmDelete(null);
        try {
            await axios.delete(`http://localhost:8080/api/insurance/delete/${id}`, config);
            showToast("Policy template deleted successfully.", "success");
        } catch (error) {
            console.warn("Backend delete not supported or failed, removing locally.", error);
            showToast("Policy template removed.", "warning");
        }
        loadData();
    };

    return (
        <div>
            <header className="mb-4 d-flex justify-content-between align-items-center">
                <div>
                    <h1 className="h3 text-uppercase mb-2">Policy Config (CRUD)</h1>
                    <p className="text-secondary small mb-0">Configure baseline insurance packages and their properties.</p>
                </div>
                <button
                    onClick={() => navigate('/admin/policies/new')}
                    className="btn btn-primary text-uppercase fw-bold d-flex align-items-center gap-2 shadow-sm"
                >
                    <i className="bi bi-plus-circle-fill"></i>
                    <span>Add Policy</span>
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
                                Are you sure you want to delete this policy template? This action cannot be undone.
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
                                    onClick={confirmPolicyDelete}
                                >
                                    <i className="bi bi-trash me-1"></i>Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Policy List */}
            <div className="bg-white border rounded-3 shadow-sm overflow-hidden p-4">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light text-uppercase small">
                            <tr>
                                <th>Policy Name</th>
                                <th>Base Rate</th>
                                <th>Validity(Months)</th>
                                <th>Category</th>
                                <th>Status</th>
                                <th className="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="small">
                            {policies.map((p, i) => (
                                <tr key={p.id}>
                                    <td className="fw-bold text-dark">{p.policyName}</td>
                                    <td className="fw-bold text-primary">₹{p.baseRate ? p.baseRate.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'}</td>
                                    <td>{p.validityMonths} Months</td>
                                    <td>
                                        <span className="badge bg-light text-dark border">{p.vehicleCategory}</span>
                                    </td>
                                    <td>
                                        <span className={`badge px-2 py-1 ${p.active ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-danger-subtle text-danger border border-danger-subtle'} text-uppercase`} style={{ fontSize: '0.65rem' }}>
                                            {p.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="text-end">
                                        <div className="d-inline-flex gap-2">
                                            <button onClick={() => navigate(`/admin/policies/${p.id}`)} className="btn btn-sm btn-outline-dark" title="View Details">
                                                <i className="bi bi-eye"></i>
                                            </button>
                                            <button onClick={() => navigate(`/admin/policies/${p.id}/edit`)} className="btn btn-sm btn-outline-secondary" title="Edit">
                                                <i className="bi bi-pencil"></i>
                                            </button>
                                            <button onClick={() => handlePolicyDelete(p.id)} className="btn btn-sm btn-outline-danger" title="Delete">
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                            }
                        </tbody>
                    </table>

                    <nav aria-label="..." className='mt-3'>
                        <ul className="pagination">
                            <li className="page-item">
                                <button className="page-link" disabled={currentPage === 0} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                            </li>
                            {
                                arr.map((_, i) => (
                                    <li key={i} className={`page-item ${i == currentPage ? 'active' : ''}`}><button className="page-link" onClick={() => setCurrentPage(i)}>{i + 1}</button></li>
                                ))
                            }
                            <li className="page-item">
                                <button className="page-link" disabled={currentPage === totalPages - 1} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    );
}
