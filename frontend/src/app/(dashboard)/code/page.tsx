"use client"

import { useState } from "react"
import { Code, Send } from "lucide-react"
import ReactMarkdown from "react-markdown"

import { Heading } from "@/components/heading"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Empty } from "@/components/ui/empty"
import { Loader } from "@/components/ui/loader"
import { cn } from "@/lib/utils"

export default function CodePage() {
    const [messages, setMessages] = useState<{ role: string, content: string }[]>([])
    const [prompt, setPrompt] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!prompt) return

        try {
            setIsLoading(true)
            const userMessage = { role: "user", content: prompt }
            const newMessages = [...messages, userMessage]
            setMessages(newMessages)
            setPrompt("")

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"
            const response = await fetch(`${apiUrl}/api/v1/ai/code?prompt=${encodeURIComponent(prompt)}`, {
                method: "POST"
            })
            const data = await response.json()

            setMessages((current) => [...current, { role: "assistant", content: data.response }])

        } catch (error) {
            console.error("CODE ERROR:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="h-full flex flex-col">
            <Heading
                title="Code Helper"
                description="Genera código usando IA descriptiva."
                icon={Code}
                iconColor="text-emerald-500"
                bgColor="bg-emerald-500/10"
            />

            <div className="px-4 lg:px-8 mt-4 flex-1 overflow-y-auto pb-20">
                {messages.length === 0 && !isLoading && (
                    <div className="text-center text-muted-foreground mt-10">
                        <Code className="h-10 w-10 mx-auto opacity-50 mb-4" />
                        <p>Pregúntame algo, por ejemplo: "Como hacer un botón en React"</p>
                    </div>
                )}

                <div className="flex flex-col-reverse gap-y-4">
                    {messages.slice().reverse().map((message, index) => (
                        <div
                            key={index}
                            className={cn(
                                "p-8 w-full flex items-start gap-x-8 rounded-lg",
                                message.role === "user" ? "bg-white border border-black/10" : "bg-muted"
                            )}
                        >
                            <div className="flex flex-col w-full">
                                <p className="text-sm font-bold mb-2">{message.role === "user" ? "Tú" : "AI"}</p>
                                <div className="text-sm overflow-hidden leading-7">
                                    <ReactMarkdown
                                        components={{
                                            pre: ({ node, ...props }) => (
                                                <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                                                    <pre {...props} />
                                                </div>
                                            ),
                                            code: ({ node, ...props }) => (
                                                <code className="bg-black/10 rounded-lg p-1 text-sm font-mono" {...props} />
                                            )
                                        }}
                                    >
                                        {message.content}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {isLoading && (
                    <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted mt-4">
                        <p className="text-sm text-muted-foreground animate-pulse">Generando código...</p>
                    </div>
                )}
            </div>

            {/* Input Area Fixed Bottom */}
            <div className="p-4 lg:px-8 border-t bg-white">
                <form
                    onSubmit={onSubmit}
                    className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
                >
                    <Input
                        className="col-span-12 lg:col-span-10 border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="Escribe tu pregunta de código..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    />
                    <Button className="col-span-12 lg:col-span-2 w-full bg-emerald-500 hover:bg-emerald-600" disabled={isLoading}>
                        Generar
                    </Button>
                </form>
            </div>
        </div>
    )
}
