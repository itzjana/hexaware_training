import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import { useSelector } from 'react-redux';

export default function VehicleFormModal({ show, onClose, onSuccess, editVehicle }) {
    const { showToast } = useApp();

    // Form states
    const [VehicleCategory, setVehicleCategory] = useState('')
    const [RegistrationNumber, setRegistrationNumber] = useState('')
    const [ChassisNumber, setChassisNumber] = useState('')
    const [EngineNumber, setEngineNumber] = useState('')
    const [Manufacturer, setManufacturer] = useState('')
    const [Model, setModel] = useState('')
    const [Variant, setVariant] = useState('')
    const [ManufactureYear, setManufactureYear] = useState('')
    const [RegistrationDate, setRegistrationDate] = useState('')
    const [FuelType, setFuelType] = useState('')
    const [EngineCapacityCc, setEngineCapacityCc] = useState('')
    const [SeatingCapacity, setSeatingCapacity] = useState('')
    const [VehicleUsage, setVehicleUsage] = useState('')
    const [ExShowroomPrice, setExShowroomPrice] = useState('')
    const [CurrentIdv, setCurrentIdv] = useState('')
    const [OwnerCount, setOwnerCount] = useState('')
    const [VehicleCondition, setVehicleCondition] = useState('')
    const [CurrentOdometerKm, setCurrentOdometerKm] = useState('')
    const [ModifiedVehicle, setModifiedVehicle] = useState(false)
    const [AccidentHistory, setAccidentHistory] = useState(false)
    const [AccidentCount, setAccidentCount] = useState('')
    const [PreviousInsurer, setPreviousInsurer] = useState('')
    const [PreviousPolicyNumber, setPreviousPolicyNumber] = useState('')
    const [PreviousPolicyExpiryDate, setPreviousPolicyExpiryDate] = useState('');
    const [NoClaimBonusPercentage, setNoClaimBonusPercentage] = useState('')
    const [documentPath, setDocumentPath] = useState('')
    const [file, setFile] = useState(null)

    const enums = useSelector(state => state.enums)

    useEffect(() => {
        if (show) {
            if (editVehicle) {
                setVehicleCategory(editVehicle.category)
                setRegistrationNumber(editVehicle.registrationNumber)
                setChassisNumber(editVehicle.chassisNumber)
                setEngineNumber(editVehicle.engineNumber)
                setManufacturer(editVehicle.manufacturer)
                setModel(editVehicle.model)
                setVariant(editVehicle.variant)
                setManufactureYear(editVehicle.manufactureYear)
                setRegistrationDate(editVehicle.registrationDate)
                setFuelType(editVehicle.fuelType)
                setEngineCapacityCc(editVehicle.engineCapacityCc)
                setSeatingCapacity(editVehicle.seatingCapacity)
                setVehicleUsage(editVehicle.usage)
                setExShowroomPrice(editVehicle.exShowroomPrice)
                setCurrentIdv(editVehicle.currentIdv)
                setOwnerCount(editVehicle.ownerCount)
                setVehicleCondition(editVehicle.condition)
                setCurrentOdometerKm(editVehicle.currentOdometerKm)
                setModifiedVehicle(editVehicle.modifiedVehicle)
                setAccidentHistory(editVehicle.accidentHistory)
                setAccidentCount(editVehicle.accidentCount)
                setPreviousInsurer(editVehicle.previousInsurer)
                setPreviousPolicyNumber(editVehicle.previousPolicyNumber)
                setPreviousPolicyExpiryDate(editVehicle.previousPolicyExpiryDate)
                setNoClaimBonusPercentage(editVehicle.noClaimBonusPercentage)
                setDocumentPath(editVehicle.documentPath)
            } else {
                setVehicleCategory()
                setRegistrationNumber()
                setChassisNumber()
                setEngineNumber()
                setManufacturer()
                setModel()
                setVariant()
                setManufactureYear()
                setRegistrationDate()
                setFuelType()
                setEngineCapacityCc()
                setSeatingCapacity()
                setVehicleUsage()
                setExShowroomPrice()
                setCurrentIdv()
                setOwnerCount()
                setVehicleCondition()
                setCurrentOdometerKm()
                setModifiedVehicle(false)
                setAccidentHistory(false)
                setAccidentCount()
                setPreviousInsurer()
                setPreviousPolicyNumber()
                setPreviousPolicyExpiryDate()
                setNoClaimBonusPercentage()
                setDocumentPath()
            }
            setFile(null);
        }
    }, [editVehicle, show]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!RegistrationNumber.trim() || !ChassisNumber.trim() || !EngineNumber.trim()) {
            showToast("Registration, Chassis, and Engine numbers are required.", "warning");
            return;
        }

        if (!editVehicle && !file) {
            showToast("Please upload a vehicle registration or document file.", "warning");
            return;
        }

        const vehicleData = {
            category: VehicleCategory,
            registrationNumber: RegistrationNumber,
            chassisNumber: ChassisNumber,
            engineNumber: EngineNumber,
            manufacturer: Manufacturer,
            model: Model,
            variant: Variant,
            manufactureYear: ManufactureYear,
            registrationDate: RegistrationDate,
            fuelType: FuelType,
            engineCapacityCc: EngineCapacityCc,
            seatingCapacity: SeatingCapacity,
            usage: VehicleUsage,
            exShowroomPrice: ExShowroomPrice,
            currentIdv: CurrentIdv,
            ownerCount: OwnerCount,
            condition: VehicleCondition,
            currentOdometerKm: CurrentOdometerKm,
            modifiedVehicle: ModifiedVehicle,
            accidentHistory: AccidentHistory,
            accidentCount: AccidentCount,
            previousInsurer: PreviousInsurer,
            previousPolicyNumber: PreviousPolicyNumber,
            previousPolicyExpiryDate: PreviousPolicyExpiryDate,
            noClaimBonusPercentage: NoClaimBonusPercentage
        };

        const formData = new FormData();

        if (file) {
            formData.append("file", file);
        }

        formData.append(
            "vehicle",
            new Blob(
                [JSON.stringify(vehicleData)],
                { type: "application/json" }
            )
        );

        const config = {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        };

        try {
            if (editVehicle) {
                await axios.patch(`http://localhost:8080/api/vehicles/update/${editVehicle.id}`, formData, config);
                showToast("Vehicle updated successfully!", "success");
            } else {
                await axios.post('http://localhost:8080/api/vehicles/add', formData, config);
                showToast("Vehicle registered successfully!", "success");
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            showToast(error.response?.data?.message || "Failed to save vehicle details.", "error");
        }
    };

    if (!show) return null;

    return (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-xl modal-dialog-scrollable">
                <div className="modal-content shadow">
                    <div className="modal-header border-bottom">
                        <h5 className="modal-title fw-black text-uppercase text-primary">
                            {editVehicle ? "Edit Vehicle Details" : "Register New Vehicle"}
                        </h5>
                        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                    </div>
                    <div className="modal-body p-4 p-md-5">
                        <form id="vehicleFormModal" onSubmit={handleSubmit}>
                            {/* Section 1: Registration Details */}
                            <div className="mb-4">
                                <h6 className="text-uppercase text-secondary fw-bold mb-3 small tracking-wide">1. Registration Details</h6>
                                <div className="row g-3">
                                    <div className="col-md-4">
                                        <label className="form-label small fw-bold text-uppercase">Registration Number *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="e.g. MH01AA1234"
                                            value={RegistrationNumber}
                                            onChange={(e) => setRegistrationNumber(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label small fw-bold text-uppercase">Chassis Number *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter chassis identifier"
                                            value={ChassisNumber}
                                            onChange={(e) => setChassisNumber(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label small fw-bold text-uppercase">Engine Number *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter engine identifier"
                                            value={EngineNumber}
                                            onChange={(e) => setEngineNumber(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold text-uppercase">Registration Date *</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={RegistrationDate}
                                            onChange={(e) => setRegistrationDate(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold text-uppercase">Manufacture Year *</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="e.g. 2023"
                                            min="1950"
                                            max={new Date().getFullYear() + 1}
                                            value={ManufactureYear}
                                            onChange={(e) => setManufactureYear(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Make & Specifications */}
                            <div className="mb-4 pt-2">
                                <h6 className="text-uppercase text-secondary fw-bold mb-3 small tracking-wide">2. Make & Specifications</h6>
                                <div className="row g-3">
                                    <div className="col-md-4">
                                        <label className="form-label small fw-bold text-uppercase">Vehicle Category *</label>
                                        <select
                                            className="form-select"
                                            value={VehicleCategory}
                                            onChange={(e) => setVehicleCategory(e.target.value)}
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            {enums?.enumslist?.vehicleCategories?.map((category, idex) => (
                                                <option value={category} key={idex}>{category.replace("_", " ")}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label small fw-bold text-uppercase">Fuel Type *</label>
                                        <select
                                            className="form-select"
                                            value={FuelType}
                                            onChange={(e) => setFuelType(e.target.value)}
                                            required
                                        >
                                            <option value="">Select Fuel Type</option>
                                            {enums?.enumslist?.fuelTypes?.map((fuelType, idex) => (
                                                <option value={fuelType} key={idex}>{fuelType.replace("_", " ")}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label small fw-bold text-uppercase">Vehicle Usage *</label>
                                        <select
                                            className="form-select"
                                            value={VehicleUsage}
                                            onChange={(e) => setVehicleUsage(e.target.value)}
                                            required
                                        >
                                            <option value="">Select Usage</option>
                                            {enums?.enumslist?.vehicleUsages?.map((usage, idex) => (
                                                <option value={usage} key={idex}>{usage.replace("_", " ")}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label small fw-bold text-uppercase">Manufacturer *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="e.g. Maruti Suzuki, Honda"
                                            value={Manufacturer}
                                            onChange={(e) => setManufacturer(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label small fw-bold text-uppercase">Model *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="e.g. Swift, Civic"
                                            value={Model}
                                            onChange={(e) => setModel(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label small fw-bold text-uppercase">Variant *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="e.g. VXI, VTEC"
                                            value={Variant}
                                            onChange={(e) => setVariant(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold text-uppercase">Engine Capacity (CC) *</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="e.g. 1197"
                                            value={EngineCapacityCc}
                                            onChange={(e) => setEngineCapacityCc(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold text-uppercase">Seating Capacity *</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="e.g. 5"
                                            value={SeatingCapacity}
                                            onChange={(e) => setSeatingCapacity(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Value & Condition */}
                            <div className="mb-4 pt-2">
                                <h6 className="text-uppercase text-secondary fw-bold mb-3 small tracking-wide">3. Valuation, Odometer & Condition</h6>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold text-uppercase">Ex-Showroom Price (₹) *</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Total purchase value"
                                            value={ExShowroomPrice}
                                            onChange={(e) => setExShowroomPrice(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold text-uppercase">Current IDV (₹) *</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Declared value for policy"
                                            value={CurrentIdv}
                                            onChange={(e) => setCurrentIdv(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label small fw-bold text-uppercase">Owner Count *</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="0 for new"
                                            value={OwnerCount}
                                            onChange={(e) => setOwnerCount(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label small fw-bold text-uppercase">Odometer Reading (KM) *</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Total mileage"
                                            value={CurrentOdometerKm}
                                            onChange={(e) => setCurrentOdometerKm(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label small fw-bold text-uppercase">Vehicle Condition *</label>
                                        <select
                                            className="form-select"
                                            value={VehicleCondition}
                                            onChange={(e) => setVehicleCondition(e.target.value)}
                                            required
                                        >
                                            <option value="">Select Condition</option>
                                            {enums?.enumslist?.vehicleConditions?.map((condition, idex) => (
                                                <option value={condition} key={idex}>{condition.replace("_", " ")}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-check form-switch pt-2">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="modalModifiedVehicleSwitch"
                                                checked={ModifiedVehicle}
                                                onChange={(e) => setModifiedVehicle(e.target.checked)}
                                            />
                                            <label className="form-check-label small fw-bold text-uppercase" htmlFor="modalModifiedVehicleSwitch">
                                                Is this a modified vehicle? (e.g. custom parts)
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 4: Claims & Prior Policy Details */}
                            <div className="mb-4 pt-2">
                                <h6 className="text-uppercase text-secondary fw-bold mb-3 small tracking-wide">4. History & Previous Insurer Details</h6>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <div className="form-check form-switch pt-2">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="modalAccidentHistorySwitch"
                                                checked={AccidentHistory}
                                                onChange={(e) => setAccidentHistory(e.target.checked)}
                                            />
                                            <label className="form-check-label small fw-bold text-uppercase" htmlFor="modalAccidentHistorySwitch">
                                                Does the vehicle have accident history?
                                            </label>
                                        </div>
                                    </div>
                                    {AccidentHistory && (
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold text-uppercase">Accident Count</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Number of accidents"
                                                value={AccidentCount}
                                                onChange={(e) => setAccidentCount(e.target.value)}
                                            />
                                        </div>
                                    )}
                                    <div className="col-md-4">
                                        <label className="form-label small fw-bold text-uppercase">Previous Insurer</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Insurer Company Name"
                                            value={PreviousInsurer}
                                            onChange={(e) => setPreviousInsurer(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label small fw-bold text-uppercase">Previous Policy Number</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Policy Identification No"
                                            value={PreviousPolicyNumber}
                                            onChange={(e) => setPreviousPolicyNumber(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label small fw-bold text-uppercase">Previous Expiry Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={PreviousPolicyExpiryDate}
                                            onChange={(e) => setPreviousPolicyExpiryDate(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold text-uppercase">No-Claim Bonus % (NCB)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="e.g. 20"
                                            min="0"
                                            max="100"
                                            value={NoClaimBonusPercentage}
                                            onChange={(e) => setNoClaimBonusPercentage(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 5: Vehicle Documents Upload */}
                            <div className="mb-4 pt-2">
                                <h6 className="text-uppercase text-secondary fw-bold mb-3 small tracking-wide">5. Document Verification Upload</h6>
                                <div className="row g-3">
                                    <div className="col-12">
                                        <label className="form-label small fw-bold text-uppercase">Registration Certificate / Document *</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            onChange={(e) => setFile(e.target.files[0])}
                                            required={!editVehicle}
                                        />
                                        <div className="form-text text-muted">Upload vehicle registration certificate (PDF or Image).</div>
                                    </div>
                                    {editVehicle && documentPath && (
                                        <div className="bg-white border rounded-3 p-4 mb-4 shadow-sm">
                                            <h5 className="text-uppercase fw-bold small mb-3 pb-2 border-bottom">
                                                <i className="bi bi-file-earmark me-2 text-primary"></i>
                                                Uploaded Documents
                                            </h5>

                                            <div className="d-flex flex-column gap-2">
                                               
                                                    <div className="d-flex justify-content-between align-items-center border rounded p-2">
                                                        <span className="text-truncate me-3">
                                                            <i className="bi bi-file-earmark-text me-2"></i> {documentPath}
                                                        </span>
                                                        <a href={`/assets/${documentPath}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                                                            <i className="bi bi-eye me-1"></i> View
                                                        </a>
                                                    </div>

                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer border-top p-3 bg-light">
                        <button type="button" className="btn btn-outline-secondary text-uppercase fw-bold px-4" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" form="vehicleFormModal" className="btn btn-primary text-uppercase fw-bold px-5">
                            {editVehicle ? "Save Changes" : "Register Vehicle"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
