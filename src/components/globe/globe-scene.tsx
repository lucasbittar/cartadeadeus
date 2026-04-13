'use client';

import React, { useRef, useState, useMemo, Suspense, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere, Html, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { threeColors } from '@/constants/colors';
import { latLngToVector3 } from '@/lib/utils';
import type { LetterMarker } from '@/types';

const GLOBE_RADIUS = 2;

const EARTH_TEXTURE_URL = '/earth-texture-light.jpg';

if (typeof window !== 'undefined') {
  useTexture.preload(EARTH_TEXTURE_URL);
}

// Detect WebGL context loss
function WebGLContextHandler({ onContextLost }: { onContextLost: () => void }) {
  const { gl } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      onContextLost();
    };
    canvas.addEventListener('webglcontextlost', handleContextLost);
    return () => canvas.removeEventListener('webglcontextlost', handleContextLost);
  }, [gl, onContextLost]);

  return null;
}

// All letter markers as a single instanced mesh — one draw call
function LetterPoints({ markers, onClick }: { markers: LetterMarker[]; onClick: (id: string) => void }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const glowRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Precompute positions
  const positions = useMemo(() => {
    return markers.map((m) => {
      const pos = latLngToVector3(m.lat, m.lng, GLOBE_RADIUS + 0.02);
      return new THREE.Vector3(pos.x, pos.y, pos.z);
    });
  }, [markers]);

  // Set instance matrices once
  useEffect(() => {
    if (!meshRef.current || !glowRef.current) return;
    positions.forEach((pos, i) => {
      dummy.position.copy(pos);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
      glowRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    glowRef.current.instanceMatrix.needsUpdate = true;
  }, [positions, dummy]);

  // Click detection via raycasting on invisible hit spheres
  const handleClick = useCallback((e: { stopPropagation: () => void; instanceId?: number }) => {
    e.stopPropagation();
    if (e.instanceId !== undefined && markers[e.instanceId]) {
      onClick(markers[e.instanceId].id);
    }
  }, [markers, onClick]);

  const handlePointerOver = useCallback((e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    document.body.style.cursor = 'pointer';
  }, []);

  const handlePointerOut = useCallback(() => {
    document.body.style.cursor = 'default';
  }, []);

  if (markers.length === 0) return null;

  return (
    <>
      {/* Hit areas — invisible, for click/hover detection */}
      <instancedMesh
        args={[undefined, undefined, markers.length]}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        ref={(mesh) => {
          if (!mesh) return;
          positions.forEach((pos, i) => {
            dummy.position.copy(pos);
            dummy.updateMatrix();
            mesh.setMatrixAt(i, dummy.matrix);
          });
          mesh.instanceMatrix.needsUpdate = true;
        }}
      >
        <sphereGeometry args={[0.1, 4, 4]} />
        <meshBasicMaterial transparent opacity={0} />
      </instancedMesh>

      {/* Outer glow — single instanced draw call */}
      <instancedMesh ref={glowRef} args={[undefined, undefined, markers.length]}>
        <sphereGeometry args={[0.025, 6, 6]} />
        <meshBasicMaterial
          color={threeColors.burgundyGlow}
          transparent
          opacity={0.15}
        />
      </instancedMesh>

      {/* Main points — single instanced draw call */}
      <instancedMesh ref={meshRef} args={[undefined, undefined, markers.length]}>
        <sphereGeometry args={[0.012, 6, 6]} />
        <meshBasicMaterial color={threeColors.burgundy} />
      </instancedMesh>
    </>
  );
}

interface GlobeProps {
  markers: LetterMarker[];
  onMarkerClick: (id: string) => void;
}

function Globe({ markers, onMarkerClick }: GlobeProps) {
  const globeRef = useRef<THREE.Group>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  const earthTexture = useTexture(EARTH_TEXTURE_URL);

  useFrame((_, delta) => {
    if (globeRef.current && !isInteracting) {
      globeRef.current.rotation.y += delta * 0.025;
    }
  });

  return (
    <group ref={globeRef}>
      <Sphere args={[GLOBE_RADIUS, 48, 48]}>
        <meshStandardMaterial
          map={earthTexture}
          roughness={1}
          metalness={0}
          color="#f0fdfa"
        />
      </Sphere>

      {/* Subtle atmosphere glow */}
      <Sphere args={[GLOBE_RADIUS + 0.05, 32, 32]}>
        <shaderMaterial
          transparent
          side={THREE.BackSide}
          uniforms={{
            glowColor: { value: new THREE.Color(0x88ccff) },
          }}
          vertexShader={`
            varying vec3 vNormal;
            varying vec3 vPositionNormal;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              vPositionNormal = normalize((modelViewMatrix * vec4(position, 1.0)).xyz);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform vec3 glowColor;
            varying vec3 vNormal;
            varying vec3 vPositionNormal;
            void main() {
              float intensity = pow(0.6 - dot(vNormal, vPositionNormal), 2.0);
              gl_FragColor = vec4(glowColor, intensity * 0.15);
            }
          `}
        />
      </Sphere>

      <LetterPoints markers={markers} onClick={onMarkerClick} />

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI - Math.PI / 4}
        onStart={() => setIsInteracting(true)}
        onEnd={() => setIsInteracting(false)}
      />
    </group>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={2} />
      <directionalLight position={[5, 3, 5]} intensity={1.5} />
      <directionalLight position={[-5, -3, -5]} intensity={0.5} />
    </>
  );
}

function LoadingState() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2">
        <div className="w-5 h-5 rounded-full border-2 border-burgundy/20 border-t-burgundy animate-spin" />
        <div className="text-foreground/40 text-xs">Carregando...</div>
      </div>
    </Html>
  );
}

interface GlobeSceneProps {
  markers: LetterMarker[];
  onMarkerClick: (id: string) => void;
}

function ErrorFallback({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="w-full h-[500px] md:h-[1000px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center px-4">
        <div className="text-foreground/40 text-sm">
          Não foi possível carregar o globo.
        </div>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-burgundy text-white text-sm rounded-lg hover:bg-burgundy/90 transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}

export function GlobeScene({ markers, onMarkerClick }: GlobeSceneProps) {
  const [hasError, setHasError] = useState(false);
  const [key, setKey] = useState(0);

  const handleRetry = useCallback(() => {
    setHasError(false);
    setKey((k) => k + 1);
  }, []);

  const handleContextLost = useCallback(() => {
    setHasError(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
    return () => clearTimeout(timer);
  }, [key]);

  if (hasError) {
    return <ErrorFallback onRetry={handleRetry} />;
  }

  return (
    <div className="w-full h-[500px] md:h-[1000px]">
      <Canvas
        key={key}
        camera={{ position: [0, 0, 7], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'default' }}
        style={{ background: 'transparent' }}
      >
        <WebGLContextHandler onContextLost={handleContextLost} />
        <Suspense fallback={<LoadingState />}>
          <Lights />
          <Globe markers={markers} onMarkerClick={onMarkerClick} />
        </Suspense>
      </Canvas>
    </div>
  );
}
