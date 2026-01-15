"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  MessageSquare, 
  ImageIcon, 
  Settings, 
  Zap,
  LogOut,
  Code
} from "lucide-react"
import Cookies from "js-cookie"

const onLogout = () => {
  Cookies.remove("token") // Borra la cookie
  localStorage.removeItem("token") // Por si acaso
  router.push("/login")
  router.refresh()
}

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Chat AI",
    icon: MessageSquare,
    href: "/chat",
    color: "text-violet-500",
  },
  {
    label: "Generador Imagen",
    icon: ImageIcon,
    href: "/image",
    color: "text-pink-700",
  },
  {
    label: "Code Helper",
    icon: Code,
    href: "/code",
    color: "text-emerald-500",
  },
  {
    label: "Configuración",
    icon: Settings,
    href: "/settings",
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const onLogout = () => {
    // 1. Borramos el token de seguridad
    localStorage.removeItem("token")
    // 2. Redirigimos al usuario al login
    router.push("/login")
    // 3. Opcional: Recargar para limpiar estados de React
    router.refresh()
  }

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white border-r border-white/10">
      <div className="px-3 py-2 flex-1">
        {/* Logo Section */}
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <div className="relative w-8 h-8 mr-4">
            <Zap className="text-yellow-400 fill-yellow-400 w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            AI SaaS
          </h1>
        </Link>

        {/* Navigation Routes */}
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Logout Button Section */}
      <div className="px-3 py-2 mt-auto">
        <button
          onClick={onLogout}
          className="text-zinc-400 text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-red-500/10 rounded-lg transition border border-transparent hover:border-red-500/20"
        >
          <div className="flex items-center flex-1">
            <LogOut className="h-5 w-5 mr-3 text-red-500" />
            Cerrar Sesión
          </div>
        </button>
      </div>
    </div>
  )
}