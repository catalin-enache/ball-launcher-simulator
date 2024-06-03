import * as THREE from 'three';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
// @ts-ignore
import Stats from 'three/addons/libs/stats.module.js';
import { useAppStore } from 'src/store';
import { usePlay } from 'lib/hooks';
import { degToRad } from 'src/lib/utils';
import { rotateAroundPoint } from 'src/lib/graphicsCalculations';
import {
  getArmVolume,
  getArmMomentOfInertia,
  getBallVolume,
  getBallMomentOfInertia,
  getMass,
  getAngularAcceleration,
  getTimeToReachEndAngle,
  getAngularVelocity,
  getLinearVelocity,
  getAngularDisplacement,
  getBallMotionAfterRelease,
  getBallRotationAfterRelease,
  ARM_DENSITY,
  BALL_DENSITY
} from 'src/lib/physicsCalculations';

import { Panel, config } from 'src/components/Panel/Panel';
import { RobotArm } from 'src/components/RobotArm/RobotArm';
import { Robot } from 'src/components/Robot/Robot';
import { Ball } from 'src/components/Ball/Ball';
import { DrawTrajectory } from 'src/components/DrawTrajectory/DrawTrajectory';

import { WALL_Z_POSITION, ROBOT_FLOOR_DISTANCE, ARBITRARY_Z_OFFSET } from 'src/components/Panel/Panel';

const stats = new Stats();
document.body.appendChild(stats.dom);

const ballBasePosition = new THREE.Vector3(0, 0, 0);
const ballBaseQuaternion = new THREE.Quaternion();
const ballRotation = new THREE.Euler();
const pointToRotateAround = new THREE.Vector3(0, ROBOT_FLOOR_DISTANCE, 0);
const rotationAxis = new THREE.Vector3(0, 0, 1);

const getReleaseAngle = (start: number, end: number) => {
  const diff = end - start;
  if (diff < 0) {
    return 2 * Math.PI + diff;
  }
  return diff;
};

export function Experience() {
  const playState = useAppStore((state) => state.playState);
  const isPlaying = playState === 'play' || playState === 'pause';
  const setPlayState = useAppStore((state) => state.setPlayState);

  const refDirectionalLight = useRef<THREE.DirectionalLight>(null!);
  const releaseAngleWasReachedRef = useRef(false);
  const ballPositionAtReleaseRef = useRef(new THREE.Vector3());
  const ballRotationAtReleaseRef = useRef(new THREE.Euler());
  const ballPositionAtReleaseHasBeenCopiedRef = useRef(false);
  const [time, setTime] = useState(0);
  const [armLength, setArmLength] = useState(config.armLength);
  const [armDiameter, setArmDiameter] = useState(config.armDiameter);
  const [armRotationStart, setArmRotationStart] = useState(+degToRad(config.armRotationStart).toFixed(3));
  const [armRotationEnd, setArmRotationEnd] = useState(+degToRad(config.armRotationEnd).toFixed(3));
  const [armCenterPercentage, setArmCenterPercentage] = useState(config.armCenterPercentage);
  const [ballDiameter, setBallDiameter] = useState(config.ballDiameter);
  const [torque, setTorque] = useState(config.torque);

  const releaseAngle = getReleaseAngle(armRotationStart, armRotationEnd);

  const armLengthFromPivot = armLength - armLength * armCenterPercentage;
  const armVolume = getArmVolume(armDiameter / 2, armLength);
  const armMass = getMass(armVolume, ARM_DENSITY);
  const armMOI = getArmMomentOfInertia(armMass, armLength, armCenterPercentage);
  const ballVolume = getBallVolume(ballDiameter / 2);
  const ballMass = getMass(ballVolume, BALL_DENSITY);
  const ballMOI = getBallMomentOfInertia(ballMass, armLengthFromPivot);
  const totalMOI = armMOI + ballMOI;
  const angularAccelerationTotal = getAngularAcceleration(torque, totalMOI);
  const timeToReachEndAngle = getTimeToReachEndAngle(angularAccelerationTotal, releaseAngle);
  const angularVelocityAtRelease = getAngularVelocity(angularAccelerationTotal, timeToReachEndAngle);
  const linearVelocityAtRelease = getLinearVelocity(angularVelocityAtRelease, armLengthFromPivot);

  const angularDisplacement = getAngularDisplacement(Math.min(time, timeToReachEndAngle), angularAccelerationTotal);

  const currentArmRotation = isPlaying ? armRotationStart + angularDisplacement : armRotationStart;

  const hitFloorPosition = useRef({ x: 0, y: 0 });
  const onHitFloorPosition = useCallback((position: { x: number; y: number }) => {
    hitFloorPosition.current = position;
  }, []);

  const ballBasePositionXYZ = useMemo(() => {
    const x = armLength - armLength * armCenterPercentage - ballDiameter / 2;
    const y = ROBOT_FLOOR_DISTANCE + armDiameter / 2 + ballDiameter / 2;
    const z = WALL_Z_POSITION + ARBITRARY_Z_OFFSET;
    return { x, y, z };
  }, [armLength, armCenterPercentage, ballDiameter, armDiameter]);

  // apply ball changes >>
  if (!releaseAngleWasReachedRef.current) {
    // during arm rotation
    // reset ball >>
    ballBasePosition.set(ballBasePositionXYZ.x, ballBasePositionXYZ.y, ballBasePositionXYZ.z);
    ballBaseQuaternion.set(0, 0, 0, 1);
    // << reset ball
    // apply rotation around point >>
    rotateAroundPoint(ballBasePosition, ballBaseQuaternion, pointToRotateAround, rotationAxis, currentArmRotation);
    ballRotation.setFromQuaternion(ballBaseQuaternion);
    // << apply rotation around point
  } else {
    // after release
    // ball motion >>
    if (+ballBasePosition.y.toFixed(6) > ballDiameter) {
      const timeSinceRelease = time - timeToReachEndAngle;
      const motion = getBallMotionAfterRelease(linearVelocityAtRelease, currentArmRotation, timeSinceRelease);
      ballBasePosition.x = motion.x + ballPositionAtReleaseRef.current.x;
      ballBasePosition.y = motion.y + ballPositionAtReleaseRef.current.y;
      // << ball motion
      // ball rotation >>
      const ballRotationAngle = getBallRotationAfterRelease(angularVelocityAtRelease, timeSinceRelease);
      ballRotation.z = ballRotationAtReleaseRef.current.z + ballRotationAngle;
      // << ball rotation
    } else {
      ballBasePosition.y = hitFloorPosition.current.y + ballDiameter / 2;
      ballBasePosition.x = hitFloorPosition.current.x;
    }
  }
  // << apply ball changes

  releaseAngleWasReachedRef.current = time > timeToReachEndAngle;
  if (releaseAngleWasReachedRef.current && !ballPositionAtReleaseHasBeenCopiedRef.current) {
    ballPositionAtReleaseRef.current.copy(ballBasePosition);
    ballRotationAtReleaseRef.current.copy(ballRotation);
    ballPositionAtReleaseHasBeenCopiedRef.current = true;
  }

  // console.log('details', {
  //   // ballMass,
  //   // armMass,
  //   // armMOI,
  //   // ballMOI,
  //   // totalMOI,
  //   // angularAcceleration,
  //   releaseAngle: +radToDeg(releaseAngle).toFixed(3),
  //   // timeToReachEndAngle,
  //   // angularDisplacement: +radToDeg(angularDisplacement).toFixed(3),
  //   currentArmRotation: +radToDeg(currentArmRotation).toFixed(3),
  //   // 'releaseAngleWasReachedRef.current': releaseAngleWasReachedRef.current
  //   // timeToReachMaxVelocity,
  //   // angularDisplacementAtMaxVelocity,
  //   // angularVelocityAtRelease,
  //   armRotationEnd: +radToDeg(armRotationEnd).toFixed(3)
  //   // time
  //   // linearVelocityAtRelease,
  //   // hvComponents
  // });

  useFrame((_state, _delta) => {
    stats.update();
  });

  usePlay((_state, _delta) => {
    setTime((prev) => prev + _delta);
  });

  const handleChange = useCallback((key: keyof typeof config) => {
    switch (key) {
      case 'armLength':
        setArmLength(+config.armLength.toFixed(2));
        break;
      case 'armDiameter':
        setArmDiameter(+config.armDiameter.toFixed(3));
        break;
      case 'armRotationStart':
        setArmRotationStart(+degToRad(config.armRotationStart).toFixed(3));
        break;
      case 'armRotationEnd':
        setArmRotationEnd(+degToRad(config.armRotationEnd).toFixed(3));
        break;
      case 'armCenterPercentage':
        setArmCenterPercentage(+config.armCenterPercentage.toFixed(2));
        break;
      case 'ballDiameter':
        setBallDiameter(+config.ballDiameter.toFixed(3));
        break;
      case 'torque':
        setTorque(+config.torque.toFixed(2));
        break;
      default:
        break;
    }
  }, []);

  const handleAction = useCallback((action: string) => {
    switch (action) {
      case 'startPause':
        setPlayState(useAppStore.getState().playState === 'play' ? 'pause' : 'play');
        break;
      case 'stop':
        setPlayState('stop');
        setTime(0);
        releaseAngleWasReachedRef.current = false;
        ballPositionAtReleaseHasBeenCopiedRef.current = false;
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
        castShadow
        position={[2, 2, 2]}
        scale={1}
        intensity={4.5}
        ref={refDirectionalLight}
        color={'white'}
      ></directionalLight>

      <ambientLight color={'#ffffff'} intensity={1} position={[0, 1, 0]} />

      <mesh name="floor" rotation={[degToRad(-90), 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#051323" side={THREE.FrontSide} />
      </mesh>

      <mesh name="wall" rotation={[0, 0, 0]} position={[0, 2, WALL_Z_POSITION]} receiveShadow castShadow>
        <boxGeometry args={[2, 4, 0.01]} />
        <meshStandardMaterial color="#09304e" side={THREE.FrontSide} />
      </mesh>

      <axesHelper args={[1000]} />

      <>
        <Robot position={[0, ROBOT_FLOOR_DISTANCE, WALL_Z_POSITION]} />
        <RobotArm
          position={[0, ROBOT_FLOOR_DISTANCE, WALL_Z_POSITION + ARBITRARY_Z_OFFSET]}
          armLength={armLength}
          armDiameter={armDiameter}
          armRotation={currentArmRotation}
          centerPercentage={armCenterPercentage}
        />
        <RobotArm
          position={[0, ROBOT_FLOOR_DISTANCE, WALL_Z_POSITION + ARBITRARY_Z_OFFSET]}
          armLength={armLength}
          armDiameter={armDiameter}
          armRotation={armRotationEnd}
          centerPercentage={armCenterPercentage}
          isTransparent
        />
        <Ball
          position={[ballBasePosition.x, ballBasePosition.y, ballBasePosition.z]}
          scale={[ballDiameter, ballDiameter, ballDiameter]}
          rotation={[ballRotation.x, ballRotation.y, ballRotation.z]}
        />
        <DrawTrajectory
          linearVelocityAtRelease={linearVelocityAtRelease}
          interval={0.0001}
          totalTime={5}
          ballBasePositionXYZ={ballBasePositionXYZ}
          armRotationEnd={armRotationEnd}
          onHitFloorPosition={onHitFloorPosition}
        />
      </>

      <Panel onChange={handleChange} onAction={handleAction} />
    </>
  );
}
