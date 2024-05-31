import * as THREE from 'three';
import { useEffect, useRef } from 'react';
import { ThreeElements } from '@react-three/fiber';

export const RobotArm = (
  props: ThreeElements['mesh'] & {
    armLength: number;
    armDiameter: number;
    armRotation: number;
    centerPercentage: number;
  }
) => {
  const meshRef = useRef<THREE.Mesh | null>(null);
  const lastTranslation = useRef(new THREE.Vector3());
  const { armLength, armDiameter, armRotation, position, centerPercentage, ...meshProps } = props;

  // initial reset
  useEffect(() => {
    if (!meshRef.current) return;

    const mesh = meshRef.current;

    const currentScale = mesh.scale.clone();
    const currentRotation = mesh.rotation.clone();
    const currentPosition = mesh.position.clone();

    mesh.scale.set(1, 1, 1);
    mesh.rotation.set(0, 0, 0);
    mesh.position.set(0, 0, 0);
    mesh.updateMatrix();

    const baseTranslation = 1 / 2; // by default the cylinder center is in the middle
    // translating origin point to bottom og the cylinder
    mesh.geometry.translate(0, baseTranslation, 0);

    const rotationMatrix = new THREE.Matrix4();
    rotationMatrix.makeRotationZ(-Math.PI / 2);
    mesh.geometry.applyMatrix4(rotationMatrix);

    // revert last translation
    mesh.scale.copy(currentScale);
    mesh.rotation.copy(currentRotation);
    mesh.position.copy(currentPosition);
    mesh.updateMatrix();
  }, []);

  // adjust center percentage
  useEffect(() => {
    if (!meshRef.current) return;
    const mesh = meshRef.current;
    const currentPosition = mesh.position.clone();
    const currentRotation = mesh.rotation.clone();
    const currentScale = mesh.scale.clone();

    // revert last translation
    mesh.geometry.translate(-lastTranslation.current.x, -lastTranslation.current.y, lastTranslation.current.z);

    const origin = new THREE.Vector3(-centerPercentage, 0, 0);

    // prepare mesh transform to apply it to the geometry
    mesh.position.copy(origin);
    mesh.rotation.set(0, 0, 0);
    mesh.scale.set(1, 1, 1);
    mesh.updateMatrix();
    mesh.geometry.applyMatrix4(mesh.matrix);

    // revert mesh transform
    mesh.position.copy(currentPosition);
    mesh.rotation.copy(currentRotation);
    mesh.scale.copy(currentScale);
    mesh.updateMatrix();
    mesh.updateMatrixWorld(true);
    lastTranslation.current = origin;
  }, [centerPercentage]);

  return (
    <mesh
      {...meshProps}
      castShadow
      receiveShadow
      ref={meshRef}
      position={position}
      scale={[armLength, armDiameter, armDiameter]}
      rotation={[0, 0, armRotation]}
    >
      <cylinderGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={0xcccccc} roughness={0} metalness={0} side={THREE.FrontSide} />
      {props.children}
    </mesh>
  );
};
