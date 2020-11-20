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
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';

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
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        email: '',
        name: '',
        entries: '',
        joined: ''
      }
    }
  }

  componentDidMount() {
    // fetch('http://localhost:3010/')
    //   .then(response => response.json())
    //   .then(console.log)
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  onPictureSubmit = (event) => {
    this.setState({ imageUrl: this.state.input });

    clarifaiApp.models.initModel({ id: Clarifai.FACE_DETECT_MODEL })
      .then(faceModel => faceModel.predict(this.state.input))
      .then(response => {
        fetch('http://localhost:3010/image', {
          method: 'put',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: this.state.user.email
          })
        }).then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {entries: count}))
          })
        this.displayFaceBox(this.calculateFaceLocation(response));
      });
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

  onRouteChange = (route) => {
    if (route === 'home')
      this.setState({ isSignedIn: true });
    else
      this.setState({ isSignedIn: false, imageUrl: '' });
    this.setState({ route: route });
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data._id,
        email: data.email,
        name: data.name,
        entries: data.entries,
        joined: data.joined
      }
    })
  }

  render() {
    const { isSignedIn, route, imageUrl, boxLocations } = this.state;
    return (
      <div className="App">
        <Particles className='particles' params={particleOptions} />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn} />
        {
          route === 'signin'
            ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            : (
              route === 'register'
                ? <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
                : <>
                  <Logo />
                  <Rank name={this.state.user.name} entries={this.state.user.entries} />
                  <ImageLinkForm onInputChange={this.onInputChange} onPictureSubmit={this.onPictureSubmit} />
                  <FaceRecognition imageUrl={imageUrl} boxLocations={boxLocations} />
                </>
            )
        }
      </div>
    );
  }
}

export default App;
