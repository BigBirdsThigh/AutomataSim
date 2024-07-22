import { Circle } from "react-konva";
import coloursRef from './colours'

const StateShape = ({ state, pos, onClick, onDragMove }) => {
    const circleOffset = 50;
    const secondCirclePos = {
      x: pos.x + circleOffset,
      y: pos.y + circleOffset
    };
  
    return (
      <>
        <Circle
          x={pos.x}
          y={pos.y}
          radius={20}
          fill={coloursRef.current.get(state)}
          draggable
          onClick={() => onClick(state)}
          onDragMove={(e) => onDragMove(state, e.target.x(), e.target.y())}
        />
        <Circle
          x={secondCirclePos.x}
          y={secondCirclePos.y}
          radius={20}
          fill={coloursRef.current.get(state)}
          draggable
          onClick={() => onClick(state)}
          onDragMove={(e) => onDragMove(state, e.target.x(), e.target.y())}
        />
      </>
    );
  };