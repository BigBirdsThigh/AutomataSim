import React, { useEffect, useRef, useState } from 'react';
import { updatePositions } from './HttpRequests';
import { Canvas as FabricCanvas, Circle as FabricCircle, Path as FabricPath, Polygon as FabricPolygon, Text as FabricText, Group as FabricGroup } from 'fabric';

const Canvas = ({ states, transitions, positions, coloursRef, onCircleClick, updateTransitionPositions }) => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const isDragging = useRef(false);
  const lines = useRef(new Map());
  // const positions = useRef(new Map())
  const radius = 35;
  const animationFrameId = useRef(null);
  const transitionsByState = useRef(new Map()); // Map to store transitions by state

  useEffect(() => {
    const fabricCanvas = new FabricCanvas(canvasRef.current, { renderOnAddRemove: false });
    setCanvas(fabricCanvas);
    fabricCanvas.selection = false;
    fabricCanvas.hoverCursor = 'pointer'; // Default cursor when hovering over objects
    fabricCanvas.defaultCursor = 'default'; // Default cursor for the canvas  

    const addCircle = async (state) => {
      const pos = (positions.current.get(state) || { x: 100, y: 100 });      
      const color = coloursRef.current.get(state) || 'red';      
      // updatePositions(state, [positions.current.get(state).x, positions.current.get(state).y])
    
      const circle = new FabricCircle({
        left: pos.x,
        top: pos.y,
        radius: radius,
        fill: color,
        id: state,
        hasControls: false,
        hasBorders: false,
        originX: 'center',
        originY: 'center',
        selectable: true,
      });
    
      const stateName = new FabricText(state || '?', {
        left: circle.left,
        top: circle.top,
        fontSize: 28,
        fill: 'black',
        fontWeight: 'bold',
        originX: 'center',
        originY: 'center',
        selectable: false,
      });        
    
      let isDragging = false;  // Track if the circle was dragged
      let originalPosition = { x: circle.left, y: circle.top };
    
      // Start tracking drag state
      circle.on('mousedown', () => {
        isDragging = false;
        originalPosition = { x: circle.left, y: circle.top };
      });


    
      // Track movement to detect dragging
      circle.on('mousemove', () => {
        if (circle.left !== originalPosition.x || circle.top !== originalPosition.y) {
          isDragging = true;
        }
        stateName.set({
          left: circle.left,
          top: circle.top
        });
        positions.current.set(state, { x: circle.left, y: circle.top });
        
    
            
      });
  
        // Group the circle and text together
      const stateGroup = new FabricGroup([circle, stateName], {
        selectable: true,
        hasControls: true,      // Enable controls around the group
        lockScalingX: true,    
        lockScalingY: true,    
        lockRotation: true,
        id: `stateGroup-${state}`,
      });

      stateGroup.set({
        borderColor: 'transparent',  // turn off border
        cornerColor: 'transparent',  // turn off border
        cornerSize: 10,       
        transparentCorners: true,  
      });

            
      let hasMoved = false;
      let mouseDown = false
    
      stateGroup.on('mousedown', (options) => {
        isDragging = true;
        hasMoved = false;
        mouseDown = true
      });
    
      stateGroup.on('moving', (options) => {
         
        positions.current.set(state, { x: stateGroup.left, y: stateGroup.top });         
        hasMoved = true;    
        console.log(positions.current.get(state))           
             
        if (!animationFrameId.current) {
          animationFrameId.current = requestAnimationFrame(() => {
            updateLines();
            animationFrameId.current = null;
          });
        }    

      });
      
    
      fabricCanvas.on('mouse:up', (options) => {
        if (isDragging) {
          isDragging = false;
    
          if (!hasMoved) {
            // This was a click, not a drag
            
            updatePositions(state, [positions.current.get(state).x, positions.current.get(state).y])
            positions.current.set(state, { x: (stateGroup.left +36), y: (stateGroup.top+36) });
            if (onCircleClick) onCircleClick(state);
          } else {
            // This was a drag
            updatePositions(state, [positions.current.get(state).x+36, positions.current.get(state).y+36])            
            positions.current.set(state, { x: (stateGroup.left +36), y: (stateGroup.top+36) });
            isDragging = false
            updateLines();
          }
        }
      });


      fabricCanvas.add(stateGroup);
      // fabricCanvas.add();
      

    };

   
    
    

    const placeLine = (x1, y1, x2, y2, index) => {
      let dist = index === 1 ? 0.7 * index : index === 2? 0.13 * index: index ===3? -0.4/4: -0.6;

      let above = y1 - (y2 - radius) > 0 ? true : false;
      let below = y1 - (y2 + radius) > 0 ? false : true;
      let inline = above === below ? true : false;
      let right = (x2 - x1) + 70 > 0 ? false : true;
      let left = (x2 - x1) - 70 > 0 ? true : false;

      if (inline) {
        if (right) {
          let n1 = x1 + (radius * Math.cos((Math.PI) + dist));
          let z1 = y1 + (radius * Math.sin((Math.PI) + dist));
          let n2 = x2 + (radius * Math.cos((2 * Math.PI) - dist));
          let z2 = y2 + (radius * Math.sin((2 * Math.PI) - dist));
          return [[n1, z1], [n2, z2]];
        } else {
          let n1 = x1 + (radius * Math.cos((2 * Math.PI) - dist));
          let z1 = y1 + (radius * Math.sin((2 * Math.PI) - dist));
          let n2 = x2 + (radius * Math.cos((Math.PI) + dist));
          let z2 = y2 + (radius * Math.sin((Math.PI) + dist));
          return [[n1, z1], [n2, z2]];
        }
      } else if (above) {
        if (right) {          
          let n1 = x1 + (radius * Math.cos(-(Math.PI/2) - dist));
          let z1 = y1 + (radius * Math.sin(-(Math.PI/2) - dist));
          let n2 = x2 + (radius * Math.cos((2*Math.PI) + dist));
          let z2 = y2 + (radius * Math.sin((2 * Math.PI) + dist));
          return [[n1, z1], [n2, z2]];
        } else if (left) {
          let n1 = x1 + (radius * Math.cos((3 * Math.PI / 2) + dist));
          let z1 = y1 + (radius * Math.sin((3 * Math.PI / 2) + dist));
          let n2 = x2 + (radius * Math.cos(Math.PI - dist));
          let z2 = y2 + (radius * Math.sin(Math.PI - dist));
          return [[n1, z1], [n2, z2]];
        } else {
          let n1 = x1 + (radius * Math.cos((3 * Math.PI / 2) - dist));
          let z1 = y1 + (radius * Math.sin((3 * Math.PI / 2) - dist));
          let n2 = x2 + (radius * Math.cos((Math.PI / 2) + dist));
          let z2 = y2 + (radius * Math.sin((Math.PI / 2) + dist));
          return [[n1, z1], [n2, z2]];
        }
      } else if (below) {
        if (right) {
          let n1 = x1 + (radius * Math.cos(Math.PI + dist));
          let z1 = y1 + (radius * Math.sin(Math.PI - dist));
          let n2 = x2 + (radius * Math.cos((3 * (Math.PI / 2)) + dist));
          let z2 = y2 + (radius * Math.sin((3 * (Math.PI / 2)) + dist));
          return [[n1, z1], [n2, z2]];
        } else if (left) {
          let n1 = x1 + (radius * Math.cos((2 * Math.PI) + dist));
          let z1 = y1 + (radius * Math.sin((2 * Math.PI) - dist));
          let n2 = x2 + (radius * Math.cos((3 * (Math.PI / 2)) + dist));
          let z2 = y2 + (radius * Math.sin((3 * (Math.PI / 2)) + dist));
          return [[n1, z1], [n2, z2]];
        }
        let n1 = x1 + (radius * Math.cos((Math.PI / 2) - dist));
        let z1 = y1 + (radius * Math.sin((Math.PI / 2) - dist));
        let n2 = x2 + (radius * Math.cos((3 * Math.PI / 2) + dist));
        let z2 = y2 + (radius * Math.sin((3 * Math.PI / 2) + dist));
        return [[n1, z1], [n2, z2]];
      }
    };

    const updateLines = () => {
      fabricCanvas.renderOnAddRemove = false;

       // Remove all existing lines and labels
      lines.current.forEach(line => fabricCanvas.remove(line));
      lines.current.clear();    
      
      const stateTransitionCount = new Map();

      transitions.forEach(({ from, to, input }, index) => {
        const fromCircle = fabricCanvas.getObjects().find(obj => obj.id === `stateGroup-${from}`);
        const toCircle = fabricCanvas.getObjects().find(obj => obj.id === `stateGroup-${to}`);

        if (fromCircle && toCircle) {
          // Increment the transition count for both 'from' and 'to' states
          if (!stateTransitionCount.has(from)) stateTransitionCount.set(from, 0);
          if (!stateTransitionCount.has(to)) stateTransitionCount.set(to, 0);

          // Use the current count to determine the index
          const transitionIndexFrom = stateTransitionCount.get(from) % 4 + 1;
          const transitionIndexTo = stateTransitionCount.get(to) % 4 + 1;

          console.log(`Transition involving state ${from} and ${to}, indexed at ${transitionIndexFrom} and ${transitionIndexTo}`);

          // Increment the count for both states
          stateTransitionCount.set(from, stateTransitionCount.get(from) + 1);
          stateTransitionCount.set(to, stateTransitionCount.get(to) + 1);

          let x1 = fromCircle.aCoords.br.x - radius;
          let y1 = fromCircle.aCoords.br.y - radius;
          let x2 = toCircle.aCoords.br.x - radius;
          let y2 = toCircle.aCoords.br.y - radius;

          const [[Nx1, Ny1], [Nx2, Ny2]] = placeLine(x1, y1, x2, y2, transitionIndexFrom);

          let below = y1 - (y2 + radius) > 0 ? false : true;
          let right = (x2 - x1) + 70 > 0 ? false : true;
          let left = (x2 - x1) - 70 > 0 ? true : false;
          let above = y1 - (y2 - radius) > 0 ? true : false;
          
          let controlY = Math.min(Ny1, Ny2) - 50;
         
          if(below && (left || right)){
            controlY = Math.min(Ny1, Ny2) - 50;
          }else{
            controlY = Math.min(Ny1, Ny2) + 50;
          }

          if (above && (left || right)) {
            controlY = Math.min(Ny1, Ny2)-20;
          } 
          // else if(above && !(left || right)){
          //   controlY = Math.min(Ny1, Ny2) + 50;
          // }

          let controlX = (Nx1 + Nx2) / 2;

          const pathData = `M ${Nx1} ${Ny1} Q ${controlX} ${controlY}, ${Nx2} ${Ny2}`;
          const curvedLine = new FabricPath(pathData, {
            stroke: 'red',
            strokeWidth: 2,
            fill: '',
            selectable: false,
            id: `line-${index}`,
          });

          const startCircle = new FabricCircle({
            left: Nx1,
            top: Ny1,
            radius: 3,
            fill: 'black',
            originX: 'center',
            originY: 'center',
            selectable: false,
          });

          const endCircle = new FabricCircle({
            left: Nx2,
            top: Ny2,
            radius: 3,
            fill: 'black',
            originX: 'center',
            originY: 'center',
            selectable: false,
          });

          const labelDistance = 0 + transitionIndexFrom/6; // Change this to place the label at different points on the path
          const labelX = Math.round((1 - labelDistance) ** 2 * Nx1 + 2 * (1 - labelDistance) * labelDistance * controlX + labelDistance ** 2 * Nx2);
          const labelY = Math.round((1 - labelDistance) ** 2 * Ny1 + 2 * (1 - labelDistance) * labelDistance * controlY + labelDistance ** 2 * Ny2);


          const transitionLabel = new FabricText(input || '?', {
            left: labelX,
            top: labelY,
            fontSize: 28,
            fill: 'black',
            fontWeight: 'bold',
            originX: 'center',
            originY: 'center',
            selectable: false,
          });
          transitionLabel.set({ objectCaching: false });
          transitionLabel.set({
            left: labelX,
            top: labelY
          });
          transitionLabel.setCoords();
          

          const t = 1;
          const dx = 2 * (1 - t) * (controlX - Nx1) + 2 * t * (Nx2 - controlX);
          const dy = 2 * (1 - t) * (controlY - Ny1) + 2 * t * (Ny2 - controlY);
          const angle = Math.atan2(dy, dx);

          const arrowHeadLength = 10;
          const arrowHeadWidth = 10;

          const arrowTipX = Nx2 - 0 * Math.cos(angle);
          const arrowTipY = Ny2 - 0 * Math.sin(angle);

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

          const pathGroup = new FabricGroup([curvedLine, startCircle, endCircle, arrowHead], {
            selectable: false,
            id: `pathGroup-${index}`,
          });

          fabricCanvas.add(pathGroup);
          fabricCanvas.add(transitionLabel);
          lines.current.set(`pathGroup-${index}`, pathGroup);           
          lines.current.set(`label-${index}`, transitionLabel);
        }
      });

      fabricCanvas.renderOnAddRemove = true;
      fabricCanvas.renderAll();
    };

    states.forEach(state => addCircle(state));
    updateLines();

    return () => {
      fabricCanvas.dispose();
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [states, transitions]);

  const getTransitionsForState = (state) => {
    return transitionsByState.current.get(state);
  };

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth - 400}
      height={window.innerHeight}
    />
  );
};

export default Canvas;
