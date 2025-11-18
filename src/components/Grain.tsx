import { useEffect, useRef } from 'react'

interface GrainProps {
  opacity?: number
  blendMode?: string
}

export default function Grain({ opacity = 0.15, blendMode = 'overlay' }: GrainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    // Set canvas size to full window
    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener('resize', resize)

    // Generate grain with high contrast (mostly dark with bright specks)
    const generateGrain = () => {
      const w = canvas.width
      const h = canvas.height
      const imageData = ctx.createImageData(w, h)
      const data = imageData.data

      for (let i = 0; i < data.length; i += 4) {
        // Generate random value
        const rand = Math.random()
        // Make it mostly black with occasional bright specks for high contrast
        const noise = rand > 0.5 ? Math.random() * 255 : 0
        data[i] = noise      // R
        data[i + 1] = noise  // G
        data[i + 2] = noise  // B
        data[i + 3] = 255    // A (full alpha)
      }

      ctx.putImageData(imageData, 0, 0)
    }

    // Animate grain at slower speed (every 5 frames = ~12fps)
    let animationId: number
    let frameCount = 0
    const animate = () => {
      frameCount++
      if (frameCount % 5 === 0) {
        generateGrain()
      }
      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity,
        mixBlendMode: blendMode as any,
        zIndex: 5,
      }}
    />
  )
}

