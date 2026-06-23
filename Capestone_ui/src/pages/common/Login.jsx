import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import axios from 'axios';
import { useDispatch } from 'react-redux';

const Login = () => {
    const { login, showToast } = useApp();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [emailOrUser, setEmailOrUser] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const loginApi = 'http://localhost:8080/api/auth/login'

    const config = {
        headers: {
            Authorization: "Basic " + window.btoa(emailOrUser + ":" + password),
        },
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!emailOrUser || !password) {
            setError('Please enter both email/username and password.');
            return;
        }

        try {
            const response = await axios.get(loginApi, config)
            let token = response.data.token
            let username = response.data.username
            let role = response.data.role
            localStorage.setItem("token", token)
            localStorage.setItem("username", username)
            localStorage.setItem("role", role)

            login(response.data);

            showToast(`Welcome back, ${username}!`, "success");

            // Redirect based on role
            if (role === 'ADMIN') {
                navigate('/admin/dashboard');
            } else if (role === 'INSURANCE_OFFICER') {
                navigate('/officer/dashboard');
            } else {
                navigate('/customer/dashboard');
            }

        } catch (err) {
            setError(err.message);
            showToast("Login failed.", "error");
        }


    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <div className="premium-card shadow-sm border overflow-hidden">
                        <div className="row g-0">
                            {/* Visual Left Panel */}
                            <div className="col-md-6 bg-light p-5 d-flex flex-column justify-content-between border-end">
                                <div>
                                    <h1 className="h2 text-uppercase mb-3">Secure Access Portal</h1>
                                    <p className="text-secondary small">
                                        Manage policies, file claims, and monitor coverage through our centralized system.
                                    </p>
                                </div>
                                <div className="wireframe-placeholder rounded border p-5 my-4 text-center">
                                    <i className="bi bi-shield-lock-fill text-secondary opacity-50 display-1"></i>
                                </div>
                                <div className="small text-muted">
                                    Protected by 256-bit encryption.
                                </div>
                            </div>

                            {/* Form Right Panel */}
                            <div className="col-md-6 p-5">
                                <div className="mb-4">
                                    <h2 className="h4 text-uppercase m-0">Member Login</h2>
                                    <div className="bg-primary mt-2" style={{ height: '3px', width: '40px' }}></div>
                                </div>

                                {error && (
                                    <div className="alert alert-danger p-2 small d-flex align-items-center gap-2 mb-3">
                                        <i className="bi bi-exclamation-triangle-fill"></i>
                                        <span>{error}</span>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="needs-validation">
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-uppercase">Email / Username</label>
                                        <input
                                            type="text"
                                            className="form-control rounded-2 p-2"
                                            placeholder="name@autoguard.com"
                                            value={emailOrUser}
                                            onChange={(e) => setEmailOrUser(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                            <label className="form-label small fw-bold text-uppercase mb-0">Password</label>
                                            <a href="#" className="small text-secondary text-decoration-underline">Forgot Password?</a>
                                        </div>
                                        <div className="input-group">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                className="form-control rounded-start-2 p-2"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mb-4 form-check">
                                        <input type="checkbox" className="form-check-input" id="rememberMe" />
                                        <label className="form-check-label small text-muted text-uppercase" htmlFor="rememberMe">Remember Me</label>
                                    </div>

                                    <button type="submit" className="btn btn-primary w-100 py-2 text-uppercase fw-bold rounded-2 d-flex align-items-center justify-content-center gap-2">
                                        <span>Login Securely</span>
                                        <i className="bi bi-arrow-right"></i>
                                    </button>

                                    <div className="mt-4 text-center">
                                        <span className="text-muted small">New to AutoGuard? </span>
                                        <Link to="/register" className="small text-primary fw-bold text-decoration-underline text-uppercase ms-1">Register Here</Link>
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


export default Login