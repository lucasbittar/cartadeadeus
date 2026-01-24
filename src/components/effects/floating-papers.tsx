'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { threeColors } from '@/constants/colors';

interface PaperInstance {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: number;
  speed: number;
  rotationSpeed: THREE.Vector3;
  offset: number;
}

function Papers({ count = 30 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { viewport } = useThree();

  const papers = useMemo<PaperInstance[]>(() => {
    return Array.from({ length: count }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * viewport.width * 2,
        (Math.random() - 0.5) * viewport.height * 2,
        (Math.random() - 0.5) * 10 - 5
      ),
      rotation: new THREE.Euler(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      ),
      scale: 0.3 + Math.random() * 0.4,
      speed: 0.1 + Math.random() * 0.2,
      rotationSpeed: new THREE.Vector3(
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.01
      ),
      offset: Math.random() * Math.PI * 2,
    }));
  }, [count, viewport]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tempMatrix = useMemo(() => new THREE.Matrix4(), []);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;

    papers.forEach((paper, i) => {
      const floatY = Math.sin(time * paper.speed + paper.offset) * 0.5;
      const floatX = Math.cos(time * paper.speed * 0.5 + paper.offset) * 0.3;

      const parallaxX = mousePosition.x * 0.5 * (1 + paper.position.z * 0.1);
      const parallaxY = mousePosition.y * 0.5 * (1 + paper.position.z * 0.1);

      dummy.position.set(
        paper.position.x + floatX + parallaxX,
        paper.position.y + floatY + parallaxY,
        paper.position.z
      );

      dummy.rotation.set(
        paper.rotation.x + time * paper.rotationSpeed.x,
        paper.rotation.y + time * paper.rotationSpeed.y,
        paper.rotation.z + time * paper.rotationSpeed.z
      );

      dummy.scale.setScalar(paper.scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(1, 1.4);
    geo.rotateX(-0.1);
    return geo;
  }, []);

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, undefined, count]}
      frustumCulled={false}
    >
      <meshBasicMaterial
        color={threeColors.burgundy}
        transparent
        opacity={0.08}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
}

function ReducedMotionFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-8 h-10 bg-burgundy/5 rounded-sm"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
    </div>
  );
}

export function FloatingPapers({ paperCount = 30 }: { paperCount?: number }) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setPrefersReducedMotion(
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
    setIsMobile(window.innerWidth < 768);
  }, []);

  if (prefersReducedMotion) {
    return <ReducedMotionFallback />;
  }

  const count = isMobile ? Math.floor(paperCount / 2) : paperCount;

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Papers count={count} />
      </Canvas>
    </div>
  );
}
