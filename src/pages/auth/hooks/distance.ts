// src/utils/distance.ts

/**
 * Calculates the distance between two geographic coordinates using the Haversine formula.
 * @param lat1 Latitude of the first location.
 * @param lon1 Longitude of the first location.
 * @param lat2 Latitude of the second location.
 * @param lon2 Longitude of the second location.
 * @returns Distance in meters.
 */
export const getDistanceFromLatLonInMeters = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const deg2rad = (deg: number): number => deg * (Math.PI / 180);
  
    const R = 6371e3; // Radius of the Earth in meters
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in meters
    return distance;
  };
  