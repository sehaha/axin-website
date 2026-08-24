"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  z: number;
  speed: number;
  phase: number;
  size: number;
};

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let pointerX = 0;
    let pointerY = 0;
    let smoothX = 0;
    let smoothY = 0;
    let time = 0;
    const depth = 1200;
    let particles: Particle[] = [];

    const createParticle = (): Particle => ({
      x: (Math.random() - 0.5) * Math.max(width, 900) * 1.7,
      y: (Math.random() - 0.5) * Math.max(height, 700) * 1.6,
      z: Math.random() * depth + 80,
      speed: Math.random() * 0.5 + 0.2,
      phase: Math.random() * Math.PI * 2,
      size: Math.random() * 1.5 + 0.4,
    });

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(190, Math.max(80, Math.round(width / 8)));
      particles = Array.from({ length: count }, createParticle);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointerX = (event.clientX / width - 0.5) * 2;
      pointerY = (event.clientY / height - 0.5) * 2;
    };

    const project = (particle: Particle) => {
      const perspective = 760 / (particle.z + 260);
      return {
        x: width / 2 + particle.x * perspective + smoothX * 28 * (1 - particle.z / depth),
        y: height / 2 + particle.y * perspective + smoothY * 20 * (1 - particle.z / depth),
        perspective,
      };
    };

    const draw = () => {
      time += reduceMotion ? 0 : 0.006;
      smoothX += (pointerX - smoothX) * 0.024;
      smoothY += (pointerY - smoothY) * 0.024;
      context.clearRect(0, 0, width, height);

      const glow = context.createRadialGradient(
        width * 0.55,
        height * 0.41,
        0,
        width * 0.55,
        height * 0.41,
        Math.max(width, height) * 0.68,
      );
      glow.addColorStop(0, "rgba(154,184,255,.22)");
      glow.addColorStop(0.18, "rgba(88,119,225,.11)");
      glow.addColorStop(0.5, "rgba(38,56,126,.035)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);

      const projected: Array<Particle & { px: number; py: number; scale: number }> = [];
      for (const particle of particles) {
        if (!reduceMotion) particle.z -= particle.speed * 2.1;
        particle.x += Math.sin(time * 1.5 + particle.phase) * 0.012;
        particle.y += Math.cos(time + particle.phase) * 0.009;
        if (particle.z < 55) Object.assign(particle, createParticle(), { z: depth });
        const point = project(particle);
        projected.push({ ...particle, px: point.x, py: point.y, scale: point.perspective });
      }

      for (let i = 0; i < projected.length; i += 1) {
        const a = projected[i];
        if (a.z > 720) continue;
        for (let j = i + 1; j < Math.min(projected.length, i + 12); j += 1) {
          const b = projected[j];
          if (Math.abs(a.z - b.z) > 155) continue;
          const dx = a.px - b.px;
          const dy = a.py - b.py;
          const distanceSquared = dx * dx + dy * dy;
          if (distanceSquared < 12000) {
            const alpha = Math.max(0, (1 - Math.sqrt(distanceSquared) / 110) * 0.08 * (1 - a.z / depth));
            context.strokeStyle = `rgba(144,171,255,${alpha})`;
            context.lineWidth = 0.45;
            context.beginPath();
            context.moveTo(a.px, a.py);
            context.lineTo(b.px, b.py);
            context.stroke();
          }
        }
      }

      for (const particle of projected) {
        const proximity = 1 - particle.z / depth;
        const radius = Math.max(0.35, particle.size * (0.7 + proximity * 2.2) * particle.scale * 1.5);
        context.fillStyle = `rgba(224,233,255,${0.12 + proximity * 0.64})`;
        context.beginPath();
        context.arc(particle.px, particle.py, radius, 0, Math.PI * 2);
        context.fill();
      }

      if (!reduceMotion) raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" aria-hidden="true" />;
}
