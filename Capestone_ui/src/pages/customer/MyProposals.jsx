import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCustomerProposals } from '../../store/action/proposalAction';

export default function MyProposals() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { proposalsList } = useSelector(state => state.proposals);

    useEffect(() => {
        dispatch(getCustomerProposals());
    }, [dispatch]);

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'ACTIVE': return 'bg-success';
            case 'VERIFIED': return 'bg-info text-dark';
            case 'QUOTE_GENERATED': return 'bg-warning text-dark';
            case 'REJECTED': return 'bg-danger';
            case 'ADDITIONAL_DETAILS_REQUIRED': return 'bg-warning text-dark';
            case 'PROPOSAL_SUBMITTED':
            default: return 'bg-secondary';
        }
    };

    return (
        <div>
            <header className="mb-4">
                <h1 className="h3 text-uppercase mb-2">My Proposals</h1>
                <p className="text-secondary small">Track the lifecycle of your submitted auto insurance applications.</p>
            </header>

            <div className="bg-white border rounded-3 shadow-sm overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light text-uppercase small">
                            <tr>
                                <th className="px-4 py-3">Proposal ID</th>
                                <th className="px-4 py-3">Policy Name</th>
                                <th className="px-4 py-3">Vehicle</th>
                                <th className="px-4 py-3">Model</th>
                                <th className="px-4 py-3">Submitted At</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-end">Details</th>
                            </tr>
                        </thead>
                        <tbody className="small">
                            {proposalsList.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center text-muted italic p-4">
                                        No proposals found. Click "Apply for Policy" in the sidebar to start a new application.
                                    </td>
                                </tr>
                            ) : (
                                proposalsList.map(p => (
                                    <tr key={p.proposalId}>
                                        <td className="px-4 py-3 font-monospace fw-bold">{p.proposalId}</td>
                                        <td className="px-4 py-3 fw-bold">{p.policyName}</td>
                                        <td className="px-4 py-3 text-secondary font-monospace">{p.vehicleNumber}</td>
                                        <td className="px-4 py-3 text-secondary">{p.vehicleModel} — {p.manufacturer}</td>
                                        <td className="px-4 py-3 text-secondary">{p.submittedAt ? new Date(p.submittedAt).toLocaleDateString() : '—'}</td>
                                        <td className="px-4 py-3">
                                            <span className={`badge ${getStatusBadgeClass(p.status)} text-uppercase`}>
                                                {p.status?.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-end">
                                            <button 
                                                onClick={() => navigate(`/customer/policies/${p.proposalId}`)} 
                                                className="btn btn-sm btn-outline-dark text-uppercase fw-bold"
                                            >
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
    );
}
