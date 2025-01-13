import React from "react";
import { useLocation } from "react-router-dom"; // Import useLocation hook
import "./TalentsFound.css";
import Header from "../Header/Header";

const TalentsFound = () => {
  const location = useLocation(); // Access location object
  const topCVs = location.state?.topCVs || []; // Get the state passed from ProjectDescriptionForm

  return (
    <div>
    <Header />
    <div className="talents-found-container">
      <h3>Talents Found</h3>
      <div className="talents-list">
        {topCVs.map((cv, index) => (
          <div key={index} className="talent-card">
            <div className="talent-header">
              <p className="talent-name">{cv.candidate_name}</p>
            </div>
            <div className="talent-details">
              {cv.full_score && (
                <p className="talent-score" style={{ fontSize: '1.2em' }}>Score: {cv.full_score}%</p>
              )}
              {cv.experience && (
                <ul className="talent-experience">
                  <b>Experience: </b>
                  {cv.experience.slice(0, 5).map((exp, index) => (
                    <li key={index} style={{ listStyleType: 'disc' }}>{exp}</li>
                  ))}
                </ul>
              )}
              {cv.education && (
                <p className="talent-education"><b>Education:</b> {cv.education}</p>
              )}
              {cv.matched_skills && (
                <p className="talent-experience"><b>Relevant Skills:</b> {cv.matched_skills}</p>
              )}
              {cv.cv_skills && (
                <p className="talent-experience"><b>All Skills:</b> {cv.cv_skills}</p>
              )}
            </div>
            <button className="talent-action-button">INVITE</button>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default TalentsFound;
