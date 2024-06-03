import * as THREE from 'three';
import { memo, useMemo } from 'react';
import type {} from '@react-three/fiber';
import { getBallMotionAfterRelease } from 'src/lib/physicsCalculations';
import { rotateAroundPoint } from 'src/lib/graphicsCalculations';
import { WALL_Z_POSITION, ROBOT_FLOOR_DISTANCE, ARBITRARY_Z_OFFSET } from 'src/components/Panel/Panel';

const ballBasePosition = new THREE.Vector3(0, 0, 0);
const ballBaseQuaternion = new THREE.Quaternion();
const pointToRotateAround = new THREE.Vector3(0, ROBOT_FLOOR_DISTANCE, 0);
const rotationAxis = new THREE.Vector3(0, 0, 1);

const simulateBallMotionAndRotation = (
  angularVelocityAtRelease: number,
  armRotationEnd: number,
  totalTime: number,
  interval: number
) => {
  const positions = [];

  for (let t = 0; t <= totalTime; t += interval) {
    const position = getBallMotionAfterRelease(angularVelocityAtRelease, armRotationEnd, t);
    positions.push({ time: t, ...position });
  }

  return positions;
};

interface DrawTrajectoryProps {
  linearVelocityAtRelease: number;
  totalTime: number;
  interval: number;
  ballBasePositionXYZ: { x: number; y: number; z: number };
  armRotationEnd: number;
}

export const DrawTrajectory = memo((props: DrawTrajectoryProps) => {
  const { linearVelocityAtRelease, totalTime, interval, ballBasePositionXYZ, armRotationEnd } = props;

  const bufferGeometry = useMemo(() => {
    ballBasePosition.set(ballBasePositionXYZ.x, ballBasePositionXYZ.y, ballBasePositionXYZ.z);
    rotateAroundPoint(ballBasePosition, ballBaseQuaternion, pointToRotateAround, rotationAxis, armRotationEnd);
    const positions = simulateBallMotionAndRotation(linearVelocityAtRelease, armRotationEnd, totalTime, interval);
    const bufferGeometry = new THREE.BufferGeometry();
    const vertices = new Float32Array(positions.length * 3);
    bufferGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    positions.forEach((position, index) => {
      vertices[index * 3] = ballBasePosition.x + position.x;
      vertices[index * 3 + 1] = ballBasePosition.y + position.y;
      vertices[index * 3 + 2] = WALL_Z_POSITION + ARBITRARY_Z_OFFSET;
    });
    return bufferGeometry;
  }, [linearVelocityAtRelease, totalTime, interval, ballBasePositionXYZ, armRotationEnd]);

  return <lineSegments geometry={bufferGeometry} />;
});
