"use client"

import { useState } from "react"
import { MessageSquare, Send, Bot, User } from "lucide-react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

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
        content: data.response || data.content 
      }])

    } catch (error: any) {
      console.error("DEBUG AI ERROR:", error)
      setMessages((current) => [...current, { 
        role: "assistant", 
        content: "Lo siento, hubo un error al conectar con el servidor de IA en Fedora." 
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
        description="Conversación profesional con Llama 3 (Groq) desde Fedora."
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
      />
      <div className="px-4 lg:px-8 flex-1 overflow-y-auto">
        <div className="space-y-4 mb-4 max-w-4xl mx-auto">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground mt-20">
              <Bot className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No hay mensajes aún. ¡Probemos el Markdown!</p>
            </div>
          )}
          
          {messages.map((message, index) => (
            <div 
              key={index}
              className={cn(
                "p-4 w-full flex items-start gap-x-4 rounded-lg",
                message.role === "user" ? "bg-white border border-black/10 shadow-sm" : "bg-muted/50 border border-violet-500/10"
              )}
            >
              {message.role === "user" ? (
                <User className="w-8 h-8 p-1 bg-gray-100 rounded-full shrink-0" />
              ) : (
                <Bot className="w-8 h-8 p-1 bg-violet-100 text-violet-600 rounded-full shrink-0" />
              )}
              
              {/* Contenedor del mensaje con Markdown */}
              <div className="text-sm overflow-hidden leading-7 flex-1">
                <div className={cn(
                  "prose prose-sm max-w-none dark:prose-invert",
                  "prose-code:bg-gray-200 prose-code:px-1 prose-code:rounded dark:prose-code:bg-gray-800", // Resalta comandos cortos
                  "prose-pre:bg-slate-900 prose-pre:text-white" // Fondo oscuro para bloques largos
                )}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="p-4 rounded-lg w-full flex items-center justify-center bg-muted animate-pulse">
              <Bot className="w-5 h-5 mr-2 animate-bounce text-violet-500" />
              <span className="text-sm text-muted-foreground">Procesando respuesta...</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Input de mensajes fijo abajo */}
      <div className="p-4 lg:p-8 border-t bg-slate-50">
        <form onSubmit={onSubmit} className="flex gap-x-2 max-w-4xl mx-auto">
          <Input 
            className="flex-1 bg-white border-violet-200 focus-visible:ring-violet-500"
            placeholder="Escribe tu mensaje aquí (ej: Crea una lista de comandos de Fedora)..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <Button className="bg-violet-600 hover:bg-violet-700 shrink-0" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}