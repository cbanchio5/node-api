window.addEventListener('load', function() {
  const locations = JSON.parse(document.getElementById('map').dataset.locations)
  console.log(locations)


  mapboxgl.accessToken = 'pk.eyJ1IjoiY2JhbmNoaW8iLCJhIjoiY2w3ZnoydDhqMDAxZzN1bndmemhnd2sydSJ9.VvOOe7c31vXCFGQVtwrslw';
  const map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/cbanchio/cl7g00d96000514tayxblcv5e',
      scrollZoom:false // style URL
      // center: [-74.5, 40], // starting position [lng, lat]
      // zoom: 9, // starting zoom
      // projection: 'globe' // display the map as a 3D globe
  });

  const bounds = new mapboxgl.LngLatBounds()
  locations.forEach(loc => {
    //Create marker
    const el = document.createElement('div')
    el.className = 'marker'
    //Add the marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    }).setLngLat(loc.coordinates).addTo(map)

    //add popup
    new mapboxgl.Popup({
      offset:30
    }).setLngLat(loc.coordinates).setHTML(`<p>Dat ${loc.day}: ${loc.description}</p>`).addTo(map)

    bounds.extend(loc.coordinates)
  })

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left:100,
      right: 100
    }
  } )


})
