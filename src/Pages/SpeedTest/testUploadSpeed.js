// src/Pages/SpeedTest/testUploadSpeed.js

export const testUploadSpeed = async (token, setUploadSpeed) => {
    const largeString = 'a'.repeat(1024 * 1024 * 5); // 5MB string
    
    const formData = {
        upload_data: largeString,
    };
    
    const startTime = new Date().getTime();
    try {
        const response = await fetch('/api/speedtest/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        });
    
        if (response.status === 401 || response.status === 403) {
            console.error('Error:', response.statusText);
            return;
        }
        const endTime = new Date().getTime();
    
        if (response.ok) {
            const duration = (endTime - startTime) / 1000;
            const bitsLoaded = largeString.length * 8;
            const speed = (bitsLoaded / duration / 1024 / 1024).toFixed(2);
    
            setUploadSpeed(speed);
            console.log('Upload Test Completed:', `Upload speed: ${speed} Mbps`);
        } else {
            const errorData = await response.json();
            console.error('Upload Test Failed:', errorData.error);
        }
    } catch (error) {
        console.error('Upload Test Failed:', error);
    }
};
