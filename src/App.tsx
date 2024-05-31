import { ReactNode, MouseEvent } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// import { useAppStore } from "./store";

const threeScene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 2;
new OrbitControls(camera, document.body);

interface AppProps {
  children: ReactNode;
}
const preventContextMenu = (evt: MouseEvent) => {
  evt.preventDefault();
};

export function App(props: AppProps) {
  return (
    <Canvas
      camera={camera}
      scene={threeScene}
      onContextMenu={preventContextMenu}
      shadows={'soft'}
      gl={{ antialias: true, precision: 'highp' }}
    >
      {props.children}
    </Canvas>
  );
}
