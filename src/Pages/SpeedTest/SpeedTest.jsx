import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../Context/AppContext';
import { testDownloadSpeed } from './testDownloadSpeed';
import { testUploadSpeed } from './testUploadSpeed';
import { testJitter } from './testJitter';
import { testPacketLoss } from './testPacketLoss';
import { testPing } from './testPing';
import { testLatency } from './testLatency';
import { useGeolocated } from 'react-geolocated';
import Swal from 'sweetalert2';
import MapComponent from '../../Components/MapComponent';
import { generateTimeSeriesData } from '../../Utils/generateTimeSeriesData';
import { getAddressFromLatLng } from '../../Utils/getAddressFromLatLng';
import { fetchIpInfo } from '../../Utils/fetchIpInfo';
import { saveResults } from '../../Utils/saveResults';
import GaugeChart from './GaugeChart';
import { FaGlobe, FaDownload, FaUpload, FaTachometerAlt, FaMapMarkerAlt, FaNetworkWired } from 'react-icons/fa';

const SpeedTest = () => {
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

    const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
        positionOptions: {
            enableHighAccuracy: true,
        },
        userDecisionTimeout: 5000,
    });

    useEffect(() => {
        fetchIpInfo(setIpInfo, setIpAddress);
    }, []);

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

        await testDownloadSpeed(setDownloadSpeed);
        await testUploadSpeed(setUploadSpeed);
        await testJitter(setJitter);
        await testPacketLoss(setPacketLoss);
        await testPing(setPing);
        await testLatency(setLatency);

        setTesting(false);
    };

    const devicePosition = coords ? [coords.latitude, coords.longitude] : null;
    const ipPosition = ipInfo && ipInfo.loc ? ipInfo.loc.split(',').map(Number) : null;

    return (
        <div className="flex flex-col items-center p-4">
            <h1 className="text-3xl font-bold mb-6">Speed Test Dashboard</h1>
            <div className="flex flex-row items-start space-x-6 w-full">
                <div className="w-4/12 space-y-6">
                    <div className="p-4 border rounded-lg shadow-md bg-white">
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <FaGlobe className="mr-2" /> IP Information
                        </h2>
                        {ipInfo && (
                            <div className="space-y-2">
                                <p><strong>IP:</strong> {ipInfo.ip}</p>
                                <p><strong>City:</strong> {ipInfo.city}</p>
                                <p><strong>Region:</strong> {ipInfo.region}</p>
                                <p><strong>Country:</strong> {ipInfo.country}</p>
                                <p><strong>Org:</strong> {ipInfo.org}</p>
                                <p><strong>Timezone:</strong> {ipInfo.timezone}</p>
                            </div>
                        )}
                    </div>
                    <div className="p-4 border rounded-lg shadow-md bg-white">
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <FaMapMarkerAlt className="mr-2" /> Location
                        </h2>
                        {!isGeolocationAvailable ? (
                            <p>Your browser does not support Geolocation</p>
                        ) : !isGeolocationEnabled ? (
                            <p>Geolocation is not enabled</p>
                        ) : coords ? (
                            <div className="space-y-2">
                                <p><strong>Latitude:</strong> {coords.latitude}</p>
                                <p><strong>Longitude:</strong> {coords.longitude}</p>
                                {deviceAddress && (
                                    <p><strong>Address:</strong> {deviceAddress.road}, {deviceAddress.district}, {deviceAddress.city}, {deviceAddress.state}, {deviceAddress.country}</p>
                                )}
                            </div>
                        ) : (
                            <p>Getting the location data&hellip; </p>
                        )}
                    </div>
                    <div className="p-4 border rounded-lg shadow-md bg-white">
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <FaNetworkWired className="mr-2" /> User Agent
                        </h2>
                        <p>{userAgent}</p>
                    </div>
                    <div className="p-4 border rounded-lg shadow-md bg-white">
                        <button onClick={runSpeedTest} className="primary-btn w-full py-2" disabled={testing}>
                            {testing ? 'Testing...' : 'Run Speed Test'}
                        </button>
                    </div>
                </div>
                <div className="w-8/12 grid grid-cols-2 gap-6">
                    <div className="p-4 border rounded-lg shadow-md bg-white">
                        <GaugeChart label="Download Speed" unit="Mbps" data={downloadSpeed || 0} />
                    </div>
                    <div className="p-4 border rounded-lg shadow-md bg-white">
                        <GaugeChart label="Upload Speed" unit="Mbps" data={uploadSpeed || 0} />
                    </div>
                    <div className="p-4 border rounded-lg shadow-md bg-white">
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <FaTachometerAlt className="mr-2" /> Jitter
                        </h2>
                        {jitter !== null && <p>{jitter} ms</p>}
                    </div>
                    <div className="p-4 border rounded-lg shadow-md bg-white">
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <FaTachometerAlt className="mr-2" /> Packet Loss
                        </h2>
                        {packetLoss !== null && <p>{packetLoss} %</p>}
                    </div>
                    <div className="p-4 border rounded-lg shadow-md bg-white">
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <FaTachometerAlt className="mr-2" /> Ping
                        </h2>
                        {ping !== null && <p>{ping} ms</p>}
                    </div>
                    <div className="p-4 border rounded-lg shadow-md bg-white">
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <FaTachometerAlt className="mr-2" /> Latency
                        </h2>
                        {latency !== null && <p>{latency} ms</p>}
                    </div>
                </div>
            </div>
            <div className="w-full mt-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <FaMapMarkerAlt className="mr-2" /> Map
                </h2>
                <MapComponent devicePosition={devicePosition} ipPosition={ipPosition} deviceAddress={deviceAddress} ipAddress={ipAddress} />
            </div>
        </div>
    );
};

export default SpeedTest;
