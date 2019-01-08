import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps";
import { AroundMarker } from './AroundMarker';
import { POS_KEY } from '../constants';

class NormalAroundMap extends React.Component {
reloadMarkers = () => {
    this.props.loadNearbyPosts();
}

    render() {
        const {lat, lon} = JSON.parse(localStorage.getItem(POS_KEY));
        return (
            <GoogleMap
                defaultZoom={10}
                defaultCenter={{ lat: lat, lng: lon }}
                onDragEnd={this.reloadMarkers}
                onZoomChanged={this.reloadMarkers}
            >
            { 
                this.props.posts.map(post => <AroundMarker post={post} key={post.url} />)
            }
          </GoogleMap>
        );
    }
}

export const AroundMap = withScriptjs(withGoogleMap(NormalAroundMap));