import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = ({ devicePosition, ipPosition, deviceAddress, ipAddress }) => {
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

export default MapComponent;
