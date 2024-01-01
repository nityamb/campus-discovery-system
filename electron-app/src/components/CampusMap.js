import React from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import '../stylesheets/MapCanvas.css';
mapboxgl.accessToken = 'pk.eyJ1IjoibmJoYWNoYXdhdDMiLCJhIjoiY2xhdnAzN3hxMDR6YzN1cnYwYXBpcDc1aiJ9.MvLxt9auJ4nfXMV_Zmbx1A';

export default class CampusMap extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            lng: this.props.lng ? this.props.lng : -84.3983,
            lat: this.props.lat ? this.props.lat : 33.7771,
            zoom: 14.5
        };
        this.mapContainer = React.createRef();
    }

    componentDidMount() {
        const { lng, lat, zoom } = this.state;
        const map = new mapboxgl.Map({
            container: this.mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [lng, lat],
            zoom: zoom,
            maxBounds: [-84.4073, 33.7686, -84.3859, 33.7835]
        });
        map.addControl(
            new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                mapboxgl: mapboxgl,
                marker: false,
                limit: 3,
                bbox: [-84.4073, 33.7686, -84.3859, 33.7835],
                enableEventLogging: false
            })
        );
        this.addMarkers(map);

        map.on('move', () => {
            this.setState({
                lng: map.getCenter().lng.toFixed(4),
                lat: map.getCenter().lat.toFixed(4),
                zoom: map.getZoom().toFixed(2)
            });
        });

        map.on('load', () => {
            map.resize();
        });
    }

    addMarkers = (map) => {
        this.props.events.forEach(e => {
            const marker = new mapboxgl.Marker({
                color: e.access === 'Public' ? '#00C1FF' : '#DA0000'
            }).setLngLat([e.lngLat[0], e.lngLat[1]])
                .setPopup(new mapboxgl.Popup().setHTML(`<h3>${e.name}</h3>`))
                .addTo(map);
            const markerDiv = marker.getElement();
            markerDiv.addEventListener('click', () => {
                this.props.show(e);
            });
            markerDiv.addEventListener('mouseenter', () => {
                marker.togglePopup();
            });
            markerDiv.addEventListener('mouseleave', () => {
                marker.togglePopup();
            });
        });
    }

    render() {
        return (
            <>
                <div className="sidebar">
                    Events: {this.props.events.length} | [{this.state.lat}, {this.state.lng}] | Zoom: {this.state.zoom}
                </div>
                <div ref={this.mapContainer} className="map-container" />
            </>
        );
    }
}