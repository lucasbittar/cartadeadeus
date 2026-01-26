'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CardInstance {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  velocity: THREE.Vector3;
  scale: number;
  baseOpacity: number;
  offset: number;
  rotationSpeed: THREE.Vector3;
}

interface FloatingCardsProps {
  count?: number;
  isSpotlightActive?: boolean;
}

// Card dimensions matching plan: 1.2 x 0.8
const CARD_WIDTH = 1.2;
const CARD_HEIGHT = 0.8;

export function FloatingCards({ count = 50, isSpotlightActive = false }: FloatingCardsProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const { viewport } = useThree();

  // Generate card instances
  const cards = useMemo<CardInstance[]>(() => {
    return Array.from({ length: count }, () => {
      // Z-depth: -5 to +3 as per plan
      const z = -5 + Math.random() * 8;
      // Scale based on depth: 0.4 (far) to 1.0 (near)
      const depthFactor = (z + 5) / 8; // 0 at z=-5, 1 at z=3
      const scale = 0.4 + depthFactor * 0.6;
      // Opacity based on depth: 0.3 (far) to 0.7 (near)
      const baseOpacity = 0.3 + depthFactor * 0.4;

      return {
        position: new THREE.Vector3(
          (Math.random() - 0.5) * viewport.width * 2.5,
          (Math.random() - 0.5) * viewport.height * 2.5,
          z
        ),
        rotation: new THREE.Euler(
          (Math.random() - 0.5) * 0.3,
          (Math.random() - 0.5) * 0.3,
          (Math.random() - 0.5) * 0.2
        ),
        // Drift speed: 0.01-0.03 units/frame as per plan
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          0.01 + Math.random() * 0.02, // Primarily upward drift
          0
        ),
        scale,
        baseOpacity,
        offset: Math.random() * Math.PI * 2,
        rotationSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.002,
          (Math.random() - 0.5) * 0.002,
          (Math.random() - 0.5) * 0.001
        ),
      };
    });
  }, [count, viewport]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Update material opacity when spotlight changes
  useEffect(() => {
    if (materialRef.current) {
      // Dim to 0.2 when spotlight is active
      materialRef.current.opacity = isSpotlightActive ? 0.15 : 0.6;
    }
  }, [isSpotlightActive]);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;
    const boundX = viewport.width * 1.5;
    const boundY = viewport.height * 1.5;

    cards.forEach((card, i) => {
      // Update position with velocity and sine-wave bobbing
      card.position.x += card.velocity.x;
      card.position.y += card.velocity.y;

      // Sine-wave bobbing for organic movement
      const bobX = Math.sin(time * 0.5 + card.offset) * 0.02;
      const bobY = Math.cos(time * 0.3 + card.offset) * 0.015;

      // Wrap around screen edges
      if (card.position.x > boundX) card.position.x = -boundX;
      if (card.position.x < -boundX) card.position.x = boundX;
      if (card.position.y > boundY) card.position.y = -boundY;
      if (card.position.y < -boundY) card.position.y = boundY;

      // Update rotation
      card.rotation.x += card.rotationSpeed.x;
      card.rotation.y += card.rotationSpeed.y;
      card.rotation.z += card.rotationSpeed.z;

      // Apply to dummy object
      dummy.position.set(
        card.position.x + bobX,
        card.position.y + bobY,
        card.position.z
      );
      dummy.rotation.copy(card.rotation);
      dummy.scale.setScalar(card.scale);
      dummy.updateMatrix();

      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  // Rounded rectangle geometry with slight bevel
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    const radius = 0.08;
    const w = CARD_WIDTH;
    const h = CARD_HEIGHT;

    shape.moveTo(-w / 2 + radius, -h / 2);
    shape.lineTo(w / 2 - radius, -h / 2);
    shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + radius);
    shape.lineTo(w / 2, h / 2 - radius);
    shape.quadraticCurveTo(w / 2, h / 2, w / 2 - radius, h / 2);
    shape.lineTo(-w / 2 + radius, h / 2);
    shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - radius);
    shape.lineTo(-w / 2, -h / 2 + radius);
    shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + radius, -h / 2);

    return new THREE.ShapeGeometry(shape);
  }, []);

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, undefined, count]}
      frustumCulled={false}
    >
      <meshBasicMaterial
        ref={materialRef}
        color={0xffffff}
        transparent
        opacity={0.6}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
}
