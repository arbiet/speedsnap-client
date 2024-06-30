// src/Pages/SpeedTest/SpeedTest.jsx

import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import { AppContext } from '../../Context/AppContext';
import { testDownloadSpeed } from './testDownloadSpeed';
import { testUploadSpeed } from './testUploadSpeed';
import { testJitter } from './testJitter';
import { testPacketLoss } from './testPacketLoss';
import { testPing } from './testPing';
import { testLatency } from './testLatency';
import { fetchIpInfoToken } from './fetchIpInfoToken';
import { useGeolocated } from 'react-geolocated';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const SpeedTest = () => {
    const { token } = useContext(AppContext);
    const [downloadSpeed, setDownloadSpeed] = useState(null);
    const [uploadSpeed, setUploadSpeed] = useState(null);
    const [jitter, setJitter] = useState(null);
    const [packetLoss, setPacketLoss] = useState(null);
    const [ping, setPing] = useState(null);
    const [latency, setLatency] = useState(null);
    const [ipInfo, setIpInfo] = useState(null);
    const [testing, setTesting] = useState(false);
    const [userAgent, setUserAgent] = useState(navigator.userAgent);

    const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
        positionOptions: {
            enableHighAccuracy: true,
        },
        userDecisionTimeout: 5000,
    });

    const runSpeedTest = async () => {
        setTesting(true);

        // Fetch IP info token from the server
        const ipToken = await fetchIpInfoToken(token);
        if (ipToken) {
            try {
                // Fetch IP info using the token
                const response = await fetch(`https://ipinfo.io/json?token=${ipToken}`);
                if (response.ok) {
                    const data = await response.json();
                    setIpInfo(data);
                } else {
                    console.error('Error fetching IP info:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching IP info:', error);
            }
        }

        await testDownloadSpeed(token, setDownloadSpeed);
        await testUploadSpeed(token, setUploadSpeed);
        await testJitter(token, setJitter);
        await testPacketLoss(token, setPacketLoss);
        await testPing(token, setPing);
        await testLatency(token, setLatency);
        
        setTesting(false);
    };

    const devicePosition = coords ? [coords.latitude, coords.longitude] : null;
    const ipPosition = ipInfo && ipInfo.loc ? ipInfo.loc.split(',').map(Number) : null;

    const renderMap = () => {
        if (!devicePosition && !ipPosition) return null;

        return (
            <MapContainer center={devicePosition || ipPosition} zoom={13} style={{ height: '400px', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {devicePosition && (
                    <Marker position={devicePosition}>
                        <Popup>Device Location</Popup>
                    </Marker>
                )}
                {ipPosition && (
                    <Marker position={ipPosition}>
                        <Popup>IP Location</Popup>
                    </Marker>
                )}
            </MapContainer>
        );
    };

    return (
        <div className="w-1/2 mx-auto space-y-6">
            <h1 className="title">Speed Test</h1>
            {ipInfo && (
                <div className="ip-info">
                    <p>IP: {ipInfo.ip}</p>
                    <p>City: {ipInfo.city}</p>
                    <p>Region: {ipInfo.region}</p>
                    <p>Country: {ipInfo.country}</p>
                    <p>Org: {ipInfo.org}</p>
                    <p>Timezone: {ipInfo.timezone}</p>
                </div>
            )}
            <div>
                <button onClick={runSpeedTest} className="primary-btn" disabled={testing}>
                    {testing ? 'Testing...' : 'Run Speed Test'}
                </button>
                {downloadSpeed && <p>Download Speed: {downloadSpeed} Mbps</p>}
                {uploadSpeed && <p>Upload Speed: {uploadSpeed} Mbps</p>}
                {jitter && <p>Jitter: {jitter} ms</p>}
                {packetLoss && <p>Packet Loss: {packetLoss} %</p>}
                {ping && <p>Ping: {ping} ms</p>}
                {latency && <p>Latency: {latency} ms</p>}
            </div>
            <div>
                <h2>User Agent</h2>
                <p>{userAgent}</p>
            </div>
            <div>
                <h2>Location</h2>
                {!isGeolocationAvailable ? (
                    <p>Your browser does not support Geolocation</p>
                ) : !isGeolocationEnabled ? (
                    <p>Geolocation is not enabled</p>
                ) : coords ? (
                    <div>
                        <p>Latitude: {coords.latitude}</p>
                        <p>Longitude: {coords.longitude}</p>
                        <p>Altitude: {coords.altitude}</p>
                        <p>Heading: {coords.heading}</p>
                        <p>Speed: {coords.speed}</p>
                    </div>
                ) : (
                    <p>Getting the location data&hellip; </p>
                )}
            </div>
            <div>
                <h2>Map</h2>
                {renderMap()}
            </div>
        </div>
    );
};

export default SpeedTest;
