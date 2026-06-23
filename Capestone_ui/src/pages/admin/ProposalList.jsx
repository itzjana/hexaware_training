import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useApp } from '../../context/AppContext';

export default function AdminProposalList() {
    const navigate = useNavigate();
    const { showToast } = useApp();

    const [proposals, setProposals] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [pageNumber, setPageNumber] = useState(0);

    const PAGE_SIZE = 2;

    const config = {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
    };

    const fetchProposals = async () => {
        try {
            let url = `http://localhost:8080/api/policyproposal/all?page=${pageNumber}&size=${PAGE_SIZE}`;
            if (filterStatus !== 'ALL') {
                url += `&status=${filterStatus}`;
            }

            const res = await axios.get(url, config);
            setProposals(res.data.proposalSummaryDTOList);
            setTotalPages(res.data.totalPage);
        } catch (error) {
            showToast('Failed to fetch proposals.', 'error');
        }
    };

    useEffect(() => {
        fetchProposals();
    }, [pageNumber, filterStatus]);

    // Reset to page 0 whenever the status filter changes
    const handleStatusChange = (status) => {
        setFilterStatus(status);
        setPageNumber(0);
    };

    const statusBadge = (status) => {
        const map = {
            PROPOSAL_SUBMITTED: { label: 'Submitted', cls: 'bg-warning text-dark' },
            UNDER_REVIEW: { label: 'Under Review', cls: 'bg-info text-dark' },
            VERIFIED: { label: 'Verified', cls: 'bg-info text-dark' },
            QUOTE_GENERATED: { label: 'Quote Sent', cls: 'bg-primary' },
            ACTIVE: { label: 'Active', cls: 'bg-success' },
            REJECTED: { label: 'Rejected', cls: 'bg-danger' },
            EXPIRED: { label: 'Expired', cls: 'bg-secondary' },
            CANCELLED: { label: 'Cancelled', cls: 'bg-secondary' },
        };
        const badge = map[status] || { label: status, cls: 'bg-dark' };
        return (
            <span
                className={`badge ${badge.cls} px-3 py-2`}
                style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}
            >
                {badge.label}
            </span>
        );
    };

    const statusOptions = [
        'ALL', 'PROPOSAL_SUBMITTED', 'UNDER_REVIEW', 'VERIFIED',
        'QUOTE_GENERATED', 'ACTIVE', 'REJECTED', 'EXPIRED', 'CANCELLED',
    ];

    return (
        <div>
            <header className="mb-4">
                <h1 className="h3 text-uppercase mb-1">All Proposals</h1>
                <p className="text-secondary small">
                    View all insurance proposals across the system.
                </p>
            </header>

            {/* Filters Bar */}
            <div className="bg-white border rounded-3 p-3 mb-4 shadow-sm d-flex flex-wrap gap-2 align-items-center">
                <span className="fw-semibold small text-muted me-1">Filter by Status:</span>
                {statusOptions.map((s) => (
                    <button
                        key={s}
                        className={`btn btn-sm ${filterStatus === s ? 'btn-dark text-white' : 'btn-outline-secondary'} text-uppercase fw-bold`}
                        style={{ fontSize: '0.7rem', letterSpacing: '0.04em' }}
                        onClick={() => handleStatusChange(s)}
                    >
                        {s === 'ALL' ? 'All' : s.replace(/_/g, ' ')}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white border rounded-3 shadow-sm overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="text-uppercase small fw-bold text-muted px-4 py-3">Proposal Id</th>
                                <th className="text-uppercase small fw-bold text-muted px-4 py-3">Policy Name</th>
                                <th className="text-uppercase small fw-bold text-muted px-4 py-3">Vehicle Number</th>
                                <th className="text-uppercase small fw-bold text-muted px-4 py-3">Vehicle Model</th>
                                <th className="text-uppercase small fw-bold text-muted px-4 py-3">Manufacturer</th>
                                <th className="text-uppercase small fw-bold text-muted px-4 py-3">Status</th>
                                <th className="text-uppercase small fw-bold text-muted px-4 py-3">Submitted At</th>
                                <th className="text-uppercase small fw-bold text-muted px-4 py-3 text-end">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {proposals.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="text-center py-5 text-muted small">
                                        No proposals found for the selected status.
                                    </td>
                                </tr>
                            ) : (
                                proposals.map((p, index) => (
                                    <tr key={index} className="border-bottom">
                                        <td className="px-4 py-3 fw-bold small text-danger">#{p.proposalId}</td>
                                        <td className="px-4 py-3 small">{p.policyName}</td>
                                        <td className="px-4 py-3 small text-muted">{p.vehicleNumber}</td>
                                        <td className="px-4 py-3 small text-truncate">{p.vehicleModel}</td>
                                        <td className="px-4 py-3 small text-truncate">{p.manufacturer}</td>
                                        <td className="px-4 py-3">{statusBadge(p.status)}</td>
                                        <td className="px-4 py-3 small text-muted">{new Date(p.submittedAt).toLocaleDateString()}</td>
                                        <td className="px-4 py-3 text-end">
                                            <button
                                                className="btn btn-sm btn-outline-dark text-uppercase fw-bold px-3"
                                                style={{ fontSize: '0.7rem' }}
                                                onClick={() => navigate(`/admin/proposals/${p.proposalId}`)}
                                            >
                                                <i className="bi bi-eye me-1"></i> Review
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="d-flex justify-content-between align-items-center px-4 py-3 border-top bg-light">
                    <span className="text-muted small">
                        Page {pageNumber + 1} of {totalPages}
                    </span>
                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-sm btn-outline-secondary"
                            disabled={pageNumber === 0}
                            onClick={() => setPageNumber(pageNumber - 1)}
                        >
                            <i className="bi bi-chevron-left"></i> Prev
                        </button>
                        <button
                            className="btn btn-sm btn-outline-secondary"
                            disabled={pageNumber === totalPages - 1 || totalPages === 0}
                            onClick={() => setPageNumber(pageNumber + 1)}
                        >
                            Next <i className="bi bi-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
