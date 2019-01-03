import React from 'react';
import { Tabs, Button, Spin } from 'antd';
import { GEO_OPTIONS, API_ROOT, POS_KEY, TOKEN_KEY, AUTH_HEADER } from '../constants';
import { Gallery } from './Gallery';
import { CreatePostButton } from './CreatePostButton';

const TabPane = Tabs.TabPane;
const operations = <Button>Extra Action</Button>;

export class Home extends React.Component {
  state = {
    isLoadingGeoLocation: false,
    isLoadingPosts: false,
    error: '',
    posts: [],
  }

  componentDidMount() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        this.onSuccessLoadGeoLocation,
        this.onFailedLoadGeoLocation,
        GEO_OPTIONS);
      this.setState({ isLoadingGeoLocation: true });
    } else {
      this.setState({ error: 'Geolocation is not supported.'});
    }
  }
  
  onSuccessLoadGeoLocation = (position) => {
    console.log(position);
    const { latitude, longitude } = position.coords;
    localStorage.setItem(POS_KEY, JSON.stringify({
      lat: latitude, 
      lon: longitude 
    }));
    this.setState({ isLoadingGeoLocation: false });
    this.loadNearbyPosts();
    /*
    const { latitude, longitude } = position.coords;
    localStorage.setItem(POS_KEY, JSON.stringify({ lat: latitude, lon: longitude }));
    this.setState({ isLoadingGeoLocation: false });
    this.loadNearbyPosts();
    */
  }

  onFailedLoadGeoLocation = (position) => {
    this.setState({
        isLoadingGeoLocation: false,
        isLoadingPosts: false,
        error: 'Failed to load geolocation.',
        posts: [],
    });
  }


  loadNearbyPosts = () => {
    // TODO:
    // 1. read location: lat, lon
    // 2. request posts from API
    // 3. setState, put returned posts into state
    const {lat, lon} = JSON.parse(localStorage.getItem(POS_KEY));
    // console.log(lat, lon);
    this.setState({isLoadingPosts: true});
    const token = localStorage.getItem(TOKEN_KEY);
    fetch(`${API_ROOT}/search?lat=${lat}&lon=${lon}&range=20000`, {
      method: 'GET',
      headers: {
        Authorization: `${AUTH_HEADER} ${token}`
      }
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then((response) => {
        console.log('response', response);
        this.setState({ isLoadingPosts: false, posts: response ? response : [] });
      })
      .catch((error) => {
        this.setState({error: error.message});
        this.setState({ isLoadingPosts: false, error: error.message });
      });
    console.log(lat, lon);
  }


  getImagePosts = () => {
    if (this.state.error) {
      return <div>{this.state.error}</div>;
    } 
    if (this.state.isLoadingGeoLocation) {
      return <Spin tip="Loading Geolocation..." />;
    }
    if (this.state.isLoadingPosts) {
      return <Spin tip="Loading posts..." />;
    }
    if (this.state.posts.length > 0) {
      const images = this.state.posts.map((post) => {
        return {
          user: post.user,
          src: post.url,
          thumbnail: post.url,
          caption: post.message,
          thumbnailWidth: 400,
          thumbnailHeight: 300,
        }
      });
      // return (<Gallery />); // with fake data/images
      return (<Gallery images={images}/>);
    }
    return 'no nearby post';
    // return <Gallery />;
    // TODO:
    //TODO: Render Posts from API
  }

 render() {
   console.log('state:', this.state);
   const operations = <CreatePostButton />;
   return (
      <Tabs tabBarExtraContent={operations} className="main-tabs">
        <TabPane tab="Posts" key="1">
          {this.getImagePosts()}
        </TabPane>
        <TabPane tab="Map" key="2">Maps</TabPane>
      </Tabs>
   );
 }
}


/*
var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };

if ("geolocation" in navigator) {
    console.log("yes");
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const coords = position.coords;
            console.log("latitude is: ", coords.latitude);
            console.log("longitude is: ",coords.longitude);
        },
        (err) => {
            console.group.warn(`ERROR(${err.code})：${err.message}`);
        },
        options
    );
} else {
    console.log("no");
}
*/