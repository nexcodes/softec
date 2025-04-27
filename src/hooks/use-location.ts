import { useState, useEffect } from "react";

type LocationSource = "gps" | "ip" | null;

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  loading: boolean;
  error: string | null;
  source: LocationSource;
}

/**
 * React hook that returns the user's geographic coordinates
 * First attempts to use browser's Geolocation API
 * Falls back to IP-based geolocation if GPS is unavailable or denied
 *
 * @returns Location data and status
 */
const useLocation = (): LocationState => {
  const [location, setLocation] = useState<LocationState>({
    latitude: null,
    longitude: null,
    loading: true,
    error: null,
    source: null,
  });

  useEffect(() => {
    // Function to handle successful GPS positioning
    const handleGPSSuccess = (position: GeolocationPosition): void => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        loading: false,
        error: null,
        source: "gps",
      });
    };

    // Function to handle GPS errors - will fallback to IP geolocation
    const handleGPSError = (error: GeolocationPositionError): void => {
      console.log("GPS error, falling back to IP geolocation:", error.message);
      fetchLocationByIP();
    };

    // Function to fetch location by IP address
    const fetchLocationByIP = async (): Promise<void> => {
      try {
        // Using a free IP geolocation API
        const response = await fetch("https://ipapi.co/json/");
        if (!response.ok) {
          throw new Error("Failed to fetch location by IP");
        }

        const data = await response.json();

        setLocation({
          latitude: data.latitude,
          longitude: data.longitude,
          loading: false,
          error: null,
          source: "ip",
        });
      } catch (error) {
        setLocation({
          latitude: null,
          longitude: null,
          loading: false,
          error: `Failed to get location: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
          source: null,
        });
      }
    };

    // First try to get location from browser's geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        handleGPSSuccess,
        handleGPSError,
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      // Browser doesn't support Geolocation API
      fetchLocationByIP();
    }

    // No cleanup needed for this effect
  }, []); // Empty dependency array means this effect runs once on mount

  return location;
};

export default useLocation;
