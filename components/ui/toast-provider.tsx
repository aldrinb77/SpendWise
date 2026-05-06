'use client'
import { createContext, useContext, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, AlertTriangle, Info, Loader2, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading'
interface ToastItem { id: string; type: ToastType; title: string; description?: string; duration?: number }
type ToastFn = (opts: Omit<ToastItem, 'id'>) => string

const ToastContext = createContext<{ toast: ToastFn; dismiss: (id: string) => void }>({
  toast: () => '',
  dismiss: () => {},
})

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts(p => p.filter(t => t.id !== id))
  }, [])

  const toast = useCallback((opts: Omit<ToastItem, 'id'>): string => {
    const id = `toast-${Date.now()}-${Math.random()}`
    setToasts(p => [...p.slice(-4), { ...opts, id }])
    const duration = opts.duration ?? (opts.type === 'loading' ? 999999 : 4000)
    if (opts.type !== 'loading') {
      setTimeout(() => dismiss(id), duration)
    }
    return id
  }, [dismiss])

  const config = {
    success: {
      icon: CheckCircle2,
      iconColor: '#10b981',
      borderColor: 'rgba(16,185,129,0.2)',
      bgAccent: 'rgba(16,185,129,0.05)',
    },
    error: {
      icon: XCircle,
      iconColor: '#f43f5e',
      borderColor: 'rgba(244,63,94,0.2)',
      bgAccent: 'rgba(244,63,94,0.05)',
    },
    warning: {
      icon: AlertTriangle,
      iconColor: '#f59e0b',
      borderColor: 'rgba(245,158,11,0.2)',
      bgAccent: 'rgba(245,158,11,0.05)',
    },
    info: {
      icon: Info,
      iconColor: '#3b82f6',
      borderColor: 'rgba(59,130,246,0.2)',
      bgAccent: 'rgba(59,130,246,0.05)',
    },
    loading: {
      icon: Loader2,
      iconColor: '#8b5cf6',
      borderColor: 'rgba(139,92,246,0.2)',
      bgAccent: 'rgba(139,92,246,0.05)',
    },
  }

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[99999] flex flex-col gap-2 pointer-events-none" style={{ maxWidth: 380 }}>
        <AnimatePresence mode="popLayout">
          {toasts.map(t => {
            const c = config[t.type]
            const Icon = c.icon
            return (
              <motion.div key={t.id}
                layout
                initial={{ opacity: 0, y: 16, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 60, scale: 0.88 }}
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                className="pointer-events-auto flex items-start gap-3 p-4 rounded-2xl"
                style={{
                  background: `linear-gradient(135deg, #0a0e1a 0%, #080c16 100%)`,
                  border: `1px solid ${c.borderColor}`,
                  boxShadow: `0 20px 60px rgba(0,0,0,0.7), inset 0 0 0 1px ${c.bgAccent}`,
                  backdropFilter: 'blur(24px)',
                }}
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: c.bgAccent, border: `1px solid ${c.borderColor}` }}>
                  <Icon size={15} style={{ color: c.iconColor }}
                    className={t.type === 'loading' ? 'animate-spin' : ''} />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-sm font-semibold text-slate-900 leading-snug">{t.title}</p>
                  {t.description && (
                    <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      {t.description}
                    </p>
                  )}
                </div>
                <button onClick={() => dismiss(t.id)}
                  className="flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center transition-all"
                  style={{ color: 'rgba(255,255,255,0.2)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.2)')}>
                  <X size={11} />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
