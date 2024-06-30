// src/Pages/SpeedTest/testDownloadSpeed.js

export const testDownloadSpeed = async (token, setDownloadSpeed) => {
    const startTime = new Date().getTime();
    const response = await fetch('/api/speedtest/download', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
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

    setDownloadSpeed(speed);
    console.log('Download Test Completed:', `Download speed: ${speed} Mbps`);
};
