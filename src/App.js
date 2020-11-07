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
      boxLocations: [],
    }
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  onDetectClick = (event) => {
    this.setState({ imageUrl: this.state.input });

    clarifaiApp.models.initModel({ id: Clarifai.FACE_DETECT_MODEL })
      .then(faceModel => faceModel.predict(this.state.input))
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response)));
  }

  calculateFaceLocation = (data) => {
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);

    const regions = data['outputs'][0]['data']['regions'];
    const boxLocations = regions.map((region) => {
      let boundingBox = region['region_info']['bounding_box'];
      return {
        top: height * boundingBox.top_row,
        right: width - (width * boundingBox.right_col),
        bottom: height - (height * boundingBox.bottom_row),
        left: width * boundingBox.left_col,
      }
    });
    
    return boxLocations;
  }

  displayFaceBox = (boxLocations) => {
    this.setState({ boxLocations: boxLocations });
  }

  render() {
    return (
      <div className="App">
        <Particles className='particles' params={particleOptions} />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm onInputChange={this.onInputChange} onDetectClick={this.onDetectClick} />
        <FaceRecognition imageUrl={this.state.imageUrl} boxLocations={this.state.boxLocations} />
      </div>
    );
  }
}

export default App;
