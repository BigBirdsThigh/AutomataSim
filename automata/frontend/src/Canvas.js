import React, { useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, Circle as FabricCircle, Line as FabricLine } from 'fabric';

// Function to calculate points evenly spaced on the top side of the circle
const getTopSidePoints = (centerX, centerY, radius, numPoints = 4) => {
  const points = [];
  const startAngle = -Math.PI / 2 + ((Math.PI / 180)); // Start 20 degrees after the top
  const endAngle = -Math.PI / 2 + (180 * (Math.PI / 180)) - (20 * (Math.PI / 180)); // End at 180 degrees, excluding last 20 degrees
  const deltaTheta = (endAngle - startAngle) / (numPoints - 1);

  for (let i = 0; i < numPoints; i++) {
    const theta = startAngle + i * deltaTheta;
    const x = centerX + radius * Math.cos(theta);
    const y = centerY + radius * Math.sin(theta);
    points.push({ x, y });
  }

  return points;
};

// Function to calculate points evenly spaced on the bottom side of the circle
const getBottomSidePoints = (centerX, centerY, radius, numPoints = 4) => {
  const points = [];
  const startAngle = Math.PI / 2 + (60 * (Math.PI / 180)); // Start 20 degrees after the bottom
  const endAngle = Math.PI / 2 + (180 * (Math.PI / 180)) - (60 * (Math.PI / 180)); // End at 0 degrees, excluding last 20 degrees
  const deltaTheta = (endAngle - startAngle) / (numPoints - 1);

  for (let i = 0; i < numPoints; i++) {
    const theta = startAngle + i * deltaTheta;
    const x = centerX + radius * Math.cos(theta);
    const y = centerY + radius * Math.sin(theta);
    points.push({ x, y });
  }

  return points;
};

// Function to calculate points evenly spaced on the left side of the circle
const getLeftSidePoints = (centerX, centerY, radius, numPoints = 4) => {
  const points = [];
  const startAngle = Math.PI - (60 * (Math.PI / 180)); // Start 20 degrees after the left
  const endAngle = -Math.PI + (60 * (Math.PI / 180)); // End at -180 degrees, excluding last 20 degrees
  const deltaTheta = (endAngle - startAngle) / (numPoints - 1);

  for (let i = 0; i < numPoints; i++) {
    const theta = startAngle + i * deltaTheta;
    const x = centerX + radius * Math.cos(theta);
    const y = centerY + radius * Math.sin(theta);
    points.push({ x, y });
  }

  return points;
};

// Function to calculate points evenly spaced on the right side of the circle
const getRightSidePoints = (centerX, centerY, radius, numPoints = 4) => {
  const points = [];
  const startAngle = -Math.PI / 2 + (60 * (Math.PI / 180)); // Start 20 degrees after the top
  const endAngle = Math.PI / 2 - (60 * (Math.PI / 180)); // End 20 degrees before the bottom
  const deltaTheta = (endAngle - startAngle) / (numPoints - 1);

  for (let i = 0; i < numPoints; i++) {
    const theta = startAngle + i * deltaTheta;
    const x = centerX + radius * Math.cos(theta);
    const y = centerY + radius * Math.sin(theta);
    points.push({ x, y });
  }

  return points;
};

// Function to determine the relative position of destination to source
const getRelativePosition = (source, destination) => {
    const { x: x1, y: y1 } = source;
    const { x: x2, y: y2 } = destination;
  
    const horizontalDifference = x2 - x1;
    const verticalDifference = y2 - y1;
  
    // Determine if the movement is more horizontal or vertical
    const isHorizontalDominant = Math.abs(horizontalDifference) > Math.abs(verticalDifference);
  
    if (isHorizontalDominant) {
      if (horizontalDifference > 0) return 'right';  // More to the right
      if (horizontalDifference < 0) return 'left';   // More to the left
    } else {
      if (verticalDifference > 0) return 'bottom';  // More below
      if (verticalDifference < 0) return 'top';     // More above
    }
  
    return 'unknown';  // This case should ideally not occur
  };
  
  

// Function to get attachment points based on relative position
const getAttachmentPointsBasedOnPosition = (circle, position) => {
  const radius = circle.radius;
  const centerX = circle.left;
  const centerY = circle.top;
  
  switch (position) {
    case 'right':
      return getRightSidePoints(centerX, centerY, radius);
    case 'left':
      return getLeftSidePoints(centerX, centerY, radius);
    case 'bottom':
      return getBottomSidePoints(centerX, centerY, radius);
    case 'top':
      return getTopSidePoints(centerX, centerY, radius);
    default:
      return getRightSidePoints(centerX, centerY, radius); // Default to right side
  }
};

const Canvas = ({ states, transitions, positions, coloursRef, onCircleClick, updateTransitionPositions }) => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const isDragging = useRef(false); // Ref to track if dragging is occurring
  const lines = useRef(new Map()); // Ref to store lines

  useEffect(() => {
    // Initialize fabric canvas
    const fabricCanvas = new FabricCanvas(canvasRef.current);
    setCanvas(fabricCanvas);

    const addCircle = (state) => {
      const pos = positions.current.get(state) || { x: 100, y: 100 }; // Default position if not found
      const color = coloursRef.current.get(state) || 'red'; // Default color if not found

      const circle = new FabricCircle({
        left: pos.x,
        top: pos.y,
        radius: 20,
        fill: color,
        id: state,
        hasControls: false,
        hasBorders: false,
        originX: 'center',
        originY: 'center',
        selectable: true,
      });

      circle.on('mousedown', () => {
        // Set dragging flag on mouse down
        isDragging.current = false;
      });

      circle.on('moving', () => {
        isDragging.current = true; // Set dragging flag while moving

        // Update the position in the ref
        positions.current.set(state, { x: circle.left, y: circle.top });
        
        // Update lines while moving
        updateLines();
      });

      circle.on('mouseup', () => {
        if (isDragging.current) {
          // Reset dragging flag after move
          isDragging.current = false;
        } else {
          // Handle click logic here
          if (onCircleClick) onCircleClick(state);
        }

        // Ensure lines are updated after dragging stops
        updateLines();
      });

      fabricCanvas.add(circle);
    };

    // Function to update lines
    const updateLines = () => {
      // Clear existing lines
      lines.current.forEach(line => fabricCanvas.remove(line));
      lines.current.clear();

      transitions.forEach(({ from, to }, index) => {
        const fromCircle = fabricCanvas.getObjects().find(obj => obj.id === from);
        const toCircle = fabricCanvas.getObjects().find(obj => obj.id === to);

        if (fromCircle && toCircle) {
          const fromPosition = getRelativePosition(
            { x: fromCircle.left, y: fromCircle.top },
            { x: toCircle.left, y: toCircle.top }
          );
          const toPosition = getRelativePosition(
            { x: toCircle.left, y: toCircle.top },
            { x: fromCircle.left, y: fromCircle.top }
          );

          const fromPoints = getAttachmentPointsBasedOnPosition(fromCircle, fromPosition);
          const toPoints = getAttachmentPointsBasedOnPosition(toCircle, toPosition);

          // Use index to pick attachment points
          const attachmentPointIndex = index % fromPoints.length;

          const line = new FabricLine([
            fromPoints[attachmentPointIndex].x, fromPoints[attachmentPointIndex].y, 
            toPoints[attachmentPointIndex].x, toPoints[attachmentPointIndex].y
          ], {
            stroke: 'black',
            strokeWidth: 2,
            selectable: false,
            id: `line-${index}`, // Assign a unique ID
          });

          fabricCanvas.add(line);
          lines.current.set(`line-${index}`, line); // Store line reference

          // Log the relative positions of the circles
          console.log(`Line from ${from} to ${to}: From ${fromPosition}, To ${toPosition}`);
        }
      });

      // Render canvas
      fabricCanvas.renderAll();
    };

    // Add circles to the canvas
    states.forEach(state => addCircle(state));

    // Initial line drawing
    updateLines();

    // Cleanup function to dispose of canvas
    return () => {
      fabricCanvas.dispose();
    };
  }, [states, transitions, positions, coloursRef, onCircleClick, updateTransitionPositions]);

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth - 400}
      height={window.innerHeight}
    />
  );
};

export default Canvas;
