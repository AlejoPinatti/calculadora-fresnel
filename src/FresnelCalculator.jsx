"use client"

import { useState, useEffect } from "react"
import "./FresnelCalculator.css"

const FresnelDiagram = ({
  distance,
  frequency,
  fresnelRadius,
  obstacleHeight,
  obstaclePosition,
  fresnelHeightAtObstacle,
  isApproved,
  antennaHeight,
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
    <div className="diagram-container">
      <h4 className="diagram-title">Diagrama de la Zona de Fresnel</h4>
      <svg width={svgWidth} height={svgHeight} className="diagram-svg">
        {/* Suelo */}
        <line x1="0" y1={groundLevel} x2={svgWidth} y2={groundLevel} stroke="#8B7355" strokeWidth="2" />
        <rect x="0" y={groundLevel} width={svgWidth} height="25" fill="#D4B896" />

        {/* Antenas */}
        <g>
          {/* Antena izquierda */}
          <line x1="40" y1={groundLevel} x2="40" y2={groundLevel - visualAntennaA} stroke="#374151" strokeWidth="2" />
          <circle cx="40" cy={groundLevel - visualAntennaA} r="3" fill="#EF4444" />
          <text x="40" y={groundLevel + 15} textAnchor="middle" className="antenna-label">
            A ({antennaHeight}m)
          </text>

          {/* Antena derecha */}
          <line x1="310" y1={groundLevel} x2="310" y2={groundLevel - visualAntennaB} stroke="#374151" strokeWidth="2" />
          <circle cx="310" cy={groundLevel - visualAntennaB} r="3" fill="#EF4444" />
          <text x="310" y={groundLevel + 15} textAnchor="middle" className="antenna-label">
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
              className="obstacle-label"
            >
              {obstacleHeight}m
            </text>
          </>
        )}

        {/* Etiquetas */}
        <text x="175" y="15" textAnchor="middle" className="fresnel-title">
          Primera Zona de Fresnel
        </text>
        <text
          x="175"
          y={groundLevel - visualAntennaA - visualRadius - 8}
          textAnchor="middle"
          className="fresnel-radius"
        >
          R = {fresnelRadius.toFixed(3)}m
        </text>

        {/* Línea del 60% */}
        <text
          x="280"
          y={groundLevel - visualAntennaA - visualRadius * 0.6 - 3}
          textAnchor="middle"
          className="sixty-percent"
        >
          60%
        </text>

        {/* Distancia */}
        <text x="175" y={groundLevel - 3} textAnchor="middle" className="distance-label">
          {distance} km
        </text>
      </svg>

      <div className="diagram-legend">
        <p>
          • <span className={isApproved ? "text-green" : "text-red"}>Zona coloreada:</span> Primera zona de Fresnel
        </p>
        <p>
          • <span className="text-green">Línea punteada:</span> 60% mínimo libre
        </p>
        <p>
          • <span className={isApproved ? "text-yellow" : "text-red"}>Obstáculo:</span>{" "}
          {obstacleHeight > 0 ? `${obstacleHeight}m` : "Sin obstáculo"}
        </p>
      </div>
    </div>
  )
}

const FresnelCalculator = () => {
  const [distance, setDistance] = useState("")
  const [frequency, setFrequency] = useState("")
  const [obstacleHeight, setObstacleHeight] = useState("")
  const [obstaclePosition, setObstaclePosition] = useState("")
  const [antennaHeight, setAntennaHeight] = useState("")
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")
  const [analysis, setAnalysis] = useState(null)
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

  const FrequencyBadge = ({ children, onClick }) => (
    <button className="frequency-badge" onClick={onClick}>
      {children}
    </button>
  )

  return (
    <div className="calculator-container">
      <div className="calculator-wrapper">
        {/* Header */}
        <div className="header">
          <div className="header-content">
            <div className="header-icon">⚡</div>
            <h1 className="header-title">Calculadora Zona de Fresnel</h1>
          </div>
          <p className="header-subtitle">Herramienta simple para calcular el radio de la primera zona de Fresnel</p>
        </div>

        {/* Fórmula - Colapsable */}
        <div className="formula-card">
          <button onClick={() => setShowFormula(!showFormula)} className="formula-toggle">
            <span className="formula-icon">ℹ️</span>
            <span className="formula-title">Fórmula Utilizada</span>
            <span className="formula-arrow">{showFormula ? "▼" : "▶"}</span>
          </button>
          {showFormula && (
            <div className="formula-content">
              <div className="formula-display">F₁[m] = 8.656 √(D[km]/f[GHz])</div>
              <p className="formula-description">Donde D es la distancia en km y f es la frecuencia en GHz</p>
            </div>
          )}
        </div>

        {/* Layout de dos columnas */}
        <div className="two-column-layout">
          {/* COLUMNA IZQUIERDA - DATOS */}
          <div className="left-column">
            <div className="data-card">
              <div className="card-header">
                <span className="card-icon">🧮</span>
                <h2 className="card-title">Datos del Enlace</h2>
              </div>
              <div className="card-content">
                {/* Inputs principales */}
                <div className="input-grid">
                  <div className="input-group">
                    <label htmlFor="distance" className="input-label">
                      Distancia (km)
                    </label>
                    <input
                      id="distance"
                      type="number"
                      placeholder="Ej: 10.5"
                      value={distance}
                      onChange={(e) => setDistance(e.target.value)}
                      className="input-field"
                      min="0"
                      step="0.1"
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="frequency" className="input-label">
                      Frecuencia (GHz)
                    </label>
                    <input
                      id="frequency"
                      type="number"
                      placeholder="Ej: 2.4"
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      className="input-field"
                      min="0"
                      step="0.1"
                    />
                  </div>
                </div>

                {/* Frecuencias comunes */}
                <div className="frequency-section">
                  <h3 className="section-title">Frecuencias Comunes:</h3>
                  <div className="frequency-grid">
                    <FrequencyBadge onClick={() => setFrequency("2.4")}>WiFi: 2.4 GHz</FrequencyBadge>
                    <FrequencyBadge onClick={() => setFrequency("5.8")}>WiFi: 5.8 GHz</FrequencyBadge>
                    <FrequencyBadge onClick={() => setFrequency("0.9")}>GSM: 900 MHz</FrequencyBadge>
                    <FrequencyBadge onClick={() => setFrequency("1.8")}>GSM: 1800 MHz</FrequencyBadge>
                  </div>
                </div>

                {/* Altura de antenas */}
                <div className="antenna-section">
                  <h3 className="section-title">Altura de Antenas</h3>
                  <div className="input-group">
                    <label htmlFor="antennaHeight" className="input-label">
                      Altura de Ambas Antenas (m)
                    </label>
                    <input
                      id="antennaHeight"
                      type="number"
                      placeholder="Ej: 30"
                      value={antennaHeight}
                      onChange={(e) => setAntennaHeight(e.target.value)}
                      className="input-field"
                      min="0"
                      step="0.1"
                    />
                  </div>
                </div>

                {/* Inputs de obstáculo */}
                <div className="obstacle-section">
                  <h3 className="section-title">Análisis de Obstáculos (Opcional)</h3>
                  <div className="input-grid">
                    <div className="input-group">
                      <label htmlFor="obstacleHeight" className="input-label">
                        Altura del Obstáculo (m)
                      </label>
                      <input
                        id="obstacleHeight"
                        type="number"
                        placeholder="Ej: 15"
                        value={obstacleHeight}
                        onChange={(e) => setObstacleHeight(e.target.value)}
                        className="input-field"
                        min="0"
                        step="0.1"
                      />
                    </div>
                    <div className="input-group">
                      <label htmlFor="obstaclePosition" className="input-label">
                        Posición del Obstáculo (km)
                      </label>
                      <input
                        id="obstaclePosition"
                        type="number"
                        placeholder={distance ? `Ej: ${(Number.parseFloat(distance) / 2).toFixed(1)}` : "Ej: 5"}
                        value={obstaclePosition}
                        onChange={(e) => setObstaclePosition(e.target.value)}
                        className="input-field"
                        min="0"
                        max={distance || undefined}
                        step="0.1"
                      />
                    </div>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="error-message">
                    <p>{error}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA - RESULTADOS */}
          <div className="right-column">
            {result !== null && !error && (
              <>
                {/* Resultado básico */}
                <div className="result-card">
                  <div className="result-content">
                    <p className="result-label">Radio de la Primera Zona de Fresnel:</p>
                    <div className="result-value">{result.toFixed(2)} m</div>
                    <div className="result-cm">{(result * 100).toFixed(0)} cm</div>
                  </div>
                </div>

                {/* Análisis de obstáculos */}
                {analysis && (
                  <div className={`analysis-card ${analysis.isApproved ? "approved" : "rejected"}`}>
                    <div className="analysis-header">
                      <div className="analysis-icon">{analysis.isApproved ? "✅" : "❌"}</div>
                      <div className="analysis-status">
                        <div className="status-text">{analysis.isApproved ? "APROBADO" : "NO APROBADO"}</div>
                        <p className="status-subtitle">Enlace de comunicación</p>
                      </div>
                    </div>

                    <div className="analysis-grid">
                      <div className="analysis-item">
                        <p className="analysis-label">Altura de Fresnel:</p>
                        <p className="analysis-value">{analysis.fresnelHeightAtObstacle.toFixed(3)} m</p>
                      </div>
                      <div className="analysis-item">
                        <p className="analysis-label">Zona libre:</p>
                        <p className="analysis-value">{analysis.clearancePercentage.toFixed(1)}%</p>
                      </div>
                      <div className="analysis-item">
                        <p className="analysis-label">Tamaño obstáculo:</p>
                        <p className="analysis-value">{Number.parseFloat(obstacleHeight) || 0} m</p>
                      </div>
                      <div className="analysis-item">
                        <p className="analysis-label">Impacto:</p>
                        <p className="analysis-value">{analysis.obstacleImpact.toFixed(1)}%</p>
                      </div>
                    </div>

                    <div className="analysis-criteria">
                      <p>
                        <strong>Criterio:</strong> Se requiere ≥60% libre.
                        {analysis.isApproved
                          ? ` ✅ Cumple (${analysis.clearancePercentage.toFixed(1)}% libre).`
                          : ` ❌ No cumple (${analysis.clearancePercentage.toFixed(1)}% libre).`}
                      </p>
                    </div>
                  </div>
                )}

                {/* Diagrama */}
                <div className="diagram-card">
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
                </div>
              </>
            )}
          </div>
        </div>

        {/* Información adicional */}
        <div className="info-card">
          <div className="info-content">
            <span className="info-icon">ℹ️</span>
            <div className="info-text">
              <p className="info-title">¿Qué es la Zona de Fresnel?</p>
              <p className="info-description">
                Es una zona elíptica alrededor de la línea de vista directa entre dos antenas. Para una comunicación
                óptima, se recomienda mantener al menos el 60% de la primera zona libre de obstáculos.
              </p>
            </div>
          </div>
        </div>

        {/* Footer con créditos */}
        <div className="footer-card">
          <div className="footer-content">
            <p className="footer-text">
              Desarrollado por: <span className="footer-author">Alejo Pinatti</span>
            </p>
            <p className="footer-subtitle">Software libre para cálculos de telecomunicaciones</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FresnelCalculator
