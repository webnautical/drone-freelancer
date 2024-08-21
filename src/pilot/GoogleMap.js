import React, { useEffect } from 'react';

const GoogleMap = (lat, long, raduis) => {


  const initMap = () => {
    const map = new window.google.maps.Map(document.getElementById('map'), {
      zoom: 10,
      center: { lat: 37.7749, lng: -122.4194 }, // Set your desired center coordinates
      mapTypeId: 'terrain',
    });

    new window.google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map,
      center: { lat: 37.7749, lng: -122.4194 },
      radius: 5000,
    });
  };
  useEffect(() => {
    initMap();
  }, []);
  console.log(lat, long, raduis, "shhshs")
  return <div id="map" style={{ height: '400px', width: '100%' }}></div>;
};

export default GoogleMap;
