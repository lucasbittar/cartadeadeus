'use client';

import React, { useRef, useState, useMemo, Suspense, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere, Html, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { threeColors } from '@/constants/colors';
import { latLngToVector3 } from '@/lib/utils';
import type { LetterMarker } from '@/types';

const GLOBE_RADIUS = 2;

// Local Earth texture for reliable loading
const EARTH_TEXTURE_URL = '/earth-texture-light.jpg';

// Preload texture
if (typeof window !== 'undefined') {
  useTexture.preload(EARTH_TEXTURE_URL);
}

// Component to detect WebGL context loss
function WebGLContextHandler({ onContextLost }: { onContextLost: () => void }) {
  const { gl } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      console.warn('WebGL context lost');
      onContextLost();
    };

    canvas.addEventListener('webglcontextlost', handleContextLost);
    return () => canvas.removeEventListener('webglcontextlost', handleContextLost);
  }, [gl, onContextLost]);

  return null;
}

interface LetterPointProps {
  marker: LetterMarker;
  onClick: (id: string) => void;
}

function LetterPoint({ marker, onClick }: LetterPointProps) {
  const groupRef = useRef<THREE.Group>(null);
  const position = useMemo(() => {
    const pos = latLngToVector3(marker.lat, marker.lng, GLOBE_RADIUS + 0.02);
    return new THREE.Vector3(pos.x, pos.y, pos.z);
  }, [marker.lat, marker.lng]);

  // Calculate normal vector pointing outward from globe center
  const normal = useMemo(() => position.clone().normalize(), [position]);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating animation
      const float = Math.sin(state.clock.elapsedTime * 1.5 + marker.lat * 0.05) * 0.003;
      groupRef.current.position.copy(
        position.clone().add(normal.clone().multiplyScalar(float))
      );
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Large invisible hit area for easy clicking */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onClick(marker.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default';
        }}
      >
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Outer glow */}
      <mesh>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshBasicMaterial
          color={threeColors.burgundyGlow}
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Main point - small 3D burgundy sphere */}
      <mesh>
        <sphereGeometry args={[0.012, 16, 16]} />
        <meshBasicMaterial color={threeColors.burgundy} />
      </mesh>

      {/* Inner highlight - creates depth */}
      <mesh position={[0.002, 0.002, 0.004]}>
        <sphereGeometry args={[0.004, 8, 8]} />
        <meshBasicMaterial
          color={0xffffff}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
}

interface GlobeProps {
  markers: LetterMarker[];
  onMarkerClick: (id: string) => void;
}

function Globe({ markers, onMarkerClick }: GlobeProps) {
  const globeRef = useRef<THREE.Group>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  // Load Earth texture with useTexture (has better error handling)
  const earthTexture = useTexture(EARTH_TEXTURE_URL);

  useFrame((_, delta) => {
    if (globeRef.current && !isInteracting) {
      globeRef.current.rotation.y += delta * 0.025;
    }
  });

  return (
    <group ref={globeRef}>
      {/* Earth globe with texture */}
      <Sphere args={[GLOBE_RADIUS, 64, 64]}>
        <meshStandardMaterial
          map={earthTexture}
          roughness={1}
          metalness={0}
          color="#f0fdfa"
        />
      </Sphere>

      {/* Subtle atmosphere glow */}
      <Sphere args={[GLOBE_RADIUS + 0.05, 64, 64]}>
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

      {markers.map((marker) => (
        <LetterPoint
          key={marker.id}
          marker={marker}
          onClick={onMarkerClick}
        />
      ))}

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

// Error fallback component
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
    setKey((k) => k + 1); // Force remount of Canvas
  }, []);

  const handleContextLost = useCallback(() => {
    setHasError(true);
  }, []);

  if (hasError) {
    return <ErrorFallback onRetry={handleRetry} />;
  }

  return (
    <div className="w-full h-[500px] md:h-[1000px]">
      <Canvas
        key={key}
        camera={{ position: [0, 0, 7], fov: 40 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'default' }}
        style={{ background: 'transparent' }}
        onCreated={({ gl }) => {
          // Verify WebGL is working
          if (!gl.capabilities.isWebGL2 && !gl.capabilities) {
            console.warn('WebGL capabilities limited');
          }
        }}
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
