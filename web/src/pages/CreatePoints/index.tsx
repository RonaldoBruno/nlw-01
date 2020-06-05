import React , { useEffect, useState, ChangeEvent, FormEvent }from 'react';
import './styles.css'
import Header from '../../Components/Header'
import { Link, useHistory } from 'react-router-dom'
import logo from '../../assets/logo.svg'
import { FiArrowLeft } from 'react-icons/fi'
import { Map, TileLayer, Marker } from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet'
import api from '../../services/api'
import axios from 'axios'
import Dropzone from '../../Components/Dropzone'


interface Item {
    id: number,
    title: string,
    image_url: string
}

interface IBGEUFResponse {
    sigla: string,
}

interface IBGECityReponse {
    nome: string
}

const CreatePoint = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);

    const [initialPositionMap, setInitialPositionMap] = useState<[number, number]>([0,0]);

    const [formData, setFormData] = useState({
        name: '',
        email:'',
        whatsapp: ''
    })

    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [selectedPositionMap, setSelectedPositionMap] = useState<[number, number]>([0,0]);
    const [selectedUF, setSelectedUF] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');
    const [selectedFile, setSelectedFile] = useState<File>();

    const history = useHistory();

    useEffect(()=> {
            navigator.geolocation.getCurrentPosition(position => {
                const {latitude, longitude} = position.coords;

                setInitialPositionMap([latitude, longitude]);

                setSelectedPositionMap([latitude, longitude]);
            })
    },[])

    //sempre que criamos um arryay ou obj, precisamos informar o tipo da varial
    //terceiro parametro [] - vazio, vai ser buscaco uma unica vez
    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data);   
        });
    }, []);

    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados/').then(response => {
            const ufInitials = response.data.map(uf => uf.sigla)
            setUfs(ufInitials);
        })
    }, []);


    useEffect(() => {
        if(selectedUF === '0')
            setCities([]);

        axios.get<IBGECityReponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`)
        .then(response => {
            const citysInitials = response.data.map(city => city.nome)

            setCities(citysInitials);
        })
    },[selectedUF]);

    function handleSelectedUF(event: ChangeEvent<HTMLSelectElement>){
        setSelectedUF(event.target.value);
    }

    function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>){
        setSelectedCity(event.target.value);
    }

    function handleMapClick(event: LeafletMouseEvent){
        setSelectedPositionMap([
            event.latlng.lat,
            event.latlng.lng
        ])        
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>)
    {
        const {name, value } = event.target;
        //... copiar tudo
        setFormData({
            ...formData, [name]: value
        })
    }

    function handleSelectedItem(id: number)
    {
        const alreadySelected = selectedItems.findIndex(item => item === id);
        
        if(alreadySelected >= 0)
        {
            const filteresItems = selectedItems.filter(item => item !== id);

            setSelectedItems(filteresItems)
        }else
            setSelectedItems([ ...selectedItems, id ])
    }

    async function handleSubmit(event: FormEvent)
    {
        event.preventDefault();

        console.log(selectedFile)
 
        const data = new FormData()

        const {name, email,whatsapp} = formData;
        const uf = selectedUF;
        const city = selectedCity;
        const [latitude, longitude] = selectedPositionMap;
        const items = selectedItems;

        
           data.append('name', name);
           data.append('email', email)
           data.append('whatsapp',whatsapp)
           data.append('uf',uf)
           data.append('city',city)
           data.append('latitude',String(latitude))
           data.append('longitude', String(longitude))
           data.append('items', items.join(','))

           if(selectedFile)
             data.append('image', selectedFile)       

       await api.post('points', data);

       alert('Ponto de coleta criado');
       history.push('/')
    }

    return (
        <div id="page-create-point">
         <header>
            <img src={logo} alt="Ecoleta"/> 
            
            <Link to="/"> 
                <FiArrowLeft />
                Voltar para home
            </Link>
         </header>

         <form onSubmit={handleSubmit}>
             <h1>Cadastro do <br /> ponto de coleta</h1>

        <Dropzone onFileUploaded={ setSelectedFile} />

          <fieldset>
              <legend>
                  <h2>Dados</h2>
             </legend>
           
             <div className="field">
                     <label htmlFor="name">Nome da entidade</label>
                     <input 
                         type="text" 
                         name="name" 
                         id="name"
                         onChange={handleInputChange}/>
            </div>

            <div className="field-group">
                 <div className="field">
                     <label htmlFor="email">E-Mail</label>
                     <input 
                         type="email" 
                         name="email" 
                         id="email"
                         onChange={handleInputChange}/>
                 </div>
                 <div className="field">
                     <label htmlFor="whatsapp">Whatsapp</label>
                     <input 
                         type="text" 
                         name="whatsapp" 
                         id="whatsapp"
                         onChange={handleInputChange}/>
                 </div>
            </div>

          </fieldset>

          <fieldset>
              <legend>
                  <h2>Endereço</h2>
                  <span>Selecione o endereço no mapa</span>
             </legend>
            {/* primeiro latitude, longitude */}
             <Map center={initialPositionMap} zoom={15} onClick={handleMapClick}>
                     <TileLayer
                       attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                       url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                     />
                     <Marker position={selectedPositionMap} />
             </Map>

             <div className="field-group">
                 <div className="field">
                    <label htmlFor="uf">Estado (UF)</label>
                    <select name="uf" id="uf" value={selectedUF} onChange={handleSelectedUF}>
                    <option value="0">Selecione uma UF</option>
                    {
                        ufs.map(uf => (<option key={uf} value={uf}>{uf}</option>))  
                    }
                    </select>
                 </div>

                 <div className="field">
                    <label htmlFor="city">Cidade</label>
                    <select name="city" id="city" value={selectedCity} onChange={handleSelectedCity}>
                        <option value="0">Selecione uma cidade</option>
                        {cities.map(city => (
                             <option key={city} value={city}>{city}</option>
                         ))}
                    </select>
                 </div>
             </div>
          </fieldset>

          <fieldset>
              <legend>
                  <h2>Ítens de coleta</h2>
                  <span>Selecione um ou mais itens abaixo</span>
             </legend>

             <ul className="items-grid">
                 {
                     items.map(item => (
                        <li key={item.id} 
                            onClick={() => handleSelectedItem(item.id)}
                            className={selectedItems?.includes(item.id) ? 'selected' : ''}
                        >
                            <img src={item.image_url} alt={item.title}/>
                            <span> {item.title}</span>
                        </li> 
                     ))
                 }
                               
             </ul>
          </fieldset>

        <button type="submit">Cadastrar ponto de coleta</button>
         </form>
        </div>
    )
}

export default CreatePoint;