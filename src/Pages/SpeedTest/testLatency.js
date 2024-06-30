// src/Pages/SpeedTest/testLatency.js

export const testLatency = async (token, setLatency) => {
    const response = await fetch('/api/speedtest/latency', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (response.ok) {
        const data = await response.json();
        setLatency(data.latency);
        console.log('Latency Test Completed:', `Latency: ${data.latency} ms`);
    } else {
        console.error('Latency Test Failed:', 'There was an error during the latency test.');
    }
};
