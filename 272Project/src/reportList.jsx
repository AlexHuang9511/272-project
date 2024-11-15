//import React, { useEffect, useState } from "react";

function ReportList({ reports }) {
  return (
    <div>
      <h2>Report List</h2>
      {reports.length === 0 ? <p>No reports available.</p> : (
        <ul>
          {reports.map((report, index) => (
            <li key={index}>
              <h3>{report.name}</h3>
              <p>
                <strong>Phone:</strong> {report.phone}
              </p>
              <p>
                <strong>Emergency Info:</strong> {report.emergencyInfo}
              </p>
              <p>
                <strong>Location:</strong> {report.location}
              </p>
              {report.pictureLink && (
                <p>
                  <strong>Picture Link:</strong>{" "}
                  <a
                    href={report.pictureLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {report.pictureLink}
                  </a>
                </p>
              )}
              {report.comments && (
                <p>
                  <strong>Comments:</strong> {report.comments}
                </p>
              )}
              <p>
                <strong>Status:</strong> {report.status}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ReportList;
