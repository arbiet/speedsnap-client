// src/Pages/SpeedTest/testPacketLoss.js

export const testPacketLoss = async (setPacketLoss) => {
    const response = await fetch('/api/speedtest/packet_loss', {
        method: 'GET',
    });
    if (response.ok) {
        const data = await response.json();
        setPacketLoss(data.packet_loss);
        console.log('Packet Loss Test Completed:', `Packet Loss: ${data.packet_loss} %`);
    } else {
        console.error('Packet Loss Test Failed:', 'There was an error during the packet loss test.');
    }
};
