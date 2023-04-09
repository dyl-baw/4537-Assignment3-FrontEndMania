import React, { useEffect } from 'react'
import axios from 'axios'
import jwt_decode from "jwt-decode"
import { useState } from 'react'
import PokemonPopUp from './PokemonPopUp'
const axiosJWT = axios.create()

function FilteredPokemons(
    { accessToken, refreshToken, setAccessToken, setRefreshToken, searchQuery, typeSelectedArray, 
        pokemons, setPokemons, filteredPokemons, setFilteredPokemons, setCount, pageNumber }) {
    
    const [showModal, setShowModal] = useState(false);
    const [selectedPokemon, setSelectedPokemon] = useState(null);
    const axiosJWT = axios.create()

    axiosJWT.interceptors.request.use(
        async (config) => {
            let currentDate = new Date();
            const decodedToken = jwt_decode(accessToken);
            if (decodedToken.exp * 1000 < currentDate.getTime()) {
                const newAccessToken = await refreshAccessToken();
                config.headers['Authorization'] = newAccessToken;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    const refreshAccessToken = async () => {
        try {
            const res = await axios.post("http://localhost:8080/requestNewAccessToken", {}, {
                headers: {
                    'Authorization': `Bearer ${accessToken} Refresh ${refreshToken}`
                }
            });
            console.log("refresh token requested");
            const authHeader = res.headers["authorization"];
            setAccessToken(authHeader.split(" ")[1]);
            setRefreshToken(authHeader.split(" ")[3]);
            return authHeader;
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        async function fetchData() {
            const response = await axios.get('https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json')
            setPokemons(response.data)
        }
        fetchData()
    }, [])


    var filtered = pokemons;
    console.log(filtered);

    useEffect(() => {
        let filtered = pokemons.filter(pokemon =>
            pokemon.name.english.toLowerCase().includes(searchQuery)
        );
    
        filtered = filtered.filter(pokemon => 
            typeSelectedArray.every(type => pokemon.type.includes(type))
        );
    
        setCount(filtered.length);
    
        const pokemonsPerPage = 5;
        const startIndex = (pageNumber - 1) * pokemonsPerPage;
        const endIndex = startIndex + pokemonsPerPage;
    
        setFilteredPokemons(filtered.slice(startIndex, endIndex));
    }, [searchQuery, pokemons, pageNumber, typeSelectedArray]);
    
    const handlePokemonPopUp = (pokemon) => {
        setSelectedPokemon(pokemon);
        setShowModal(true);
    };

    return (
        <div className='pokemon-grid'>
            {
                filteredPokemons.map(pokemon => {
                    // if(typeSelectedArray.every(type => pokemon.type.includes(type))){
                        var id = '00' + pokemon.id;
                        id = id.slice(-3);

                        return <div key={pokemon.id} className="pokemon-list" onClick={() => handlePokemonPopUp(pokemon)}>
                            <img key={id} className="pokemon-image" src={`https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/${id}.png`} alt={pokemon.name.english} />
                            <span key={pokemon.name.english}>{pokemon.name.english}</span>
                            </div>
                    // }
                })
            }
            <PokemonPopUp
                showModal={showModal}
                setShowModal={setShowModal}
                pokemon={selectedPokemon}
                />
        </div>
    )
}

export default FilteredPokemons