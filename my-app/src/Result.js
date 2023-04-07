import React from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import { useState } from 'react'

function Result({selectedTypes}) {

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
                        {pokemon.name.english}
                        <br/>
                     </>
                        )   
                    }
                 })
        }

    </div>
  )
}

export default Result