// src/Pages/SpeedTest/testJitter.js

export const testJitter = async (setJitter) => {
    const response = await fetch('/api/speedtest/jitter', {
        method: 'GET',
    });
    if (response.ok) {
        const data = await response.json();
        setJitter(data.jitter);
        console.log('Jitter Test Completed:', `Jitter: ${data.jitter} ms`);
    } else {
        console.error('Jitter Test Failed:', 'There was an error during the jitter test.');
    }
};
