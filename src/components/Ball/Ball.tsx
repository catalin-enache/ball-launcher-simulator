import * as THREE from 'three';
import { useEffect, useState } from 'react';
import { ThreeElements } from '@react-three/fiber';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

export const Ball = (props: ThreeElements['group']) => {
  const { position, scale, rotation } = props;

  const [object, setObject] = useState<THREE.Object3D | null>(null);

  useEffect(() => {
    const loader = new FBXLoader();
    loader.load('models/robot/ball.fbx', (object) => {
      const mesh = object.children[0] as THREE.Mesh;
      mesh.geometry.scale(10, 10, 10);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      setObject(object);
    });
  }, []);

  if (!object) return null;

  return <primitive object={object} position={position} scale={scale} rotation={rotation} />;
};
