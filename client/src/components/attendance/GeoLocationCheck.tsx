import React from "react";
import { MapPin } from "lucide-react";
import { useGeolocation } from "../../hooks/useGeolocation.ts";

export const GeoLocationCheck: React.FC = () => {
  const { location, error } = useGeolocation();

  return (
    <div className="flex items-center gap-2 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100 font-sans">
      <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
      <div>
        {error ? (
          <span className="text-slate-400">Location not permitted: {error}</span>
        ) : location ? (
          <span className="text-slate-700 font-semibold">
            Location Verified: {location.latitude.toFixed(4)}°, {location.longitude.toFixed(4)}°
          </span>
        ) : (
          <span className="text-slate-500">Checking physical dispatch location coordinates...</span>
        )}
      </div>
    </div>
  );
};

export default GeoLocationCheck;
