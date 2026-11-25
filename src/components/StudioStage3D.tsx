"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ThemeMode } from "@/types/cv";

interface StudioStage3DProps {
  theme: ThemeMode;
  triggerRef: React.RefObject<HTMLElement | null>;
}

/**
 * Pattern 1 (Layered Separation): Non-blocking ambient Three.js cinema-lens stage
 * synchronized with GSAP ScrollTrigger & damped pointer parallax.
 * Only activates on fine-pointer desktop viewports (>= 1024px) with motion enabled.
 */
export function StudioStage3D({ theme, triggerRef }: StudioStage3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const materialsRef = useRef<{
    outerRing?: THREE.MeshBasicMaterial;
    innerRing?: THREE.MeshBasicMaterial;
    ticks?: THREE.LineBasicMaterial;
    dust?: THREE.PointsMaterial;
  }>({});

  // Sync palette cleanly when user switches Light Stone / Dark Obsidian
  useEffect(() => {
    const mats = materialsRef.current;
    const isDark = theme === "dark";
    if (mats.outerRing) {
      mats.outerRing.color.set(isDark ? "#dfa066" : "#8f5222");
      mats.outerRing.opacity = isDark ? 0.32 : 0.24;
    }
    if (mats.innerRing) {
      mats.innerRing.color.set(isDark ? "#88867f" : "#6e6c66");
      mats.innerRing.opacity = isDark ? 0.22 : 0.18;
    }
    if (mats.ticks) {
      mats.ticks.color.set(isDark ? "#dfa066" : "#8f5222");
      mats.ticks.opacity = isDark ? 0.24 : 0.18;
    }
    if (mats.dust) {
      mats.dust.color.set(isDark ? "#eab582" : "#8f5222");
      mats.dust.opacity = isDark ? 0.35 : 0.22;
    }
  }, [theme]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const desktopFinePointer = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!desktopFinePointer.matches || reducedMotion.matches) return;

    gsap.registerPlugin(ScrollTrigger);

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || 720;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 40);
    camera.position.set(0, 0, 7.2);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const isDark = document.documentElement.classList.contains("dark");

    // Offset optical rig toward right side behind the portrait
    const rig = new THREE.Group();
    rig.position.set(2.05, 0.05, 0);
    scene.add(rig);

    const outerGeo = new THREE.TorusGeometry(2.18, 0.012, 16, 128);
    const outerMat = new THREE.MeshBasicMaterial({
      color: isDark ? "#dfa066" : "#8f5222",
      transparent: true,
      opacity: isDark ? 0.32 : 0.24,
    });
    const outerRing = new THREE.Mesh(outerGeo, outerMat);
    outerRing.rotation.x = 0.32;
    outerRing.rotation.y = -0.22;
    rig.add(outerRing);

    const innerGeo = new THREE.TorusGeometry(1.56, 0.008, 12, 96);
    const innerMat = new THREE.MeshBasicMaterial({
      color: isDark ? "#88867f" : "#6e6c66",
      transparent: true,
      opacity: isDark ? 0.22 : 0.18,
    });
    const innerRing = new THREE.Mesh(innerGeo, innerMat);
    innerRing.rotation.x = -0.45;
    innerRing.rotation.y = 0.28;
    rig.add(innerRing);

    // Subtle cinema lens focus calibration ticks
    const tickCount = 36;
    const tickPositions = new Float32Array(tickCount * 2 * 3);
    for (let i = 0; i < tickCount; i++) {
      const theta = (i / tickCount) * Math.PI * 2;
      const r1 = 2.3;
      const r2 = i % 3 === 0 ? 2.44 : 2.37;
      const idx = i * 6;
      tickPositions[idx] = Math.cos(theta) * r1;
      tickPositions[idx + 1] = Math.sin(theta) * r1;
      tickPositions[idx + 2] = 0;
      tickPositions[idx + 3] = Math.cos(theta) * r2;
      tickPositions[idx + 4] = Math.sin(theta) * r2;
      tickPositions[idx + 5] = 0;
    }
    const tickGeo = new THREE.BufferGeometry();
    tickGeo.setAttribute("position", new THREE.BufferAttribute(tickPositions, 3));
    const tickMat = new THREE.LineBasicMaterial({
      color: isDark ? "#dfa066" : "#8f5222",
      transparent: true,
      opacity: isDark ? 0.24 : 0.18,
    });
    const ticks = new THREE.LineSegments(tickGeo, tickMat);
    ticks.rotation.x = 0.32;
    ticks.rotation.y = -0.22;
    rig.add(ticks);

    // Atmospheric cinema dust particles
    const dustCount = 72;
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.3) * 8.5;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 5.2;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 3.2;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: isDark ? "#eab582" : "#8f5222",
      size: 0.032,
      transparent: true,
      opacity: isDark ? 0.35 : 0.22,
      sizeAttenuation: true,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    materialsRef.current = {
      outerRing: outerMat,
      innerRing: innerMat,
      ticks: tickMat,
      dust: dustMat,
    };

    const pointer = { targetX: 0, targetY: 0, currentX: 0, currentY: 0 };
    const handlePointerMove = (e: PointerEvent) => {
      pointer.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    // GSAP ScrollTrigger coordinates 3D camera + rig smoothly with Hero scroll
    const ctx = gsap.context(() => {
      if (triggerRef.current) {
        gsap.to(rig.position, {
          y: -0.95,
          z: -0.8,
          ease: "none",
          scrollTrigger: {
            trigger: triggerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.8,
          },
        });
        gsap.to(camera.position, {
          z: 8.1,
          ease: "none",
          scrollTrigger: {
            trigger: triggerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.8,
          },
        });
      }
    });

    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.02 }
    );
    if (triggerRef.current) {
      observer.observe(triggerRef.current);
    }

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || 720;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    const clock = new THREE.Clock();
    let rafId = 0;

    const tick = () => {
      rafId = window.requestAnimationFrame(tick);
      if (!isVisible || document.hidden) return;

      const elapsed = clock.getElapsedTime();
      pointer.currentX += (pointer.targetX - pointer.currentX) * 0.045;
      pointer.currentY += (pointer.targetY - pointer.currentY) * 0.045;

      rig.rotation.y = pointer.currentX * 0.16 + Math.sin(elapsed * 0.25) * 0.05;
      rig.rotation.x = -pointer.currentY * 0.12 + Math.cos(elapsed * 0.2) * 0.04;
      outerRing.rotation.z = elapsed * 0.06;
      ticks.rotation.z = -elapsed * 0.035;
      innerRing.rotation.z = -elapsed * 0.09;
      dust.rotation.y = elapsed * 0.02 + pointer.currentX * 0.04;

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
      ctx.revert();
      outerGeo.dispose();
      outerMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      tickGeo.dispose();
      tickMat.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      materialsRef.current = {};
    };
  }, [triggerRef]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none hidden lg:block absolute inset-0 z-0 overflow-hidden"
    />
  );
}
