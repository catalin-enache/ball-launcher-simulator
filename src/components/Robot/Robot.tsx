import * as THREE from 'three';
import { useEffect, useState } from 'react';
import { ThreeElements } from '@react-three/fiber';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

export const Robot = (props: ThreeElements['group']) => {
  const { position } = props;

  const [object, setObject] = useState<THREE.Object3D | null>(null);

  useEffect(() => {
    const loader = new FBXLoader();
    loader.load('/models/robot/robot.fbx', (object) => {
      const mesh = object.children[0] as THREE.Mesh;
      object.rotation.set(0, -Math.PI / 2, 0);
      object.updateMatrix();
      object.updateMatrixWorld(true);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      (mesh.material as THREE.MeshPhongMaterial[]).forEach((material: THREE.MeshPhongMaterial) => {
        // material.side = THREE.DoubleSide;
        if (material.name === 'grey') {
          material.color = new THREE.Color('gray');
        }
      });

      setObject(object);
    });
  }, []);

  if (!object) return null;

  return <primitive object={object} position={position} />;
};
