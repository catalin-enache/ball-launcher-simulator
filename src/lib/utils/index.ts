import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';

// not used
export const setFullScreen = (isFullScreen: boolean) => {
  const fullScreenOn = document.documentElement;
  const fullscreenElement =
    // @ts-ignore
    document.fullscreenElement || document.webkitFullscreenElement;

  const requestFullscreen =
    // prettier-ignore
    // @ts-ignore
    (fullScreenOn.requestFullscreen || fullScreenOn.webkitRequestFullscreen).bind(fullScreenOn);
  const exitFullscreen =
    // prettier-ignore
    // @ts-ignore
    (document.exitFullscreen || document.webkitExitFullscreen).bind(document);

  if (!fullscreenElement && isFullScreen) {
    requestFullscreen();
  } else {
    fullscreenElement && exitFullscreen();
  }
};

export const degToRad = (deg: number) => (deg / 180) * Math.PI;
export const radToDegFormatter = (rad: number) => ((rad / Math.PI) * 180).toFixed(3);

export const focusCamera = ({
  transformControls,
  orbitControls,
  camera
}: {
  transformControls?: TransformControls | null;
  orbitControls?: OrbitControls | null;
  camera: THREE.Camera;
}) => {
  const focusOn = new THREE.Vector3(); // center of the stage by default
  transformControls?.['object']?.getWorldPosition(focusOn);
  if (orbitControls) {
    orbitControls.target.copy(focusOn);
    orbitControls.update();
  } else {
    camera.lookAt(focusOn);
  }
};
