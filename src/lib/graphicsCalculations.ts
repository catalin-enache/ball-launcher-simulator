import * as THREE from 'three';

const quaternion = new THREE.Quaternion();

export function rotateAroundPoint(
  objectPosition: THREE.Vector3,
  objectQuaternion: THREE.Quaternion,
  point: THREE.Vector3,
  axis: THREE.Vector3,
  angle: number
) {
  // Translate the object to the origin relative to the point
  objectPosition.sub(point);

  // Create a quaternion for the rotation
  // const quaternion = new THREE.Quaternion();
  quaternion.setFromAxisAngle(axis, angle);

  // Apply the rotation to the object's position
  objectPosition.applyQuaternion(quaternion);

  // Translate the object back to its original position
  objectPosition.add(point);

  // Apply the rotation to the object's orientation
  objectQuaternion.multiplyQuaternions(quaternion, objectQuaternion);
  return objectQuaternion;
}
