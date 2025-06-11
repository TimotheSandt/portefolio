import React from "react";

import "./WelcomeSection.css";
import AnimatedWave from "../../Noise/AnimatedWave.tsx";

import { map } from "../../../../script/math.ts";
import { getCSSVariable } from "../../../../script/utils.ts"; 

function WelcomeSection({ id }: { id?: string }) {
  const initialAmplitude = 75;
  const [amplitude, setAmplitude] = React.useState(initialAmplitude);

  React.useEffect(() => {
    const handleScroll = () => {
      const amplitude = map(window.scrollY, 0, window.innerHeight * 0.85, initialAmplitude, 3);
      setAmplitude(amplitude);

      const translateY = map(window.scrollY, 0, window.innerHeight, 0, window.innerHeight * 0.4); // map(window.scrollY, 0, window.innerHeight * 0.5, 0, -100);

      const welcomeTextElement = document.querySelector(".welcome-text") as HTMLElement;
      // welcomeTextElement.style.transition = "transform 0.01s ease-out";
      welcomeTextElement.style.transform = `translateY(${translateY}px)`;

      const welcomeTextTitleElement = document.querySelector(".welcome-text h1") as HTMLElement;
      const welcomeTextSubtitleElement = document.querySelector(".welcome-text p") as HTMLElement;

      const opacityTitle = map(welcomeTextTitleElement.getBoundingClientRect().top, window.innerHeight * 0.4, 50, 4, 0);
      const opacitySubtitle = map(welcomeTextSubtitleElement.getBoundingClientRect().top, window.innerHeight * 0.5, 50, 4, 0);
      // console.log(opacityTitle, opacitySubtitle);

      welcomeTextTitleElement.style.opacity = `${opacityTitle}`;
      welcomeTextSubtitleElement.style.opacity = `${opacitySubtitle}`;
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div id={id} className="welcome-section">
      <div className="welcome-container">
        <div className="welcome-text">
          <h1>Timothé Sandt</h1>
          <p>Programmer</p>
        </div>
      </div>
      <AnimatedWave
        height={150}
        fillDirection={"above"}
        amplitude={amplitude}
        speed={0.003}
        frequency={0.003}
        color={getCSSVariable("--primary-color")}
        opacity={1}
      />
    </div>
  );
}

export default WelcomeSection;
