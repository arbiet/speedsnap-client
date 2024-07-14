export const getAddressFromLatLng = async (lat, lng) => {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        if (response.ok) {
            const data = await response.json();
            console.log('Raw location data:', data); // Menampilkan data raw lokasi

            let district = data.address.suburb || data.address.neighbourhood || data.address.district || data.address.city_district;
            let city = data.address.city || data.address.town;

            const validDistricts = ['Mojoroto', 'Pesantren', 'Kota'];
            const validCities = ['Kediri', 'Kediri City', 'City Kediri', 'Kediri Kota'];

            district = normalizeDistrict(district, validDistricts);
            city = normalizeCity(city, validCities);

            return {
                road: data.address.road || '',
                city: city,
                state: data.address.state || '',
                country: data.address.country || '',
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

const normalizeDistrict = (district, validDistricts) => {
    const normalizedDistrict = validDistricts.find(validDistrict => 
        new RegExp(`\\b${validDistrict}\\b`, 'i').test(district)
    );
    return normalizedDistrict ? normalizedDistrict : `${district || 'undefined'} (Luar)`;
};

const normalizeCity = (city, validCities) => {
    const normalizedCity = validCities.find(validCity => 
        new RegExp(`\\b${validCity}\\b`, 'i').test(city)
    );
    return normalizedCity ? normalizedCity : `${city || 'undefined'} (Luar)`;
};
