# Calculadora de Zona de Fresnel

Software libre para calcular el radio de la primera zona de Fresnel en enlaces de telecomunicaciones.

## Desarrollado por: Alejo Pinatti

### Características

- ✅ Cálculo preciso de la zona de Fresnel
- ✅ Análisis de obstáculos
- ✅ Visualización gráfica interactiva
- ✅ Interfaz responsive
- ✅ Frecuencias comunes preconfiguradas
- ✅ Validación de datos en tiempo real

### Instalación

1. Clona o descarga este repositorio:
   \`\`\`
    git clone https://github.com/AlejoPinatti/calculadora-fresnel.git
   \`\`\`
2. Instala las dependencias:
   \`\`\`
   npm install
   \`\`\`
3. Ejecuta la aplicación:
   \`\`\`
   npm start
   \`\`\`

### Uso

1. Ingresa la distancia del enlace en kilómetros
2. Ingresa la frecuencia en GHz (o selecciona una frecuencia común)
3. Opcionalmente, configura las alturas de las antenas
4. Opcionalmente, añade información sobre obstáculos
5. La aplicación calculará automáticamente el radio de Fresnel y determinará si el enlace es viable

### Fórmula Utilizada

F₁[m] = 8.656 √(D[km]/f[GHz])

Donde:
- F₁ = Radio de la primera zona de Fresnel en metros
- D = Distancia del enlace en kilómetros  
- f = Frecuencia en GHz

### Criterio de Aprobación

Para que un enlace sea considerado viable, se requiere que al menos el 60% de la primera zona de Fresnel esté libre de obstáculos.

### Licencia

MIT License - Software libre

### Tecnologías

- React 18
- JavaScript ES6+
- CSS3
- SVG para visualizaciones

---

**Contacto:** Alejo Pinatti
**Versión:** 1.0.0
