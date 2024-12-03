//import React, { useEffect, useState } from "react";
import "./reportList.css";

function ReportList({ reports, onDelete, onChangeStatus }) {
  return (
    <div className="ReportListCenter">
      <h2>Report List</h2>
      {reports.length === 0 ? <p>No reports available.</p> : (
        <table>
          {reports.map((report, index) => (
            <tr key={index}>
              <td>{report.name}</td>
              <td>
                {report.phone}
              </td>
              <td>
                {report.emergencyInfo}
              </td>
              <td>
                {report.location}
              </td>

              {/* If picture link exists */}
              {report.pictureLink && (
                <td>
                  <img
                    className="report-image"
                    src={report.pictureLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                </td>
              )}

              {/* If picture link doesn't exist */}
              {!report.pictureLink && (
                <td className="not-provided">
                  <em>No picture provided</em>
                </td>
              )}

              {/* If comment exists */}
              {report.comments && (
                <td>
                  {report.comments}
                </td>
              )}

              {/* If comment does not exist */}
              {!report.comments && (
                <td className="not-provided">
                  <em>No comments provided</em>
                </td>
              )}
              <td>
                {report.status}{"  "}
                <a
                  onClick={(event) => {
                    event.preventDefault();
                    console.log(index);
                    onChangeStatus(report);
                  }}
                >
                  Change
                </a>
              </td>
              <td onClick={() => onDelete(report)}>
                X
              </td>
            </tr>
          ))}
        </table>
      )}
    </div>
  );
}

export default ReportList;
