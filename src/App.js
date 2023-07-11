import './App.css';

import { useState, useEffect } from "react";

import GoogleMapReact from 'google-map-react';

import { db } from "./firebase";
import { ref, onValue, set } from "firebase/database";
import Form from "./components/Form";

// Define your draggable marker component
const Marker = () => {
  return (
    <div
      style={{
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: 'red'
      }}
    />
  );
};

function App() {
  const [data, setData] = useState();
  const [show, setShow] = useState(true);

  const defaultProps = {
    center: {
      lat: 39.791000,
      lng: -86.148003
    },
    zoom: 4
  };

  // Read Data using Firebase
  useEffect(() => {
    onValue(ref(db), (snapshot) => {
      const db_data = snapshot.val();
      if (db_data !== null) {
        setData(db_data);
      }
    });
  }, []);

  let content;
  if (show) {
    content = (
      <div className="map" style={{ height: '500px', width: '75%', margin: "auto"}}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyBfyZ7xwtZdyg7f8lWUPFE99AJE0VMRpDU" }}
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
          draggable={false} // Disable map dragging
          options={{ gestureHandling: 'none' }} // Disable Map Interaction
        >
        {data && data.visitors && (
        Object.keys(data.visitors).map((key) => {
          return <Marker key={key} lat={data.visitors[key].latitude} lng={data.visitors[key].longitude} />
        })
        )}
        </GoogleMapReact>
      </div>
    );
  } else {
    content = (
      <div className='container'>
        <Form />
      </div>
    );
  }

  return (
    <div className="App">
      <div className='navbar' style={{display: "flex", flexDirection: "row", gap: 200, alignItems: "center"}}>
        <h1>Welcome To Church Maps</h1>
        <button onClick={() => setShow(!show)} style={{height: 50, width: 100, backgroundColor: "#0275d8", cursor: "pointer", border: "none", borderRadius: 5}}>{show ? 'Add Entry' : 'Show Map'}</button>
      </div>
      {content}
    </div>
  );
}

export default App;
