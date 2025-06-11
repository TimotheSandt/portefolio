"use client";

import { useEffect, useRef } from "react";
import "./PerlinNoise.css";

// Simple Perlin noise implementation
export class PerlinNoise {
  private permutation: number[];
  private p: number[];

  constructor() {
    // Permutation table
    this.permutation = [
      151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240,
      21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88,
      237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83,
      111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216,
      80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186,
      3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58,
      17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
      129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193,
      238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157,
      184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128,
      195, 78, 66, 215, 61, 156, 180,
    ];

    // Duplicate the permutation table
    this.p = new Array(512);
    for (let i = 0; i < 256; i++) {
      this.p[256 + i] = this.p[i] = this.permutation[i];
    }
  }

  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  private lerp(t: number, a: number, b: number): number {
    return a + t * (b - a);
  }

  private grad(hash: number, x: number, y: number, z: number): number {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  noise(x: number, y: number, z: number): number {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const Z = Math.floor(z) & 255;

    x -= Math.floor(x);
    y -= Math.floor(y);
    z -= Math.floor(z);

    const u = this.fade(x);
    const v = this.fade(y);
    const w = this.fade(z);

    const A = this.p[X] + Y;
    const AA = this.p[A] + Z;
    const AB = this.p[A + 1] + Z;
    const B = this.p[X + 1] + Y;
    const BA = this.p[B] + Z;
    const BB = this.p[B + 1] + Z;

    return this.lerp(
      w,
      this.lerp(
        v,
        this.lerp(u, this.grad(this.p[AA], x, y, z), this.grad(this.p[BA], x - 1, y, z)),
        this.lerp(u, this.grad(this.p[AB], x, y - 1, z), this.grad(this.p[BB], x - 1, y - 1, z))
      ),
      this.lerp(
        v,
        this.lerp(u, this.grad(this.p[AA + 1], x, y, z - 1), this.grad(this.p[BA + 1], x - 1, y, z - 1)),
        this.lerp(u, this.grad(this.p[AB + 1], x, y - 1, z - 1), this.grad(this.p[BB + 1], x - 1, y - 1, z - 1))
      )
    );
  }
}

interface PerlinNoiseBackgroundProps {
  className?: string;
  scale?: number;
  speed?: number;
  opacity?: number;
  colors?: string[];
}

export default function PerlinNoiseBackground({
  className = "",
  scale = 0.01,
  speed = 0,
  opacity = 0.8,
  colors = ["#fff4e4", "#ffe7ce", "#ffd0a0", "#ffe09a"],
}: PerlinNoiseBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const noiseRef = useRef(new PerlinNoise());
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth / 4;
      canvas.height = window.innerHeight / 4;
    };

    const animate = () => {
      if (!ctx || !canvas) return;

      const { width, height } = canvas;
      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;

      timeRef.current += speed;

      for (let x = 0; x < width; x += 2) {
        for (let y = 0; y < height; y += 2) {
          // Generate noise value
          const noiseValue = noiseRef.current.noise(x * scale, y * scale, timeRef.current);

          // Normalize noise value to 0-1
          const normalizedNoise = (noiseValue + 1) / 2;

          // Map noise to color
          const colorIndex = Math.floor(normalizedNoise * (colors.length - 1));
          const nextColorIndex = Math.min(colorIndex + 1, colors.length - 1);
          const t = normalizedNoise * (colors.length - 1) - colorIndex;

          // Parse hex colors
          const color1 = hexToRgb(colors[colorIndex]);
          const color2 = hexToRgb(colors[nextColorIndex]);

          if (!color1 || !color2) continue;

          // Interpolate between colors
          const r = Math.floor(color1.r + (color2.r - color1.r) * t);
          const g = Math.floor(color1.g + (color2.g - color1.g) * t);
          const b = Math.floor(color1.b + (color2.b - color1.b) * t);

          // Set pixel data (2x2 blocks for performance)
          for (let dx = 0; dx < 2 && x + dx < width; dx++) {
            for (let dy = 0; dy < 2 && y + dy < height; dy++) {
              const index = ((y + dy) * width + (x + dx)) * 4;
              data[index] = r;
              data[index + 1] = g;
              data[index + 2] = b;
              data[index + 3] = Math.floor(255 * opacity);
            }
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);
      animationRef.current = requestAnimationFrame(animate);
    };

    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: Number.parseInt(result[1], 16),
            g: Number.parseInt(result[2], 16),
            b: Number.parseInt(result[3], 16),
          }
        : null;
    };

    resizeCanvas();
    animate();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [scale, speed, opacity, colors]);

  return (
    <canvas
      ref={canvasRef}
      className={`perlin-noise-canvas ${className}`}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        margin: 0,
        padding: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -10,
        pointerEvents: "none",
      }}
    />
  );
}
