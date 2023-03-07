import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import { useState, useEffect } from 'react'

function App() {

  const [data, setData] = useState({})
  const [europeData, seteuropeData] = useState({})

  useEffect(() => {
    async function getData() {
      let res = await fetch('https://supercharge.info/service/supercharge/allSites')
      let mapInfo = await res.json()
      setData(mapInfo)
    }
    getData()
  }, [])

  useEffect(() => {
    if (data.length > 0) {
      const filterData = data.filter(element => element.address.region === "Europe")
      seteuropeData(filterData)
    }
    console.log('lefut datauseeffect')
  }, [data])

  function apiBtn() {
    console.log('europeData:', europeData)
  }

  return (
    <div className="App">
      <button onClick={apiBtn}>API</button>
      <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {europeData.map(tesla=>(
            <Marker 
            key={tesla.id}
            position={[tesla.gps.latitude, tesla.gps.longitude]}>
            </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

export default App
