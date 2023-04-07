import React from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import { useState } from 'react'

function Search({selectedTypes, setSelectedTypes}) {
    const [Types, setTypes] = useState([])

    // called once when component is mounted
   useEffect(() => {
    async function fetchTypes() {
      const response = await axios.get('https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/types.json')
      setTypes(response.data.map(type => type.english))
    }
    fetchTypes()
  }, [])

  const handleChange = (e) => {
    const {value, checked} = e.target
    if (checked) {
        setSelectedTypes([...selectedTypes, value])
    } else {
        setSelectedTypes(selectedTypes.filter(type => type !== value))
        }
    }

  return (
    <div>
        {
            Types.map(type => <div key ={type}>
                <label htmlFor={type}>{type}</label>
                <input
                    type="checkbox"
                    value={type}
                    id={type}
                    onChange={handleChange}
                    />
            
            
            </div>)
        }
    </div>
  )
}

export default Search