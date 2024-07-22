import React from 'react';
import { Line } from 'react-konva';

const StateLine = ({ fromPos, toPos, midPoints }) => {
  const calculatePoints = () => {
    const points = [fromPos.x, fromPos.y];

    // Calculate mid points
    if (midPoints > 0) {
      const deltaX = (toPos.x - fromPos.x) / (midPoints + 1);
      const deltaY = (Math.abs(toPos.y - fromPos.y) < 50) ? fromPos.y : fromPos.y + 10; // Adjusted condition

      for (let i = 1; i <= midPoints; i++) {
        points.push(fromPos.x + deltaX * i);
        points.push(deltaY); // Use dynamic y-value
      }
    }

    // Add the end point
    points.push(toPos.x, toPos.y);

    return points;
  };

  return (
    <Line
      points={calculatePoints()} // Calculate points dynamically
      stroke="black"
      strokeWidth={2}
    />
  );
};

export default StateLine;