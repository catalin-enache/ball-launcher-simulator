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
  // calculate the mass
  // m = ρV
  return density * volume;
};

export const getArmMomentOfInertia = (mass: number, radius: number) => {
  // calculate the moment of inertia of a cylinder
  // I = 1/2m(r^2)
  return 0.5 * mass * radius ** 2;
};

export const getBallMomentOfInertia = (mass: number, radius: number) => {
  // calculate the moment of inertia of a sphere
  // I = 2/5mr^2
  return (2 / 5) * mass * radius ** 2;
};

export const getAngularAcceleration = (torque: number, momentOfInertia: number) => {
  // calculate the angular acceleration
  // α = τ/I
  return torque / momentOfInertia;
};

export const getAngularVelocity = (angularAcceleration: number, time: number) => {
  // calculate the angular velocity
  // ω = αt
  return angularAcceleration * time;
};

export const getRotationalKineticEnergy = (momentOfInertia: number, angularVelocity: number) => {
  // calculate the rotational kinetic energy
  // KE = 1/2Iω^2
  return 0.5 * momentOfInertia * angularVelocity ** 2;
};

export const getRotationalWork = (torque: number, angle: number) => {
  // calculate the rotational work
  // W = τθ
  return torque * angle;
};

export const getRotationalPower = (torque: number, angularVelocity: number) => {
  // calculate the rotational power
  // P = τω
  return torque * angularVelocity;
};

export const getRotationalImpulse = (torque: number, time: number) => {
  // calculate the rotational impulse
  // I = τt
  return torque * time;
};

export const getRotationalMomentum = (momentOfInertia: number, angularVelocity: number) => {
  // calculate the rotational momentum
  // L = Iω
  return momentOfInertia * angularVelocity;
};
