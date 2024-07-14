import { useContext } from "react";
import { Link, useNavigate, Outlet } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import { showWarningAlert, showSuccessAlert } from '../Utils/alertUtils';

const adminLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "", label: "Users", subLinks: [{ to: "/users", label: "Manage Users" }] },
    { to: "", label: "ISPs", subLinks: [
        { to: "/service_providers", label: "Manage ISPs" },
        { to: "/coverage_areas", label: "Coverage Areas" },
        { to: "/service_types", label: "Service Types" },
        { to: "/plan_details", label: "Plan Details" },
        { to: "/aliases", label: "Manage Aliases" }
    ] },
];


const userLinks = [
  { to: "/speedtest", label: "Speed Test" },
  { to: "", label: "Recommendations", subLinks: [{ to: "/recommendations", label: "Top Recommendations" }] },
];

const guestLinks = [
  { to: "/speedtest", label: "Speed Test" },
  { to: "", label: "Recommendations", subLinks: [{ to: "/recommendations", label: "Top Recommendations" }] },
  { to: "/register", label: "Register" },
  { to: "/login", label: "Login" },
];

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

    const renderLinks = () => {
        let links = [];
        if (user && user.user_type === 'admin') {
            links = adminLinks;
        } else if (user && user.user_type === 'user') {
            links = userLinks;
        } else {
            links = guestLinks;
        }

        return links.map((link, index) => (
            <div key={index} className="relative">
                {link.subLinks ? (
                    <details className="group">
                        <summary className="nav-link px-4 text-white cursor-pointer">{link.label}</summary>
                        <div className="absolute left-0 mt-1 w-48 bg-white shadow-md rounded-md z-10">
                            {link.subLinks.map((subLink, subIndex) => (
                                <Link key={subIndex} to={subLink.to} className="block px-4 py-2 text-black hover:bg-gray-200">
                                    {subLink.label}
                                </Link>
                            ))}
                        </div>
                    </details>
                ) : (
                    <Link to={link.to} className="nav-link px-4 text-white">
                        {link.label}
                    </Link>
                )}
            </div>
        ));
    };

    return (
        <>
            <header className="bg-gray-800 p-4 text-white">
                <nav className="flex justify-between items-center">
                    <div>
                        <Link to="/" className="nav-link px-4 text-white">Speedsnap.my.id</Link>
                    </div>
                    {user && user.name ? (
                        <div className="space-x-4 flex flex-row items-center">
                            <p className="text-slate-200 rounded-md px-3 py-2 text-sm">Welcome back, {user.name}</p>
                            {renderLinks()}
                            <button onClick={handleLogout} className="nav-link px-4 text-white">Logout</button>
                        </div>
                    ) : (
                        <div className="space-x-4 flex">
                            {renderLinks()}
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
