import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { useState, useEffect } from 'react'

function App() {

  const [data, setData] = useState({})
  const [filteredData, setFilteredData] = useState({})
  const [selectedRegion, setSelectedRegion] = useState({
    region: 'Europe',
    center: [48.227093, 7.753694]
  })
  const regions = [
    {
      "region": "Europe",
      "center": [48.227093, 7.753694]
    },
    {
      "region": "Asia Pacific",
      "center": [33.60084662, 114.0130563]
    },
    {
      "region": "North America",
      "center": [41.220935, -95.835622]
    }
  ]

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
      const filterData = data.filter(element => element.address.region === selectedRegion.region)
      setFilteredData(filterData)
    }
  }, [data, selectedRegion.region])


  function changeRegion(e) {
    let newRegion = regions.filter(region => region.region === e.target.value)
    setSelectedRegion({
      region: newRegion[0].region,
      center: newRegion[0].center
    })
  }

  function ChangeView({ center }) {
    const map = useMap()
    map.setView(center)
    return null
  }

  return (
    <div className="App">
      <header>
        <h1 className='page-title'>Tesla supercharger map</h1>
        <div className='select-region-container'>
          <p>Select region:</p>
          <select onChange={(e) => { changeRegion(e) }} className='select-region-dropdown'>
            <option>Europe</option>
            <option>Asia Pacific</option>
            <option>North America</option>
          </select>
        </div>
      </header>
      <MapContainer center={selectedRegion.center} zoom={5} scrollWheelZoom={true}>
        <ChangeView center={selectedRegion.center} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {filteredData.length > 0 &&
          filteredData.map(tesla => (
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
