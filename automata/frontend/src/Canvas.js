import React, { useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, Circle as FabricCircle, Path as FabricPath, Polygon as FabricPolygon, Text as FabricText } from 'fabric';

import { fabric } from 'fabric';



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


    // Temp line placement system
    const placeLine = (x1,y1, x2,y2) => {
         // define what is above, below, left, right and inline
         let above = y1 -(y2-20) > 0? true: false
         let below = y1 -(y2+20) > 0? false:true
         let inline = above === below? true:false
         let right = (x2-x1)+ 70 >0? false: true
         let left = (x2-x1) - 70 > 0? true: false


         // detection implementation
         if(inline){
         if(right){
           console.log("points should be on right")

            //  New points on circle 1
           let n1 = x1 + (20* Math.cos(Math.PI))
           let z1 = y1 + (20* Math.sin(Math.PI))

          //  New points on circle 2

          let n2 = x2 + (20* Math.cos(2*Math.PI))
          let z2 = y2 + (20* Math.sin(2*Math.PI))

           return [[n1,z1],[n2,z2]]
         }else{
           console.log("points should be on left")

           let n1 = x1 + (20* Math.cos(2*Math.PI))
           let z1 = y1 + (20* Math.sin(2*Math.PI))

           let n2 = x2 + (20* Math.cos(Math.PI))
           let z2 = y2 + (20* Math.sin(Math.PI))

           return [[n1,z1],[n2,z2]]
         }
       }else if(above){
         if(right){
           console.log("points should be on right")

           let n1 = x1 + (20* Math.cos(3*Math.PI/2))
           let z1 = y1 + (20* Math.sin(3*Math.PI/2))

           let n2 = x2 + (20* Math.cos(2*Math.PI))
           let z2 = y2 + (20* Math.sin(2*Math.PI))

           return [[n1,z1],[n2,z2]]

         }else if(left){
           console.log("points should be on left")

           let n1 = x1 + (20* Math.cos(3*Math.PI/2))
           let z1 = y1 + (20* Math.sin(3*Math.PI/2))

           let n2 = x2 + (20* Math.cos(Math.PI))
           let z2 = y2 + (20* Math.sin(Math.PI))

           return [[n1,z1],[n2,z2]]

         }else{
           console.log("points should be on bottom")

           let n1 = x1 + (20* Math.cos((3*Math.PI/2)))
           let z1 = y1 + (20* Math.sin((3*Math.PI/2)))

           let n2 = x2 + (20* Math.cos(Math.PI/2))
           let z2 = y2 + (20* Math.sin(Math.PI/2))

           return [[n1,z1],[n2,z2]]
           
         }
       }else if(below){
         console.log("points should be on top")

         if(right){
           let n1 = x1 + (20* Math.cos(Math.PI))
           let z1 = y1 + (20* Math.sin(Math.PI))

           let n2 = x2 + (20* Math.cos(3*(Math.PI/2)))
           let z2 = y2 + (20* Math.sin(3*(Math.PI/2)))

           return [[n1,z1],[n2,z2]]
         }else if (left){


          let n1 = x1 + (20* Math.cos(2*Math.PI))
          let z1 = y1 + (20* Math.sin(2*Math.PI))


          let n2 = x2 + (20* Math.cos(3*(Math.PI/2)))
          let z2 = y2 + (20* Math.sin(3*(Math.PI/2)))

           return [[n1,z1],[n2,z2]]
         }

         let n1 = x1 + (20* Math.cos(Math.PI/2))
         let z1 = y1 + (20* Math.sin(Math.PI/2))

         let n2 = x2 + (20* Math.cos((3*Math.PI/2)))
         let z2 = y2 + (20* Math.sin((3*Math.PI/2)))

         return [[n1,z1],[n2,z2]]

       }
    }

    // Function to update lines
    const updateLines = () => {
      lines.current.forEach(line => fabricCanvas.remove(line));
      lines.current.clear();
    
      transitions.forEach(({ from, to, input }, index) => {
        const fromCircle = fabricCanvas.getObjects().find(obj => obj.id === from);
        const toCircle = fabricCanvas.getObjects().find(obj => obj.id === to);
    
        if (fromCircle && toCircle) {
          let x1 = fromCircle.aCoords.br.x - 20;
          let y1 = fromCircle.aCoords.br.y - 20;
          let x2 = toCircle.aCoords.br.x - 20;
          let y2 = toCircle.aCoords.br.y - 20;
    
          const [[Nx1, Ny1], [Nx2, Ny2]] = placeLine(x1, y1, x2, y2);
    
          let controlX = (Nx1 + Nx2) / 2;
          let controlY = Math.min(Ny1, Ny2) - 50;
    
          // Adjust the control point if the target is above the start
          if (Ny2 < Ny1) {
            controlY = Math.max(Ny1, Ny2) + 50;
          }
    
          const pathData = `M ${Nx1} ${Ny1} Q ${controlX} ${controlY}, ${Nx2} ${Ny2}`;
          const curvedLine = new FabricPath(pathData, {
            stroke: 'black',
            strokeWidth: 2,
            fill: '',
            selectable: false,
            id: `line-${index}`,
          });
    
          fabricCanvas.add(curvedLine);
          lines.current.set(`line-${index}`, curvedLine);
    
          // Draw a circle at the start position
          const startCircle = new FabricCircle({
            left: Nx1,
            top: Ny1,
            radius: 3,
            fill: 'black',
            originX: 'center',
            originY: 'center',
            selectable: false,
          });
    
          fabricCanvas.add(startCircle);
          lines.current.set(`start-circle-${index}`, startCircle);
    
          // Calculate position for the label
          const labelDistance = 0.5; // Position at the middle of the curve
          const labelX = (1 - labelDistance) ** 2 * Nx1 + 2 * (1 - labelDistance) * labelDistance * controlX + labelDistance ** 2 * Nx2;
          const labelY = (1 - labelDistance) ** 2 * Ny1 + 2 * (1 - labelDistance) * labelDistance * controlY + labelDistance ** 2 * Ny2;
    
          // Create the label
          const transitionLabel = new FabricText(input || '?', { // Use 'input' as the label
            left: labelX,
            top: labelY,
            fontSize: 20,
            fill: 'blue',
            fontWeight: 'bold',
            originX: 'center',
            originY: 'center',
            selectable: false,
          });
    
          fabricCanvas.add(transitionLabel);
          lines.current.set(`label-${index}`, transitionLabel);
    
          // Arrowhead calculation
          const arrowOffset = 0;
          var angle = Math.atan2(Ny2 - Ny1, Nx2 - Nx1);
    
          const arrowHeadLength = 10;
          const arrowHeadWidth = 10;
    
          const arrowTipX = Nx2 - arrowOffset * Math.cos(angle);
          const arrowTipY = Ny2 - arrowOffset * Math.sin(angle);
    
          const arrowBaseX1 = arrowTipX - arrowHeadLength * Math.cos(angle);
          const arrowBaseY1 = arrowTipY - arrowHeadLength * Math.sin(angle);
          const arrowBaseX2 = arrowBaseX1 + arrowHeadWidth * Math.cos(angle + Math.PI / 2);
          const arrowBaseY2 = arrowBaseY1 + arrowHeadWidth * Math.sin(angle + Math.PI / 2);
          const arrowBaseX3 = arrowBaseX1 + arrowHeadWidth * Math.cos(angle - Math.PI / 2);
          const arrowBaseY3 = arrowBaseY1 + arrowHeadWidth * Math.sin(angle - Math.PI / 2);
    
          const arrowHead = new FabricPolygon([
            { x: arrowTipX, y: arrowTipY },
            { x: arrowBaseX2, y: arrowBaseY2 },
            { x: arrowBaseX3, y: arrowBaseY3 }
          ], {
            fill: 'black',
            selectable: false,
            id: `arrowhead-${index}`,
          });
    
          fabricCanvas.add(arrowHead);
          lines.current.set(`arrowhead-${index}`, arrowHead);
        }
      });
    
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
