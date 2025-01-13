// LandingPage.js
import React from 'react';
import "./styles.css"; // Updated CSS import
import Header from "../Header/Header";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faMapMarkerAlt, faBriefcase, faDollarSign, faSearch, faMagnifyingGlass, faEnvelope, faBullseye, faTabletAlt, faHandshake, faComments, faUsers, faPhone, faLocationArrow } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons'; // Social media icons
import HeroImage from '../images/pic.png'; // Correct image path
import HerooImage from '../images/picture.png'; // Correct image path

const jobs = [
  {
    id: 1,
    time: "1 hour ago",
    title: "Senior UX Designer",
    company: "StarArt",
    rate: "$25–$35 / hour",
    location: "New York, NY, USA",
    type: "Full Time",
    color: "blue",
  },
  {
    id: 2,
    time: "1 day ago",
    title: "Marketing Director",
    company: "UpBook",
    rate: "$45–$53 / hour",
    location: "Saint-Etienne, France",
    type: "Part Time",
    color: "red",
  },
  {
    id: 3,
    time: "1 day ago",
    title: "Front End Developer",
    company: "MediaLab",
    rate: "$25–$43 / hour",
    location: "Derry, United Kingdom",
    type: "Freelance",
    color: "purple",
  },
  {
    id: 4,
    time: "1 day ago",
    title: "Social Media Executive",
    company: "Creator",
    rate: "$15–$43 / hour",
    location: "London, UK",
    type: "Full Time",
    color: "blue",
  },
];

const LandingPage = () => {
  return (
    <div className="landing-page">
      <Header />
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Job Search</title>

      {/* Welcome Section */}
      <div className="welcome-section">
        <h1>Welcome to <span className="highlighted-text">FBA</span></h1>
        <p className="welcome-tagline">
          A place where leading employers are already looking for your talent and experience.
        </p>
      </div>

      {/* Main Content Section */}
      <div className="main-content-section">
        <div className="left-image-section">
          <img src={HeroImage} alt="People sitting and waiting" className="main-image" />
        </div>
        
        <div className="right-feature-section">
          <div className="feature-item">
            <FontAwesomeIcon icon={faUsers} className="feature-icon" />
            <p>More than 3.8 million visitors every day</p>
          </div>

          <div className="feature-item">
            <FontAwesomeIcon icon={faHandshake} className="feature-icon" />
            <p>Leading recruiting website in the UK and Europe</p>
          </div>

          <div className="feature-item">
            <FontAwesomeIcon icon={faComments} className="feature-icon" />
            <p>24/7 Dedicated and free Support</p>
          </div>

          <div className="feature-item">
            <FontAwesomeIcon icon={faBullseye} className="feature-icon" />
            <p>Only relevant and verified vacancies</p>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="left-side">
          <h1>Start Building Your Own Career Now</h1>
          <div className="search-bar-container">
            <div className="search-bar">
              <input type="text" className="input-field" placeholder="Keywords" required />
              <button className="search-button">
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>
          </div>
          <p className="vacancies-text">
            We offer <span className="highlighted-text">1,099 job vacancies</span> right now!
          </p>
        </div>
        <div className="right-side">
          <img src={HerooImage} alt="People working" className="hero-image" />
        </div>
      </div>

      {/* Job Listings Section */}
      <div className="jobs-list">
        <h2>Recent Jobs</h2>
        {jobs.map((job) => (
          <div key={job.id} className="job-card">
            <div className="job-time">{job.time}</div>
            <div className="job-details">
              <h2>{job.title}</h2>
              <p>{job.company}</p>
            </div>
            <div className="job-info">
              <span className="job-rate">
                <FontAwesomeIcon icon={faDollarSign} /> {job.rate}
              </span>
              <span className="job-location">
                <FontAwesomeIcon icon={faMapMarkerAlt} /> {job.location}
              </span>
            </div>
            <div className={`job-type ${job.color}`}>{job.type}</div>
          </div>
        ))}
      </div>

        {/* New Section: 3 Easy Steps */}
        <div className="steps-section">
        <h2>Just 3 Easy Steps to New Capabilities</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-icon">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </div>
            <h3>1. Browse Jobs</h3>
            <p>Easy search by category</p>
          </div>
          <div className="step">
            <div className="step-icon">
              <FontAwesomeIcon icon={faBullseye} />
            </div>
            <h3>2. Find Your Vacancy</h3>
            <p>Choose a suitable job</p>
          </div>
          <div className="step">
            <div className="step-icon">
              <FontAwesomeIcon icon={faEnvelope} />
            </div>
            <h3>3. Submit Resume</h3>
            <p>Get a personal job offer</p>
          </div>
        </div>
        <button className="start-now-button">
          <FontAwesomeIcon icon={faTabletAlt} /> Start Now
        </button>
      </div>

      {/* Candidate Section */}
      <div className="candidate-section">
        <h2>New Candidates</h2>
        <div className="candidate-container">
          <div className="candidate-card">
            <FontAwesomeIcon icon={faUserCircle} className="candidate-icon" />
            <div className="candidate-info">
              <h3>Amanda Cook</h3>
              <p><FontAwesomeIcon icon={faMapMarkerAlt} /> London, United Kingdom</p>
              <p><FontAwesomeIcon icon={faBriefcase} /> Junior Web Designer</p>
            </div>
          </div>

          <div className="candidate-card">
            <FontAwesomeIcon icon={faUserCircle} className="candidate-icon" />
            <div className="candidate-info">
              <h3>Kevin Parker</h3>
              <p><FontAwesomeIcon icon={faMapMarkerAlt} /> Seattle, Washington</p>
              <p><FontAwesomeIcon icon={faBriefcase} /> Data Engineer</p>
            </div>
          </div>

          <div className="candidate-card">
            <FontAwesomeIcon icon={faUserCircle} className="candidate-icon" />
            <div className="candidate-info">
              <h3>Sandy Williams</h3>
              <p><FontAwesomeIcon icon={faMapMarkerAlt} /> Manchester, United Kingdom</p>
              <p><FontAwesomeIcon icon={faBriefcase} /> Sales Manager</p>
            </div>
          </div>

          <div className="candidate-card">
            <FontAwesomeIcon icon={faUserCircle} className="candidate-icon" />
            <div className="candidate-info">
              <h3>James Johnson</h3>
              <p><FontAwesomeIcon icon={faMapMarkerAlt} /> Boston, Massachusetts</p>
              <p><FontAwesomeIcon icon={faBriefcase} /> Programmer</p>
            </div>
          </div>
        </div>
      </div>


      <footer className="footer-section">
        <div className="footer-container">
          <div className="footer-column">
            <h4>Contact</h4>
            <p><FontAwesomeIcon icon={faPhone} /> +1 234 567 890</p>
            <p><FontAwesomeIcon icon={faEnvelope} /> support@fba.com</p>
            <p><FontAwesomeIcon icon={faLocationArrow} /> 1234 Job St, London City, United Kingdom</p>
          </div>

          <div className="footer-column">
            <h4>Follow Us</h4>
            <div className="social-icons">
              <FontAwesomeIcon icon={faFacebookF} className="social-icon" />
              <FontAwesomeIcon icon={faTwitter} className="social-icon" />
              <FontAwesomeIcon icon={faInstagram} className="social-icon" />
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 FBA. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
