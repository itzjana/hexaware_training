import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import axios from 'axios';

export default function Register() {
    const { showToast } = useApp()
    const navigate = useNavigate()
    const [name, setName] = useState()
    const [address, setAddress] = useState()
    const [dob, setDob] = useState()
    const [aadhaarNumber, setAadhaarNumber] = useState()
    const [panNumber, setPanNumber] = useState()
    const [username, setUsername] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [confirmPassword, setConfirmPassword] = useState()
    const [error, setError] = useState();
    const registerApi = 'http://localhost:8080/api/auth/customer/signup'


    const handleSubmit = async (e) => {
        e.preventDefault()
        setError()
        if (username.length < 4) {
            setError('Username must be more than 4 characters.');
            showToast('Username is short.', 'error');
            return;
        }
        else if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            showToast('Password is too short.', 'error');
            return;
        }
        else if (password !== confirmPassword) {
            setError('Passwords do not match. Please verify and try again.');
            showToast('Passwords do not match.', 'error');
            return;
        }
        else {
            const body = {
                name: name,
                address: address,
                dob: dob,
                aadhaarNumber: aadhaarNumber,
                panNumber: panNumber,
                username: username,
                email: email,
                password: password
            }
            try {
                const response = await axios.post(registerApi, body)
                navigate('/login')

            } catch (err) {
                showToast(err.response.data.message, 'error')
            }

        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-lg-12">
                    <div className="premium-card shadow-sm border overflow-hidden">
                        <div className="row g-0">
                            {/* Left Panel: Info */}
                            <div className="col-lg-4 bg-light p-3 d-flex flex-col justify-content-between border-end">
                                <div>
                                    <h1 className="h2 text-uppercase mb-3">Create Account</h1>
                                    <p className="text-secondary small">
                                        Join the most reliable vehicle insurance management ecosystem. Secure your assets with precision-engineered coverage.
                                    </p>
                                </div>

                                <div className="space-y-3 my-4">
                                    <div className="d-flex align-items-start gap-3 p-3 bg-white border rounded">
                                        <i className="bi bi-shield-fill-check text-primary fs-4"></i>
                                        <div>
                                            <div className="small fw-bold text-uppercase">Secure Data Storage</div>
                                            <div className="text-muted small">Your credentials and identities are fully encrypted.</div>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-start gap-3 p-3 bg-white border rounded mt-3">
                                        <i className="bi bi-lightning-charge-fill text-primary fs-4"></i>
                                        <div>
                                            <div className="small fw-bold text-uppercase">Instant Verification</div>
                                            <div className="text-muted small">Automatic validation of DOB and customer details.</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="wireframe-placeholder rounded border p-4 text-center">
                                    <i className="bi bi-car-front-fill text-secondary opacity-50 display-6"></i>
                                </div>
                            </div>

                            {/* Right Panel: Form */}
                            <div className="col-lg-8 p-3">
                                <div className="mb-4">
                                    <h2 className="h4 text-uppercase m-0">Customer Registration</h2>
                                    <div className="bg-primary mt-2" style={{ height: '3px', width: '40px' }}></div>
                                </div>

                                {error && (
                                    <div className="alert alert-danger p-2 small d-flex align-items-center gap-2 mb-4">
                                        <i className="bi bi-exclamation-triangle-fill"></i>
                                        <span>{error}</span>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="row g-3">
                                    {/* Full Name */}
                                    <div className="col-12">
                                        <label className="form-label small fw-bold text-uppercase">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            className="form-control rounded-2 p-2"
                                            placeholder="John Doe"
                                            value={name}
                                            onChange={(e) => { setName(e.target.value) }}
                                            required
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold text-uppercase">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control rounded-2 p-2"
                                            placeholder="john@example.com"
                                            value={email}
                                            onChange={(e) => { setEmail(e.target.value) }}
                                            required
                                        />
                                    </div>

                                    {/* Username */}
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold text-uppercase">Username</label>
                                        <input
                                            type="text"
                                            name="username"
                                            className="form-control rounded-2 p-2"
                                            placeholder="johndoe88"
                                            value={username}
                                            onChange={(e) => { setUsername(e.target.value) }}
                                            required
                                        />
                                    </div>

                                    {/* Password */}
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold text-uppercase">Password</label>
                                        <input
                                            type="password"
                                            name="password"
                                            className="form-control rounded-2 p-2"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => { setPassword(e.target.value) }}
                                            required
                                        />
                                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>Min. 8 characters</span>
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold text-uppercase">Confirm Password</label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            className="form-control rounded-2 p-2"
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => { setConfirmPassword(e.target.value) }}
                                            required
                                        />
                                    </div>

                                    {/* DOB */}
                                    <div className="col-md-4">
                                        <label className="form-label small fw-bold text-uppercase">Date of Birth</label>
                                        <input
                                            type="date"
                                            name="dob"
                                            className="form-control rounded-2 p-2"
                                            value={dob}
                                            onChange={(e) => { setDob(e.target.value) }}
                                            required
                                        />
                                    </div>

                                    {/* Aadhaar */}
                                    <div className="col-md-4">
                                        <label className="form-label small fw-bold text-uppercase">Aadhaar Number</label>
                                        <input
                                            type="text"
                                            name="aadhar"
                                            className="form-control rounded-2 p-2"
                                            maxLength="12"
                                            placeholder="123456789012"
                                            value={aadhaarNumber}
                                            onChange={(e) => { setAadhaarNumber(e.target.value) }}
                                            required
                                        />
                                    </div>

                                    {/* PAN */}
                                    <div className="col-md-4">
                                        <label className="form-label small fw-bold text-uppercase">PAN Number</label>
                                        <input
                                            type="text"
                                            name="pan"
                                            className="form-control rounded-2 p-2"
                                            maxLength="10"
                                            placeholder="ABCDE1234F"
                                            value={panNumber}
                                            onChange={(e) => { setPanNumber(e.target.value) }}
                                            required
                                        />
                                    </div>

                                    {/* Permanent Address */}
                                    <div className="col-12">
                                        <label className="form-label small fw-bold text-uppercase">Permanent Address</label>
                                        <textarea
                                            name="address"
                                            className="form-control rounded-2 p-2"
                                            rows="2"
                                            placeholder="Street, City, State, ZIP"
                                            value={address}
                                            onChange={(e) => { setAddress(e.target.value) }}
                                            required
                                        ></textarea>
                                    </div>

                                    {/* Submit */}
                                    <div className="col-12 pt-3">
                                        <button type="submit" className="btn btn-primary w-100 py-3 text-uppercase fw-bold rounded-2">
                                            Register Account
                                        </button>

                                        <div className="mt-4 text-center">
                                            <span className="text-muted small">Already have an account? </span>
                                            <Link to="/login" className="small text-primary fw-bold text-decoration-underline text-uppercase ms-1">Login Here</Link>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
