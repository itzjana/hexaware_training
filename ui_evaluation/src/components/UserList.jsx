import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";


// {
//     "id": 1,
//     "name": "Leanne Graham",
//     "username": "Bret",
//     "email": "Sincere@april.biz",
//     "address": {
//       "street": "Kulas Light",
//       "suite": "Apt. 556",
//       "city": "Gwenborough",
//       "zipcode": "92998-3874",
//       "geo": {
//         "lat": "-37.3159",
//         "lng": "81.1496"
//       }
//     },
//     "phone": "1-770-736-8031 x56442",
//     "website": "hildegard.org",
//     "company": {
//       "name": "Romaguera-Crona",
//       "catchPhrase": "Multi-layered client-server neural-net",
//       "bs": "harness real-time e-markets"
//     }
//   },

const UserList = () => {
    const [users, setUsers] = useState([])
    const [errorMsg, setErrorMsg] = useState()
    const [userId,setUserId] = useState(null)

    const api = 'https://jsonplaceholder.typicode.com/users'

    const fetchUser = async () => {
        try {
            const response = await axios.get(api)
            setUsers(response.data)
            setErrorMsg("")
        } catch (err) {
            setErrorMsg("Error fetching users")

        }
    }

    const handleDelete = async (userId) => {
        setUserId(userId)
        const deleteapi = `https://jsonplaceholder.typicode.com/users/${userId}`
        try {
            await axios.delete(deleteapi)
            setUsers(users.filter((user) => user.id !== userId))
            setErrorMsg("")
        } catch (err) {
            setErrorMsg("Error deleting user")
        }
    }

    useEffect(() => {
        fetchUser()
    }, [])

    return (
        <div className="container my-5">

            {userId && (
                <div className="alert alert-danger" role="alert">
                    User deleted successfully
                </div>
            )}
            {
                errorMsg && (
                    <div className="alert alert-danger" role="alert">
                        {errorMsg}
                    </div>
                )
            }
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Id</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Phone</th>
                        <th scope="col">Company Name</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user,index) => (
                        <tr key={index}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            <td>{user.company.name}</td>
                            <td>
                                <button className="btn btn-danger" onClick={() => handleDelete(user.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UserList;