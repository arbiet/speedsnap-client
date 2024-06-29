import { createContext, useEffect, useState, useCallback } from "react";
import PropTypes from 'prop-types';
import { showSuccessAlert, showErrorAlert } from '../Utils/alertUtils';

export const AppContext = createContext()

export default function AppProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState({});
    const [alertShown, setAlertShown] = useState(false);

    const getUser = useCallback(async () => {
        try {
            const res = await fetch("/api/user", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error('Failed to fetch user data');
            }

            const data = await res.json();
            setUser(data);
            console.log(data);

            if (!alertShown) {
                showSuccessAlert('Logged In', `Welcome back, ${data.name}!`);
                setAlertShown(true);
            }
        } catch (error) {
            console.error(error);
            showErrorAlert('Error', 'Failed to fetch user data. Please try again.');
        }
    }, [token, alertShown]);

    async function logout() {
        try {
            const res = await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                setToken(null);
                setUser({});
                localStorage.removeItem("token");
                setAlertShown(false);
                showSuccessAlert('Logged Out', 'You have been logged out successfully!');
            } else {
                throw new Error('Failed to log out');
            }
        } catch (error) {
            console.error(error);
            showErrorAlert('Logout Failed', 'There was an error logging out. Please try again.');
        }
    }

    useEffect(() => {
        if (token) {
            getUser();
        }
    }, [token, getUser]);

    console.log("Token: ", token);
    console.log("User: ", user);

    return (
        <AppContext.Provider value={{ token, setToken, user, logout }}>
            {children}
        </AppContext.Provider>
    )
}

AppProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
