import { useState } from "react";
import axios from "axios";

const AddUser = () => {
    //name ,email,phone,compnay name
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [company, setCompany] = useState('')
    const [successMsg, setSuccessMsg] = useState('')
    const [errorMsg, setErrorMsg] = useState('')

    const api = 'https://jsonplaceholder.typicode.com/users'



    const handleAddUser = async (e) => {
        e.preventDefault()
        console.log(name, email, phone, company)

        const body = {
            name: name,
            email: email,
            phone: phone,
            company: company,
        }

        try {
            const response = await axios.post(api, body)
            setSuccessMsg("User added successfully", response.data)
            setErrorMsg("")
            setName("")
            setEmail("")
            setPhone("")
            setCompany("")

        } catch (err) {
            setSuccessMsg("")
            setErrorMsg("Error adding user")
        }
    }


    return (
        <div className="vh-100 d-flex align-items-center justify-content-center">
            <div className="col-4">
                {
                    successMsg && (<div className="alert alert-success" role="alert">{successMsg}</div>)
                }

                {
                    errorMsg && (<div className="alert alert-danger" role="alert">{errorMsg}</div>)
                }
                <h1 className="text-center mb-4">Add User</h1>
                <form onSubmit={(e) => handleAddUser(e)}>
                    <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Phone</label>
                        <input type="text" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Company</label>
                        <input type="text" className="form-control" value={company} onChange={(e) => setCompany(e.target.value)} />
                    </div>
                    <input type="submit" value={"Add User"} className="btn btn-primary" />
                </form>
            </div>
        </div>
    )
}
export default AddUser;