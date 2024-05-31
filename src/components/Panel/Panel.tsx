import { useRef, useEffect } from 'react';
import { Pane } from 'tweakpane';
import './Panel.css';

const panelContainer = document.getElementById('controlPanel')!;
panelContainer.addEventListener('pointerdown', (evt) => {
  evt.stopPropagation();
});

const ARM_LENGTH = 0.2;
const ARM_DIAMETER = 0.015;
const ARM_ROTATION_START = 0;
const CENTER_POSITION = 0.03;
const CENTER_PERCENTAGE = CENTER_POSITION / ARM_LENGTH;

export const config = {
  armLength: ARM_LENGTH,
  armDiameter: ARM_DIAMETER,
  armRotationStart: ARM_ROTATION_START,
  centerPercentage: CENTER_PERCENTAGE
};

interface PanelProps {
  onChange: (key: keyof typeof config) => void;
}

export const Panel = (props: PanelProps) => {
  const paneRef = useRef<Pane | null>(null);

  const { onChange } = props;

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
        max: 0.02,
        pointerScale: 0.001,
        step: 0.001
      })
      .on('change', () => {
        onChange('armDiameter');
      });
    folder
      .addBinding(config, 'armRotationStart', {
        label: 'Arm Rotation Start',
        min: -180,
        max: 180,
        pointerScale: 0.01,
        step: 0.01
      })
      .on('change', () => {
        onChange('armRotationStart');
      });
    folder
      .addBinding(config, 'centerPercentage', {
        label: 'Arm Center %',
        min: 0.01,
        max: 0.99,
        pointerScale: 0.01,
        step: 0.01
      })
      .on('change', () => {
        onChange('centerPercentage');
      });
  }, []);
  return null;
};
