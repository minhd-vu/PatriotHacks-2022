/* eslint-disable no-unused-vars */
import { useState, useRef, useCallback, useEffect } from "react";
import ReactMapGL, { FullscreenControl, GeolocateControl, NavigationControl, Marker, Layer, Source } from "react-map-gl";
import Pin from "./pin";
import axios from "axios";

import mapboxgl from 'mapbox-gl';

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

const MAX_ZOOM_LEVEL = 14;
const heatmapLayer = {
	id: 'heatmap',
	maxzoom: MAX_ZOOM_LEVEL,
	type: 'heatmap',
	paint: {
		// Increase the heatmap weight based on frequency and property magnitude
		'heatmap-weight': ['interpolate', ['linear'], ['get', 'mag'], 0, 0, 6, 1],
		// Increase the heatmap color weight weight by zoom level
		// heatmap-intensity is a multiplier on top of heatmap-weight
		'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, MAX_ZOOM_LEVEL, 3],
		// Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
		// Begin color ramp at 0-stop with a 0-transparancy color
		// to create a blur-like effect.
		'heatmap-color': [
			'interpolate',
			['linear'],
			['heatmap-density'],
			0,
			'rgba(33,102,172,0)',
			0.2,
			'rgb(103,169,207)',
			0.4,
			'rgb(209,229,240)',
			0.6,
			'rgb(253,219,199)',
			0.8,
			'rgb(239,138,98)',
			0.9,
			'rgb(255,201,101)'
		],
		// Adjust the heatmap radius by zoom level
		'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, MAX_ZOOM_LEVEL, 20],
		// Transition from heatmap to circle layer by zoom level
		'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 1, MAX_ZOOM_LEVEL, 0]
	}
};


// eslint-disable-next-line import/no-webpack-loader-syntax
// import mapboxgl from "mapbox-gl/dist/mapbox-gl-csp";
// mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

export default function Map() {
	const [viewport, setViewport] = useState({
		latitude: 48.3794,
		longitude: 31.1656,
		zoom: 5
	});

	const [marker, setMarker] = useState([]);
	const [data, setData] = useState();
	const mapRef = useRef();

	const handleViewportChange = useCallback(
		(newViewport) => setViewport(newViewport),
		[]
	);

	const handleGeocoderViewportChange = useCallback(
		(newViewport) => {
			const geocoderDefaultOverrides = { transitionDuration: 1000 };

			return handleViewportChange({
				...newViewport,
				...geocoderDefaultOverrides
			});
		},
		[handleViewportChange]
	);

	useEffect(() => {
		axios.get("/api/entry", { withCredentials: true })
			.then(res => {
				if (res.status === 200) {
					console.log(res.data);

					setData({
						type: 'FeatureCollection',
						features: res.data?.map(e => ({
							type: 'Feature',
							geometry: {
								type: 'Point',
								// properties: { mag: 1 },
								coordinates: [e.longitude, e.latitude],
							},
						})),
					});

					setMarker(res.data?.map((e) =>
						<Marker key={e.createdAt} latitude={e.latitude} longitude={e.longitude}>
							<Pin size={10} />
						</Marker>
					));
				}
			})
			.catch(err => {
				console.log(err);
			});
	}, []);

	return (
		<div style={{ height: "80vh" }}>
			<ReactMapGL
				{...viewport}
				ref={mapRef}
				width="100%"
				height="100%"
				mapStyle="mapbox://styles/mapbox/outdoors-v11"
				onViewportChange={handleViewportChange}
				mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
			>
				{
					data &&
					<Source type="geojson" data={data}>
						<Layer {...heatmapLayer} />
					</Source>
				}
				<FullscreenControl />
				<NavigationControl />
				<GeolocateControl
					positionOptions={{ enableHighAccuracy: true }}
					trackUserLocation={true}
				/>
				{/* {marker} */}
			</ReactMapGL>
		</div>
	);
}