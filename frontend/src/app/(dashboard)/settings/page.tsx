"use client"

import { Settings, Zap, User, CreditCard } from "lucide-react"

import { Heading } from "@/components/heading"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function SettingsPage() {
    // Simulamos datos por ahora (el endpoint /users/me existe pero requeriría auth hook complejo para este paso rápido)
    // En Día 8 conectaremos esto con Stripe real.
    const isPro = false

    return (
        <div>
            <Heading
                title="Configuración"
                description="Gestiona tu cuenta y suscripción."
                icon={Settings}
                iconColor="text-gray-700"
                bgColor="bg-gray-700/10"
            />
            <div className="px-4 lg:px-8 space-y-4">
                <div className="text-muted-foreground text-sm">
                    Plan Actual
                </div>
                <Card className="p-4 border-black/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-x-4">
                        <div className="p-2 w-fit rounded-md bg-orange-100">
                            <Zap className="w-8 h-8 text-orange-500" />
                        </div>
                        <div>
                            <div className="font-semibold text-lg">
                                {isPro ? "Plan Pro" : "Plan Gratuito"}
                            </div>
                            <div className="text-muted-foreground text-sm">
                                {isPro ? "Tienes acceso ilimitado a todas las funciones." : "Actualmente estás en el plan básico limitada."}
                            </div>
                        </div>
                    </div>
                    <Button className="w-full md:w-auto" variant={isPro ? "default" : "premium"}>
                        {isPro ? "Gestionar Suscripción" : "Mejorar a Pro"}
                    </Button>
                </Card>

                <div className="text-muted-foreground text-sm mt-8">
                    Perfil de Usuario
                </div>
                <Card className="p-4 border-black/5">
                    <div className="flex items-center gap-x-4 mb-4">
                        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <p className="font-medium">Usuario Demo</p>
                            <p className="text-sm text-muted-foreground">demo@ejemplo.com</p>
                        </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                        <p>ID: user_123456789</p>
                        <p>Backend: Conectado (Fedora Local)</p>
                    </div>
                </Card>
            </div>
        </div>
    )
}
