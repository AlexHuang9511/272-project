import React, { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";
import Form from "./form.jsx";

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
      markersRef.current.reportMarkers.forEach((marker) => {
        const markerData = marker.data;
        if (!reports.find((report) => report.name === markerData.name)) {
          marker.remove();
        }
      });

      markersRef.current.reportMarkers = [];
      markersRef.current.regularMarkers = [];

      if (!Array.isArray(reports)) return;

      for (let report of reports) {
        if (report.status === "OPEN") {
          const { location, name, status, emergencyInfo, time } = report;
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
                            <strong>Emergency Info:</strong> ${emergencyInfo}<br>
                            <strong>Time Reported:</strong> ${time}
                        `;
            newMarker.bindPopup(popupContent);

            newMarker.on("mouseover", function () {
              newMarker.openPopup();
            });
            newMarker.on("mouseout", function () {
              newMarker.closePopup();
            });

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
      var shortAddress = " ";
      if (!addressParts.house_number) {
        if (!addressParts.road) {
          shortAddress = `${addressParts.city}`;
        } else {
          shortAddress = `${addressParts.road}, ${addressParts.city}`;
        }
      } else {
        shortAddress = `${addressParts.house_number} ${addressParts.road}, ${addressParts.city}`;
      }
      setShortAddress(shortAddress);

      const popupContent = `Address: ${shortAddress}<br>`;

      const newMarker = L.marker([lat, lng])
        .addTo(map)
        .bindPopup(popupContent)
        .openPopup();

      markersRef.current.regularMarkers.push(newMarker);
    });

    return () => {
      map.remove();
    };
  }, [reports]);

  return <div id='map' className='map'></div>;
};

export default Map;
