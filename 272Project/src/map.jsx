import React, { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const Map = ({ reports }) => {
  const [clickedLocation, setClickedLocation] = useState(null);
  const [shortAddress, setShortAddress] = useState("");
  const markersRef = useRef({
    reportMarkers: [], // Array for report markers
    regularMarkers: [], // Array for regular markers
  });

  // Function to geocode address to lat/lng
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
    // Initialize the map
    const map = L.map("map").setView([49.2827, -123.1207], 13); // Default to Vancouver

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    // Add markers for all open reports
    const addMarkersForReports = async () => {
      // Clear only regular markers, not report markers
      markersRef.current.regularMarkers.forEach((marker) => marker.remove());
      markersRef.current.regularMarkers = []; // Clear regular markers array

      if (!Array.isArray(reports)) {
        console.error("Reports is not an array:", reports);
        return;
      }

      // Loop through reports and add markers for those with status "OPEN"
      for (let report of reports) {
        if (report.status === "OPEN") {
          const { location, name, status, emergencyInfo } = report;
          const coordinates = await geocodeAddress(location);

          if (coordinates) {
            // Create and add marker for the report
            const newMarker = L.marker([
              coordinates.lat,
              coordinates.lon,
            ]).addTo(map);

            // Create a popup with report info
            const popupContent = `
              <strong>${name}</strong><br>
              <strong>Location:</strong> ${location}<br>
              <strong>Status:</strong> ${status}<br>
              <strong>Emergency Info:</strong> ${emergencyInfo}
            `;
            newMarker.bindPopup(popupContent);

            // Add hover effect to display popup on hover
            newMarker.on("mouseover", () => {
              newMarker.openPopup(); // Open the popup on hover
            });

            newMarker.on("mouseout", () => {
              newMarker.closePopup(); // Close the popup when mouse moves out
            });

            markersRef.current.reportMarkers.push(newMarker); // Store report marker
          }
        }
      }
    };

    // Call the function to add markers for open reports
    addMarkersForReports();

    // Add click event listener to the map for adding a marker at clicked location
    map.on("click", async (e) => {
      const { lat, lng } = e.latlng;
      setClickedLocation({ lat, lng });

      // Remove only the regular markers when clicking around
      markersRef.current.regularMarkers.forEach((marker) => marker.remove());
      markersRef.current.regularMarkers = []; // Clear the regular markers array

      // Get the address using Nominatim reverse geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await response.json();

      const addressParts = data.address;
      let shortAddress = `${addressParts.road}, ${addressParts.city}`;
      setShortAddress(shortAddress);

      // Add a new marker at clicked location
      const newMarker = L.marker([lat, lng])
        .addTo(map)
        .bindPopup(`You clicked at:<br>Address: ${shortAddress}`)
        .openPopup();

      markersRef.current.regularMarkers.push(newMarker); // Store regular marker
    });

    return () => {
      map.remove(); // Cleanup on unmount
    };
  }, [reports]); // This effect runs when the reports change

  return (
    <div>
      <div
        id='map'
        style={{
          height: "100vh", // Full viewport height
          width: "100%", // Full width
        }}
      ></div>
      {clickedLocation && (
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            backgroundColor: "white",
            padding: "10px",
            color: "black",
          }}
        >
          <p>
            <strong>Clicked Location:</strong>
          </p>
          <p>Address: {shortAddress}</p>
        </div>
      )}
    </div>
  );
};

export default Map;
