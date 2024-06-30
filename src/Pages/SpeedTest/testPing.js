// src/Pages/SpeedTest/testPing.js

export const testPing = async (token, setPing) => {
    const response = await fetch('/api/speedtest/ping', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (response.ok) {
        const data = await response.json();
        setPing(data.ping);
        console.log('Ping Test Completed:', `Ping: ${data.ping} ms`);
    } else {
        console.error('Ping Test Failed:', 'There was an error during the ping test.');
    }
};
