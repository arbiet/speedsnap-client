export const getAddressFromLatLng = async (lat, lng) => {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        if (response.ok) {
            const data = await response.json();
            let district = data.address.suburb || data.address.neighbourhood || data.address.district || getRandomDistrict();
            const validDistricts = ['Mojoroto', 'Pesantren', 'Kota'];
            
            if (!validDistricts.includes(district)) {
                district = 'Kecamatan Luar';
            }

            const city = data.address.city || data.address.town || data.address.village;
            const validCities = ['Kediri', 'Kediri City', 'City Kediri', 'Kediri Kota'];
            
            if (!validCities.includes(city)) {
                return {
                    road: data.address.road,
                    city: 'Kota Luar',
                    state: data.address.state,
                    country: data.address.country,
                    district: 'Kecamatan Luar'
                };
            }

            return {
                road: data.address.road,
                city: city,
                state: data.address.state,
                country: data.address.country,
                district: district
            };
        } else {
            console.error('Failed to fetch address');
            return null;
        }
    } catch (error) {
        console.error('Error fetching address:', error);
        return null;
    }
};

const getRandomDistrict = () => {
    const districts = ['Mojoroto', 'Pesantren', 'Kota'];
    return districts[Math.floor(Math.random() * districts.length)];
};
