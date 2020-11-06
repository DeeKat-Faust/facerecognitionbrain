import React from 'react';
import Clarifai from 'clarifai';
import dotenv from 'dotenv';
import './App.css';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';

dotenv.config();

// const Clarifai = require('clarifai');

const clarifaiApp = new Clarifai.App({
  apiKey: process.env.REACT_APP_CLARIFAI_API_KEY
});

const particleOptions = {
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
    }
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  onDetectClick = (event) => {

    this.setState({ imageUrl: this.state.input })

    clarifaiApp.models.initModel({ id: Clarifai.FACE_DETECT_MODEL })
      .then(faceModel => {
        return faceModel.predict(this.state.input);
      })
      .then(response => {
        let regions = response['outputs'][0]['data']['regions'];
        console.log(regions);
        let firstRegionBox = regions[0]['region_info']['bounding_box'];
        console.log(firstRegionBox);
      })
  }

  render() {
    return (
      <div className="App">
        <Particles className='particles' params={particleOptions} />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm onInputChange={this.onInputChange} onDetectClick={this.onDetectClick} />
        <FaceRecognition imageUrl={this.state.imageUrl} />
      </div>
    );
  }
}

export default App;
