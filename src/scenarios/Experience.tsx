import * as THREE from 'three';
import { useCallback, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
// @ts-ignore
import Stats from 'three/addons/libs/stats.module.js';
import { usePlay } from 'lib/hooks';
import { degToRad } from 'src/lib/utils';

import { Panel, config } from 'src/components/Panel/Panel';
import { RobotArm } from 'src/components/RobotArm/RobotArm';
import { Robot } from 'src/components/Robot/Robot';

const stats = new Stats();
document.body.appendChild(stats.dom);

const WALL_Z_POSITION = -0.1;

export function Experience() {
  // @ts-ignore
  // const { scene, gl, clock } = useThree();

  const refDirectionalLight = useRef<THREE.DirectionalLight>(null!);

  const [armLength, setArmLength] = useState(config.armLength);
  const [armDiameter, setArmDiameter] = useState(config.armDiameter);
  const [armRotation, setArmRotation] = useState(+degToRad(config.armRotationStart).toFixed(2));
  const [centerPercentage, setCenterPercentage] = useState(config.centerPercentage);

  useFrame((_state, _delta) => {
    stats.update();
  });

  usePlay((_state, _delta) => {});

  const handleChange = useCallback((key: keyof typeof config) => {
    switch (key) {
      case 'armLength':
        setArmLength(+config.armLength.toFixed(2));
        break;
      case 'armDiameter':
        setArmDiameter(+config.armDiameter.toFixed(3));
        break;
      case 'armRotationStart':
        setArmRotation(+degToRad(config.armRotationStart).toFixed(2));
        break;
      case 'centerPercentage':
        setCenterPercentage(+config.centerPercentage.toFixed(2));
        break;
      default:
        break;
    }
  }, []);

  return (
    <>
      <directionalLight
        shadow-mapSize-width={8192}
        shadow-mapSize-height={8192}
        shadow-camera-far={500}
        shadow-camera-near={0.1}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        // shadow-normalBias={0.01}
        // shadow-bias={-0.0001}
        // shadow-radius={4}
        // shadow-blurSamples={8}
        castShadow
        position={[2, 2, 2]}
        scale={1}
        intensity={4.5}
        ref={refDirectionalLight}
        color={'white'}
      ></directionalLight>

      <ambientLight color={'#ffffff'} intensity={1} position={[0, 1, 0]} />

      <mesh name="floor" rotation={[degToRad(90), 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="white" side={THREE.DoubleSide} />
      </mesh>

      <mesh name="wall" rotation={[0, 0, 0]} position={[0, 2, WALL_Z_POSITION]} receiveShadow castShadow>
        <boxGeometry args={[2, 4, 0.01]} />
        <meshStandardMaterial color="#09304e" side={THREE.FrontSide} />
      </mesh>

      <axesHelper args={[1000]} />
      <>
        <Robot position={[0, 1, WALL_Z_POSITION]} />
        <RobotArm
          position={[0, 1, WALL_Z_POSITION + 0.23]}
          armLength={armLength}
          armDiameter={armDiameter}
          armRotation={armRotation}
          centerPercentage={centerPercentage}
        />
      </>

      <Panel onChange={handleChange} />
    </>
  );
}
