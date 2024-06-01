export const ARM_DENSITY = 2700; // kg/m^3
export const BALL_DENSITY = 7870; // kg/m^3
export const MAX_SPEED = 20; // rad/s

export const getArmVolume = (radius: number, height: number) => {
  // calculate the volume of a cylinder
  // V = πr^2h
  return Math.PI * radius ** 2 * height;
};

export const getBallVolume = (radius: number) => {
  // calculate the volume of a sphere
  // V = 4/3πr^3
  return (4 / 3) * Math.PI * radius ** 3;
};

export const getMass = (volume: number, density: number) => {
  // m = ρV
  return density * volume;
};

const getMomentOfInertiaAboutCenterOfTheMass = (mass: number, length: number) => {
  // calculate the moment of inertia for a cylinder about its center of mass
  // I = 1/12 * m * L^2
  return (1 / 12) * mass * length ** 2;
};

export const getArmMomentOfInertia = (mass: number, fullLength: number, pivotPercentage: number) => {
  // calculate the moment of inertia using Parallel Axis Theorem
  // I = Icm + md^2
  const middle = fullLength / 2;
  const distanceToAxisOfRotation = fullLength * pivotPercentage;
  const lengthFromCenter = Math.abs(middle - distanceToAxisOfRotation);
  const Icm = getMomentOfInertiaAboutCenterOfTheMass(mass, fullLength);
  return Icm + mass * lengthFromCenter ** 2;
};

export const getBallMomentOfInertia = (mass: number, length: number) => {
  // calculate the moment of inertia for point mass
  // I = mr^2
  return mass * length ** 2;
};

export const getAngularAcceleration = (torque: number, momentOfInertia: number) => {
  // α = τ/I
  return torque / momentOfInertia;
};

export const getTimeToReachMaxVelocity = (angularAcceleration: number) => {
  // ω = αt
  // solving for t
  // t = ω/α
  return MAX_SPEED / angularAcceleration;
};

export const getAngularPositionAtMaxVelocity = (angularAcceleration: number) => {
  // θmax = 1/2αTmax^2
  return 0.5 * angularAcceleration * getTimeToReachMaxVelocity(angularAcceleration) ** 2;
};

// also good for getting angular velocity at end angle TRelease (returned by getTimeToReachEndAngle)
export const getAngularVelocity = (angularAcceleration: number, time: number) => {
  // ω = ω0 + αt // ω0 is 0, so we ignore it
  return Math.min(angularAcceleration * time, MAX_SPEED);
};

export const getAngularDisplacement = (time: number, angularAcceleration: number) => {
  const timeToReachMaxVelocity = getTimeToReachMaxVelocity(angularAcceleration);
  if (time <= timeToReachMaxVelocity) {
    // acceleration phase
    // θ = ω0t + 1/2αt^2 // ω0t is 0, so we ignore it
    return 0.5 * angularAcceleration * time ** 2;
  } else {
    // constant velocity phase
    const remainingTime = time - timeToReachMaxVelocity;
    const angularPositionAtMaxVelocity = getAngularPositionAtMaxVelocity(angularAcceleration);
    return angularPositionAtMaxVelocity + MAX_SPEED * remainingTime;
  }
};

export const getTimeToReachEndAngle = (angularAcceleration: number, endAngle: number) => {
  const angularPositionAtMaxVelocity = getAngularPositionAtMaxVelocity(angularAcceleration);
  if (endAngle <= angularPositionAtMaxVelocity) {
    // θend = 1/2αt^2
    // solving for t
    // t = √(2θ/α)
    return Math.sqrt((2 * endAngle) / angularAcceleration); // TRelease
  } else {
    const remainingAngle = endAngle - angularPositionAtMaxVelocity;
    const timeRemaining = remainingAngle / MAX_SPEED;
    return getTimeToReachMaxVelocity(angularAcceleration) + timeRemaining; // TRelease
  }
};

export const getLinearVelocity = (angularVelocity: number, length: number) => {
  // calculate the linear velocity at release point
  // v = ωr
  return angularVelocity * length;
};

export const getHVComponentsFromLinearVelocity = (velocity: number, angle: number) => {
  // calculate the horizontal and vertical components of the linear velocity
  // Vx = vcosθ
  // Vy = vsinθ
  return {
    x: velocity * Math.cos(angle),
    y: velocity * Math.sin(angle)
  };
};

export const getBallMotion = (velocity: number, angle: number, time: number) => {
  // calculate the horizontal and vertical motion of the ball
  // x = vcosθt
  // y = vsinθt - 1/2gt^2
  return {
    x: velocity * Math.cos(angle) * time,
    y: velocity * Math.sin(angle) * time - 0.5 * 9.81 * time ** 2
  };
};
