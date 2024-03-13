import './App.css';

import { useState, useEffect } from "react";

import GoogleMapReact from 'google-map-react';

import { db } from "./firebase";
import { ref, onValue } from "firebase/database";
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
        background: 'blue',
        borderColor: 'black',
        borderWidth: 1
      }}
    />
  );
};

function App() {
  const [data, setData] = useState();
  const [show, setShow] = useState(true);
  const [mapIndex, setMapIndex] = useState(0);

  const defaultProps = {
    UnitedStates: {
      center: {
        lat: 39.791000,
        lng: -86.148003
      },
      zoom: 4
    },
    Canada: {
      center: {
        lat: 59.791000,
        lng: -86.148003
      },
      zoom: 3
    }
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

  useEffect(() => {
    const interval = setInterval(() => {
      // Update the content here based on the time interval
       setMapIndex((prevIndex) => (prevIndex + 1) % 4);
    }, 5000); // Change content every 5 seconds

    return () => {
      clearInterval(interval); // Cleanup the interval when the component unmounts
    };

  }, []);

  let content;
  if (show) {
    if (mapIndex === 0) {
      content = (
        <>
        <h2>Past Year Guests</h2>
        <div key={mapIndex} className="us-map yearly" style={{ height: '500px', width: '75%', margin: "auto"}}>
          <GoogleMapReact
            bootstrapURLKeys={{ key: "AIzaSyBfyZ7xwtZdyg7f8lWUPFE99AJE0VMRpDU" }}
            defaultCenter={defaultProps.UnitedStates.center}
            defaultZoom={defaultProps.UnitedStates.zoom}
            draggable={false} // Disable map dragging
            options={{ gestureHandling: 'none' }} // Disable Map Interaction
          >
          {data && (
          Object.keys(data).map((key) => {
            const curYear = new Date().getFullYear();
            if (curYear === data[key].year) {
              return <Marker key={key} lat={data[key].latitude} lng={data[key].longitude} />
            } else {
              return null;
            }
          })
          )}
          </GoogleMapReact>
        </div>
        </>
      );
    } else if (mapIndex === 1) {
      content = (
        <>
        <h2>Past Month Guests</h2>
        <div key={mapIndex} className="us-map monthly" style={{ height: '500px', width: '75%', margin: "auto"}}>
          <GoogleMapReact
            bootstrapURLKeys={{ key: "AIzaSyBfyZ7xwtZdyg7f8lWUPFE99AJE0VMRpDU" }}
            defaultCenter={defaultProps.UnitedStates.center}
            defaultZoom={defaultProps.UnitedStates.zoom}
            draggable={false} // Disable map dragging
            options={{ gestureHandling: 'none' }} // Disable Map Interaction
          >
          {data && (
          Object.keys(data).map((key) => {
            const curMonth = new Date().getMonth();
            const curYear = new Date().getFullYear();

            if (curMonth === data[key].month && curYear === data[key].year) {
              return <Marker key={key} lat={data[key].latitude} lng={data[key].longitude} />
            } else {
              return null;
            }
          })
          )}
          </GoogleMapReact>
        </div>
        </>
      );
    } else if (mapIndex === 2) {
      content = (
        <>
        <h2>Past Week Guests</h2>
        <div key={mapIndex} className="us-map weekly" style={{ height: '500px', width: '75%', margin: "auto"}}>
          <GoogleMapReact
            bootstrapURLKeys={{ key: "AIzaSyBfyZ7xwtZdyg7f8lWUPFE99AJE0VMRpDU" }}
            defaultCenter={defaultProps.UnitedStates.center}
            defaultZoom={defaultProps.UnitedStates.zoom}
            draggable={false} // Disable map dragging
            options={{ gestureHandling: 'none' }} // Disable Map Interaction
          >
          {data && (
          Object.keys(data).map((key) => {
            
            const givenDate = new Date(data[key].year, data[key].month, data[key].day); 
            const today = new Date();
            const pastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
            const isPastWeek = givenDate >= pastWeek && givenDate <= today;
            
            if (isPastWeek) {
              return <Marker key={key} lat={data[key].latitude} lng={data[key].longitude} />
            } else {
              return null;
            }
          })
          )}
          </GoogleMapReact>
        </div>
        </>
      );
    } else {
      content = (
        <>
        <h2>Today's Guests</h2>
        <div key={mapIndex} className="us-map today" style={{ height: '500px', width: '75%', margin: "auto"}}>
          <GoogleMapReact
            bootstrapURLKeys={{ key: "AIzaSyBfyZ7xwtZdyg7f8lWUPFE99AJE0VMRpDU" }}
            defaultCenter={defaultProps.UnitedStates.center}
            defaultZoom={defaultProps.UnitedStates.zoom}
            draggable={false} // Disable map dragging
            options={{ gestureHandling: 'none' }} // Disable Map Interaction
          >
          {data && (
          Object.keys(data).map((key) => {
            const curMonth = new Date().getMonth();
            const curYear = new Date().getFullYear(); 
            const curDay = new Date().getDate();

            if (curDay === data[key].day && curMonth === data[key].month && curYear === data[key].year) {
              return <Marker key={key} lat={data[key].latitude} lng={data[key].longitude} />
            } else {
              return null;
            }
          })
          )}
          </GoogleMapReact>
        </div>
        </>
      );
    }
  } else {
    content = (
      <div className='form-container'>
        <Form />
      </div>
    );
  }

  console.log(mapIndex);

  return (
    <div className="App">
      <div className='navbar' style={{display: "flex", flexDirection: "row", gap: 200, alignItems: "center"}}>
        <h1>Welcome To Guest Maps</h1>
        <button onClick={() => setShow(!show)} style={{height: 50, width: 100, backgroundColor: "#0275d8", cursor: "pointer", border: "none", borderRadius: 5}}>{show ? 'Add Entry' : 'Show Map'}</button>
      </div>
      {content}
    </div>
  );
}

export default App;
