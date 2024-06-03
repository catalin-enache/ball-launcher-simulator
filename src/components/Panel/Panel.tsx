import { useRef, useEffect } from 'react';
import { Pane } from 'tweakpane';
import './Panel.css';

export const WALL_Z_POSITION = -0.1;
export const ROBOT_FLOOR_DISTANCE = 1;
// 0.23 is arbitrary value to place the arm in front of the robot
export const ARBITRARY_Z_OFFSET = 0.23;

const panelContainer = document.getElementById('controlPanel')!;
panelContainer.addEventListener('pointerdown', (evt) => {
  evt.stopPropagation();
});

const ARM_LENGTH = 0.2;
const ARM_DIAMETER = 0.015;
const ARM_ROTATION_START = 0;
const ARM_ROTATION_END = 45;
const ARM_CENTER_POSITION = 0.03;
const ARM_CENTER_PERCENTAGE = ARM_CENTER_POSITION / ARM_LENGTH;
const BALL_DIAMETER = 0.015;
const TORQUE = 2;

export const config = {
  armLength: ARM_LENGTH,
  armDiameter: ARM_DIAMETER,
  armRotationStart: ARM_ROTATION_START,
  armRotationEnd: ARM_ROTATION_END,
  armCenterPercentage: ARM_CENTER_PERCENTAGE,
  ballDiameter: BALL_DIAMETER,
  torque: TORQUE
};

interface PanelProps {
  onChange: (key: keyof typeof config) => void;
  onAction: (action: string) => void;
}

export const Panel = (props: PanelProps) => {
  const paneRef = useRef<Pane | null>(null);

  const { onChange, onAction } = props;

  useEffect(() => {
    paneRef.current = new Pane({
      container: panelContainer
    });
    const panel = paneRef.current;
    const folder = panel.addFolder({
      title: 'Configs'
    });
    folder
      .addBinding(config, 'armLength', {
        label: 'Arm Length',
        min: 0.1,
        max: 1,
        pointerScale: 0.01,
        step: 0.01
      })
      .on('change', () => {
        onChange('armLength');
      });
    folder
      .addBinding(config, 'armDiameter', {
        label: 'Arm Diameter',
        min: 0.01,
        max: 0.05,
        pointerScale: 0.001,
        step: 0.001
      })
      .on('change', () => {
        onChange('armDiameter');
      });
    folder
      .addBinding(config, 'armRotationStart', {
        label: 'Arm Rotation Start',
        min: 0,
        max: 360,
        pointerScale: 0.001,
        step: 0.001
      })
      .on('change', () => {
        onChange('armRotationStart');
      });
    folder
      .addBinding(config, 'armRotationEnd', {
        label: 'Arm Rotation End',
        min: 0,
        max: 360,
        pointerScale: 0.001,
        step: 0.001
      })
      .on('change', () => {
        onChange('armRotationEnd');
      });
    folder
      .addBinding(config, 'armCenterPercentage', {
        label: 'Arm Center %',
        min: 0.01,
        max: 0.99,
        pointerScale: 0.01,
        step: 0.01
      })
      .on('change', () => {
        onChange('armCenterPercentage');
      });
    folder
      .addBinding(config, 'ballDiameter', {
        label: 'Ball Diameter',
        min: 0.01,
        max: 0.1,
        pointerScale: 0.001,
        step: 0.001
      })
      .on('change', () => {
        onChange('ballDiameter');
      });
    folder
      .addBinding(config, 'torque', {
        label: 'Torque',
        min: 0.01,
        max: 4,
        pointerScale: 0.01,
        step: 0.01
      })
      .on('change', () => {
        onChange('torque');
      });
    folder
      .addButton({
        title: 'Start/Pause'
      })
      .on('click', () => {
        onAction('startPause');
      });
    folder
      .addButton({
        title: 'Stop'
      })
      .on('click', () => {
        onAction('stop');
      });
    folder
      .addButton({
        title: 'Trajectory Hide/Show'
      })
      .on('click', () => {
        onAction('hideShowTrajectory');
      });
  }, [onChange, onAction]);
  return null;
};
