import React from 'react';
import { FiPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer } from 'react-leaflet';

import '../../styles/pages/orphanages.css';
import 'leaflet/dist/leaflet.css';

import mapMarker from '../../assets/map-marker.svg';

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
      </MapContainer>
      <Link to="" className="create-orphanage">
        <FiPlus size={32} color="#FFF" />
      </Link>
    </div>
  );
}

export default OrphanagesMap;