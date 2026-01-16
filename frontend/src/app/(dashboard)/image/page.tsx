"use client"

import { useState } from "react"
import { ImageIcon, Download } from "lucide-react"
import { Heading } from "@/components/heading"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardFooter } from "@/components/ui/card"
import Image from "next/image"

export default function ImagePage() {
  const [prompt, setPrompt] = useState("")
  const [images, setImages] = useState<{ url: string, prompt: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt) return

    try {
      setIsLoading(true)
      setError(null)

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"
      const response = await fetch(`${apiUrl}/api/v1/images/generate?prompt=${encodeURIComponent(prompt)}`)

      if (!response.ok) {
        throw new Error("Error connecting to server")
      }

      const data = await response.json()

      // Añadimos la nueva imagen al principio de la lista
      setImages((current) => [{ url: data.url, prompt: data.prompt }, ...current])
      setPrompt("")
    } catch (error) {
      console.error("ERROR GENERATING IMAGE:", error)
      setError("Algo salió mal. Asegúrate de que el backend esté corriendo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <Heading
        title="Generación de Imágenes"
        description="Convierte tus palabras en arte visual."
        icon={ImageIcon}
        iconColor="text-pink-700"
        bgColor="bg-pink-700/10"
      />

      <div className="px-4 lg:px-8 space-y-4">
        <form onSubmit={onSubmit} className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2 bg-white shadow-sm">
          <Input
            className="col-span-12 lg:col-span-10 border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent px-0 text-lg"
            placeholder="Un astronauta montando un caballo en Marte..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
          />
          <Button className="col-span-12 lg:col-span-2 w-full bg-pink-700 hover:bg-pink-800 font-semibold" disabled={isLoading}>
            {isLoading ? "Creando..." : "Generar"}
          </Button>
        </form>

        {error && (
          <div className="p-4 bg-red-50 text-red-500 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="p-20">
            <div className="flex flex-col gap-y-4 items-center justify-center">
              <div className="w-10 h-10 relative animate-spin">
                <ImageIcon className="w-10 h-10 text-pink-700" />
              </div>
              <p className="text-sm text-muted-foreground animate-pulse">La IA está pintando tu idea... esto puede tardar unos segundos.</p>
            </div>
          </div>
        )}

        {images.length === 0 && !isLoading && !error && (
          <div className="text-center text-muted-foreground mt-20 opacity-20">
            <ImageIcon className="w-20 h-20 mx-auto" />
            <p>No se han generado imágenes todavía.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8 pb-10">
          {images.map((img, index) => (
            <Card key={index} className="rounded-lg overflow-hidden border-black/5 shadow-sm hover:shadow-md transition group">
              <div className="relative aspect-square">
                <Image
                  alt={img.prompt}
                  fill
                  src={img.url}
                  className="object-cover transition duration-300 group-hover:scale-105"
                  unoptimized={true} // IMPORTANT: Bypasses Next.js optimization for external dynamic URLs
                />
              </div>
              <CardFooter className="p-2 flex flex-col gap-2">
                <p className="text-xs text-muted-foreground line-clamp-1 w-full text-left italic">"{img.prompt}"</p>
                <Button
                  onClick={() => window.open(img.url)}
                  variant="secondary"
                  className="w-full h-8 text-xs"
                >
                  <Download className="h-3 w-3 mr-2" />
                  Descargar
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}