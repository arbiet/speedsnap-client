import { useContext } from "react";
import { Link, useNavigate, Outlet } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import { showWarningAlert, showSuccessAlert } from '../Utils/alertUtils';

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
            <header className="bg-gray-800 p-4 text-white">
                <nav className="flex justify-between items-center">
                    <div>
                        <Link to="/" className="nav-link px-4 text-white">Home</Link>
                    </div>
                    {user && user.name ? (
                        <div className="space-x-4 flex flex-row items-center">
                            <p className="text-slate-200 rounded-md px-3 py-2 text-sm">Welcome back, {user.name}</p>
                            <Link to="/speedtest" className="nav-link px-4 text-white">Speed Test</Link>
                            <Link to="/recommendations" className="nav-link px-4 text-white">ISP Recommendations</Link>
                            {user.user_type === 'admin' && (
                                <Link to="/users" className="nav-link px-4 text-white">Users</Link>
                            )}
                            <button onClick={handleLogout} className="nav-link px-4 text-white">Logout</button>
                        </div>
                    ) : (
                        <div className="space-x-4">
                            <Link to="/register" className="nav-link px-4 text-white">Register</Link>
                            <Link to="/login" className="nav-link px-4 text-white">Login</Link>
                        </div>
                    )}
                </nav>
            </header>
            <main className="p-4">
                <Outlet />
            </main>
        </>
    );
}
