import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiPlus } from 'react-icons/fi';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

import mapMarker from '../../assets/map-marker.svg';
import mapIcon from '../../utils/mapIcon';

import '../../styles/pages/orphanage-map.css';

const OrphanagesMap: React.FC = () => {
  return (
    <div id="page-map">
      <aside>
        <header>
          <img src={mapMarker} alt="Happy"/>
          <h2>Escolha um orfanato no mapa</h2>
          <p>Muitas crianças estão esperando a sua visita :)</p>
        </header>
        <footer>
          <strong>Cabo Frio</strong>
          <strong>Rio de Janeiro</strong>
        </footer>
      </aside>
      <MapContainer center={[-22.8803188,-42.0241387]} zoom={15} style={{ width: '100%', height: '100%'}}>
        <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker
          icon={mapIcon}
          position={[-22.8803188,-42.0241387]}
        >
          <Popup closeButton={false} minWidth={240} maxWidth={240} className="map-popup">
            Lar das Meninas
            <Link to="/orphanage/1">
              <FiArrowRight size={20} color="#FFF" />
            </Link>
          </Popup>
        </Marker>
      </MapContainer>
      <Link to="/orphanage/create" className="create-orphanage">
        <FiPlus size={32} color="#FFF" />
      </Link>
    </div>
  );
}

export default OrphanagesMap;