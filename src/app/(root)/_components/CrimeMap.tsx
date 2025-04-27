"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { format } from "date-fns";

// Define the types for crime data fetched for the map
// Ensure this matches the data returned by /api/crimes/locations
interface CrimeLocation {
  id: string;
  title: string;
  description: string;
  location: string; // Textual location from DB
  latitude: string; // Coordinates must be strings here based on original code
  longitude: string;// Coordinates must be strings here based on original code
  reportedAt: string; // ISO date string
  crimeType: string;
  incidentDate: string; // ISO date string
  // Add isVerified, isLive if needed for status display on map, otherwise remove status logic below
  // isVerified?: boolean | null;
  // isLive?: boolean;
}

// Map container style
const containerStyle = {
  width: '100%',
  height: '600px'
};

// Default center position (e.g., Pakistan)
const defaultCenter = {
  lat: 30.3753,
  lng: 69.3451
};

// Marker colors
const crimeTypeColors: Record<string, string> = {
  "theft": "red",
  "assault": "purple",
  "harassment": "orange",
  "vandalism": "yellow",
  "burglary": "brown", // Added burglary from sample data
  "fraud": "pink", // Added fraud
  "suspicious activity": "cyan", // Added
  "traffic violation": "lime", // Added
  "drug activity": "indigo", // Added
  "other": "blue"
};

// Renamed Component: Only Displays the map
const CrimeMapDisplay = () => {
  // State for crime data from API
  const [crimes, setCrimes] = useState<CrimeLocation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for selected marker and info window
  const [selectedCrime, setSelectedCrime] = useState<CrimeLocation | null>(null);

  // Google Maps instance reference
  const mapRef = useRef<google.maps.Map | null>(null);

  // Function to load crime data from API
  const fetchCrimeData = useCallback(async () => {
    // Ensure this matches the actual API endpoint structure
    try {
      setLoading(true);
      setError(null); // Clear previous errors
      const response = await fetch('/api/crimes/locations'); // Use the correct endpoint

      if (!response.ok) {
        throw new Error("Failed to fetch crime data: ${response.statusText");
      }

      const data = await response.json();
        // Basic validation if data is an array
        if (!Array.isArray(data)) {
            throw new Error('Received invalid data format from API');
        }
      setCrimes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching crime data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load crime data on component mount
  useEffect(() => {
    fetchCrimeData();
  }, [fetchCrimeData]);

  // Handle map load
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  // Function to get marker icon based on crime type
  const getMarkerIcon = (crimeType: string) => {
    const typeLower = crimeType?.toLowerCase() || 'other'; // Handle potential null/undefined crimeType
    const color = crimeTypeColors[typeLower] || crimeTypeColors.other;
    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: color,
      fillOpacity: 0.9,
      strokeWeight: 1,
      strokeColor: '#ffffff',
      scale: 8 // Slightly smaller scale?
    };
  };

  // Format date for display in InfoWindow
  const formatDateForInfoWindow = (dateString: string | null | undefined) => {
      if (!dateString) return "N/A";
      try {
        return format(new Date(dateString), "PPp"); // Format like "Sep 21, 2025, 1:00:00 PM"
      } catch (e) {
          console.error("Error formatting date:", dateString, e);
          return "Invalid Date";
      }
  };

  // Map options with dark mode styling
  const mapOptions = {
    styles: [ /* Your Dark Mode Styles Array */
       { elementType: "geometry", stylers: [{ color: "#242f3e" }] }, { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] }, { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] }, { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] }, { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] }, { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] }, { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] }, { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] }, { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] }, { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] }, { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] }, { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] }, { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] }, { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] }, { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] }, { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] }, { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] }, { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] }
    ],
    streetViewControl: false, // Simplify UI
    mapTypeControl: false,
    fullscreenControl: true
  };

  return (
    <div className="crime-map-container bg-gray-900 p-4 rounded-lg shadow-lg mt-10"> {/* Added margin top */}
      <div className="mb-4"> {/* Removed button */}
        <h2 className="text-2xl font-bold text-white mb-2">Crime Hotspot Map</h2>
        <p className="text-gray-300">Visualizing reported incidents across the area.</p>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="flex justify-center items-center h-64 bg-gray-800/50 rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error Message */}
      {error && !loading && (
        <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded mb-4">
          <p>Error loading map data: {error}</p>
          <button
            onClick={fetchCrimeData} // Allow retry
            className="mt-2 bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Map Display */}
      {!loading && !error && (
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_Maps_API_KEY || ""}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={defaultCenter}
            zoom={6} // Adjust default zoom
            onLoad={onMapLoad}
            options={mapOptions}
          >
            {/* Render markers for each crime */}
            {crimes.map((crime) => {
                // Validate coordinates before parsing
                const lat = parseFloat(crime.latitude);
                const lng = parseFloat(crime.longitude);
                if (isNaN(lat) || isNaN(lng)) {
                    console.warn("Skipping crime report with invalid coordinates: ID ${crime.id}, Lat: ${crime.latitude}, Lng: ${crime.longitude");
                    return null; // Skip rendering this marker if coords are invalid
                }
                return (
                    <Marker
                        key={crime.id}
                        position={{ lat, lng }}
                        onClick={() => setSelectedCrime(crime)}
                        icon={getMarkerIcon(crime.crimeType)}
                        title={crime.title} // Add hover title
                    />
                );
             })}

            {/* Info window for selected crime */}
            {selectedCrime && (
              <InfoWindow
                position={{ lat: parseFloat(selectedCrime.latitude), lng: parseFloat(selectedCrime.longitude) }}
                onCloseClick={() => setSelectedCrime(null)}
              >
                 {/* InfoWindow Content - Use dark theme styling */}
                <div className="bg-gray-800 text-white p-3 rounded-md max-w-xs border border-gray-600 shadow-lg text-sm">
                    <h3 className="font-semibold text-base text-blue-400 mb-1">{selectedCrime.title}</h3>
                    <p className="text-xs text-gray-400 mb-2 capitalize">
                        <span className="font-medium">Type:</span> {selectedCrime.crimeType || 'N/A'}
                    </p>
                    <p className="text-gray-300 mb-2 text-xs leading-relaxed">{selectedCrime.description}</p>
                     <p className="text-xs text-gray-400 mb-2">
                        <span className="font-medium">Location:</span> {selectedCrime.location || 'N/A'}
                    </p>
                    <div className="mt-2 pt-2 border-t border-gray-700 text-xs text-gray-400 space-y-1">
                        <p><span className="font-medium">Incident:</span> {formatDateForInfoWindow(selectedCrime.incidentDate)}</p>
                        <p><span className="font-medium">Reported:</span> {formatDateForInfoWindow(selectedCrime.reportedAt)}</p>
                    </div>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      )}

      {/* Crime type legend */}
      <div className="mt-6 p-4 bg-gray-800 rounded-lg">
        <h3 className="text-white text-lg mb-3 font-semibold">Legend: Crime Types</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-2"> {/* Responsive grid */}
          {Object.entries(crimeTypeColors).map(([type, color]) => (
            <div key={type} className="flex items-center">
              <div className="w-4 h-4 rounded-full mr-2 flex-shrink-0" style={{ backgroundColor: color }}></div>
              <span className="text-gray-300 capitalize text-sm">{type}</span>
            </div>
          ))}
        </div>
      </div>

       {/* Status legend (Removed as status info isn't fetched/used in this version) */}
       {/*
       <div className="mt-4 p-4 bg-gray-800 rounded-lg">
         <h3 className="text-white text-lg mb-2">Status Types</h3> ...
       </div>
       */}

    </div>
  );
};

export default CrimeMapDisplay;