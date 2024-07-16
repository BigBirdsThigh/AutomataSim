import React, { useRef, useState } from 'react';
import { Stage, Layer, Circle, Line } from 'react-konva';

const Canvas = ({ states, transitions, positions, coloursRef, onCircleClick }) => {
  const layerRef = useRef(null);
  const [forceUpdateCount, setForceUpdateCount] = useState(0);
                

  // Debugging: Log states, transitions, and positions.current for debugging
  console.log('states:', states);
  console.log('positions.current:', positions.current);

  return (
    <Stage width={window.innerWidth - 400} height={window.innerHeight}>
      <Layer ref={layerRef}>
        {/* Render circles for each state */}
        {states.map((state) => {
          const pos = positions.current.get(state);
          if (!pos) {
            console.warn(`Position for state ${state} is undefined`);
            return null;
          }
          return (
            <Circle
              key={state}
              x={pos.x}
              y={pos.y}
              radius={20}
              fill={coloursRef.current.get(state)}
              draggable
              onClick={() => onCircleClick(state)}
              onDragMove={(e) => {
                const stateKey = state;
                const newPos = { x: e.target.x(), y: e.target.y() };
                positions.current.set(stateKey, newPos);
                setForceUpdateCount(forceUpdateCount + 1); // Force re-render
              }}
            />
          );
        })}

        {/* Render lines for each transition */}
        {transitions.map((transition, index) => {
          const fromPos = positions.current.get(transition.from);
          const toPos = positions.current.get(transition.to);
          if (!fromPos || !toPos) {
            console.warn(`Positions for transition ${index} are undefined`);
            return null;
          }
          return (
            <Line
              key={index}
              points={[fromPos.x, fromPos.y, toPos.x, toPos.y]}
              stroke="black"
              strokeWidth={2}
            />
          );
        })}
      </Layer>
    </Stage>
  );
};

export default Canvas;
