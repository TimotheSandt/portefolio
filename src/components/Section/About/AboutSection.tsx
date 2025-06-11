import "./AboutSection.css";

function AboutSection({ id }: { id?: string }) {
  return (
    <div id={id} className="about-section">
      <div className="about-container">
        <div className="about-title">
          <h2>About Me</h2>
        </div>
        <p className="about-description">
          Hello! I'm a passionate developer with a love for creating innovative solutions and learning new technologies.
          I enjoy working on challenging projects and collaborating with talented teams to bring ideas to life.
        </p>
      </div>
    </div>
  );
}

export default AboutSection;

