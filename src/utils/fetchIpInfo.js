// src/Utils/fetchIpInfo.js
import { fetchIpInfoToken } from '../Pages/SpeedTest/fetchIpInfoToken';
import { getAddressFromLatLng } from './getAddressFromLatLng';

export const fetchIpInfo = async (token, setIpInfo, setIpAddress) => {
    const ipToken = await fetchIpInfoToken(token);
    if (ipToken) {
        try {
            const response = await fetch(`https://ipinfo.io/json?token=${ipToken}`);
            if (response.ok) {
                const data = await response.json();
                setIpInfo(data);
                console.log('Fetched IP Info:', data);

                const [lat, lng] = data.loc.split(',');
                const ipAddr = await getAddressFromLatLng(lat, lng);
                setIpAddress(ipAddr);
            } else {
                console.error('Error fetching IP info:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching IP info:', error);
        }
    }
};
