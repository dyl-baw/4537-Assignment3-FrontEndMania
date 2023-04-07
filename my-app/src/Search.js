import React from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import { useState } from 'react'

function Search() {
    const [Types, setTypes] = useState([])

    // called once when component is mounted
   useEffect(() => {
    async function fetchTypes() {
      const response = await axios.get('https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/types.json')
      setTypes(response.data.map(type => type.english))
    }
    fetchTypes()
  }, [])

  return (
    <div>
        {
            Types.map(type => <div key ={type}>
                <label htmlFor={type}>{type}</label>
                <input
                    type="checkbox"
                    value={type}
                    id={type}
                    />
            
            
            </div>)
        }
    </div>
  )
}

export default Search