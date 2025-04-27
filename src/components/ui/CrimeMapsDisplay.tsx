"use client";

import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
// Added HeatmapLayer import
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
  HeatmapLayer,
} from "@react-google-maps/api";
import { format } from "date-fns";
import { Button } from "@/components/ui/button"; // Import Button for the toggle

// Define the types for crime data fetched for the map
interface CrimeLocation {
  id: string;
  title: string;
  description: string;
  location: string;
  latitude: string; // Coordinates must be strings here based on original code
  longitude: string; // Coordinates must be strings here based on original code
  reportedAt: string;
  crimeType: string;
  incidentDate: string;
}

// Map container style
const containerStyle = {
  width: "100%",
  height: "600px",
};

// Default center position (Pakistan)
const defaultCenter = {
  lat: 30.3753,
  lng: 69.3451,
};

// Marker colors
const crimeTypeColors: Record<string, string> = {
  theft: "red",
  assault: "purple",
  harassment: "orange",
  vandalism: "yellow",
  burglary: "brown",
  fraud: "pink",
  "suspicious activity": "cyan",
  "traffic violation": "lime",
  "drug activity": "indigo",
  other: "blue",
};

// Specify required libraries including visualization for Heatmap
const libraries: ("visualization" | "places" | "drawing" | "geometry")[] = [
  "visualization",
];

const CrimeMapDisplay = () => {
  const [crimes, setCrimes] = useState<CrimeLocation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCrime, setSelectedCrime] = useState<CrimeLocation | null>(
    null
  );
  const mapRef = useRef<google.maps.Map | null>(null);

  // ---- State for Heatmap Toggle ----
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  // ---------------------------------

  const fetchCrimeData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/crime/locations");
      if (!response.ok) {
        throw new Error("Failed to fetch crime data: ${response.statusText");
      } // --- START OF CHANGES ---
      const responseData = await response.json(); // Get the full response object from the API // Check if the responseData object has a 'data' property and if it is an array

      if (!responseData || !Array.isArray(responseData.data)) {
        throw new Error(
          'Received invalid data format from API: Expected response object with a "data" array.'
        );
      } // Extract the actual array of crime locations from the 'data' property

      const crimeDataArray = responseData.data; // Set the state with the extracted array

      setCrimes(crimeDataArray); // --- END OF CHANGES ---
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error("Error fetching crime data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCrimeData();
  }, [fetchCrimeData]);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const getMarkerIcon = (crimeType: string) => {
    const typeLower = crimeType?.toLowerCase() || "other";
    const color = crimeTypeColors[typeLower] || crimeTypeColors.other;
    return {
      /* ... icon options ... */ path: google.maps.SymbolPath.CIRCLE,
      fillColor: color,
      fillOpacity: 0.9,
      strokeWeight: 1,
      strokeColor: "#ffffff",
      scale: 8,
    };
  };

  const formatDateForInfoWindow = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "PPp");
    } catch (e) {
      console.error("Error formatting date:", dateString, e);
      return "Invalid Date";
    }
  };

  // ---- Transform crime data for Heatmap ----
  const heatmapData = useMemo(() => {
    // Ensure google maps visualization library is loaded before creating LatLng objects
    if (
      !window.google ||
      !window.google.maps ||
      !window.google.maps.visualization
    ) {
      // console.warn("Google Maps Visualization library not loaded yet for heatmap.");
      return []; // Return empty array if library isn't ready
    }

    return crimes
      .map((crime) => {
        const lat = parseFloat(crime.latitude);
        const lng = parseFloat(crime.longitude);
        // Validate coordinates
        if (isNaN(lat) || isNaN(lng)) {
          console.warn(
            "Invalid coordinates for crime ID ${crime.id}: Lat ${crime.latitude}, Lng ${crime.longitude"
          );
          return null; // Skip invalid data points
        }
        return new google.maps.LatLng(lat, lng);
      })
      .filter((point): point is google.maps.LatLng => point !== null); // Filter out nulls and ensure type safety
  }, [crimes]); // Recalculate only when crimes data changes
  // -------------------------------------------

  // --- Heatmap Layer Options ---
  const heatmapOptions = {
    radius: 20, // Adjust radius (in pixels) for influence of each point
    opacity: 0.7, // Adjust opacity (0 to 1)
    // Optional: Customize gradient (array of CSS color strings)
    // gradient: [
    //   'rgba(0, 255, 255, 0)', // Transparent cyan for low density
    //   'rgba(0, 255, 255, 1)', // Opaque cyan
    //   'rgba(0, 191, 255, 1)',
    //   'rgba(0, 127, 255, 1)',
    //   'rgba(0, 63, 255, 1)',
    //   'rgba(0, 0, 255, 1)', // Blue
    //   'rgba(0, 0, 223, 1)',
    //   'rgba(0, 0, 191, 1)',
    //   'rgba(0, 0, 159, 1)',
    //   'rgba(0, 0, 127, 1)',
    //   'rgba(63, 0, 91, 1)',
    //   'rgba(127, 0, 63, 1)',
    //   'rgba(191, 0, 31, 1)',
    //   'rgba(255, 0, 0, 1)' // Red for high density
    // ]
  };
  // ---------------------------

  const mapOptions = {
    styles: [
      /* Your Dark Mode Styles Array */
      { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
      {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }],
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
      },
      {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
      },
      {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }],
      },
      {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }],
      },
    ],
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: true,
  };

  return (
    <div className="crime-map-container bg-gray-900 p-4 rounded-lg shadow-lg mt-10">
      {/* Header and Toggle Button */}
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">
            Crime Hotspot Map
          </h2>
          <p className="text-gray-300 text-sm">
            Visualizing reported incidents and density.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowHeatmap(!showHeatmap)}
          className="bg-gray-700 border-gray-600 hover:bg-gray-600 text-white"
        >
          {showHeatmap ? "Hide Heatmap" : "Show Heatmap"}
        </Button>
      </div>

      {/* Loading Indicator */}
      {loading /* ... loading spinner ... */ && (
        <div className="flex justify-center items-center h-64 bg-gray-800/50 rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error Message */}
      {error && !loading /* ... error display ... */ && (
        <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded mb-4">
          <p>Error loading map data: {error}</p>
          <button
            onClick={fetchCrimeData}
            className="mt-2 bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Map Display - LoadScript specifies libraries */}
      {!loading && !error && (
        <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_Maps_API_KEY || ""}
          libraries={libraries} // Ensure visualization library is loaded
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={defaultCenter}
            zoom={6}
            onLoad={onMapLoad}
            options={mapOptions}
          >
            {/* Render Markers (Optional: You might hide markers when heatmap is on) */}
            {crimes.map((crime) => {
              const lat = parseFloat(crime.latitude);
              const lng = parseFloat(crime.longitude);
              if (isNaN(lat) || isNaN(lng)) {
                return null;
              }
              return (
                <Marker
                  key={crime.id}
                  position={{ lat, lng }}
                  onClick={() => setSelectedCrime(crime)}
                  icon={getMarkerIcon(crime.crimeType)}
                  title={crime.title}
                  // Example: Hide markers if heatmap is shown
                  // visible={!showHeatmap}
                />
              );
            })}

            {/* Render Heatmap Layer Conditionally */}
            {showHeatmap && heatmapData.length > 0 && (
              <HeatmapLayer data={heatmapData} options={heatmapOptions} />
            )}

            {/* Info window for selected crime */}
            {selectedCrime && (
              <InfoWindow
                position={{
                  lat: parseFloat(selectedCrime.latitude),
                  lng: parseFloat(selectedCrime.longitude),
                }}
                onCloseClick={() => setSelectedCrime(null)}
              >
                {/* ... InfoWindow Content ... */}
                <div className="bg-gray-800 text-white p-3 rounded-md max-w-xs border border-gray-600 shadow-lg text-sm">
                  <h3 className="font-semibold text-base text-blue-400 mb-1">
                    {selectedCrime.title}
                  </h3>
                  <p className="text-xs text-gray-400 mb-2 capitalize">
                    <span className="font-medium">Type:</span>{" "}
                    {selectedCrime.crimeType || "N/A"}
                  </p>
                  <p className="text-gray-300 mb-2 text-xs leading-relaxed">
                    {selectedCrime.description}
                  </p>
                  <p className="text-xs text-gray-400 mb-2">
                    <span className="font-medium">Location:</span>{" "}
                    {selectedCrime.location || "N/A"}
                  </p>
                  <div className="mt-2 pt-2 border-t border-gray-700 text-xs text-gray-400 space-y-1">
                    <p>
                      <span className="font-medium">Incident:</span>{" "}
                      {formatDateForInfoWindow(selectedCrime.incidentDate)}
                    </p>
                    <p>
                      <span className="font-medium">Reported:</span>{" "}
                      {formatDateForInfoWindow(selectedCrime.reportedAt)}
                    </p>
                  </div>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      )}

      {/* Crime type legend */}
      <div className="mt-6 p-4 bg-gray-800 rounded-lg">
        <h3 className="text-white text-lg mb-3 font-semibold">
          Legend: Crime Types
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-2">
          {Object.entries(crimeTypeColors).map(
            ([type, color] /* ... legend items ... */) => (
              <div key={type} className="flex items-center">
                <div
                  className="w-4 h-4 rounded-full mr-2 flex-shrink-0"
                  style={{ backgroundColor: color }}
                ></div>
                <span className="text-gray-300 capitalize text-sm">{type}</span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default CrimeMapDisplay;