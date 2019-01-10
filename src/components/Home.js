import React from 'react';
import { Tabs, Spin, Row, Col, Radio } from 'antd';
import { GEO_OPTIONS, API_ROOT, POS_KEY, TOKEN_KEY, AUTH_HEADER } from '../constants';
import { Gallery } from './Gallery';
import { CreatePostButton } from './CreatePostButton';
import { AroundMap } from './AroundMap';

const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;
//const operations = <Button>Extra Action</Button>;

export class Home extends React.Component {
  state = {
    isLoadingGeoLocation: false,
    isLoadingPosts: false,
    error: '',
    posts: [],
    topic: 'around',
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
      lat: 35.780422,
      lon: -121.330554
      //lat: latitude, 
      //lon: longitude 
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


  loadNearbyPosts = (center, radius) => {
    // TODO:
    // 1. read location: lat, lon
    // 2. request posts from API
    // 3. setState, put returned posts into state
    // console.log(lat, lon);
    const {lat, lon} = center ? center : JSON.parse(localStorage.getItem(POS_KEY));
    const token = localStorage.getItem(TOKEN_KEY);
    const range = radius ? radius : 20000;
    
    this.setState({isLoadingPosts: true});
    fetch(`${API_ROOT}/search?lat=${lat}&lon=${lon}&range=${range}`, {
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


  getPanelContent = (type) => {
    if (this.state.error) {
      return <div>{this.state.error}</div>;
    } 
    if (this.state.isLoadingGeoLocation) {
      return <Spin tip="Loading Geolocation..." />;
    }
    if (this.state.isLoadingPosts) {
      return <Spin tip="Loading posts..." />;
    }
    if (this.state.posts && this.state.posts.length > 0) {
      return type === "image" ? this.getImagePosts() : this.getVideoPosts();
    }
    return 'no nearby post';
  }

  getImagePosts = () => {
    const images = this.state.posts
      .filter((post) => post.type === "image")
      .map((post) => {
        return {
          user: post.user,
          src: post.url,
          thumbnail: post.url,
          caption: post.message,
          thumbnailWidth: 400,
          thumbnailHeight: 300,
        }
      });
    return (<Gallery images={images}/>);
  }

  getVideoPosts = () => {
    return (
      <Row gutter={32}>
        <Col span={6}>Video 1</Col>
        {
          this.state.posts
            .filter((post) => post.type === "video")
            .map((post) => (
              <Col span={6} key={post.url}>
                <video src={post.url} controls className="video-block"/>
                <p>{`${post.user}: ${post.message}`}</p>
              </Col>
            ))
        }
      </Row>
    );
  }

  onTopicChange = (e) => {
    const topic = e.target.value;
    this.setState({topic});
    this.updatePosts({topic});
  }

  loadFacesAroundTheWorld = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    this.setState({isLoadingPosts: true});
    fetch(`${API_ROOT}/cluster?term=face`, {
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
  }

  updatePosts = ({topic, center, radius}) => {
    topic = topic || this.state.topic;
    if (topic === 'face') {
      this.loadFacesAroundTheWorld();
    } else {
      this.loadNearbyPosts(center, radius);
    }
  }

 render() {
   console.log('state:', this.state);
   const operations = <CreatePostButton loadNearbyPosts={this.loadNearbyPosts}/>;
   return (
     <div>
       <RadioGroup onChange={this.onTopicChange} value={this.state.topic}>
         <Radio value="around">Posts Around Me</Radio>
         <Radio value="face">Faces Around the World</Radio>
       </RadioGroup>
        <Tabs tabBarExtraContent={operations} className="main-tabs">
          <TabPane tab="Image Posts" key="1">
            {this.getPanelContent("image")}
          </TabPane>
          <TabPane tab="Video Posts" key="2">
            {this.getPanelContent("video")}
          </TabPane>
          <TabPane tab="Map" key="3">
            <AroundMap 
                isMarkerShown
                googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyD3CEh9DXuyjozqptVB5LA-dN7MxWWkr9s&v=3.exp&libraries=geometry,drawing,places"
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `600px` }} />}
                mapElement={<div style={{ height: `100%` }} />}
                posts={this.state.posts}
                updatePosts={this.updatePosts}
                //loadNearbyPosts={this.loadNearbyPosts}
                //loadFacesAroundTheWorld={this.loadFacesAroundTheWorld}
                //topic={this.state.topic}
            />
          </TabPane>
        </Tabs>
      </div>
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