import React, { useState, FormEvent, ChangeEvent } from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import { useHistory } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';

import { Sidebar } from '../../components/shared';
import mapIcon from '../../utils/mapIcon';

import '../../styles/pages/create-orphanage.css';

/* import api from '../services/api'; */

export default function CreateOrphanage() {
  const history = useHistory();
  const [position, setPosition] = useState({ latitude: 0, longitude: 0})

  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [instructions, setInstructions] = useState('');
  const [opening_hours, setOpening_hours] = useState('');
  const [open_on_weekends, setOpen_on_weekends] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [previewImage, setPreviewImage] = useState<string[]>([]);

  // Selecionar um ponto no map
  // --------------------------------------------------------------------
  function handlerMapClick(event: LeafletMouseEvent) {
    const {lat, lng} = event.latlng;
    setPosition({
      latitude: lat,
      longitude: lng,
    })
  }
  // Deletar imagem selecionadas
  // --------------------------------------------------------------------
  function handleDeleteImage(idx: number) {
    // Excluir do ImagePreview o index informado
    const filteredImagePreview = previewImage.filter((img,index) => index !== idx ); 
    setPreviewImage(filteredImagePreview);
    // Excluir do Images o index informado
    const filteredImages = images.filter((img,index) => index !== idx ); 
    setImages(filteredImages);
  }
  // Abrir janela para selecionar imagens
  // --------------------------------------------------------------------
  function handlerSelectImage(event: ChangeEvent<HTMLInputElement>) {
    // Se não selecionar nenhum imagem
    if(!event.target.files) { return; }
    // Transforma as imagens selecinadas em uma array de images
    const selectImages = Array.from(event.target.files)
    setImages(selectImages);
    // Criar um objeto de url para exibir um preview das imagens selecionadas
    const selectImagePreview = selectImages.map(image => {
      return URL.createObjectURL(image);
    });
    // Armazena no state um array de string de imagens
    setPreviewImage(selectImagePreview);
  }
  // Gravando os dados fornecidos no formulário
  // --------------------------------------------------------------------
  async function handlerSubmit(event: FormEvent ) {
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
      // incluir todas as images
      images.forEach(image => {
        data.append('images', image);
      });

      /* await api.post('orphanages', data); */

      alert('Cadastro realizado com sucesso!');
      history.push('/app');
    } catch (error) {
      alert('Erro falta de dados');
    }
  }
  
  return (
    <div id='page-create-orphanage'>
      <Sidebar />
      <main>
        <form onSubmit={handlerSubmit} className='create-orphanage-form'>
          <fieldset>
            <legend>Dados</legend>
            <MapContainer 
              center={[-22.8803188,-42.0241387]} 
              style={{ width: '100%', height: 280 }}
              zoom={15}
              /* onclick={handlerMapClick} */
            >
              <TileLayer 
                url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {position.latitude !== 0 && 
                <Marker 
                  interactive={false} 
                  icon={mapIcon} 
                  position={[
                    position.latitude,
                    position.longitude]} 
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

            {/* Upload de images */}
            <div className='input-block'>
              <label htmlFor='images'>Fotos</label>

              <div className='images-container'>
                {/* fazer um Preview das imagens */}
                {previewImage.map((image, idx) => {
                  return (
                    <div key={image} className='content-image'>
                      <img src={image} alt={name} />
                      <button 
                        onClick={()=> handleDeleteImage(idx)}
                        className='delete-img' 
                        type='button'>
                        X
                      </button>
                    </div>
                  )
                })}

                <label htmlFor='image[]' className='new-image'>
                  <FiPlus size={24} color='#15b6d6' />
                </label>
              </div>
              
              <input multiple onChange={handlerSelectImage} type='file' id='image[]' />
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
                onChange={event => setOpening_hours(event.target.value)}
              />
            </div>

            <div className='input-block'>
              <label htmlFor='open_on_weekends'>Atende fim de semana</label>

              <div className='button-select'>
                <button 
                  type='button' 
                  className={open_on_weekends ? 'active' : ''}
                  onClick={()=> setOpen_on_weekends(true)}>
                    Sim
                </button>
                
                <button 
                  type='button'
                  className={!open_on_weekends ? 'active' : ''}
                  onClick={()=> setOpen_on_weekends(false)}>
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

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;