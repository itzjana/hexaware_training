import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import axios from 'axios';
import { useSelector } from 'react-redux';

export default function OnboardOfficer() {
    const { showToast } = useApp()
    const navigate = useNavigate()
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [username, setUsername] = useState()
    const [jobTitle, setJobTitle] = useState()
    const [error, setError] = useState('')

    const onBoardApi = 'http://localhost:8080/api/auth/officer/signup'

    const config = {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
    };

    const enums = useSelector(state => state.enums)
    console.log(enums)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try{
            const response = await axios.post(onBoardApi,{username:username,email:email,name:name,jobTitle:jobTitle},config)
            if(response.status == 200){
                showToast("Officer onboarded successfully", "success")
                navigate('/admin/dashboard')
            }
        }
        catch(err){
            if(err.response.data.jobTitle){
                showToast(err.response.data.jobTitle, "error")
            }
            if(err.response.data.username)
                showToast(err.response.data.username, "error")
            if(err.response.data.name)
                showToast(err.response.data.name, "error")
            if(err.response.data.email)
                showToast(err.response.data.email, "error")
            if(err.response.data.message){
            showToast(err.response.data.message, "error")
            }
        }
    };

    return (
        <div className="row justify-content-center">
            <div className="col-lg-8">
                <div className="premium-card p-5 bg-white border shadow-sm">
                    <header className="mb-4">
                        <h2 className="h4 text-uppercase m-0">Onboard Insurance Officer</h2>
                        <div className="bg-primary mt-2" style={{ height: '3px', width: '40px' }}></div>
                    </header>

                    {error && (
                        <div className="alert alert-danger p-2 small d-flex align-items-center gap-2 mb-4">
                            <i className="bi bi-exclamation-triangle-fill"></i>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="row g-3">
                        <div className="col-12">
                            <label className="form-label small fw-bold text-uppercase">Officer Full Name</label>
                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                placeholder="e.g. Officer Marcus T."
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label small fw-bold text-uppercase">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                placeholder="name@autoguard.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label small fw-bold text-uppercase">Username</label>
                            <input
                                type="text"
                                name="username"
                                className="form-control"
                                placeholder="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label small fw-bold text-uppercase">Job Title / Designation</label>
                            <select
                                name="jobTitle"
                                className="form-select"
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                            >
                                <option value="">Select Job Title</option>
                                {enums?.enumslist?.jobTitles?.map((jobTitle, idex) => (
                                    <option value={jobTitle} key={idex}>{jobTitle.replace("_", " ")}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-12 pt-3">
                            <button type="submit" className="btn btn-primary text-uppercase fw-bold py-3 w-100">
                                Register Officer Account
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
