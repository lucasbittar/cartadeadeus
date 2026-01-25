'use client';

import React, { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';
import { threeColors } from '@/constants/colors';
import { latLngToVector3, truncateText } from '@/lib/utils';
import type { Letter } from '@/types';

const GLOBE_RADIUS = 2;

// Local Earth texture for reliable loading
// const EARTH_TEXTURE_URL = '/earth-texture.jpg';
const EARTH_TEXTURE_URL = '/earth-texture-light.jpg';

interface LetterPointProps {
  letter: Letter;
  onClick: (letter: Letter) => void;
  onHover: (letter: Letter | null) => void;
  isHovered: boolean;
}

function LetterPoint({ letter, onClick, onHover, isHovered }: LetterPointProps) {
  const groupRef = useRef<THREE.Group>(null);
  const position = useMemo(() => {
    const pos = latLngToVector3(letter.lat, letter.lng, GLOBE_RADIUS + 0.02);
    return new THREE.Vector3(pos.x, pos.y, pos.z);
  }, [letter.lat, letter.lng]);

  // Calculate normal vector pointing outward from globe center
  const normal = useMemo(() => position.clone().normalize(), [position]);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating animation
      const float = Math.sin(state.clock.elapsedTime * 1.5 + letter.lat * 0.05) * 0.003;
      groupRef.current.position.copy(
        position.clone().add(normal.clone().multiplyScalar(float))
      );
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Large invisible hit area for easy hovering */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onClick(letter);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(letter);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          onHover(null);
          document.body.style.cursor = 'default';
        }}
      >
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Outer glow - always visible, stronger on hover */}
      <mesh scale={isHovered ? 1.8 : 1}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshBasicMaterial
          color={threeColors.burgundyGlow}
          transparent
          opacity={isHovered ? 0.35 : 0.15}
        />
      </mesh>

      {/* Main point - small 3D burgundy sphere */}
      <mesh scale={isHovered ? 1.3 : 1}>
        <sphereGeometry args={[0.012, 16, 16]} />
        <meshBasicMaterial
          color={isHovered ? threeColors.burgundyGlow : threeColors.burgundy}
        />
      </mesh>

      {/* Inner highlight - creates depth */}
      <mesh position={[0.002, 0.002, 0.004]} scale={isHovered ? 1.3 : 1}>
        <sphereGeometry args={[0.004, 8, 8]} />
        <meshBasicMaterial
          color={0xffffff}
          transparent
          opacity={isHovered ? 0.9 : 0.6}
        />
      </mesh>
    </group>
  );
}

interface TooltipProps {
  letter: Letter;
}

function Tooltip({ letter }: TooltipProps) {
  const position = useMemo(() => {
    const pos = latLngToVector3(letter.lat, letter.lng, GLOBE_RADIUS + 0.12);
    return new THREE.Vector3(pos.x, pos.y, pos.z);
  }, [letter.lat, letter.lng]);

  return (
    <Html position={position} center distanceFactor={8}>
      <div
        className="pointer-events-none select-none"
        style={{
          animation: 'tooltipFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div
          className="relative"
          style={{
            background: 'rgba(255, 255, 255, 0.97)',
            backdropFilter: 'blur(8px)',
            borderRadius: '2px',
            padding: '4px 6px',
            maxWidth: '110px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            borderTop: '1.5px solid rgba(139, 21, 56, 0.6)',
          }}
        >
          <p
            className="font-jetbrains text-foreground/75 leading-snug"
            style={{
              fontSize: '5.4px',
              letterSpacing: '-0.01em',
            }}
          >
            &ldquo;{truncateText(letter.content, 50)}&rdquo;
          </p>
          <div
            className="flex items-center gap-0.5 mt-0.5 pt-0.5"
            style={{ borderTop: '1px solid rgba(0,0,0,0.04)' }}
          >
            <svg
              width="5"
              height="5"
              viewBox="0 0 24 24"
              fill="#8B1538"
              style={{ opacity: 0.5, flexShrink: 0 }}
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <span
              className="text-foreground/50 truncate"
              style={{ fontSize: '4.8px', letterSpacing: '0.01em' }}
            >
              {letter.city}
            </span>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes tooltipFadeIn {
          from { opacity: 0; transform: translateY(2px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Html>
  );
}

interface GlobeProps {
  letters: Letter[];
  onLetterClick: (letter: Letter) => void;
}

function Globe({ letters, onLetterClick }: GlobeProps) {
  const globeRef = useRef<THREE.Group>(null);
  const [hoveredLetter, setHoveredLetter] = useState<Letter | null>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  // Load Earth texture
  const earthTexture = useLoader(THREE.TextureLoader, EARTH_TEXTURE_URL);

  const shouldRotate = !isInteracting && !hoveredLetter;

  useFrame((_, delta) => {
    if (globeRef.current && shouldRotate) {
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

      {letters.map((letter) => (
        <LetterPoint
          key={letter.id}
          letter={letter}
          onClick={onLetterClick}
          onHover={setHoveredLetter}
          isHovered={hoveredLetter?.id === letter.id}
        />
      ))}

      {hoveredLetter && <Tooltip letter={hoveredLetter} />}

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
  letters: Letter[];
  onLetterClick: (letter: Letter) => void;
}

export function GlobeScene({ letters, onLetterClick }: GlobeSceneProps) {
  return (
    <div className="w-full h-[500px] md:h-[1000px]">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 40 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={<LoadingState />}>
          <Lights />
          <Globe letters={letters} onLetterClick={onLetterClick} />
        </Suspense>
      </Canvas>
    </div>
  );
}
