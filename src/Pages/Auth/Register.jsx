import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import { showSuccessAlert, showErrorAlert } from '../../utils/alertUtils';

export default function Register() {
    const { setToken } = useContext(AppContext)
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });

    const [errors, setErrors] = useState({})

    async function handleRegister(e) {
        e.preventDefault();
        const res = await fetch('/api/register', {
            method: 'post',
            body: JSON.stringify(formData),
        });
        const data = await res.json();
        
        if (data.errors) {
            setErrors(data.errors)
            showErrorAlert('Registration Failed', 'Please correct the errors and try again.');
        } else {
            localStorage.setItem('token', data.access_token)
            setToken(data.access_token)
            showSuccessAlert('Registration Successful', 'Welcome to our service!');
            navigate("/");  // Redirect to home after registration
        }
    }

    return (
        <>
            <h1 className="title">Register a new account</h1>
            <form className="w-1/2 mx-auto space-y-6" onSubmit={handleRegister}>
                <div>
                    <input 
                        type="text" 
                        placeholder="Name" 
                        value={formData.name} 
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                    />
                    {errors.name && <p className="error" >{errors.name[0]}</p> }
                </div>
                <div>
                    <input 
                        type="text" 
                        placeholder="Email" 
                        value={formData.email} 
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                    />
                    {errors.email && <p className="error" >{errors.email[0]}</p> }
                </div>
                <div>  
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={formData.password} 
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                    />
                    {errors.password && <p className="error" >{errors.password[0]}</p> }
                </div>
                <div>
                    <input 
                        type="password" 
                        placeholder="Password Confirmation" 
                        value={formData.password_confirmation} 
                        onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })} 
                    />
                </div>
                <button className="primary-btn" type="submit">
                    Register
                </button>
            </form>
        </>
    );
}
