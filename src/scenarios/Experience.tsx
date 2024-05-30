import * as THREE from 'three';
import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
// @ts-ignore
import Stats from 'three/addons/libs/stats.module.js';
import { usePlay } from 'lib/hooks';
import { degToRad } from 'src/lib/utils';

const stats = new Stats();
document.body.appendChild(stats.dom);

export function Experience() {
  // @ts-ignore
  const { scene, gl, clock } = useThree();

  const refDirectionalLight = useRef<THREE.DirectionalLight>(null!);
  useFrame((_state, _delta) => {
    stats.update();
  });

  usePlay((_state, _delta) => {});

  return (
    <>
      <directionalLight
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-radius={4}
        shadow-blurSamples={8}
        castShadow
        position={[2, 2, 2]}
        scale={1}
        intensity={4.5}
        ref={refDirectionalLight}
        color={'white'}
      ></directionalLight>

      {/*<ambientLight color={'#ffffff'} intensity={3.5} position={[0, 1, 0]} />*/}

      <mesh name="plane" rotation={[degToRad(90), 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="white" side={THREE.DoubleSide} />
      </mesh>

      <axesHelper args={[1000]} />
    </>
  );
}
