export const degToRad = (deg: number) => (deg / 180) * Math.PI;
export const radToDeg = (rad: number) => (rad / Math.PI) * 180;
export const radToDegFormatter = (rad: number) => radToDeg(rad).toFixed(3);
