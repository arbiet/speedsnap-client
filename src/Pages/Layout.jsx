import { useContext } from "react";
import { Link, useNavigate, Outlet } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import { showWarningAlert, showSuccessAlert } from '../utils/alertUtils';

export default function Layout() {
    const { user, logout } = useContext(AppContext);
    const navigate = useNavigate();

    function handleLogout() {
        showWarningAlert(
            'Are you sure?',
            "You will be logged out!",
            'Yes, log me out!',
            () => {
                logout();
                navigate('/login');
                showSuccessAlert('Logged Out!', 'You have been logged out successfully.');
            }
        );
    }

    return (
        <>
            <header>
                <nav>
                    <Link to="/" className="nav-link">Home</Link>
                    {user && user.name ? (
                        <div className="space-x-4 flex flex-row">
                            <p className="text-slate-200 rounded-md px-3 py-2 text-sm ">Welcome back, {user.name}</p>
                            <button onClick={handleLogout} className="nav-link">Logout</button>
                        </div>
                    ) : (
                        <div className="space-x-4">
                            <Link to="/register" className="nav-link">Register</Link>
                            <Link to="/login" className="nav-link">Login</Link>
                        </div>
                    )}
                </nav>
            </header>
            <main>
                <Outlet />
            </main>
        </>
    );
}
