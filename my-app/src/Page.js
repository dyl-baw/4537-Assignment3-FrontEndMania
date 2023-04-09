import React from 'react'
import Pokemon from './Pokemon'

function page({ currentPokemons, setCurrentId, currentId, refreshtoken, username, accesstoken, setAccesstoken }) {

  return (
    <div>
      <div className="pokemon-list">
        {
          currentPokemons.map(item => {
            return <>
              <div className='imgBorder'>
                <div key={item.id}>  <Pokemon pokemon={item} setCurrentId={setCurrentId} currentId={currentId} accessToken={accesstoken} setAccessToken={setAccesstoken} refreshToken={refreshtoken} userid={username} />   </div>
              </div>
            </>
          })
        }
      </div>
    </div>
  )
}

export default page;