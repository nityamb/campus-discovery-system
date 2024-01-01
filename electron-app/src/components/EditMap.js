import React from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import '../stylesheets/MapCanvas.css';
mapboxgl.accessToken = 'pk.eyJ1IjoibmJoYWNoYXdhdDMiLCJhIjoiY2xhdnAzN3hxMDR6YzN1cnYwYXBpcDc1aiJ9.MvLxt9auJ4nfXMV_Zmbx1A';

export default class EditMap extends React.PureComponent {
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
                limit: 3,
                bbox: [-84.4073, 33.7686, -84.3859, 33.7835],
                enableEventLogging: false
            })
        );

        if (this.props.lngLat && this.props.lngLat.length > 0) {
            new mapboxgl.Marker({
                color: '#29CF00'
            }).setLngLat(this.props.lngLat)
                .addTo(map);
        }

        map.on('move', () => {
            this.setState({
                lng: map.getCenter().lng.toFixed(4),
                lat: map.getCenter().lat.toFixed(4),
                zoom: map.getZoom().toFixed(2)
            });
        });

        map.on('click', (e) => {
            fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${e.lngLat.lng},${e.lngLat.lat}.json?types=poi&access_token=${mapboxgl.accessToken}`)
            .then(r => r.json()).then(data => {
                if (data.features.length > 0) {
                    this.props.updateLocation({
                        text: data.features[0].text,
                        lng: data.query[0],
                        lat: data.query[1]
                    });
                } else {
                    this.props.createAlert({
                        type: -1,
                        title: 'Location could not be geocoded! Try a nearby location'
                    });
                }
            });
        });

        map.on('load', () => {
            map.resize();
        });
    }

    render() {
        return (
            <>
                <div className="sidebar">
                    Click on desired event location
                </div>
                <div ref={this.mapContainer} className="map-container" />
            </>
        );
    }
}