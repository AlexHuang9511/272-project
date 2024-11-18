import React, { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const Map = ({ reports }) => {
  const [clickedLocation, setClickedLocation] = useState(null);
  const [shortAddress, setShortAddress] = useState("");
  const markersRef = useRef({
    reportMarkers: [],
    regularMarkers: [],
  });

  const geocodeAddress = async (address) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}`
      );
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];
        return { lat: parseFloat(lat), lon: parseFloat(lon) };
      }
      return null;
    } catch (error) {
      console.error("Error geocoding address:", error);
      return null;
    }
  };

  useEffect(() => {
    const map = L.map("map").setView([49.2827, -123.1207], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
    }).addTo(map);

    const addMarkersForReports = async () => {
      markersRef.current.regularMarkers.forEach((marker) => marker.remove());
      markersRef.current.regularMarkers = [];

      if (!Array.isArray(reports)) return;

      for (let report of reports) {
        if (report.status === "OPEN") {
          const { location, name, status, emergencyInfo } = report;
          const coordinates = await geocodeAddress(location);

          if (coordinates) {
            const newMarker = L.marker([
              coordinates.lat,
              coordinates.lon,
            ]).addTo(map);

            const popupContent = `
                            <strong>${name}</strong><br>
                            <strong>Location:</strong> ${location}<br>
                            <strong>Status:</strong> ${status}<br>
                            <strong>Emergency Info:</strong> ${emergencyInfo}
                        `;
            newMarker.bindPopup(popupContent);

            markersRef.current.reportMarkers.push(newMarker);
          }
        }
      }
    };

    addMarkersForReports();

    map.on("click", async (e) => {
      const { lat, lng } = e.latlng;
      setClickedLocation({ lat, lng });

      markersRef.current.regularMarkers.forEach((marker) => marker.remove());
      markersRef.current.regularMarkers = [];

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await response.json();

      const addressParts = data.address;
      const shortAddress = `${addressParts.road}, ${addressParts.city}`;
      setShortAddress(shortAddress);

      const newMarker = L.marker([lat, lng])
        .addTo(map)
        .bindPopup(`You clicked at:<br>Address: ${shortAddress}`)
        .openPopup();

      markersRef.current.regularMarkers.push(newMarker);
    });

    return () => {
      map.remove();
    };
  }, [reports]);

  return (
    <div>
      <div
        id='map'
        style={{
          height: "100vh",
          width: "100%",
        }}
      ></div>
    </div>
  );
};

export default Map;
