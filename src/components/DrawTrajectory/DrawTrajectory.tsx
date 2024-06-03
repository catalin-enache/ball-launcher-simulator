import * as THREE from 'three';
import { memo } from 'react';
import type {} from '@react-three/fiber';
// import React from 'react';
import { getBallMotionAfterRelease } from 'src/lib/physicsCalculations';
import { useMemo } from 'react';

const simulateBallMotionAndRotation = (
  angularVelocityAtRelease: number,
  releaseAngle: number,
  totalTime: number,
  interval: number
) => {
  const positions = [];

  for (let t = 0; t <= totalTime; t += interval) {
    const position = getBallMotionAfterRelease(angularVelocityAtRelease, releaseAngle, t);
    positions.push({ time: t, ...position });
  }

  return positions;
};

interface DrawTrajectoryProps {
  angularVelocityAtRelease: number;
  releaseAngle: number;
  totalTime: number;
  interval: number;
}

export const DrawTrajectory = memo((props: DrawTrajectoryProps) => {
  const { angularVelocityAtRelease, releaseAngle, totalTime, interval } = props;

  const bufferGeometry = useMemo(() => {
    const positions = simulateBallMotionAndRotation(angularVelocityAtRelease, releaseAngle, totalTime, interval);
    const bufferGeometry = new THREE.BufferGeometry();
    const vertices = new Float32Array(positions.length * 3);
    bufferGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    positions.forEach((position, index) => {
      vertices[index * 3] = position.x;
      vertices[index * 3 + 1] = position.y;
      vertices[index * 3 + 2] = 0;
    });
    return bufferGeometry;
  }, [angularVelocityAtRelease, releaseAngle, totalTime, interval]);

  return <lineSegments geometry={bufferGeometry} />;
});
