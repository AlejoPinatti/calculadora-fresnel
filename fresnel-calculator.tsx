"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Calculator, Zap, Info, CheckCircle, XCircle } from "lucide-react"

const FresnelDiagram = ({
  distance,
  frequency,
  fresnelRadius,
  obstacleHeight,
  obstaclePosition,
  fresnelHeightAtObstacle,
  isApproved,
  antennaHeight,
}: {
  distance: number
  frequency: number
  fresnelRadius: number
  obstacleHeight: number
  obstaclePosition: number
  fresnelHeightAtObstacle: number
  isApproved: boolean
  antennaHeight: number
}) => {
  const svgWidth = 350
  const svgHeight = 180
  const groundLevel = svgHeight - 25

  // Escalar para visualización
  const maxRadius = 35
  const visualRadius = Math.min(fresnelRadius * 2, maxRadius)
  const visualObstacleHeight = Math.min(obstacleHeight * 3, 50)

  // Posición del obstáculo en el SVG
  const obstacleX = 40 + (obstaclePosition / distance) * 270

  // Calcular alturas visuales de las antenas
  const visualAntennaA = Math.max(antennaHeight * 3, 5)
  const visualAntennaB = Math.max(antennaHeight * 3, 5)

  return (
    <div className="bg-white p-3 rounded-lg border">
      <h4 className="text-sm font-medium text-gray-700 mb-2 text-center">Diagrama de la Zona de Fresnel</h4>
      <svg width={svgWidth} height={svgHeight} className="mx-auto">
        {/* Suelo */}
        <line x1="0" y1={groundLevel} x2={svgWidth} y2={groundLevel} stroke="#8B7355" strokeWidth="2" />
        <rect x="0" y={groundLevel} width={svgWidth} height="25" fill="#D4B896" />

        {/* Antenas */}
        <g>
          {/* Antena izquierda */}
          <line x1="40" y1={groundLevel} x2="40" y2={groundLevel - visualAntennaA} stroke="#374151" strokeWidth="2" />
          <circle cx="40" cy={groundLevel - visualAntennaA} r="3" fill="#EF4444" />
          <text x="40" y={groundLevel + 15} textAnchor="middle" className="text-xs fill-gray-600">
            A ({antennaHeight}m)
          </text>

          {/* Antena derecha */}
          <line x1="310" y1={groundLevel} x2="310" y2={groundLevel - visualAntennaB} stroke="#374151" strokeWidth="2" />
          <circle cx="310" cy={groundLevel - visualAntennaB} r="3" fill="#EF4444" />
          <text x="310" y={groundLevel + 15} textAnchor="middle" className="text-xs fill-gray-600">
            B ({antennaHeight}m)
          </text>
        </g>

        {/* Línea de vista directa */}
        <line
          x1="40"
          y1={groundLevel - visualAntennaA}
          x2="310"
          y2={groundLevel - visualAntennaB}
          stroke="#3B82F6"
          strokeWidth="2"
          strokeDasharray="4,4"
        />

        {/* Zona de Fresnel (elipse) */}
        <ellipse
          cx="175"
          cy={groundLevel - visualAntennaA}
          rx="135"
          ry={visualRadius}
          fill={isApproved ? "rgba(34, 197, 94, 0.2)" : "rgba(239, 68, 68, 0.2)"}
          stroke={isApproved ? "#22C55E" : "#EF4444"}
          strokeWidth="2"
        />

        {/* Línea del 60% de la zona */}
        <ellipse
          cx="175"
          cy={groundLevel - visualAntennaA}
          rx="135"
          ry={visualRadius * 0.6}
          fill="none"
          stroke={isApproved ? "#22C55E" : "#EF4444"}
          strokeWidth="1"
          strokeDasharray="2,2"
        />

        {/* Obstáculo */}
        {obstacleHeight > 0 && (
          <>
            <rect
              x={obstacleX - 8}
              y={groundLevel - visualObstacleHeight}
              width="16"
              height={visualObstacleHeight}
              fill={isApproved ? "#F59E0B" : "#DC2626"}
              opacity="0.8"
            />
            <text
              x={obstacleX}
              y={groundLevel - visualObstacleHeight - 3}
              textAnchor="middle"
              className="text-xs fill-gray-700"
            >
              {obstacleHeight}m
            </text>
          </>
        )}

        {/* Etiquetas */}
        <text x="175" y="15" textAnchor="middle" className="text-xs fill-blue-600 font-medium">
          Primera Zona de Fresnel
        </text>
        <text
          x="175"
          y={groundLevel - visualAntennaA - visualRadius - 8}
          textAnchor="middle"
          className="text-xs fill-blue-600"
        >
          R = {fresnelRadius.toFixed(3)}m
        </text>

        {/* Línea del 60% */}
        <text
          x="280"
          y={groundLevel - visualAntennaA - visualRadius * 0.6 - 3}
          textAnchor="middle"
          className="text-xs fill-green-600"
        >
          60%
        </text>

        {/* Distancia */}
        <text x="175" y={groundLevel - 3} textAnchor="middle" className="text-xs fill-gray-600">
          {distance} km
        </text>
      </svg>

      <div className="mt-2 text-xs text-gray-600 space-y-1">
        <p>
          • <span className={isApproved ? "text-green-600" : "text-red-600"}>Zona coloreada:</span> Primera zona de
          Fresnel
        </p>
        <p>
          • <span className="text-green-600">Línea punteada:</span> 60% mínimo libre
        </p>
        <p>
          • <span className={isApproved ? "text-yellow-600" : "text-red-600"}>Obstáculo:</span>{" "}
          {obstacleHeight > 0 ? `${obstacleHeight}m` : "Sin obstáculo"}
        </p>
      </div>
    </div>
  )
}

export default function Component() {
  const [distance, setDistance] = useState("")
  const [frequency, setFrequency] = useState("")
  const [obstacleHeight, setObstacleHeight] = useState("")
  const [obstaclePosition, setObstaclePosition] = useState("")
  const [antennaHeight, setAntennaHeight] = useState("")
  const [result, setResult] = useState<number | null>(null)
  const [error, setError] = useState("")
  const [analysis, setAnalysis] = useState<{
    fresnelHeightAtObstacle: number
    clearancePercentage: number
    isApproved: boolean
    obstacleImpact: number
  } | null>(null)
  const [showFormula, setShowFormula] = useState(false)

  const calculateFresnel = () => {
    const d = Number.parseFloat(distance)
    const f = Number.parseFloat(frequency)
    const oh = Number.parseFloat(obstacleHeight) || 0
    const op = Number.parseFloat(obstaclePosition) || d / 2
    const ah = Number.parseFloat(antennaHeight) || 0

    // Validaciones básicas
    if (!distance || !frequency) {
      setResult(null)
      setAnalysis(null)
      setError("")
      return
    }

    if (isNaN(d) || isNaN(f)) {
      setError("Por favor ingrese números válidos")
      setResult(null)
      setAnalysis(null)
      return
    }

    if (d <= 0) {
      setError("La distancia debe ser mayor a 0")
      setResult(null)
      setAnalysis(null)
      return
    }

    if (f <= 0) {
      setError("La frecuencia debe ser mayor a 0")
      setResult(null)
      setAnalysis(null)
      return
    }

    if (op > d || op < 0) {
      setError("La posición del obstáculo debe estar entre 0 y la distancia total")
      setResult(null)
      setAnalysis(null)
      return
    }

    // Fórmula: F₁[m] = 8.656 √(D[km]/f[GHz])
    const fresnel = 8.656 * Math.sqrt(d / f)
    setResult(fresnel)

    // Calcular altura de la línea de vista en la posición del obstáculo
    const x = op
    const lineOfSightHeight = ah

    // Calcular altura de Fresnel en la posición del obstáculo desde la línea de vista
    const fresnelAtPosition = fresnel * Math.sqrt((4 * x * (d - x)) / (d * d))

    // El obstáculo debe superar tanto la línea de vista como la zona de Fresnel
    const totalRequiredHeight = lineOfSightHeight + fresnelAtPosition
    const obstacleBlocking = Math.max(0, oh)
    const clearHeight = Math.max(0, totalRequiredHeight - obstacleBlocking)
    const clearancePercentage = (clearHeight / totalRequiredHeight) * 100

    // Determinar si aprueba (necesita al menos 60% libre)
    const isApproved = clearancePercentage >= 60

    // Calcular impacto del obstáculo
    const obstacleImpact = (obstacleBlocking / fresnelAtPosition) * 100

    setAnalysis({
      fresnelHeightAtObstacle: fresnelAtPosition,
      clearancePercentage: Math.min(100, clearancePercentage),
      isApproved,
      obstacleImpact: Math.min(100, obstacleImpact),
    })

    setError("")
  }

  useEffect(() => {
    calculateFresnel()
  }, [distance, frequency, obstacleHeight, obstaclePosition, antennaHeight])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Zap className="h-7 w-7 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">Calculadora Zona de Fresnel</h1>
          </div>
          <p className="text-gray-600 text-sm">
            Herramienta simple para calcular el radio de la primera zona de Fresnel
          </p>
        </div>

        {/* Fórmula - Colapsable */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-2">
            <button
              onClick={() => setShowFormula(!showFormula)}
              className="flex items-center gap-2 text-blue-800 hover:text-blue-900 w-full text-left"
            >
              <Info className="h-4 w-4" />
              <CardTitle className="flex-1 text-base">Fórmula Utilizada</CardTitle>
              <span className="text-sm">{showFormula ? "▼" : "▶"}</span>
            </button>
          </CardHeader>
          {showFormula && (
            <CardContent className="pt-0">
              <div className="text-center">
                <div className="text-xl font-mono bg-white p-3 rounded-lg border">F₁[m] = 8.656 √(D[km]/f[GHz])</div>
                <p className="text-xs text-gray-600 mt-2">Donde D es la distancia en km y f es la frecuencia en GHz</p>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Layout de dos columnas */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* COLUMNA IZQUIERDA - DATOS */}
          <div className="space-y-4">
            {/* Datos principales */}
            <Card className="shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calculator className="h-5 w-5" />
                  Datos del Enlace
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Inputs principales */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="distance" className="text-sm font-medium">
                      Distancia (km)
                    </Label>
                    <Input
                      id="distance"
                      type="number"
                      placeholder="Ej: 10.5"
                      value={distance}
                      onChange={(e) => setDistance(e.target.value)}
                      className="h-10"
                      min="0"
                      step="0.1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="frequency" className="text-sm font-medium">
                      Frecuencia (GHz)
                    </Label>
                    <Input
                      id="frequency"
                      type="number"
                      placeholder="Ej: 2.4"
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      className="h-10"
                      min="0"
                      step="0.1"
                    />
                  </div>
                </div>

                {/* Frecuencias comunes */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <h3 className="font-medium text-gray-800 mb-2 text-sm">Frecuencias Comunes:</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Badge
                      variant="outline"
                      className="cursor-pointer hover:bg-blue-50 text-xs py-1"
                      onClick={() => setFrequency("2.4")}
                    >
                      WiFi: 2.4 GHz
                    </Badge>
                    <Badge
                      variant="outline"
                      className="cursor-pointer hover:bg-blue-50 text-xs py-1"
                      onClick={() => setFrequency("5.8")}
                    >
                      WiFi: 5.8 GHz
                    </Badge>
                    <Badge
                      variant="outline"
                      className="cursor-pointer hover:bg-blue-50 text-xs py-1"
                      onClick={() => setFrequency("0.9")}
                    >
                      GSM: 900 MHz
                    </Badge>
                    <Badge
                      variant="outline"
                      className="cursor-pointer hover:bg-blue-50 text-xs py-1"
                      onClick={() => setFrequency("1.8")}
                    >
                      GSM: 1800 MHz
                    </Badge>
                  </div>
                </div>

                {/* Altura de antenas */}
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2 text-sm">Altura de Ambas Antenas (m)</h3>
                  <div className="space-y-2">
                    <Input
                      id="antennaHeight"
                      type="number"
                      placeholder="Ej: 30"
                      value={antennaHeight}
                      onChange={(e) => setAntennaHeight(e.target.value)}
                      className="h-10"
                      min="0"
                      step="0.1"
                    />
                  </div>
                </div>

                {/* Inputs de obstáculo */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2 text-sm">Análisis de Obstáculos (Opcional)</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="obstacleHeight" className="text-sm font-medium">
                        Altura del Obstáculo (m)
                      </Label>
                      <Input
                        id="obstacleHeight"
                        type="number"
                        placeholder="Ej: 15"
                        value={obstacleHeight}
                        onChange={(e) => setObstacleHeight(e.target.value)}
                        className="h-10"
                        min="0"
                        step="0.1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="obstaclePosition" className="text-sm font-medium">
                        Posición del Obstáculo (km)
                      </Label>
                      <Input
                        id="obstaclePosition"
                        type="number"
                        placeholder={distance ? `Ej: ${(Number.parseFloat(distance) / 2).toFixed(1)}` : "Ej: 5"}
                        value={obstaclePosition}
                        onChange={(e) => setObstaclePosition(e.target.value)}
                        className="h-10"
                        min="0"
                        max={distance || undefined}
                        step="0.1"
                      />
                    </div>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* COLUMNA DERECHA - RESULTADOS */}
          <div className="space-y-4">
            {result !== null && !error && (
              <>
                {/* Resultado básico */}
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <p className="text-sm text-blue-700 mb-2">Radio de la Primera Zona de Fresnel:</p>
                      <div className="text-3xl font-bold text-blue-800 mb-1">{result.toFixed(2)} m</div>
                      <div className="text-lg text-blue-700">{(result * 100).toFixed(0)} cm</div>
                    </div>
                  </CardContent>
                </Card>

                {/* Análisis de obstáculos */}
                {analysis && (
                  <Card
                    className={`border-2 ${
                      analysis.isApproved ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300"
                    }`}
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-center gap-3 mb-3">
                        {analysis.isApproved ? (
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        ) : (
                          <XCircle className="h-6 w-6 text-red-600" />
                        )}
                        <div className="text-center">
                          <div
                            className={`text-xl font-bold ${analysis.isApproved ? "text-green-800" : "text-red-800"}`}
                          >
                            {analysis.isApproved ? "APROBADO" : "NO APROBADO"}
                          </div>
                          <p className={`text-xs ${analysis.isApproved ? "text-green-700" : "text-red-700"}`}>
                            Enlace de comunicación
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="font-medium text-gray-700">Altura de Fresnel:</p>
                          <p className="text-lg font-bold text-gray-800">
                            {analysis.fresnelHeightAtObstacle.toFixed(3)} m
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Zona libre:</p>
                          <p className="text-lg font-bold text-gray-800">{analysis.clearancePercentage.toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Tamaño obstáculo:</p>
                          <p className="text-lg font-bold text-gray-800">{Number.parseFloat(obstacleHeight) || 0} m</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Impacto:</p>
                          <p className="text-lg font-bold text-gray-800">{analysis.obstacleImpact.toFixed(1)}%</p>
                        </div>
                      </div>

                      <div className="mt-3 p-2 bg-white rounded border">
                        <p className="text-xs text-gray-700">
                          <strong>Criterio:</strong> Se requiere ≥60% libre.
                          {analysis.isApproved
                            ? ` ✅ Cumple (${analysis.clearancePercentage.toFixed(1)}% libre).`
                            : ` ❌ No cumple (${analysis.clearancePercentage.toFixed(1)}% libre).`}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Diagrama */}
                <Card>
                  <CardContent className="pt-4">
                    <FresnelDiagram
                      distance={Number.parseFloat(distance)}
                      frequency={Number.parseFloat(frequency)}
                      fresnelRadius={result}
                      obstacleHeight={Number.parseFloat(obstacleHeight) || 0}
                      obstaclePosition={Number.parseFloat(obstaclePosition) || Number.parseFloat(distance) / 2}
                      fresnelHeightAtObstacle={analysis?.fresnelHeightAtObstacle || 0}
                      isApproved={analysis?.isApproved || true}
                      antennaHeight={Number.parseFloat(antennaHeight) || 0}
                    />
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
        {/* Información adicional */}
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="pt-4">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-amber-600 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">¿Qué es la Zona de Fresnel?</p>
                <p className="text-xs">
                  Es una zona elíptica alrededor de la línea de vista directa entre dos antenas. Para una comunicación
                  óptima, se recomienda mantener al menos el 60% de la primera zona libre de obstáculos.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Footer con créditos */}
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="pt-4 text-center">
            <p className="text-sm text-gray-600">
              Desarrollado por: <span className="font-semibold">Alejo Pinatti</span>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
