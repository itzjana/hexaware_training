import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';

export default function OfficerManagement() {

    const { showToast } = useApp();
    const [officers, setOfficers] = useState([]);
    const [search, setSearch] = useState('');

    const config = {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
    };

    const fetchOfficers = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/officer/list', config);
            setOfficers(res.data);
        } catch (error) {
            showToast('Failed to fetch officer records.', 'error');
        }
    };

    const searchOfficer = async () => {
        if (!search.trim()) {
            fetchOfficers();
            return;
        }

        const searchApi = `http://localhost:8080/api/officer/search?name=${encodeURIComponent(search)}`;

        try {
            const res = await axios.get(searchApi, config);
            setOfficers([res.data]);
        } catch (error) {
            showToast('Failed to fetch officer records.', 'error');
        }
    };

    const clearSearch = () => {
        setSearch('');
        fetchOfficers();
    };

    useEffect(() => {
        fetchOfficers();
    }, []);

    return (
        <div className="container-fluid py-4">
            {/* Header */}
            <header className="mb-4 d-flex justify-content-between align-items-center">
                <div>
                    <h1 className="h3 text-uppercase mb-1 fw-bold">Officer Registry</h1>
                    <p className="text-secondary small mb-0">
                        Manage insurance officers, track their active workload of proposals and claims, and suspend/deactivate accounts.
                    </p>
                </div>
            </header>

            {/* Table Card */}
            <div className="bg-white border rounded-3 shadow-sm overflow-hidden">
                <div className="d-flex justify-content-between align-items-center p-3">
                    <div className="input-group" style={{ width: '250px' }}>
                        <span className="input-group-text">
                            <i className="bi bi-search"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && searchOfficer()}
                        />
                    </div>

                    <div className="d-flex gap-2">
                        {search.length > 0 && (
                            <button className="btn btn-outline-secondary" onClick={clearSearch}>
                                Clear
                            </button>
                        )}
                        <button className="btn btn-outline-primary" onClick={searchOfficer}>
                            Search
                        </button>
                        <Link to="/admin/onboard" className="btn btn-primary">
                            <i className="bi bi-plus-circle"></i> Add Officer
                        </Link>
                    </div>
                </div>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="text-uppercase small fw-bold text-muted px-4 py-3">Officer Name</th>
                                <th className="text-uppercase small fw-bold text-muted px-4 py-3">Credentials</th>
                                <th className="text-uppercase small fw-bold text-muted px-4 py-3">Job Title</th>
                                <th className="text-uppercase small fw-bold text-muted px-4 py-3 text-center">Proposals Handled</th>
                                <th className="text-uppercase small fw-bold text-muted px-4 py-3 text-center">Claims Handled</th>
                            </tr>
                        </thead>
                        <tbody>
                            {officers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-5 text-muted">
                                        <i className="bi bi-inbox display-4 d-block mb-3 text-black-50"></i>
                                        No officers registered.
                                    </td>
                                </tr>
                            ) : (
                                officers.map((o) => (
                                    <tr key={o.id} className="border-bottom">
                                        <td className="px-4 py-3 fw-semibold text-dark">
                                            {o.name}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="fw-semibold text-primary small">@{o.username}</div>
                                            <div className="text-muted small" style={{ fontSize: '0.78rem' }}>{o.email}</div>
                                        </td>
                                        <td className="px-4 py-3 small text-muted">
                                            {o.jobTitle ? o.jobTitle.replace(/_/g, ' ') : '—'}
                                        </td>
                                        <td className="px-4 py-3 text-center fw-bold text-secondary">
                                            {o.proposalCount}
                                        </td>
                                        <td className="px-4 py-3 text-center fw-bold text-secondary">
                                            {o.claimCount}
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