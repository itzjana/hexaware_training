import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import axios from 'axios';
import VehicleFormModal from '../../components/VehicleFormModal';

export default function MyVehicles() {
    const { currentUser, showToast } = useApp();
    const [vehicles, setVehicles] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);

    const config = {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        }
    };

    const getAllApi = 'http://localhost:8080/api/vehicles/getbycustomer';

    const loadData = async () => {
        if (!currentUser) return;
        try {
            const res = await axios.get(getAllApi, config);
            setVehicles(res.data);
        } catch (error) {
            console.error(error);
            showToast("Failed to load your vehicle registry.", "error");
        }
    };

    useEffect(() => {
        loadData();
    }, [currentUser]);

    const handleEdit = (v) => {
        setSelectedVehicle(v);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to remove this vehicle? This will delete associated proposals if any.")) {
            try {
                await axios.delete(`http://localhost:8080/api/vehicles/delete/${id}`, config);
                showToast("Vehicle removed from registry successfully.", "success");
                loadData();
            } catch (error) {
                console.error(error);
                showToast(error.response?.data?.message || "Failed to delete vehicle.", "error");
            }
        }
    };

    return (
        <div>
            <header className="mb-4 d-flex justify-content-between align-items-center">
                <div>
                    <h1 className="h3 text-uppercase mb-2">My Vehicles</h1>
                    <p className="text-secondary small m-0">Register and manage vehicles for your insurance proposals.</p>
                </div>
                <button onClick={() => { setSelectedVehicle(null); setShowModal(true); }} className="btn btn-primary text-uppercase fw-bold rounded-2 shadow-sm">
                    <i className="bi bi-plus-circle-fill me-2"></i> Register Vehicle
                </button>
            </header>

            <VehicleFormModal
                show={showModal}
                editVehicle={selectedVehicle}
                onClose={() => { setShowModal(false); setSelectedVehicle(null); }}
                onSuccess={loadData}
            />

            {/* Vehicles Table */}
            <div className="bg-white border rounded-3 shadow-sm overflow-hidden mt-4">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light text-uppercase small">
                            <tr>
                                <th className="px-4 py-3">Vehicle Details</th>
                                <th className="px-4 py-3">Registration No</th>
                                <th className="px-4 py-3">Manufacturer / Model</th>
                                <th className="px-4 py-3">Current IDV</th>
                                <th className="px-4 py-3 text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="small">
                            {vehicles.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center text-muted italic p-4">
                                        No registered vehicles found. Click "Register Vehicle" to add one.
                                    </td>
                                </tr>
                            ) : (
                                vehicles.map((v, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-3">
                                            <div className="d-flex align-items-center gap-2">
                                                <i className={`bi bi-${v.category === 'CAR' ? 'car-front-fill' :
                                                    v.category === 'MOTORCYCLE' ? 'bicycle' :
                                                        v.category === 'TRUCK' ? 'truck' :
                                                            v.category === 'BIKE' ? 'bicycle' : 'car-front'
                                                    } fs-5 text-primary`}></i>
                                                <div>
                                                    <span className="fw-bold d-block">{v.category}</span>
                                                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>ID: {v.id}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-monospace fw-bold text-dark">{v.registrationNumber}</td>
                                        <td className="px-4 py-3">
                                            <span className="fw-bold">{v.manufacturer}</span>
                                            <span className="text-secondary small d-block">{v.model} ({v.variant})</span>
                                        </td>
                                        <td className="px-4 py-3 text-primary fw-bold">
                                            ₹{v.currentIdv ? v.currentIdv.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'}
                                        </td>
                                        <td className="px-4 py-3 text-end">
                                            <div className="d-inline-flex gap-2">
                                                <button onClick={() => handleEdit(v)} className="btn btn-sm btn-outline-dark" title="Edit">
                                                    <i className="bi bi-pencil"></i>
                                                </button>
                                                <button onClick={() => handleDelete(v.id)} className="btn btn-sm btn-outline-danger" title="Delete">
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
