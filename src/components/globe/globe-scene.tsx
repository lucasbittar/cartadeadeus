'use client';

import React, { useRef, useState, useCallback, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';
import { threeColors } from '@/constants/colors';
import { latLngToVector3, truncateText } from '@/lib/utils';
import type { Letter } from '@/types';

const GLOBE_RADIUS = 2;

interface LetterPointProps {
  letter: Letter;
  onClick: (letter: Letter) => void;
  onHover: (letter: Letter | null) => void;
  isHovered: boolean;
}

function LetterPoint({ letter, onClick, onHover, isHovered }: LetterPointProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const position = useMemo(() => {
    const pos = latLngToVector3(letter.lat, letter.lng, GLOBE_RADIUS + 0.02);
    return new THREE.Vector3(pos.x, pos.y, pos.z);
  }, [letter.lat, letter.lng]);

  useFrame((state) => {
    if (meshRef.current) {
      const scale = isHovered
        ? 1.5 + Math.sin(state.clock.elapsedTime * 4) * 0.2
        : 1 + Math.sin(state.clock.elapsedTime * 2 + letter.lat) * 0.1;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
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
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshBasicMaterial
          color={isHovered ? threeColors.burgundyGlow : threeColors.burgundy}
          transparent
          opacity={isHovered ? 1 : 0.8}
        />
      </mesh>
      {isHovered && (
        <pointLight
          color={threeColors.burgundyGlow}
          intensity={0.5}
          distance={0.5}
        />
      )}
    </group>
  );
}

interface TooltipProps {
  letter: Letter;
}

function Tooltip({ letter }: TooltipProps) {
  const position = useMemo(() => {
    const pos = latLngToVector3(letter.lat, letter.lng, GLOBE_RADIUS + 0.15);
    return new THREE.Vector3(pos.x, pos.y, pos.z);
  }, [letter.lat, letter.lng]);

  return (
    <Html position={position} center distanceFactor={4}>
      <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-3 max-w-[200px] pointer-events-none">
        <p className="font-jetbrains text-xs text-foreground leading-relaxed">
          &ldquo;{truncateText(letter.content, 80)}&rdquo;
        </p>
        <p className="text-[10px] text-foreground/50 mt-2">
          {letter.city}
        </p>
      </div>
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

  useFrame((_, delta) => {
    if (globeRef.current && !isInteracting) {
      globeRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group ref={globeRef}>
      <Sphere args={[GLOBE_RADIUS, 64, 64]}>
        <meshStandardMaterial
          color={threeColors.globe}
          roughness={0.9}
          metalness={0.1}
          transparent
          opacity={0.95}
        />
      </Sphere>

      <Sphere args={[GLOBE_RADIUS - 0.01, 64, 64]}>
        <meshBasicMaterial
          color={threeColors.globe}
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </Sphere>

      <Sphere args={[GLOBE_RADIUS + 0.2, 64, 64]}>
        <shaderMaterial
          transparent
          side={THREE.BackSide}
          uniforms={{
            glowColor: { value: new THREE.Color(threeColors.globeAtmosphere) },
            coefficient: { value: 0.5 },
            power: { value: 2.5 },
          }}
          vertexShader={`
            varying vec3 vNormal;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform vec3 glowColor;
            uniform float coefficient;
            uniform float power;
            varying vec3 vNormal;
            void main() {
              float intensity = pow(coefficient - dot(vNormal, vec3(0.0, 0.0, 1.0)), power);
              gl_FragColor = vec4(glowColor, intensity * 0.3);
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
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={0.5} />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} color="#8B1538" />
    </>
  );
}

function LoadingState() {
  return (
    <Html center>
      <div className="text-foreground/50 text-sm">Carregando...</div>
    </Html>
  );
}

interface GlobeSceneProps {
  letters: Letter[];
  onLetterClick: (letter: Letter) => void;
}

export function GlobeScene({ letters, onLetterClick }: GlobeSceneProps) {
  return (
    <div className="w-full h-[500px] md:h-[600px]">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
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
