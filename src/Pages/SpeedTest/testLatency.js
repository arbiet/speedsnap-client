// src/Pages/SpeedTest/testLatency.js

export const testLatency = async (setLatency) => {
    const response = await fetch('/api/speedtest/latency', {
        method: 'GET',
    });
    if (response.ok) {
        const data = await response.json();
        setLatency(data.latency);
        console.log('Latency Test Completed:', `Latency: ${data.latency} ms`);
    } else {
        console.error('Latency Test Failed:', 'There was an error during the latency test.');
    }
};
