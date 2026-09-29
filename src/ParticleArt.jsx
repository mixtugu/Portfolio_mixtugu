import React, { useEffect, useRef, useState } from 'react';
import { particleScenes, sampleParticleShapes } from './data/particleShapes';

const CYCLE_MS = 6500;
const MORPH_MS = 2300;
const ease = (value) => value * value * (3 - 2 * value);

export function ParticleArt({ active, paused, onNext, description, loadingLabel, errorLabel, retryLabel }) {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const optionsRef = useRef({ active, paused, onNext });
  optionsRef.current = { active, paused, onNext };
  const [shapes, setShapes] = useState(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoadFailed(false);
    const count = window.matchMedia('(max-width: 600px)').matches ? 6000 : 10000;
    sampleParticleShapes(count).then((result) => {
      if (!cancelled) setShapes(result);
    }).catch(() => {
      if (!cancelled) setLoadFailed(true);
    });
    return () => { cancelled = true; };
  }, [loadAttempt]);

  useEffect(() => {
    if (!shapes) return undefined;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const count = shapes[0].length;
    const pointer = { x: -9999, y: -9999 };
    const burst = { x: 0, y: 0, start: -2000 };
    const bounds = shapes.map((shape) => {
      let minX = Infinity;
      let maxX = -Infinity;
      let minY = Infinity;
      let maxY = -Infinity;
      for (const point of shape) {
        minX = Math.min(minX, point.x);
        maxX = Math.max(maxX, point.x);
        minY = Math.min(minY, point.y);
        maxY = Math.max(maxY, point.y);
      }
      return { width: Math.max(Math.abs(minX), Math.abs(maxX)) * 2, height: Math.max(Math.abs(minY), Math.abs(maxY)) * 2 };
    });
    let width = 0;
    let height = 0;
    let scale = 1;
    let frame = 0;
    let lastTime = 0;
    let elapsed = 0;
    let animationTime = 0;
    let morphTime = optionsRef.current.paused ? MORPH_MS : 0;
    let sceneIndex = optionsRef.current.active;
    let inView = true;
    let reducedMotion = media.matches;
    let waitingForNext = false;

    const particles = Array.from({ length: count }, (_, i) => {
      const angle = i * 2.399963;
      const radius = 110 + ((i * 73) % 310);
      const cloudX = Math.cos(angle) * radius;
      const cloudY = Math.sin(angle) * radius * 0.78;
      return {
        x: cloudX, y: cloudY, fromX: cloudX, fromY: cloudY,
        cloudX, cloudY,
        r: shapes[sceneIndex][i].r, g: shapes[sceneIndex][i].g, b: shapes[sceneIndex][i].b,
        size: 0.52 + (i % 5) * 0.11,
        phase: angle,
        radius,
        depth: Math.sin(angle * 3) * 24,
        previousX: null,
        previousY: null,
      };
    });

    function render(delta = 0) {
      const staticFrame = reducedMotion;
      const playing = !optionsRef.current.paused && !staticFrame;
      if (playing) {
        elapsed += delta;
        animationTime += delta;
        morphTime = Math.min(MORPH_MS, morphTime + delta);
      }
      const t = staticFrame ? 1 : Math.min(1, morphTime / MORPH_MS);
      const shape = shapes[sceneIndex];
      const fit = Math.min(width / (bounds[sceneIndex].width + 64), height / (bounds[sceneIndex].height + 60));
      scale += (fit - scale) * (staticFrame || !playing ? 1 : 1 - Math.exp(-delta / 220));
      ctx.clearRect(0, 0, width, height);

      // A light orbital field makes the motion visible without adding decorative UI.
      for (let i = 0; i < 100; i += 1) {
        const angle = i * 2.399963 + animationTime / (13000 + i * 70);
        const radius = 0.24 + (i % 19) / 38;
        const x = width / 2 + Math.cos(angle) * width * radius;
        const y = height / 2 + Math.sin(angle) * height * radius;
        ctx.fillStyle = `rgba(79, 70, 229, ${0.08 + (i % 5) * 0.025})`;
        ctx.fillRect(x, y, i % 7 === 0 ? 2 : 1, i % 7 === 0 ? 2 : 1);
      }

      const yaw = staticFrame ? 0 : Math.sin(animationTime / 1800) * 0.075;
      const floatY = staticFrame ? 0 : Math.sin(animationTime / 1300) * 4;
      const burstAge = animationTime - burst.start;
      for (let i = 0; i < count; i += 1) {
        const p = particles[i];
        const target = shape[i];
        const delay = (i % 23) / 23 * 0.14;
        const localT = Math.max(0, Math.min(1, (t - delay) / (1 - delay)));
        const gather = Math.max(0, (localT - 0.3) / 0.7);
        const settle = 1 - (1 - gather) ** 3 + Math.sin(gather * Math.PI * 2) * (1 - gather) * 0.12;
        const scatter = ease(Math.min(1, localT / 0.4));
        const spin = p.phase + localT * Math.PI * 1.5;
        const orbitX = Math.cos(spin) * p.radius;
        const orbitY = Math.sin(spin) * p.radius * 0.82;
        const cloudX = p.fromX + (orbitX - p.fromX) * scatter;
        const cloudY = p.fromY + (orbitY - p.fromY) * scatter;
        p.x = cloudX + (target.x - cloudX) * settle;
        p.y = cloudY + (target.y - cloudY) * settle;
        const blend = staticFrame ? 1 : 1 - Math.exp(-delta / 220);
        p.r += (target.r - p.r) * blend;
        p.g += (target.g - p.g) * blend;
        p.b += (target.b - p.b) * blend;
        const drift = staticFrame ? 0 : Math.sin(animationTime / 900 + p.phase) * 0.65;
        let x = width / 2 + (p.x * Math.cos(yaw) + p.depth * Math.sin(yaw) + drift) * scale;
        let y = height / 2 + (p.y + drift + floatY) * scale;
        const dx = x - pointer.x;
        const dy = y - pointer.y;
        const distance = Math.hypot(dx, dy);
        if (playing && distance < 125 && distance > 0) {
          const force = (1 - distance / 125) ** 2 * 65;
          x += dx / distance * force;
          y += dy / distance * force;
        }
        if (!staticFrame && burstAge >= 0 && burstAge < 1000) {
          const bx = x - burst.x;
          const by = y - burst.y;
          const bd = Math.max(1, Math.hypot(bx, by));
          const ring = 30 + burstAge * 0.45;
          const force = Math.exp(-(((bd - ring) / 65) ** 2)) * (1 - burstAge / 1000) * 60;
          x += bx / bd * force;
          y += by / bd * force;
        }
        const alpha = 0.76 + (i % 4) * 0.08;
        if (t > 0.06 && t < 0.94 && i % 18 === 0 && p.previousX !== null) {
          ctx.strokeStyle = `rgba(${Math.round(p.r)},${Math.round(p.g)},${Math.round(p.b)},0.22)`;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(p.previousX, p.previousY);
          ctx.lineTo(x, y);
          ctx.stroke();
        }
        p.previousX = x;
        p.previousY = y;
        ctx.fillStyle = `rgba(${Math.round(p.r)},${Math.round(p.g)},${Math.round(p.b)},${alpha})`;
        const size = Math.max(0.4, p.size * scale);
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        if (i % 43 === 0) {
          ctx.fillStyle = `rgba(${Math.round(p.r)},${Math.round(p.g)},${Math.round(p.b)},0.08)`;
          ctx.beginPath();
          ctx.arc(x, y, size * 3.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      if (playing && elapsed >= CYCLE_MS && !waitingForNext) {
        waitingForNext = true;
        optionsRef.current.onNext((sceneIndex + 1) % particleScenes.length);
      }
    }

    function tick(now) {
      frame = 0;
      const delta = lastTime ? Math.min(now - lastTime, 50) : 16;
      lastTime = now;
      render(delta);
      schedule();
    }

    function schedule() {
      if (!frame && inView && !document.hidden && !reducedMotion && !optionsRef.current.paused) {
        frame = window.requestAnimationFrame(tick);
      }
    }

    function stop() {
      window.cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      scale = Math.min(width / (bounds[sceneIndex].width + 64), height / (bounds[sceneIndex].height + 60));
      render();
    }

    function onPointerMove(event) {
      if (event.pointerType === 'touch') return;
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    }
    function onPointerLeave() {
      pointer.x = -9999;
      pointer.y = -9999;
    }
    function onPointerDown(event) {
      if (reducedMotion || optionsRef.current.paused) return;
      const rect = canvas.getBoundingClientRect();
      burst.x = event.clientX - rect.left;
      burst.y = event.clientY - rect.top;
      burst.start = animationTime;
    }
    function onVisibilityChange() {
      stop();
      schedule();
    }
    function onMotionChange() {
      reducedMotion = media.matches;
      stop();
      render();
      schedule();
    }

    engineRef.current = {
      update() {
        if (sceneIndex !== optionsRef.current.active) {
          for (const p of particles) {
            p.fromX = p.x;
            p.fromY = p.y;
          }
          sceneIndex = optionsRef.current.active;
          elapsed = 0;
          morphTime = optionsRef.current.paused || reducedMotion ? MORPH_MS : 0;
          waitingForNext = false;
          // A paused scene can still be selected and inspected immediately.
          if (optionsRef.current.paused) {
            particles.forEach((p, i) => Object.assign(p, shapes[sceneIndex][i]));
          }
        }
        stop();
        render();
        schedule();
      },
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      stop();
      schedule();
    }, { threshold: 0.01 });
    intersectionObserver.observe(canvas);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerleave', onPointerLeave);
    canvas.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('visibilitychange', onVisibilityChange);
    media.addEventListener('change', onMotionChange);
    resize();
    schedule();

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      canvas.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      media.removeEventListener('change', onMotionChange);
      engineRef.current = null;
    };
  }, [shapes]);

  useEffect(() => {
    engineRef.current?.update();
  }, [active, paused]);

  return <>
    <canvas ref={canvasRef} className="particleCanvas" role="img" aria-label={description} aria-busy={!shapes} />
    {!shapes && <div className="particleLoadStatus" role="status">
      <span>{loadFailed ? errorLabel : loadingLabel}</span>
      {loadFailed && <button type="button" onClick={() => setLoadAttempt((value) => value + 1)}>{retryLabel}</button>}
    </div>}
  </>;
}
