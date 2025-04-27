import React from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { MapPin } from "lucide-react";

// Map container style
const containerStyle = {
  width: "100%",
  height: "200px",
};

export const GoogleMapComponent = ({
  latitude,
  longitude,
  location,
}: {
  latitude: number;
  longitude: number;
  location: string;
}) => {
  // Load the Google Maps JavaScript API
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY, // Replace with your actual API key
  });

  const center = {
    lat: latitude,
    lng: longitude,
  };

  if (loadError) {
    return (
      <div className="rounded-lg overflow-hidden border border-gray-700 bg-gray-800">
        <div className="h-48 w-full bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-8 w-8 text-red-500 mx-auto" />
            <p className="mt-2 text-sm">Error loading map</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="rounded-lg overflow-hidden border border-gray-700 bg-gray-800">
        <div className="h-48 w-full bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <p className="mt-2 text-sm">Loading map...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg overflow-hidden border border-gray-700 bg-gray-800">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={15}
          options={{
            styles: [
              { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
              {
                elementType: "labels.text.stroke",
                stylers: [{ color: "#242f3e" }],
              },
              {
                elementType: "labels.text.fill",
                stylers: [{ color: "#746855" }],
              },
              // Add more styles as needed for dark mode map
            ],
            streetViewControl: false,
            mapTypeControl: false,
          }}
        >
          <Marker position={center} />
        </GoogleMap>
      </div>
      <p className="mt-2 text-gray-300 flex items-start">
        <MapPin className="mr-2 h-4 w-4 mt-1 flex-shrink-0" />
        <span>{location}</span>
      </p>
    </>
  );
};
