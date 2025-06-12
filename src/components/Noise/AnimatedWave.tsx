import "./AnimatedWave.css";

import { useRef, useEffect } from "react";

import { PerlinNoise } from "./PerlinNoise";
import { map } from "../../../script/math";

interface WaveProps {
  height?: number;
  amplitude?: number;
  speed?: number;
  frequency?: number;
  color?: string;
  backgroundColor?: string;
  opacity?: number;
  className?: string;
  fillDirection?: "below" | "above";
}

function AnimatedWave({
  height = 200,
  amplitude = 60,
  speed = 0.02,
  frequency = 0.008,
  color = "#fff",
  backgroundColor = "transparent",
  opacity = 0.8,
  className = "AnimatedWave",
  fillDirection = "below",
}: WaveProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0); // Use useRef instead of useState
  const inView = useRef<boolean>(false);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const noise = new PerlinNoise();

    function animate() {
      // Increment time using ref (doesn't trigger re-renders)
      timeRef.current += 1;
      const n = Math.max(Math.floor(0.007 / speed), 1);
      if (timeRef.current % n !== 0 && timeRef.current > 10) {
        // console.log(n);
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      if (!svg) return;

      // Clear previous content
      svg.innerHTML = "";

      const width = window.innerWidth;
      const resolution = 16; // Points per wave segment
      const amplitudeOffset = height <= 50 ? Math.max(map(height, 10, 50, 0, 20), 0) : 20;
      const baseHeight = fillDirection === "below" ? height - amplitude - amplitudeOffset : amplitude + amplitudeOffset; // Base position of the wave

      const points = [];

      // Generate wave points
      for (let x = 0; x <= width; ) {
        const noiseValue = noise.noise(x * frequency, timeRef.current * speed, 0);
        const y = baseHeight + noiseValue * amplitude;
        points.push({ x, y });

        x += resolution;
        if (x > width && x - resolution !== width) {
          x = width;
        }
      }

      // Create smooth path using quadratic curves
      let pathData = fillDirection === "below" ? `M 0,${height} L 0,${points[0].y}` : `M 0,0 L 0,${points[0].y}`;

      for (let i = 0; i < points.length - 1; i++) {
        const current = points[i];
        const next = points[i + 1];

        if (i === 0) {
          const controlX = (current.x + next.x) / 2;
          const controlY = (current.y + next.y) / 2;
          pathData += ` Q ${controlX},${controlY} ${next.x},${next.y}`;
        } else {
          pathData += ` T ${next.x},${next.y}`;
        }
      }

      // Close the path to fill above or below
      if (fillDirection === "below") {
        pathData += ` L ${width},${height} Z`;
      } else {
        pathData += ` L ${width},0 Z`;
      }

      // Create and append the path element
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", pathData);
      path.setAttribute("fill", color);
      path.setAttribute("opacity", opacity.toString());

      svg.appendChild(path);

      animationRef.current = requestAnimationFrame(animate);
    }
    animationRef.current = requestAnimationFrame(animate);

    // Handle window resize
    const handleResize = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [height, amplitude, speed, frequency, color, opacity, fillDirection, inView]);

  return (
    <svg
      ref={svgRef}
      className={className}
      style={{ height: `${height}px`, backgroundColor: backgroundColor }}
      preserveAspectRatio="none"
      viewBox={`0 0 ${typeof window !== "undefined" ? window.innerWidth : 1200} ${height}`}
    />
  );
}

export default AnimatedWave;
