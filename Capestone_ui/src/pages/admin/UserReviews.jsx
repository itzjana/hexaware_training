import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useApp } from '../../context/AppContext';

export default function UserReviews() {
    const { showToast } = useApp();
    const [reviews, setReviews] = useState([]);
    const [selectedReview, setSelectedReview] = useState(null);

    const fetchReviews = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/review/all');
            setReviews(res.data);
        } catch (error) {
            showToast('Failed to fetch reviews.', 'error');
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleViewReview = (r) => {
        setSelectedReview(r);
    };

    return (
        <div>
            <header className="mb-4">
                <h1 className="h3 text-uppercase mb-2">User Reviews Registry</h1>
                <p className="text-secondary small">Browse customer testimonials and ratings submitted by policyholders.</p>
            </header>

            <div className="bg-white border rounded-3 shadow-sm overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light text-uppercase small">
                            <tr>
                                <th className="px-4 py-3">Customer Name</th>
                                <th className="px-4 py-3">Rating</th>
                                <th className="px-4 py-3">Review Feedback</th>
                                <th className="px-4 py-3 text-end">Action</th>
                            </tr>
                        </thead>
                        <tbody className="small">
                            {reviews.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-5 text-muted">
                                        <i className="bi bi-inbox display-4 d-block mb-3 text-black-50"></i>
                                        No reviews submitted yet.
                                    </td>
                                </tr>
                            ) : (
                                reviews.map((r, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-3 fw-bold">{r.name}</td>
                                        <td className="px-4 py-3 text-warning">
                                            {[...Array(5)].map((_, i) => (
                                                <i key={i} className={`bi bi-star${i < r.rating ? '-fill' : ''} me-1`}></i>
                                            ))}
                                        </td>
                                        <td className="px-4 py-3 text-secondary text-truncate" style={{ maxWidth: '400px' }}>
                                            {r.reviewContent}
                                        </td>
                                        <td className="px-4 py-3 text-end">
                                            <button
                                                onClick={() => handleViewReview(r)}
                                                className="btn btn-sm btn-outline-dark"
                                                data-bs-toggle="modal"
                                                data-bs-target="#reviewDetailsModal"
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

            {/* Bootstrap Modal for Review Details */}
            {selectedReview && (
                <div className="modal fade" id="reviewDetailsModal" tabIndex="-1" aria-labelledby="reviewModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content rounded-3">
                            <div className="modal-header border-bottom">
                                <h5 className="modal-title text-uppercase fw-bold" id="reviewModalLabel">Review Details</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body p-4">
                                <div className="d-flex align-items-center gap-3 mb-3">
                                    <div className="bg-light rounded-circle d-flex align-items-center justify-content-center text-primary fw-bold" style={{ width: '48px', height: '48px', fontSize: '1.25rem' }}>
                                        {selectedReview.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="fw-bold">{selectedReview.name}</div>
                                        <div className="text-warning">
                                            {[...Array(5)].map((_, i) => (
                                                <i key={i} className={`bi bi-star${i < selectedReview.rating ? '-fill' : ''} me-1`}></i>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <div className="small fw-bold text-uppercase text-muted mb-2">Review Content:</div>
                                <p className="text-secondary italic">"{selectedReview.reviewContent}"</p>
                            </div>
                            <div className="modal-footer border-top">
                                <button type="button" className="btn btn-dark text-uppercase fw-bold" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}