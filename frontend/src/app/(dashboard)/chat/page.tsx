"use client"

import { useState } from "react"
import { MessageSquare, Send, Bot, User } from "lucide-react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"

import { Heading } from "@/components/heading"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export default function ChatPage() {
  const [messages, setMessages] = useState<{role: string, content: string}[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input || isLoading) return

    const userMessage = { role: "user", content: input }
    setMessages((current) => [...current, userMessage])
    setIsLoading(true)
    
    const token = Cookies.get("token")

    try {
      // LLAMADA REAL A TU BACKEND EN FEDORA
      // Asegúrate de que tu endpoint en FastAPI coincida con esta URL
      const response = await fetch(`http://127.0.0.1:8000/api/v1/ai/chat?prompt=${encodeURIComponent(input)}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (response.status === 401) {
        router.push("/login")
        return
      }

      if (!response.ok) {
        throw new Error("Error en la respuesta de la IA")
      }

      const data = await response.json()
      
      setMessages((current) => [...current, { 
        role: "assistant", 
        content: data.response || data.content // Maneja ambos posibles nombres de campo
      }])

    } catch (error: any) {
      console.error("DEBUG AI ERROR:", error)
      setMessages((current) => [...current, { 
        role: "assistant", 
        content: "Lo siento, hubo un error al conectar con el servidor de IA." 
      }])
    } finally {
      setIsLoading(false)
      setInput("")
    }
  }

  return (
    <div className="h-full flex flex-col">
      <Heading 
        title="Chat de IA"
        description="Conversación en tiempo real impulsada por OpenAI y Fedora."
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
      />
      <div className="px-4 lg:px-8 flex-1 overflow-y-auto">
        <div className="space-y-4 mb-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground mt-20">
              <Bot className="w-12 h-12 mx-auto mb-4 opacity-20" />
              No hay mensajes aún. ¡Pregúntame algo!
            </div>
          )}
          {messages.map((message, index) => (
            <div 
              key={index}
              className={cn(
                "p-4 w-full flex items-start gap-x-4 rounded-lg",
                message.role === "user" ? "bg-white border border-black/10" : "bg-violet-500/10"
              )}
            >
              {message.role === "user" ? <User className="w-6 h-6 mt-1" /> : <Bot className="w-6 h-6 mt-1 text-violet-500" />}
              <div className="text-sm overflow-hidden leading-7">
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="p-4 rounded-lg w-full flex items-center justify-center bg-muted animate-pulse">
              <Bot className="w-5 h-5 mr-2 animate-bounce" />
              La IA está pensando...
            </div>
          )}
        </div>
      </div>
      
      {/* Input de mensajes fijo abajo */}
      <div className="p-4 lg:p-8 border-t bg-white">
        <form onSubmit={onSubmit} className="flex gap-x-2 max-w-4xl mx-auto">
          <Input 
            className="flex-1 focus-visible:ring-violet-500"
            placeholder="Escribe tu mensaje aquí..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <Button className="bg-violet-600 hover:bg-violet-700" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}