import React from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import { useState } from 'react'

function Result({selectedTypes}) {

    const x = (id) => {
        if (id < 10) {
            return "00"
        } else if (id < 100) {
            return "0"
        } else {
            return ""
        }
    }

    const [pokemons, setPokemons] = useState([])
  

    useEffect(() => {
        async function fetchData() {
            const response = await axios.get('https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json')
            setPokemons(response.data)
        }
        fetchData()
    }, [])
  
  
    return (
    <div>
        {
            pokemons.map(pokemon => {
                if(selectedTypes.length === 0) {
                    return (
                        <>
                        </>
                    )
                } else
                if (selectedTypes.every(type => pokemon.type.includes(type))) {
                return (
                    <>
                    <div className='pokemon_list'>
                        {pokemon.name.english}
                        <img src = {`https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/${x(pokemon.id)}${pokemon.id}.png`} alt={pokemon.name.english} />
                        <br/>
                     </div>
                     </>
                        )   
                    }
                 })
        }

    </div>
  )
}

export default Result