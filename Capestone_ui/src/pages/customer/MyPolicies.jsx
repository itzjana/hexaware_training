import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCustomerProposals } from '../../store/action/proposalAction';

export default function MyPolicies() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { proposalsList } = useSelector(state => state.proposals);

    // Policies are proposals with status ACTIVE, EXPIRED, or CANCELLED
    const policies = proposalsList.filter(p =>
        p.status === 'ACTIVE' || p.status === 'EXPIRED' || p.status === 'CANCELLED'
    );

    useEffect(() => {
        dispatch(getCustomerProposals());
    }, [dispatch]);

    return (
        <div>
            <header className="mb-4">
                <h1 className="h3 text-uppercase mb-2">My Policies</h1>
                <p className="text-secondary small">View and download your active, expired, and renewed auto insurance policies.</p>
            </header>

            <div className="bg-white border rounded-3 shadow-sm overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light text-uppercase small">
                            <tr>
                                <th className="px-4 py-3">Policy ID</th>
                                <th className="px-4 py-3">Coverage Name</th>
                                <th className="px-4 py-3">Vehicle</th>
                                <th className="px-4 py-3">Model</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-end">Details</th>
                            </tr>
                        </thead>
                        <tbody className="small">
                            {policies.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center text-muted italic p-4">
                                        No active policy coverages on file. Apply for a policy to get covered.
                                    </td>
                                </tr>
                            ) : (
                                policies.map(p => (
                                    <tr key={p.proposalId}>
                                        <td className="px-4 py-3 font-monospace fw-bold">{p.proposalId}</td>
                                        <td className="px-4 py-3 fw-bold">{p.policyName}</td>
                                        <td className="px-4 py-3 text-secondary font-monospace">{p.vehicleNumber}</td>
                                        <td className="px-4 py-3 text-secondary">{p.vehicleModel} — {p.manufacturer}</td>
                                        <td className="px-4 py-3">
                                            <span className={`badge ${
                                                p.status === 'ACTIVE' ? 'bg-success' :
                                                p.status === 'RENEWED' ? 'bg-info text-dark' :
                                                'bg-secondary'
                                            } text-uppercase`}>
                                                {p.status}
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
