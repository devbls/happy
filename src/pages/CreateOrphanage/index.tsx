import React, { useState, FormEvent, ChangeEvent } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvent } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import { useHistory } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';

import { Sidebar } from '../../components/shared';
import mapIcon from '../../utils/mapIcon';
import api from '../../services/api';

import '../../styles/pages/create-orphanage.css';

function MapClickHandler({ setPosition }: { setPosition: React.Dispatch<React.SetStateAction<{
  latitude: number;
  longitude: number;
}>>}) {
  useMapEvent('click', (event: LeafletMouseEvent) => {
    const { lat, lng } = event.latlng;

      setPosition({
        latitude: lat,
        longitude: lng,
      });
  });

  return null;
}

export default function CreateOrphanage() {
  const history = useHistory();

  const [position, setPosition] = useState({ latitude: 0, longitude: 0});
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [instructions, setInstructions] = useState('');
  const [opening_hours, setOpeningHours] = useState('');
  const [open_on_weekends, setOpenOnWeekends] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  function handleDeleteImage(idx: number) {
    const filteredImagePreview = previewImages.filter((img, index) => index !== idx );

    setPreviewImages(filteredImagePreview);

    const filteredImages = images.filter((img, index) => index !== idx ); 

    setImages(filteredImages);
  }

  function handleSelectImage(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) {
      return;
    }

    const selectedImages = Array.from(event.target.files);

    setImages(selectedImages);

    const selectedImagePreview = selectedImages.map(image => {
      return URL.createObjectURL(image);
    });

    setPreviewImages(selectedImagePreview);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    try {
      const data = new FormData();

      data.append('name', name);
      data.append('latitude', String(position.latitude));
      data.append('longitude', String(position.longitude));
      data.append('about', about);
      data.append('instructions', instructions);
      data.append('opening_hours', opening_hours);
      data.append('open_on_weekends', String(open_on_weekends));
      images.forEach(image => {
        data.append('images', image);
      });

      await api.post('orphanages', data);

      alert('Cadastro realizado com sucesso!');

      history.push('/orphanages');
    } catch (error) {
      alert('Erro falta de dados');
    }
  }
  
  return (
    <div id='page-create-orphanage'>
      <Sidebar />
      <main>
        <form onSubmit={handleSubmit} className='create-orphanage-form'>
          <fieldset>
            <legend>Dados</legend>
            <MapContainer 
              center={[-22.8803188,-42.0241387]} 
              style={{ width: '100%', height: 280 }}
              zoom={15}
            >
              <MapClickHandler setPosition={setPosition} />
              <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {position.latitude !== 0 && 
                <Marker 
                  interactive={false} 
                  icon={mapIcon} 
                  position={[
                    position.latitude,
                    position.longitude
                  ]} 
                />
              }
            </MapContainer>
            <div className='input-block'>
              <label htmlFor='name'>Nome</label>
              <input 
                id='name'
                value={name}
                onChange={event => setName(event.target.value)}
              />
            </div>
            <div className='input-block'>
              <label htmlFor='about'>Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea 
                id='name' 
                maxLength={300} 
                value={about}
                onChange={event => setAbout(event.target.value)}
              />
            </div>
            <div className='input-block'>
              <label htmlFor='images'>Fotos</label>
              <div className='images-container'>
                {previewImages.map((image, idx) => {
                  return (
                    <div key={image} className='content-image'>
                      <img src={image} alt={name} />
                      <button 
                        onClick={()=> handleDeleteImage(idx)}
                        className='delete-img' 
                        type='button'
                      >
                        X
                      </button>
                    </div>
                  )
                })}
                <label htmlFor='image[]' className='new-image'>
                  <FiPlus size={24} color='#15b6d6' />
                </label>
              </div>
              <input multiple onChange={handleSelectImage} type='file' id='image[]' />
            </div>
          </fieldset>
          <fieldset>
            <legend>Visitação</legend>
            <div className='input-block'>
              <label htmlFor='instructions'>Instruções</label>
              <textarea 
                id='instructions' 
                value={instructions}
                onChange={event => setInstructions(event.target.value)}
              />
            </div>
            <div className='input-block'>
              <label htmlFor='opening_hours'>Horário de funcionamento</label>
              <input 
                id='opening_hours' 
                value={opening_hours}
                onChange={event => setOpeningHours(event.target.value)}
              />
            </div>
            <div className='input-block'>
              <label htmlFor='open_on_weekends'>Atende fim de semana</label>
              <div className='button-select'>
                <button 
                  type='button' 
                  className={open_on_weekends ? 'active' : ''}
                  onClick={()=> setOpenOnWeekends(true)}
                >
                    Sim
                </button>
                <button 
                  type='button'
                  className={!open_on_weekends ? 'active' : ''}
                  onClick={()=> setOpenOnWeekends(false)}
                >
                    Não
                </button>
              </div>
            </div>
          </fieldset>
          <button className='confirm-button' type='submit'>
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}
