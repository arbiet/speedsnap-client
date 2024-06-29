import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import { showSuccessAlert, showErrorAlert } from '../../utils/alertUtils';

export default function Login() {
    const { setToken } = useContext(AppContext)
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({})

    async function handleLogin(e) {
        e.preventDefault();
        const res = await fetch('/api/login', {
            method: 'post',
            body: JSON.stringify(formData),
        });
        const data = await res.json();
        
        if (data.errors) {
            setErrors(data.errors)
            showErrorAlert('Login Failed', 'Invalid credentials. Please try again.');
        } else {
            localStorage.setItem('token', data.access_token)
            setToken(data.access_token)
            showSuccessAlert('Login Successful', 'Welcome back!');
            navigate("/");  // Redirect to home after login
        }
    }

    return (
        <>
            <h1 className="title">Login</h1>
            <form className="w-1/2 mx-auto space-y-6" onSubmit={handleLogin}>
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
                <button className="primary-btn" type="submit">
                    Login
                </button>
            </form>
        </>
    );
}
