// src/utils/getAddressFromLatLng.js

export const getAddressFromLatLng = async (lat, lng) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.address;
    } catch (error) {
        console.error('Request failed:', error);
        return null;
    }
};
