import React from "react";

function Features() {
  return (
    <section className="features container">
      <div className="feature-box">
        <div className="feature-image">
          <img

            src={`${process.env.PUBLIC_URL}/images/Screenshot 2024-11-05 at 6.47.33 PM.png`} // Ensure the correct path

            src={`${process.env.PUBLIC_URL}/images/Screenshot 2024-11-05 at 6.47.33 PM.png`}
            alt="Feature 1"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <div className="feature-content">
          <h4>Course Dashboard for Easy Resource Management</h4>
          <p>Add your courses to your personal dashboard to easily access all related study materials.
             CourseMate organizes resources by course, semester, and resource type, making it simple to find
             exactly what you need. Get notified when new materials are added for your courses, ensuring you
             never miss important study resources.
          </p>
        </div>
      </div>
      <div className="feature-box">
        <div className="feature-image">
          <img

            src={`${process.env.PUBLIC_URL}/images/Screenshot 2024-11-05 at 6.33.25 PM.png`} // Adjust paths for other images if necessary

            src={`${process.env.PUBLIC_URL}/images/Screenshot 2024-11-05 at 6.33.25 PM.png`}

            alt="Feature 2"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <div className="feature-content">
          <h4>Upload and Share Study Materials</h4>
          <p>Contribute to the community by uploading and sharing your own study materials.
             Add detailed information about each resource, including the course, semester, and resource type.
             Rate materials from other students to help everyone find the most helpful resources.
             CourseMate makes it easy to collaborate and learn from each other's notes, exams, and study guides.
          </p>
        </div>
      </div>
      <div className="feature-box">
        <div className="feature-image">
          <img
            src={`${process.env.PUBLIC_URL}/images/Screenshot 2024-11-05 at 6.56.54 PM.png`} // Adjust paths for other images if necessary
            alt="Feature 3"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <div className="feature-content">
          <h4>Advanced Search and Download</h4>
          <p>Find exactly what you need with our powerful search and filter system.
             Filter resources by course, semester, resource type, and more.
             Sort by rating, date, or number of downloads to quickly find the best materials.
             Preview resources before downloading, and save them for offline access.
             CourseMate makes studying more efficient by putting all the resources you need at your fingertips.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Features;
