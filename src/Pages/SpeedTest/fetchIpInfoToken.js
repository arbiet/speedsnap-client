// src/Pages/SpeedTest/fetchIpInfoToken.js

export const fetchIpInfoToken = async (token) => {
    try {
        const response = await fetch('/api/ipinfo/token', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        
        if (response.ok) {
            const data = await response.json();
            return data.token;
        } else {
            console.error('Error fetching IP info token:', response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error fetching IP info token:', error);
        return null;
    }
};
