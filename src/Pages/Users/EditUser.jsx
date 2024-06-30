import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import { showSuccessAlert, showErrorAlert, showLoadingAlert, hideLoadingAlert } from "../../Utils/alertUtils";

export default function EditUser() {
    const { token, user } = useContext(AppContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        async function fetchUser() {
            showLoadingAlert();
            try {
                const res = await fetch(`/api/users/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!res.ok) {
                    throw new Error('Failed to fetch user');
                }
                const data = await res.json();
                setFormData({
                    name: data.name || '',
                    email: data.email || '',
                    password: '',
                    password_confirmation: ''
                });
            } catch (error) {
                console.error(error);
                showErrorAlert('Error', 'Failed to fetch user. Please try again.');
            } finally {
                hideLoadingAlert();
            }
        }

        fetchUser();
    }, [id, token]);

    async function handleEditUser(e) {
        e.preventDefault();
        if (user.user_type !== 'admin') {
            showErrorAlert('Access Denied', 'You do not have permission to edit users.');
            return;
        }

        // Construct the payload
        const payload = {
            name: formData.name,
            email: formData.email,
        };

        if (formData.password) {
            payload.password = formData.password;
            payload.password_confirmation = formData.password_confirmation;
        }

        const res = await fetch(`/api/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        const data = await res.json();
        
        if (data.errors) {
            setErrors(data.errors)
            showErrorAlert('Update Failed', 'Please correct the errors and try again.');
        } else {
            showSuccessAlert('User Updated', 'The user has been updated successfully!');
            navigate("/users");
        }
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <>
            <h1 className="title">Edit User</h1>
            <form className="w-1/2 mx-auto space-y-6" onSubmit={handleEditUser}>
                <div>
                    <input 
                        type="text" 
                        placeholder="Name" 
                        name="name"
                        value={formData.name} 
                        onChange={handleChange} 
                        className="border rounded w-full py-2 px-3"
                    />
                    {errors.name && <p className="error text-red-500">{errors.name[0]}</p>}
                </div>
                <div>
                    <input 
                        type="email" 
                        placeholder="Email" 
                        name="email"
                        value={formData.email} 
                        onChange={handleChange} 
                        className="border rounded w-full py-2 px-3"
                    />
                    {errors.email && <p className="error text-red-500">{errors.email[0]}</p>}
                </div>
                <div>
                    <input 
                        type="password" 
                        placeholder="Password" 
                        name="password"
                        value={formData.password} 
                        onChange={handleChange} 
                        className="border rounded w-full py-2 px-3"
                    />
                    {errors.password && <p className="error text-red-500">{errors.password[0]}</p>}
                </div>
                <div>
                    <input 
                        type="password" 
                        placeholder="Password Confirmation" 
                        name="password_confirmation"
                        value={formData.password_confirmation} 
                        onChange={handleChange} 
                        className="border rounded w-full py-2 px-3"
                    />
                </div>
                <button className="primary-btn" type="submit">
                    Update User
                </button>
            </form>
        </>
    );
}
