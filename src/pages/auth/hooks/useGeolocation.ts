// src/components/SignInPage/hooks/useGeolocation.ts

import { useState, useEffect } from "react";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

const useGeolocation = (): GeolocationState => {
  const [location, setLocation] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation({
        latitude: null,
        longitude: null,
        error: "Geolocation is not supported by your browser.",
        loading: false,
      });
      return;
    }

    const success = (position: GeolocationPosition) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null,
        loading: false,
      });
    };

    const errorHandler = (err: GeolocationPositionError) => {
      let message = "";
      switch (err.code) {
        case err.PERMISSION_DENIED:
          message = "Location permission denied.";
          break;
        case err.POSITION_UNAVAILABLE:
          message = "Location information is unavailable.";
          break;
        case err.TIMEOUT:
          message = "The request to get your location timed out.";
          break;
        default:
          message = "An unknown error occurred while retrieving location.";
          break;
      }
      setLocation({
        latitude: null,
        longitude: null,
        error: message,
        loading: false,
      });
    };

    navigator.geolocation.getCurrentPosition(success, errorHandler);
  }, []);

  return location;
};

export default useGeolocation;
