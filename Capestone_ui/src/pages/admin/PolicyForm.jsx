import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import axios from 'axios';
import { useSelector } from 'react-redux';

export default function PolicyForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showToast } = useApp();

    

    const isEditMode = !!id;

    const getByIDApi = `http://localhost:8080/api/insurance/getbyid/${id}`
    const addApi = 'http://localhost:8080/api/insurance/insert'
    const updateApi = `http://localhost:8080/api/insurance/update/${id}`
    const config = {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        }
    }

    const [policyName, setPolicyName] = useState()
    const [description, setDescription] = useState()
    const [baseRate, setBaseRate] = useState()
    const [validityMonths, setValidityMonths] = useState()
    const [vehicleUsage, setVehicleUsage] = useState()
    const [vehicleCategory, setVehicleCategory] = useState()
    const [fuelType, setFuelType] = useState()
    const [active, setActive] = useState()

    const enums = useSelector(state => state.enums)

    
    const handlegetPolicyByID = async () => {
        try {
            const res = await axios.get(getByIDApi)
            console.log(res.data)
            setPolicyName(res.data.policyName)
            setDescription(res.data.description)
            setBaseRate(res.data.baseRate)
            setValidityMonths(res.data.validityMonths)
            setVehicleUsage(res.data.vehicleUsage)
            setVehicleCategory(res.data.vehicleCategory)
            setFuelType(res.data.fuelType)
            setActive(res.data.active)
        } catch (error) {
            console.log(error);
            showToast("Failed to load policy", "error");
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const policyData = {
            id: isEditMode ? id : undefined,
            policyName: policyName,
            description: description,
            baseRate: baseRate,
            validityMonths: validityMonths,
            vehicleUsage: vehicleUsage,
            vehicleCategory: vehicleCategory,
            fuelType: fuelType,
            active: active
        };

        console.log(policyData);

        try {
            if (isEditMode) {
                const response = await axios.put(updateApi, policyData, config)
                console.log(response.data);

                showToast("Policy updated successfully", "success")
                navigate('/admin/policies')
            } else {
                const response = await axios.post(addApi, policyData, config)
                console.log(response.data);

                showToast("Policy created successfully", "success")
                navigate('/admin/policies')
            }
        } catch (err) {
            showToast(err.response.data.message, "error")
        }
        showToast(
            isEditMode ? "Policy template updated successfully!" : "Policy template created successfully!",
            "success"
        )
        navigate('/admin/policies')
    };

    useEffect(() => {
        if (isEditMode) {
            handlegetPolicyByID();
        }
    }, [id, isEditMode]);

    return (
        <div className="container py-2" style={{ maxWidth: '750px' }}>
            <header className="mb-4 d-flex align-items-center gap-3">
                <button
                    onClick={() => navigate('/admin/policies')}
                    className="btn btn-outline-dark btn-sm rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: '36px', height: '36px' }}
                    type="button"
                >
                    <i className="bi bi-arrow-left"></i>
                </button>
                <div>
                    <h1 className="h3 text-uppercase m-0">{isEditMode ? "Edit Policy" : "Create Policy"}</h1>
                    <p className="text-secondary small m-0">
                        {isEditMode ? `Modify details for policy ID: ${id}` : "Configure a new standard insurance policy template"}
                    </p>
                </div>
            </header>

            <div className="bg-white border rounded-3 p-4 p-md-5 shadow-sm">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="form-label small fw-bold text-uppercase">Policy Name *</label>
                        <input
                            type="text"
                            className="form-control form-control-lg"
                            placeholder="e.g. Comprehensive Protection Plus"
                            value={policyName}
                            onChange={(e) => setPolicyName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label small fw-bold text-uppercase">Description *</label>
                        <textarea
                            className="form-control"
                            rows="4"
                            placeholder="Provide a comprehensive summary of coverage details, key features, limits, etc."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    <div className="row g-4 mb-4">
                        <div className="col-md-6">
                            <label className="form-label small fw-bold text-uppercase">Base Rate (₹) *</label>
                            <div className="input-group input-group-lg">
                                <span className="input-group-text bg-light">₹</span>
                                <input
                                    min={0.1}
                                    type="number"
                                    className="form-control"
                                    placeholder="0.00"
                                    step="0.01"
                                    value={baseRate}
                                    onChange={(e) => setBaseRate(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-text text-muted">Annual baseline cost for this policy.</div>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label small fw-bold text-uppercase">Validity Months *</label>
                            <div className="input-group input-group-lg">
                                <input
                                    min={1}
                                    type="number"
                                    className="form-control"
                                    placeholder="12"
                                    step="1"
                                    value={validityMonths}
                                    onChange={(e) => setValidityMonths(e.target.value)}
                                    required
                                />
                                <span className="input-group-text bg-light">Months</span>
                            </div>
                            <div className="form-text text-muted">Duration of policy coverage in months.</div>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label small fw-bold text-uppercase">Vehicle Usage *</label>
                            <select
                                className="form-select form-select-lg"
                                value={vehicleUsage}
                                required
                                onChange={(e) => setVehicleUsage(e.target.value)}
                            >
                                <option value="">--Select--</option>
                                {enums?.enumslist?.vehicleUsages?.map((vehicleUsage,index) => (
                                    <option key={index} value={vehicleUsage}>{vehicleUsage}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label small fw-bold text-uppercase">Vehicle Category *</label>
                        <select
                            className="form-select form-select-lg"
                            value={vehicleCategory}
                            required
                            onChange={(e) => setVehicleCategory(e.target.value)}
                        >
                            <option value="">--Select--</option>
                            {enums?.enumslist?.vehicleCategories?.map((vehicleCategory,index) => (
                                <option key={index} value={vehicleCategory}>{vehicleCategory}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label small fw-bold text-uppercase">Fuel Type *</label>
                        <select
                            className="form-select form-select-lg"
                            value={fuelType}
                            required
                            onChange={(e) => setFuelType(e.target.value)}
                        >
                            <option value="">--Select--</option>
                            {enums?.enumslist?.fuelTypes?.map((fuelType,index) => (
                                <option key={index} value={fuelType}>{fuelType}</option>
                            ))}
                        </select>
                    </div>

                    {
                        //if edit mode show a checkbox to toggle the addon
                        isEditMode && (
                            <div className="mb-4">
                                <label className="form-label small fw-bold text-uppercase">Status</label>
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={active}
                                        onChange={(e) => setActive(e.target.checked)}
                                    />
                                    <label className="form-check-label">
                                        {active ? 'Active' : 'Inactive'}
                                    </label>
                                </div>
                            </div>
                        )
                    }

                    <div className="d-flex justify-content-end gap-3 pt-3 border-top">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/policies')}
                            className="btn btn-outline-secondary text-uppercase fw-bold px-4 py-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary text-uppercase fw-bold px-5 py-2 shadow-sm"
                        >
                            {isEditMode ? "Save Changes" : "Create Policy"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
