import React from 'react';
import { useState, useEffect } from "react";
import { ref, set } from "firebase/database";
import { db } from "../firebase.js";
import "./Form.css";
import axios from 'axios';
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';

function Form() {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [country, setCountry] = useState('');
    const [parish, setParish] = useState('');

    function writeData(userId, firstName, lastName, email, city, state, zipcode, country, parish, lat, lng) {
        set(ref(db, 'visitors/' + userId), {
          firstName: firstName,
          lastName: lastName,
          email: email,
          city: city,
          state: state,
          zipcode: zipcode,
          country: country,
          latitude: lat,
          longitude: lng,
          parish: parish
        });
    }

    function handleSubmit(event) {

        event.preventDefault();

        let userId = email.split("@")[0];
        let address = city + ", " + state;

        axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            address
            )}&key=AIzaSyBfyZ7xwtZdyg7f8lWUPFE99AJE0VMRpDU`
        ).then((response) => {
            console.log(response);
            if (response.data.results.length > 0) {
                const lat = response.data.results[0].geometry.location.lat;
                const lng = response.data.results[0].geometry.location.lng;
                writeData(userId, firstName, lastName, email, city, state, zipcode, country, parish, lat, lng);
                NotificationManager.success('Your data has been submitted successfully', 'Form Submission');
            }
        }).catch((error) => {
            console.error('Error occurred while geocoding address: ', error);
        });

        setFirstName('');
        setLastName('');
        setEmail('');
        setCity('');
        setState('');
        setCountry('');
        setParish('');
    }

    return (
    <div className='form'>
        <h1>Guest Sign In</h1>
        <form onSubmit={handleSubmit}>
            <label htmlFor="firstName">First Name:</label>
            <input onChange={e => setFirstName(e.target.value)} type="text" id="firstName" name="firstName" required />

            <label htmlFor="lastName">Last Name:</label>
            <input onChange={e => setLastName(e.target.value)} type="text" id="lastName" name="lastName" required />

            <label htmlFor="email">Email:</label>
            <input onChange={e => setEmail(e.target.value)} type="email" id="email" name="email" required />

            <label htmlFor="city">City:</label>
            <input onChange={e => setCity(e.target.value)} type="text" id="city" name="city" required />

            <label htmlFor="state">State:</label>
            <input onChange={e => setState(e.target.value)} type="text" id="state" name="state" required />

            <label htmlFor="zipcode">Zip Code:</label>
            <input onChange={e => setZipcode(e.target.value)} type="text" id="zipcode" name="zipcode" required />

            <label htmlFor="country">Country:</label>
            <input onChange={e => setCountry(e.target.value)} type="text" id="country" name="country" required />

            <label htmlFor="parish">Parish:</label>
            <input onChange={e => setParish(e.target.value)} type="text" id="parish" name="parish" />

            <button type="submit"> Submit </button> 
        </form>

        <NotificationContainer />
    </div>
  )
}

export default Form