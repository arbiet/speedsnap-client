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
import { getAddressFromLatLng } from '../../Utils/getAddressFromLatLng';
import { useGeolocated } from 'react-geolocated';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Swal from 'sweetalert2';

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
    const [getData, setgetData] = useState({});
    const [deviceAddress, setDeviceAddress] = useState(null);
    const [ipAddress, setIpAddress] = useState(null);

    const generateTimeSeriesData = (baseValue, count = 10, variance = 0.1) => {
        const data = [];
        for (let i = 0; i < count; i++) {
            const value = baseValue * (1 + (Math.random() - 0.5) * 2 * variance);
            data.push(value);
        }
        return data;
    };

    const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
        positionOptions: {
            enableHighAccuracy: true,
        },
        userDecisionTimeout: 5000,
    });

    useEffect(() => {
        const fetchIpInfo = async () => {
            const ipToken = await fetchIpInfoToken(token);
            if (ipToken) {
                try {
                    const response = await fetch(`https://ipinfo.io/json?token=${ipToken}`);
                    if (response.ok) {
                        const data = await response.json();
                        setIpInfo(data);
                        console.log('Fetched IP Info:', data);

                        const [lat, lng] = data.loc.split(',');
                        const ipAddr = await getAddressFromLatLng(lat, lng);
                        setIpAddress(ipAddr);
                    } else {
                        console.error('Error fetching IP info:', response.statusText);
                    }
                } catch (error) {
                    console.error('Error fetching IP info:', error);
                }
            }
        };

        fetchIpInfo();
    }, [token]);

    useEffect(() => {
        if (
            downloadSpeed !== null &&
            uploadSpeed !== null &&
            jitter !== null &&
            packetLoss !== null &&
            ping !== null &&
            latency !== null
        ) {
            const timeseriesData = {
                downloadSpeed: generateTimeSeriesData(downloadSpeed),
                uploadSpeed: generateTimeSeriesData(uploadSpeed),
                jitter: generateTimeSeriesData(jitter),
                packetLoss: generateTimeSeriesData(packetLoss),
                ping: generateTimeSeriesData(ping),
                latency: generateTimeSeriesData(latency),
            };
            setgetData(timeseriesData);

            if (ipInfo && deviceAddress) {
                console.log('Device Address:', deviceAddress); // Log the device address to the console
                saveResults({
                    isp: {
                        name: ipInfo.org,
                        service_type: 'fiber',
                        ip: ipInfo.ip,
                        city: ipInfo.city,
                        region: ipInfo.region,
                        country: ipInfo.country,
                        loc: ipInfo.loc,
                        org: ipInfo.org,
                        timezone: ipInfo.timezone,
                        district: deviceAddress.district // Include district information
                    },
                    speed_measurement: {
                        download_speed: downloadSpeed,
                        upload_speed: uploadSpeed,
                        jitter: jitter,
                        packet_loss: packetLoss,
                        ping: ping,
                        latency: latency,
                    },
                    timeseries: timeseriesData.downloadSpeed.map((d, i) => ({
                        timestamp: new Date().toISOString(),
                        download_speed: timeseriesData.downloadSpeed[i],
                        upload_speed: timeseriesData.uploadSpeed[i],
                        jitter: timeseriesData.jitter[i],
                        packet_loss: timeseriesData.packetLoss[i],
                        ping: timeseriesData.ping[i],
                        latency: timeseriesData.latency[i],
                    })),
                    device_location: {
                        latitude: coords.latitude,
                        longitude: coords.longitude,
                        road: deviceAddress?.road,
                        city: deviceAddress?.city,
                        state: deviceAddress?.state,
                        country: deviceAddress?.country,
                        district: deviceAddress.district // Include district information
                    },
                    user_agent: userAgent,
                });
            } else {
                console.error('IP information or device address is not available.');
                Swal.fire('Error', 'IP information or device address is not available.', 'error');
            }
        }
    }, [downloadSpeed, uploadSpeed, jitter, packetLoss, ping, latency, ipInfo, coords, deviceAddress, userAgent]);

    const resetState = () => {
        setDownloadSpeed(null);
        setUploadSpeed(null);
        setJitter(null);
        setPacketLoss(null);
        setPing(null);
        setLatency(null);
        setgetData({});
        setDeviceAddress(null);
        setIpAddress(null);
    };

    const runSpeedTest = async () => {
        resetState();
        setTesting(true);

        if (coords) {
            const deviceAddr = await getAddressFromLatLng(coords.latitude, coords.longitude);
            console.log('Geocoded Address:', deviceAddr); // Log the geocoded address to the console
            setDeviceAddress(deviceAddr);
        }

        await testDownloadSpeed(token, setDownloadSpeed);
        await testUploadSpeed(token, setUploadSpeed);
        await testJitter(token, setJitter);
        await testPacketLoss(token, setPacketLoss);
        await testPing(token, setPing);
        await testLatency(token, setLatency);

        setTesting(false);
    };

    const saveResults = async (data) => {
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
                        <Popup>
                            Device Location:
                            {deviceAddress && `${deviceAddress.road}, ${deviceAddress.city}, ${deviceAddress.state}, ${deviceAddress.country}`}
                        </Popup>
                    </Marker>
                )}
                {ipPosition && (
                    <Marker position={ipPosition}>
                        <Popup>
                            IP Location:
                            {ipAddress && `${ipAddress.road}, ${ipAddress.city}, ${ipAddress.state}, ${ipAddress.country}`}
                        </Popup>
                    </Marker>
                )}
            </MapContainer>
        );
    };

    return (
        <div className="grid grid-cols-2 gap-6 w-3/4 mx-auto">
            <div className="space-y-6">
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
            <div className="space-y-6">
                <h2>(Timeseries)</h2>
                <pre>{JSON.stringify(getData, null, 2)}</pre>
            </div>
        </div>
    );
};

export default SpeedTest;
