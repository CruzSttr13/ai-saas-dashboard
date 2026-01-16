"use client"

import { ArrowRight, MessageSquare, ImageIcon, Code, Settings } from "lucide-react"
import { useRouter } from "next/navigation"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const tools = [
  {
    label: "Conversación IA",
    icon: MessageSquare,
    href: "/chat",
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  {
    label: "Generación de Imagen",
    icon: ImageIcon,
    href: "/image",
    color: "text-pink-700",
    bgColor: "bg-pink-700/10",
  },
  {
    label: "Asistente de Código",
    icon: Code,
    href: "/code",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    label: "Configuración",
    icon: Settings,
    href: "/settings",
    color: "text-gray-500",
    bgColor: "bg-gray-500/10", // Fallback color
  },
]

export default function DashboardPage() {
  const router = useRouter()

  return (
    <div>
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center">
          Explora el poder de la IA
        </h2>
        <p className="text-muted-foreground font-light text-sm md:text-lg text-center">
          Chatea con los modelos más inteligentes y crea contenido visual al instante.
        </p>
      </div>
      <div className="px-4 md:px-20 lg:px-32 space-y-4">
        {tools.map((tool) => (
          <Card
            key={tool.href}
            onClick={() => router.push(tool.href)}
            className="p-4 border-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer"
          >
            <div className="flex items-center gap-x-4">
              <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                <tool.icon className={cn("w-8 h-8", tool.color)} />
              </div>
              <div className="font-semibold">
                {tool.label}
              </div>
            </div>
            <ArrowRight className="w-5 h-5" />
          </Card>
        ))}
      </div>
    </div>
  )
}