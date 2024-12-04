import React, { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css"; // Import the CSS file

const Map = ({ reports, setReportsInMap, setMarkers, mapHasReset}) => {
  const [clickedLocation, setClickedLocation] = useState(null);
  const [shortAddress, setShortAddress] = useState("");
  const markersRef = useRef({
    reportMarkers: [],
    regularMarkers: [],
  });
  const tempReports = [];

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
    // Map reset
    mapHasReset(true);
    const map = L.map("map").setView([49.2827, -123.1207], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
    }).addTo(map);

    const addMarkersForReports = async () => {
      markersRef.current.reportMarkers.forEach((marker) => {
        const markerData = marker;
        if (!reports.find((report) => report.name === markerData.data.name)) {
          marker.remove();
        }
      });

      markersRef.current.reportMarkers = [];
      markersRef.current.regularMarkers = [];

      if (!Array.isArray(reports)) return;

      for (let report of reports) {
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
            // Add to data
            newMarker.data = report;
            markersRef.current.reportMarkers.push(newMarker);

            tempReports.push(report);
          }
      }
      // Filter visible reports
      const bounds = map.getBounds();

      // Go through markers again
      const reportsCurrentlyVisible = tempReports.filter((report) => {
        const validMarker = markersRef.current.reportMarkers.find((marker)=> marker.data.name === report.name);
        // returns boolean for the report filter
        console.log("valid marker: ", validMarker)
        if (validMarker){
          const validMarkerLatLng = validMarker.getLatLng();
          return bounds.contains(validMarkerLatLng);
        }
        else{
          return false;
        }
      });

      console.log("REPORTS VISIBLE:", reportsCurrentlyVisible)
      // Prop
      setReportsInMap(reportsCurrentlyVisible);
      // Pass markers to App
      setMarkers(markersRef.current.reportMarkers);
    };

    addMarkersForReports();

    const updateReportsInMap = () => {
      // Filter visible reports
      const bounds = map.getBounds();

      // Go through markers again
      const reportsCurrentlyVisible = tempReports.filter((report) => {
        const validMarker = markersRef.current.reportMarkers.find((marker)=> 
          marker.data.name === report.name &&
          marker.data.time === report.time &&
          marker.data.phone === report.phone &&
          marker.data.emergencyInfo === report.emergencyInfo &&
          marker.data.location === report.location &&
          marker.data.pictureLink === report.pictureLink &&
          marker.data.comments === report.comments
      );
        // returns boolean for the report filter
        console.log("valid marker: ", validMarker)
        if (validMarker){
          const validMarkerLatLng = validMarker.getLatLng();
          return bounds.contains(validMarkerLatLng);
        }
        else{
          return false;
        }
      });

      console.log("REPORTS VISIBLE:", reportsCurrentlyVisible)
      // Prop
      setReportsInMap(reportsCurrentlyVisible);
    };

    // when Map is moved, update the ReportList to show reports in map
    map.on("moveend", updateReportsInMap);

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

      // Find and change highlighted marker
      const highlighted = markersRef.current.reportMarkers.find((marker) => marker._icon.style.filter == "hue-rotate(-120deg)");
      if(highlighted){
        highlighted._icon.style.filter = "hue-rotate(0deg)";
      }

    });

    return () => {
      map.remove();
    };
  }, [reports]);


  return <div id='map' className='map'></div>;
};

export default Map;
