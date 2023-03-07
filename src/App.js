import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
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
  }, [data])



  return (
    <div className="App">
      <h1 className='page-title'>Tesla supercharger map</h1>
      <div className='select-region-container'>
        <p>Select region:</p>
        <select>
          <option>Europe</option>
          <option>Asia Pacific</option>
          <option>North America</option>
        </select>
      </div>
      <MapContainer center={[51.505, -0.09]} zoom={6} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {europeData.length > 0 &&
          europeData.map(tesla => (
            <Marker
              key={tesla.id}
              position={[tesla.gps.latitude, tesla.gps.longitude]}>
              <Popup className='map-popup' position={[tesla.gps.latitude, tesla.gps.longitude]}>
                <p className='popup-name'>{tesla.name}</p>
                <p>{`GPS: ${tesla.gps.latitude}, ${tesla.gps.longitude}`}</p>
                <p>{`Power: ${tesla.powerKilowatt}kW`}</p>
                <p>{`Stalls: ${tesla.stallCount}`}</p>
              </Popup>
            </Marker>
          ))
        }
      </MapContainer>
    </div>
  )
}

export default App
