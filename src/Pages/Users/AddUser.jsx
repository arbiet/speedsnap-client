import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import { showSuccessAlert, showErrorAlert } from "../../Utils/alertUtils";

export default function AddUser() {
    const { token } = useContext(AppContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });

    const [errors, setErrors] = useState({})

    async function handleAddUser(e) {
        e.preventDefault();
        const res = await fetch('/api/users', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        });
        const data = await res.json();
        
        if (data.errors) {
            setErrors(data.errors)
            showErrorAlert('Failed to Add User', 'Please correct the errors and try again.');
        } else {
            showSuccessAlert('User Added', 'The user has been added successfully!');
            navigate("/users");
        }
    }

    return (
        <>
            <h1 className="text-2xl font-bold">Add New User</h1>
            <form className="w-1/2 mx-auto space-y-6" onSubmit={handleAddUser}>
                <div>
                    <input 
                        type="text" 
                        placeholder="Name" 
                        value={formData.name} 
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                        className="border rounded w-full py-2 px-3"
                    />
                    {errors.name && <p className="text-red-500">{errors.name[0]}</p>}
                </div>
                <div>
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={formData.email} 
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                        className="border rounded w-full py-2 px-3"
                    />
                    {errors.email && <p className="text-red-500">{errors.email[0]}</p>}
                </div>
                <div>
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={formData.password} 
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                        className="border rounded w-full py-2 px-3"
                    />
                    {errors.password && <p className="text-red-500">{errors.password[0]}</p>}
                </div>
                <div>
                    <input 
                        type="password" 
                        placeholder="Password Confirmation" 
                        value={formData.password_confirmation} 
                        onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })} 
                        className="border rounded w-full py-2 px-3"
                    />
                </div>
                <button className="bg-blue-500 text-white py-2 px-4 rounded" type="submit">
                    Add User
                </button>
            </form>
        </>
    );
}
