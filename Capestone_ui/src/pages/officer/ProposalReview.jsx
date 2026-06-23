import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useApp } from '../../context/AppContext'

const OFFICER_STATUS_OPTIONS = [
  { value: 'ADDITIONAL_DETAILS_REQUIRED', label: 'Additional Details Required' },
  { value: 'QUOTE_GENERATED', label: 'Quote Generated' }
]

export default function ProposalReview() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useApp()

  const [proposal, setProposal] = useState(null)
  const [saving, setSaving] = useState(false)
  const [officerRemark, setOfficerRemark] = useState('')
  const [status, setStatus] = useState('')
  const [calculatedAmount, setCalculatedAmount] = useState('')

  // Custom states for calculation utility
  const [calculationResult, setCalculationResult] = useState(null)
  const [useCalculated, setUseCalculated] = useState(true)
  const [showCalcBreakdown, setShowCalcBreakdown] = useState(false)

  // ─── helpers ──────────────────────────────────────────────────────────────

  const config = {
    headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
  }



  const calculateAge = (dob) => {
    if (!dob) return '—'
    const today = new Date()
    const birth = new Date(dob)
    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
    return age
  }

  const statusBadge = (s) => {
    const map = {
      PROPOSAL_SUBMITTED: { label: 'Submitted', cls: 'bg-warning text-dark' },
      UNDER_REVIEW: { label: 'Under Review', cls: 'bg-info text-dark' },
      VERIFIED: { label: 'Verified', cls: 'bg-info text-dark' },
      QUOTE_GENERATED: { label: 'Quote Generated', cls: 'bg-primary' },
      ACTIVE: { label: 'Active', cls: 'bg-success' },
      REJECTED: { label: 'Rejected', cls: 'bg-danger' },
      ADDITIONAL_DETAILS_REQUIRED: { label: 'Info Needed', cls: 'bg-secondary' },
    }
    const badge = map[s] || { label: s, cls: 'bg-dark' }
    return (
      <span className={`badge ${badge.cls} px-3 py-2`} style={{ fontSize: '0.75rem' }}>
        {badge.label}
      </span>
    )
  }

  // ─── data loading ──────────────────────────────────────────────────────────

  const fetchProposal = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/policyproposal/${id}`, config)
      console.log('Proposal API Response:', res.data)
      const p = res.data
      setProposal(p)
      setOfficerRemark(p.officerRemark ?? '')
      setStatus(p.status ?? '')
    } catch (err) {
      console.error(err)
      showToast('Failed to load proposal details.', 'error')
    }
  }

  const fetchCalculatedPremium = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/policyproposal/${id}/calculate-premium`, config)
      setCalculationResult(res.data)
      setCalculatedAmount(res.data.estimatedPremium)
    } catch (err) {
      console.error(err)
      showToast('Failed to calculate premium from backend utility.', 'error')
    }
  }

  useEffect(() => {
    fetchProposal()
  }, [id])

  useEffect(() => {
    if (status === 'QUOTE_GENERATED') {
      fetchCalculatedPremium()
    }
  }, [status, id])

  const handleAdditionalDetails = async () => {
    await axios.patch(`http://localhost:8080/api/officer/proposal/additional-details/${id}`, { officerRemark }, config)
  }

  const handleQuoteGenerated = async () => {
    await axios.post(`http://localhost:8080/api/quote/create`, { proposalId: id, calculatedAmount }, config)
  }

  console.log("Status", status)

  const handleSave = async () => {
    setSaving(true)
    try {
      if (status === 'ADDITIONAL_DETAILS_REQUIRED') {
        await handleAdditionalDetails()
      } else if (status === 'QUOTE_GENERATED') {
        await handleQuoteGenerated()
      }
      showToast('Proposal updated successfully.', 'success')
      fetchProposal()
    } catch (err) {
      console.error(err)
      showToast(err?.response?.data?.message || 'Failed to update proposal.', 'error')
    }
  }

  // ─── sub-components ────────────────────────────────────────────────────────

  const InfoRow = ({ label, value }) => (
    <div className="col-sm-6">
      <div className="text-muted small text-uppercase fw-bold mb-1" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>
        {label}
      </div>
      <div className="fw-semibold">{value ?? '—'}</div>
    </div>
  )

  // ─── derived ───────────────────────────────────────────────────────────────

  const currentStatus = proposal?.status
  const isTerminal = currentStatus === 'ACTIVE' || currentStatus === 'REJECTED' || currentStatus === 'QUOTE_GENERATED'

  // ─── render ────────────────────────────────────────────────────────────────


  // {
  //     "proposalId": 1,
  //     "customerName": "jana",
  //     "customerAddress": "xxchyj",
  //     "customerPan": "sdfghjkytr",
  //     "customerAadhaar": "123456789098",
  //     "dob": "2026-06-17",
  //     "policyName": "Comprensive Insurance",
  //     "policyPrice": 20100.00,
  //     "vehicleNumber": "TN 27 AS 3456",
  //     "manufacturer": "Honda",
  //     "model": "Swift",
  //     "variant": "VXI",
  //     "category": "CAMPER_VAN",
  //     "manufactureYear": 2023,
  //     "registrationDate": "2026-06-15",
  //     "fuelType": "CNG",
  //     "engineCapacityCc": 1197,
  //     "seatingCapacity": 5,
  //     "usage": "PRIVATE",
  //     "currentIdv": 20000.00,
  //     "ownerCount": 1,
  //     "condition": "GOOD",
  //     "currentOdometerKm": 23000,
  //     "modifiedVehicle": false,
  //     "accidentHistory": false,
  //     "accidentCount": null,
  //     "previousInsurer": null,
  //     "noClaimBonusPercentage": null,
  //     "addOns": [
  //         {
  //             "name": "Zero AddOn",
  //             "additionalCost": 10000.00
  //         }
  //     ],
  //     "startDate": "2026-06-17",
  //     "endDate": "2027-06-17",
  //     "officerRemark": null,
  //     "documentPaths": [
  //         "b32228d3-1d49-4389-b92d-4a83a68f577f_image (24).png",
  //         "745676a4-fdc4-428f-888d-135c8a074cd3_image (19).png"
  //     ],
  //     "status": "ACTIVE",
  //     "submittedAt": "2026-06-17T09:39:20.097245Z"
  // }

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <button
            className="btn btn-link text-secondary text-decoration-none p-0 mb-2 small text-uppercase fw-bold"
            onClick={() => navigate('/officer/proposals')}
          >
            <i className="bi bi-arrow-left me-1"></i> Back to Proposals Queue
          </button>
          <h1 className="h3 text-uppercase mb-1">Proposal Review</h1>
          <p className="text-muted small mb-0">
            Underwrite and assess proposal{' '}
            <span className="fw-bold text-primary">#{proposal?.proposalId}</span>
          </p>
        </div>
        <div>{statusBadge(currentStatus)}</div>
      </div>

      <div className="row g-4">
        {/* Left Column */}
        <div className="col-lg-8">

          {/* Proposal Details */}
          <div className="bg-white border rounded-3 p-4 mb-4 shadow-sm">
            <h5 className="text-uppercase fw-bold small mb-3 pb-2 border-bottom">
              <i className="bi bi-file-earmark-text me-2 text-primary"></i>Proposal Details
            </h5>
            <div className="row g-3">
              <InfoRow label="Proposal ID" value={`#${proposal?.proposalId}`} />
              <InfoRow label="Policy Name" value={proposal?.policyName} />
              <InfoRow label="Policy Price" value={proposal?.policyPrice != null ? `₹${Number(proposal.policyPrice).toFixed(2)}` : '—'} />
              <InfoRow label="Submitted On" value={new Date(proposal?.submittedAt).toLocaleDateString()} />
              <InfoRow label="Coverage Start" value={proposal?.startDate} />
              <InfoRow label="Coverage End" value={proposal?.endDate} />

              <div className="col-12">
                <div className="text-muted small text-uppercase fw-bold mb-2" style={{ fontSize: '0.65rem' }}>
                  Add-ons
                </div>
                <div className="d-flex flex-wrap gap-2">
                  {(proposal?.addOns ?? []).map((addon, i) => (
                    <span key={i} className="badge bg-light text-dark border px-3 py-2" style={{ fontSize: '0.7rem' }}>
                      <i className="bi bi-plus-circle me-1"></i>{addon.name} (₹{addon.additionalCost})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white border rounded-3 p-4 mb-4 shadow-sm">
            <h5 className="text-uppercase fw-bold small mb-3 pb-2 border-bottom">
              <i className="bi bi-person me-2 text-primary"></i>Customer Information
            </h5>
            <div className="row g-3">
              <InfoRow label="Full Name" value={proposal?.customerName} />
              <InfoRow label="Aadhaar" value={proposal?.customerAadhaar} />
              <InfoRow label="PAN" value={proposal?.customerPan} />
              <InfoRow label="Date of Birth" value={proposal?.dob} />
              <InfoRow label="Age" value={calculateAge(proposal?.dob)} />
              <InfoRow label="Address" value={proposal?.customerAddress} />
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="bg-white border rounded-3 p-4 mb-4 shadow-sm">
            <h5 className="text-uppercase fw-bold small mb-3 pb-2 border-bottom">
              <i className="bi bi-car-front me-2 text-primary"></i>Vehicle Information
            </h5>
            <div className="row g-3">
              <InfoRow label="Category" value={proposal?.category} />
              <InfoRow label="Registration No." value={proposal?.vehicleNumber} />
              <InfoRow label="Manufacturer" value={proposal?.manufacturer} />
              <InfoRow label="Model" value={proposal?.model} />
              <InfoRow label="Variant" value={proposal?.variant} />
              <InfoRow label="Manufacture Year" value={proposal?.manufactureYear} />
              <InfoRow label="Fuel Type" value={proposal?.fuelType} />
              <InfoRow label="Condition" value={proposal?.condition} />
              <InfoRow label="Usage" value={proposal?.usage} />
              <InfoRow label="Engine (cc)" value={proposal?.engineCapacityCc} />
              <InfoRow label="Seating Capacity" value={proposal?.seatingCapacity} />
              <InfoRow label="Odometer (km)" value={proposal?.currentOdometerKm} />
              <InfoRow label="Owner Count" value={proposal?.ownerCount} />
              <InfoRow label="Current IDV" value={proposal?.currentIdv != null ? `₹${Number(proposal.currentIdv).toFixed(2)}` : '—'} />
              <InfoRow label="Modified Vehicle" value={proposal?.modifiedVehicle ? 'Yes' : 'No'} />
              <InfoRow label="Accident History" value={proposal?.accidentHistory ? 'Yes' : 'No'} />
              {proposal?.accidentHistory && (
                <InfoRow label="Accident Count" value={proposal?.accidentCount} />
              )}
              <InfoRow label="Previous Insurer" value={proposal?.previousInsurer} />
              <InfoRow label="No Claim Bonus (%)" value={proposal?.noClaimBonusPercentage} />
              <InfoRow label="Registration Date" value={proposal?.registrationDate} />
            </div>
          </div>

          {/* Uploaded Documents */}
          <div className="bg-white border rounded-3 p-4 mb-4 shadow-sm">
            <h5 className="text-uppercase fw-bold small mb-3 pb-2 border-bottom">
              <i className="bi bi-file-earmark me-2 text-primary"></i>
              Uploaded Documents
            </h5>

            <div className="d-flex flex-column gap-2">

              <div className="d-flex justify-content-between align-items-center border rounded p-2">
                <span className="text-truncate me-3">
                  <i className="bi bi-file-earmark-text me-2"></i>
                  Vehicle Document
                </span>

                <a
                  href={`/assets/${proposal?.vehiclePath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline-primary"
                >
                  <i className="bi bi-eye me-1"></i>
                  View
                </a>
              </div>

              {(proposal?.documentPaths ?? []).map((path, idx) => {
                const originalName =
                  path.indexOf("_") !== -1
                    ? path.substring(path.indexOf("_") + 1)
                    : path;

                return (
                  <div
                    key={idx}
                    className="d-flex justify-content-between align-items-center border rounded p-2"
                  >
                    <span className="text-truncate me-3">
                      <i className="bi bi-file-earmark-text me-2"></i>
                      {originalName}
                    </span>

                    <a
                      href={`/assets/${path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-primary"
                    >
                      <i className="bi bi-eye me-1"></i>
                      View
                    </a>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Officer Actions */}
        <div className="col-lg-4">
          <div className="bg-white border rounded-3 p-4 shadow-sm sticky-top" style={{ top: '80px' }}>
            <h5 className="text-uppercase fw-bold small mb-3 pb-2 border-bottom">
              <i className="bi bi-pencil-square me-2 text-primary"></i>Officer Actions
            </h5>

            {isTerminal ? (
              <div className="alert alert-secondary small mb-0">
                <i className="bi bi-lock-fill me-2"></i>
                This proposal is <strong>{currentStatus?.replace(/_/g, ' ')}</strong> and requires no further action.
              </div>
            ) : (
              <>
                <div className="mb-3">
                  <label className="form-label small text-uppercase fw-bold text-muted" style={{ fontSize: '0.65rem' }}>
                    Proposal Status
                  </label>
                  <select
                    className="form-select text-uppercase"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    disabled={saving}
                  >
                    <option value="">Select Status</option>
                    {OFFICER_STATUS_OPTIONS.map((opt) => (
                      <option value={opt.value} key={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {status === 'QUOTE_GENERATED' && (
                  <>
                    {/* Calculator Assistant */}
                    {calculationResult && (
                      <div className="mb-3 p-3 rounded-3" style={{ backgroundColor: '#e8f5e9', border: '1px solid #a5d6a7' }}>
                        <div className="d-flex align-items-center mb-2">
                          <i className="bi bi-calculator-fill text-success me-2"></i>
                          <span className="small fw-bold text-uppercase" style={{ fontSize: '0.65rem' }}>
                            Estimated Premium
                          </span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="fw-semibold small text-muted">Calculated Amount:</span>
                          <span className="fw-bold text-success" style={{ fontSize: '1.2rem' }}>
                            ₹{Number(calculationResult.estimatedPremium)?.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Decide: Use suggested or Custom amount */}
                    <div className="mb-3">
                      <label className="form-label small text-uppercase fw-bold text-muted" style={{ fontSize: '0.65rem' }}>
                        Premium Amount Option
                      </label>
                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className={`btn btn-sm flex-fill ${useCalculated ? 'btn-success' : 'btn-outline-secondary'}`}
                          onClick={() => {
                            setUseCalculated(true)
                            if (calculationResult) {
                              setCalculatedAmount(calculationResult.estimatedPremium)
                            }
                          }}
                          disabled={saving}
                        >
                          <i className="bi bi-check-circle-fill me-1"></i>Use Estimated
                        </button>
                        <button
                          type="button"
                          className={`btn btn-sm flex-fill ${!useCalculated ? 'btn-primary' : 'btn-outline-secondary'}`}
                          onClick={() => {
                            setUseCalculated(false)
                            setCalculatedAmount('')
                          }}
                          disabled={saving}
                        >
                          <i className="bi bi-pencil-fill me-1"></i>Custom Amount
                        </button>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small text-uppercase fw-bold text-muted" style={{ fontSize: '0.65rem' }}>
                        Premium Quote Amount (₹)
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        value={calculatedAmount}
                        onChange={(e) => setCalculatedAmount(e.target.value)}
                        disabled={saving || useCalculated}
                        placeholder="Enter premium amount"
                      />
                    </div>
                  </>
                )}

                <div className="mb-4">
                  <label className="form-label small text-uppercase fw-bold text-muted" style={{ fontSize: '0.65rem' }}>
                    Officer Remark / Notes
                  </label>
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Assessment notes, risk remarks..."
                    value={officerRemark}
                    onChange={(e) => setOfficerRemark(e.target.value)}
                    disabled={saving}
                  ></textarea>
                </div>

                {proposal?.officerRemark && (
                  <div className="bg-light border rounded-3 p-3 mb-4">
                    <div className="small text-uppercase fw-bold text-muted mb-1" style={{ fontSize: '0.65rem' }}>
                      Previous Remark
                    </div>
                    <p className="small mb-0">{proposal.officerRemark}</p>
                  </div>
                )}

                <div className="d-grid">
                  <button
                    className="btn btn-primary fw-bold text-uppercase btn-sm py-2"
                    onClick={handleSave}
                    disabled={saving || !status}
                  >
                    Save Review & Status
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
