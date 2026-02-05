// src/components/FirmaDigital.jsx - ACTUALIZAR
import React, { useRef, useState, useEffect } from 'react';
import '../styles/firma.css';

export default function FirmaDigital({ 
  value = "", 
  onChange, 
  disabled = false,
  label = "Firma"
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [signatureData, setSignatureData] = useState(value);

  // Prevenir scroll cuando se está dibujando
  useEffect(() => {
    const preventScroll = (e) => {
      if (isDrawing) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    document.addEventListener('touchmove', preventScroll, { passive: false });
    document.addEventListener('wheel', preventScroll, { passive: false });

    return () => {
      document.removeEventListener('touchmove', preventScroll);
      document.removeEventListener('wheel', preventScroll);
    };
  }, [isDrawing]);

  // Inicializar canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#000000';
    setContext(ctx);

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Si hay firma guardada, restaurarla
    if (signatureData) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = signatureData;
    }
  }, [signatureData]);

  // Obtener posición corregida para el canvas
  const getPosition = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    
    if (e.type.includes('mouse')) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else {
      // Touch event - prevenir el comportamiento por defecto
      e.preventDefault();
      const touch = e.touches[0];
      clientX = touch.clientX;
      clientY = touch.clientY;
    }
    
    // Calcular posición relativa al canvas
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    
    return { x, y };
  };

  // Manejar inicio del dibujo
  const startDrawing = (e) => {
    if (disabled) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const pos = getPosition(e);
    setIsDrawing(true);
    
    context.beginPath();
    context.moveTo(pos.x, pos.y);
  };

  // Manejar dibujo
  const draw = (e) => {
    if (!isDrawing || disabled) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const pos = getPosition(e);
    
    context.lineTo(pos.x, pos.y);
    context.stroke();
  };

  // Manejar fin del dibujo
  const stopDrawing = () => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    context.closePath();
    
    // Guardar la firma como imagen base64
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL('image/png');
    setSignatureData(dataURL);
    
    if (onChange) {
      onChange(dataURL);
    }
  };

  // Limpiar firma
  const clearSignature = () => {
    if (disabled) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    setSignatureData('');
    if (onChange) {
      onChange('');
    }
  };

  return (
    <div 
      className="firma-container" 
      ref={containerRef}
      onTouchMove={(e) => {
        // Prevenir scroll del contenedor padre
        if (isDrawing) {
          e.preventDefault();
        }
      }}
    >
      <label className="firma-label">{label}</label>
      
      <div className="firma-canvas-wrapper">
        <canvas
          ref={canvasRef}
          width={400}
          height={150}
          className="firma-canvas"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          onTouchCancel={stopDrawing}
          style={{
            touchAction: 'none'
          }}
        />
      </div>
      
      <div className="firma-controls">
        <button
          type="button"
          onClick={clearSignature}
          disabled={disabled || !signatureData}
          className="btn-limpiar"
          onTouchStart={(e) => e.stopPropagation()}
        >
          🗑️ Limpiar firma
        </button>
        
        <span className="firma-instructions">
          {disabled ? 
            "Firma bloqueada" : 
            "Dibuja tu firma con el mouse o dedo"}
        </span>
      </div>
    </div>
  );
}