// export const testUploadSpeed = async (setUploadSpeed) => {
//     const largeString = 'a'.repeat(1024 * 10); // 5MB string
    
//     const formData = {
//         upload_data: largeString,
//     };
    
//     const startTime = new Date().getTime();
//     try {
//         const response = await fetch('/api/speedtest/upload', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(formData),
//         });
    
//         if (response.status === 401 || response.status === 403) {
//             console.error('Error:', response.statusText);
//             return;
//         }
//         const endTime = new Date().getTime();
    
//         if (response.ok) {
//             const duration = (endTime - startTime) / 1000;
//             const bitsLoaded = largeString.length * 8;
//             const speed = (bitsLoaded / duration / 1024 / 1024).toFixed(2);
    
//             setUploadSpeed(speed);
//             console.log('Upload Test Completed:', `Upload speed: ${speed} Mbps`);
//         } else {
//             const errorData = await response.json();
//             console.error('Upload Test Failed:', errorData.error);
//         }
//     } catch (error) {
//         console.error('Upload Test Failed:', error);
//     }
// };
// src/Pages/SpeedTest/testDownloadSpeed.js

export const testUploadSpeed = async (setUploadSpeed) => {
    const startTime = new Date().getTime();
    const response = await fetch('/api/speedtest/download', {
        method: 'GET'
    });
    if (response.status === 401 || response.status === 403) {
        console.error('Error:', response.statusText);
        return;
    }
    const data = await response.blob();
    const endTime = new Date().getTime();

    const duration = (endTime - startTime) / 1000;
    const bitsLoaded = data.size * 8;
    const speed = (bitsLoaded / duration / 1024 / 1024).toFixed(2);

    setUploadSpeed(speed);
    console.log('Download Test Completed:', `Download speed: ${speed} Mbps`);
};

