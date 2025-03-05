"use client";

import "leaflet/dist/leaflet.css";
import "@/lib/leaflet-setup";
import React, { useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import { FeatureCollection } from "geojson";
import L from "leaflet";

export interface MapProps {
  maps?: FeatureCollection | FeatureCollection[] | null;
}

function FitBounds({ mapsArray }: { mapsArray: FeatureCollection[] }) {
  const map = useMap();

  useEffect(() => {
    if (mapsArray.length > 0) {
      const bounds = L.geoJSON(mapsArray).getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds);
      }
    }
  }, [mapsArray, map]);

  return null;
}

export function MapComponent({ maps }: MapProps) {
  const mapsArray = (Array.isArray(maps) ? maps : maps ? [maps] : []).filter(Boolean);

  return (
    <MapContainer center={[0, 0]} zoom={2} style={{ height: "100%", width: "100%", position: "relative" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {mapsArray.length > 0 && <FitBounds mapsArray={mapsArray} />}

      {mapsArray.map((geoJsonData, index) => (
        <GeoJSON key={index} data={geoJsonData} />
      ))}
    </MapContainer>
  );
}

export default MapComponent;
