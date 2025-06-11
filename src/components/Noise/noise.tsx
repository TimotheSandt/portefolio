"use client"

import { useEffect, useRef } from "react"

// Simplex Noise implementation
class SimplexNoise {
  private grad3 = [
    [1, 1, 0],
    [-1, 1, 0],
    [1, -1, 0],
    [-1, -1, 0],
    [1, 0, 1],
    [-1, 0, 1],
    [1, 0, -1],
    [-1, 0, -1],
    [0, 1, 1],
    [0, -1, 1],
    [0, 1, -1],
    [0, -1, -1],
  ]

  private p = [
    151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240,
    21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88,
    237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83,
    111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80,
    73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64,
    52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182,
    189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22,
    39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210,
    144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84,
    204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78,
    66, 215, 61, 156, 180,
  ]
  private perm = new Array(512)
  private gradP = new Array(512)

  constructor(seed = 0) {
    this.seed(seed)
  }

  seed(seed: number) {
    if (seed > 0 && seed < 1) {
      seed *= 65536
    }

    seed = Math.floor(seed)
    if (seed < 256) {
      seed |= seed << 8
    }

    for (let i = 0; i < 256; i++) {
      let v
      if (i & 1) {
        v = this.p[i] ^ (seed & 255)
      } else {
        v = this.p[i] ^ ((seed >> 8) & 255)
      }

      this.perm[i] = this.perm[i + 256] = v
      this.gradP[i] = this.gradP[i + 256] = this.grad3[v % 12]
    }
  }

  private dot(g: number[], x: number, y: number) {
    return g[0] * x + g[1] * y
  }

  noise(xin: number, yin: number): number {
    const F2 = 0.5 * (Math.sqrt(3) - 1)
    const G2 = (3 - Math.sqrt(3)) / 6

    const s = (xin + yin) * F2
    const i = Math.floor(xin + s)
    const j = Math.floor(yin + s)
    const t = (i + j) * G2
    const x0 = xin - i + t
    const y0 = yin - j + t

    let i1, j1
    if (x0 > y0) {
      i1 = 1
      j1 = 0
    } else {
      i1 = 0
      j1 = 1
    }

    const x1 = x0 - i1 + G2
    const y1 = y0 - j1 + G2
    const x2 = x0 - 1 + 2 * G2
    const y2 = y0 - 1 + 2 * G2

    const ii = i & 255
    const jj = j & 255
    const gi0 = this.gradP[ii + this.perm[jj]]
    const gi1 = this.gradP[ii + i1 + this.perm[jj + j1]]
    const gi2 = this.gradP[ii + 1 + this.perm[jj + 1]]

    const t0 = 0.5 - x0 * x0 - y0 * y0
    const n0 = t0 < 0 ? 0 : Math.pow(t0, 4) * this.dot(gi0, x0, y0)

    const t1 = 0.5 - x1 * x1 - y1 * y1
    const n1 = t1 < 0 ? 0 : Math.pow(t1, 4) * this.dot(gi1, x1, y1)

    const t2 = 0.5 - x2 * x2 - y2 * y2
    const n2 = t2 < 0 ? 0 : Math.pow(t2, 4) * this.dot(gi2, x2, y2)

    return 70 * (n0 + n1 + n2)
  }
}

// Fractal Brownian Motion
class FractalNoise {
  private simplex: SimplexNoise

  constructor(seed = 0) {
    this.simplex = new SimplexNoise(seed)
  }

  noise(x: number, y: number, octaves = 4, persistence = 0.5): number {
    let value = 0
    let amplitude = 1
    let frequency = 1
    let maxValue = 0

    for (let i = 0; i < octaves; i++) {
      value += this.simplex.noise(x * frequency, y * frequency) * amplitude
      maxValue += amplitude
      amplitude *= persistence
      frequency *= 2
    }

    return value / maxValue
  }
}

// Worley/Voronoi Noise
class WorleyNoise {
  private points: Array<{ x: number; y: number }> = []

  constructor(density = 50, seed = 12345) {
    let seedValue = seed
    const seededRandom = () => {
      seedValue = (seedValue * 9301 + 49297) % 233280
      return seedValue / 233280
    }

    for (let i = 0; i < density; i++) {
      this.points.push({
        x: seededRandom() * 4000,
        y: seededRandom() * 4000,
      })
    }
  }

  noise(x: number, y: number): number {
    let minDist = Number.POSITIVE_INFINITY

    for (const point of this.points) {
      const dx = x - point.x
      const dy = y - point.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      minDist = Math.min(minDist, dist)
    }

    return Math.min(minDist / 100, 1)
  }
}

// Value Noise
class ValueNoise {
  private seed: number

  constructor(seed = 12345) {
    this.seed = seed
  }

  private random(x: number, y: number): number {
    const n = Math.sin(x * 12.9898 + y * 78.233 + this.seed) * 43758.5453
    return n - Math.floor(n)
  }

  private interpolate(a: number, b: number, t: number): number {
    return a * (1 - t) + b * t
  }

  private smoothstep(t: number): number {
    return t * t * (3 - 2 * t)
  }

  noise(x: number, y: number): number {
    const ix = Math.floor(x)
    const iy = Math.floor(y)
    const fx = x - ix
    const fy = y - iy

    const a = this.random(ix, iy)
    const b = this.random(ix + 1, iy)
    const c = this.random(ix, iy + 1)
    const d = this.random(ix + 1, iy + 1)

    const i1 = this.interpolate(a, b, this.smoothstep(fx))
    const i2 = this.interpolate(c, d, this.smoothstep(fx))

    return this.interpolate(i1, i2, this.smoothstep(fy))
  }
}

// Ridged Noise
class RidgedNoise {
  private simplex: SimplexNoise

  constructor(seed = 0) {
    this.simplex = new SimplexNoise(seed)
  }

  noise(x: number, y: number): number {
    return 1 - Math.abs(this.simplex.noise(x, y))
  }
}

type NoiseType = "simplex" | "fractal" | "worley" | "value" | "ridged"

interface NoiseLayer {
  type: NoiseType
  weight: number
  scale: number
  seed: number
}

interface MixedNoiseBackgroundProps {
  noiseLayers: NoiseLayer[]
  resolution?: number
  colors?: string[]
  opacity?: number
}

export function MixedNoiseBackground({
  noiseLayers = [{ type: "simplex", weight: 1, scale: 0.01, seed: 12345 }],
  resolution = 2,
  colors = ["#1a1a2e", "#16213e", "#0f3460", "#533483"],
  opacity = 0.8,
}: MixedNoiseBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Initialize noise generators
  const noiseGenerators = useRef({
    simplex: {} as Record<number, SimplexNoise>,
    fractal: {} as Record<number, FractalNoise>,
    worley: {} as Record<number, WorleyNoise>,
    value: {} as Record<number, ValueNoise>,
    ridged: {} as Record<number, RidgedNoise>,
  })

  // Get or create a noise generator for a specific type and seed
  const getNoiseGenerator = (type: NoiseType, seed: number) => {
    const generators = noiseGenerators.current

    switch (type) {
      case "simplex":
        if (!generators.simplex[seed]) {
          generators.simplex[seed] = new SimplexNoise(seed)
        }
        return generators.simplex[seed]
      case "fractal":
        if (!generators.fractal[seed]) {
          generators.fractal[seed] = new FractalNoise(seed)
        }
        return generators.fractal[seed]
      case "worley":
        if (!generators.worley[seed]) {
          generators.worley[seed] = new WorleyNoise(50, seed)
        }
        return generators.worley[seed]
      case "value":
        if (!generators.value[seed]) {
          generators.value[seed] = new ValueNoise(seed)
        }
        return generators.value[seed]
      case "ridged":
        if (!generators.ridged[seed]) {
          generators.ridged[seed] = new RidgedNoise(seed)
        }
        return generators.ridged[seed]
      default:
        if (!generators.simplex[seed]) {
          generators.simplex[seed] = new SimplexNoise(seed)
        }
        return generators.simplex[seed]
    }
  }

  // Get noise value for a specific layer
  const getNoiseValue = (layer: NoiseLayer, x: number, y: number): number => {
    const { type, scale, seed } = layer
    const generator = getNoiseGenerator(type, seed)

    switch (type) {
      case "simplex":
        return generator.noise(x * scale, y * scale)
      case "fractal":
        return (generator as FractalNoise).noise(x * scale, y * scale)
      case "worley":
        return (generator as WorleyNoise).noise(x * scale, y * scale)
      case "value":
        return (generator as ValueNoise).noise(x * scale, y * scale)
      case "ridged":
        return (generator as RidgedNoise).noise(x * scale, y * scale)
      default:
        return generator.noise(x * scale, y * scale)
    }
  }

  // Mix multiple noise layers together
  const getMixedNoiseValue = (x: number, y: number): number => {
    if (noiseLayers.length === 0) return 0

    let totalValue = 0
    let totalWeight = 0

    for (const layer of noiseLayers) {
      const value = getNoiseValue(layer, x, y)
      totalValue += value * layer.weight
      totalWeight += layer.weight
    }

    return totalWeight > 0 ? totalValue / totalWeight : 0
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const generateNoise = () => {
      // Set canvas size to match container size
      const { width, height } = container.getBoundingClientRect()
      canvas.width = width
      canvas.height = height

      const imageData = ctx.createImageData(width, height)
      const data = imageData.data

      for (let x = 0; x < width; x += resolution) {
        for (let y = 0; y < height; y += resolution) {
          const noiseValue = getMixedNoiseValue(x, y)
          const normalizedNoise = Math.max(0, Math.min(1, (noiseValue + 1) / 2))

          const colorIndex = Math.floor(normalizedNoise * (colors.length - 1))
          const nextColorIndex = Math.min(colorIndex + 1, colors.length - 1)
          const t = normalizedNoise * (colors.length - 1) - colorIndex

          const color1 = hexToRgb(colors[colorIndex])
          const color2 = hexToRgb(colors[nextColorIndex])

          if (!color1 || !color2) continue

          const r = Math.floor(color1.r + (color2.r - color1.r) * t)
          const g = Math.floor(color1.g + (color2.g - color1.g) * t)
          const b = Math.floor(color1.b + (color2.b - color1.b) * t)

          // Fill resolution x resolution block
          for (let dx = 0; dx < resolution && x + dx < width; dx++) {
            for (let dy = 0; dy < resolution && y + dy < height; dy++) {
              const index = ((y + dy) * width + (x + dx)) * 4
              data[index] = r
              data[index + 1] = g
              data[index + 2] = b
              data[index + 3] = Math.floor(255 * opacity)
            }
          }
        }
      }

      ctx.putImageData(imageData, 0, 0)
    }

    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result
        ? {
            r: Number.parseInt(result[1], 16),
            g: Number.parseInt(result[2], 16),
            b: Number.parseInt(result[3], 16),
          }
        : null
    }

    generateNoise()

    // Regenerate on window resize
    const handleResize = () => {
      generateNoise()
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [noiseLayers, resolution, colors, opacity])

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        margin: 0,
        padding: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          margin: 0,
          padding: 0,
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  )
}
