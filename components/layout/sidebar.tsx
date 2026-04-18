'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  LucideLayoutDashboard, 
  LucideArrowLeftRight, 
  LucideUpload, 
  LucideSparkles, 
  LucideTarget, 
  LucideRepeat, 
  LucideSettings, 
  LucideLogOut,
  LucideWallet
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LucideLayoutDashboard },
  { name: 'Transactions', href: '/transactions', icon: LucideArrowLeftRight },
  { name: 'Import Data', href: '/import', icon: LucideUpload },
  { name: 'AI Insights', href: '/insights', icon: LucideSparkles },
  { name: 'Budgets', href: '/budgets', icon: LucideTarget },
  { name: 'Auto-Debits', href: '/auto-debits', icon: LucideRepeat },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; email: string; image?: string } | null>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) setUser(JSON.parse(savedUser))
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      localStorage.removeItem('user')
      router.push('/login')
    } catch (error) {
      console.error('Logout failed', error)
    }
  }

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[240px] bg-[#060910] border-r border-white/5 flex flex-col z-50">
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
      
      {/* Brand */}
      <div className="p-8 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
          <LucideWallet className="text-white h-6 w-6" />
        </div>
        <div className="flex flex-col">
          <span className="text-white font-black text-xl tracking-tighter leading-none">SpendWise</span>
          <span className="text-[10px] text-emerald-500/50 uppercase font-black tracking-widest mt-1">Premium Terminal</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 mt-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`group flex items-center gap-3 py-3 px-4 transition-all duration-300 relative ${
                isActive 
                  ? 'text-emerald-400 bg-emerald-500/5 rounded-r-xl' 
                  : 'text-white/40 hover:text-white/80 hover:bg-white/[0.03] rounded-xl'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="sidebar-active"
                  className="absolute left-0 top-0 bottom-0 w-[2px] bg-emerald-500"
                />
              )}
              <item.icon className="h-5 w-5" />
              <span className="text-sm font-bold tracking-tight">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* User Footer */}
      <div className="p-6 border-t border-white/5 bg-black/20">
        <div className="flex items-center gap-4 group cursor-default">
          <Avatar className="h-10 w-10 border border-white/10">
            <AvatarImage src={user?.image} />
            <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-blue-600 text-white font-black text-xs uppercase">
              {user?.name?.split(' ').map(n => n[0]).join('') || 'SW'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{user?.name || 'Intelligence Unit'}</p>
            <p className="text-[10px] text-white/30 font-medium truncate uppercase tracking-widest">{user?.email || 'OFFLINE TERMINAL'}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-6">
          <Link 
            href="/settings"
            className="flex items-center justify-center h-10 rounded-xl bg-white/[0.03] border border-white/5 text-white/40 hover:text-white hover:bg-white/[0.06] transition-all"
          >
            <LucideSettings className="h-4 w-4" />
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center h-10 rounded-xl bg-white/[0.03] border border-white/5 text-white/40 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
          >
            <LucideLogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
