import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getFormattedDate } from '@/utils/helpers';

const markerIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const UserLocationsMap = ({ locations }) => {
  const positions = locations.map(location => [Number(location.latitude), Number(location.longitude)]);
  const defaultCenter = positions[0] ?? [31.5204, 74.3587];

  return (
    <MapContainer center={defaultCenter} zoom={13} style={{ height: 420, width: '100%', borderRadius: 8 }}>
      <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {locations.map(location => (
        <Marker key={location.createdAt} position={[Number(location.latitude), Number(location.longitude)]} icon={markerIcon}>
          <Popup>
            <strong>{location.fullName}</strong>
            <br />
            Lat: {location.latitude}
            <br />
            Lng: {location.longitude}
            <br />
            {getFormattedDate(location.createdAt, true)}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default UserLocationsMap;
