import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import axios from 'axios';

// id: 1, name: "test1", additionalCost: 1, description: "teste", status: true

export default function AddonForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showToast } = useApp();

    const isEditMode = !!id;

    // Form states
    const [name, setName] = useState()
    const [description, setDescription] = useState()
    const [cost, setCost] = useState()
    const [status, setStatus] = useState(false)

    const config = {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        }
    };

    const getByIDApi = `http://localhost:8080/api/addon/by-id/${id}`;
    const insertApi = 'http://localhost:8080/api/addon/insert';
    const updateApi = `http://localhost:8080/api/addon/update/${id}`;

    const handleGetAddonByID = async () => {
        try {
            const res = await axios.get(getByIDApi, config);
            if (res.data) {
                setName(res.data.name)
                setDescription(res.data.description)
                setCost(res.data.additionalCost)
                setStatus(res.data.status)
            }
        } catch (error) {
            console.error(error);
            showToast("Failed to load addon details", "error");
            navigate('/admin/addons');
        }
    };

    useEffect(() => {
        if (isEditMode) {
            handleGetAddonByID();
        }
    }, [id, isEditMode]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const addonData = {
            id: isEditMode ? parseInt(id) : undefined,
            name: name.trim(),
            description: description.trim(),
            additionalCost: parseFloat(cost),
            active: Boolean(status)
        };

        try {
            if (isEditMode) {
                await axios.patch(updateApi, addonData, config);
            }
            else {
                await axios.post(insertApi, addonData, config);
            }
            showToast(
                isEditMode ? "Addon template updated successfully!" : "Addon template created successfully!",
                "success"
            );
            navigate('/admin/addons');
        } catch (err) {
            console.error(err);
            showToast(err.response?.data?.message, "error");
        }
    };

    return (
        <div className="container py-2" style={{ maxWidth: '600px' }}>
            <header className="mb-4 d-flex align-items-center gap-3">
                <button
                    onClick={() => navigate('/admin/addons')}
                    className="btn btn-outline-dark btn-sm rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: '36px', height: '36px' }}
                    type="button"
                >
                    <i className="bi bi-arrow-left"></i>
                </button>
                <div>
                    <h1 className="h3 text-uppercase m-0">{isEditMode ? "Edit Addon" : "Create Addon"}</h1>
                    <p className="text-secondary small m-0">
                        {isEditMode ? `Modify details for addon ID: ${id}` : "Configure a new optional policy addon package"}
                    </p>
                </div>
            </header>

            <div className="bg-white border rounded-3 p-4 p-md-5 shadow-sm">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="form-label small fw-bold text-uppercase">Addon Name *</label>
                        <input
                            type="text"
                            className="form-control form-control-lg"
                            placeholder="e.g. Zero Depreciation Shield"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label small fw-bold text-uppercase">Description *</label>
                        <textarea
                            className="form-control"
                            rows="4"
                            placeholder="Describe benefit conditions, coverage details, and payout terms..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    <div className="mb-4">
                        <label className="form-label small fw-bold text-uppercase">Annual Cost (₹) *</label>
                        <div className="input-group input-group-lg">
                            <span className="input-group-text bg-light">₹</span>
                            <input
                                min={0.1}
                                type="number"
                                className="form-control"
                                placeholder="0.00"
                                step="0.01"
                                value={cost}
                                onChange={(e) => setCost(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-text text-muted">Additional yearly charge if selected by a customer.</div>
                    </div>

                    {
                        //if edit mode show a checkbox to toggle the addon
                        isEditMode && (
                            <div className="mb-4">
                                <label className="form-label small fw-bold text-uppercase">Status</label>
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        id="addonActiveToggle"
                                        type="checkbox"
                                        checked={Boolean(status)}
                                        onChange={(e) => setStatus(e.target.checked)}
                                    />
                                    <label className="form-check-label" htmlFor="addonActiveToggle">
                                        {status ? 'Active' : 'Inactive'}
                                    </label>
                                </div>
                            </div>
                        )
                    }

                    <div className="d-flex justify-content-end gap-3 pt-3 border-top">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/addons')}
                            className="btn btn-outline-secondary text-uppercase fw-bold px-4 py-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary text-uppercase fw-bold px-5 py-2 shadow-sm"
                        >
                            {isEditMode ? "Save Changes" : "Create Addon"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
