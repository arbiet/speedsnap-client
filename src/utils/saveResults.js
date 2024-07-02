// src/Utils/saveResults.js
import Swal from 'sweetalert2';

export const saveResults = async (data, token) => {
    try {
        const response = await fetch('/api/speedtest/results', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            Swal.fire('Success', 'Results saved successfully!', 'success');
        } else {
            const errorData = await response.json();
            console.error('Validation failed:', errorData);
            Swal.fire('Error', errorData.error ? JSON.stringify(errorData.error) : 'An error occurred', 'error');
        }
    } catch (error) {
        console.error('Failed to save speed test data:', error);
        Swal.fire('Error', 'Request failed', 'error');
    }
};
