'use client'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export function CustomCursor() {
  const [mounted, setMounted] = useState(false)
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  useEffect(() => {
    setMounted(true)
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY })
    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement
      setHovered(!!el.closest('a, button, [role="button"], input, select, textarea, label, [data-hover]'))
    }
    const onDown = () => setClicked(true)
    const onUp   = () => setClicked(false)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onOver)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
    }
  }, [])

  if (!mounted) return null;

  return (
    <div className="hidden md:block">
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[99999] mix-blend-difference"
        animate={{
          x: pos.x - (hovered ? 20 : 5),
          y: pos.y - (hovered ? 20 : 5),
          width:  hovered ? 40 : 10,
          height: hovered ? 40 : 10,
          background: hovered ? 'rgba(16,185,129,0.18)' : '#10b981',
          border: hovered ? '1.5px solid #10b981' : '0px solid transparent',
          scale: clicked ? 0.75 : 1,
        }}
        transition={{ type: 'spring', stiffness: 600, damping: 45, mass: 0.25 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-emerald-400/30 pointer-events-none z-[99998]"
        animate={{ x: pos.x - 4, y: pos.y - 4 }}
        transition={{ type: 'spring', stiffness: 120, damping: 18, mass: 0.8 }}
      />
    </div>
  )
}
