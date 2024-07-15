import React, { useState, useEffect, useRef } from 'react';
import { createState, deleteState, createTransition, simDFA, simNFA } from './HttpRequests';
import './tailwind.css';
import { Stage, Layer, Circle } from 'react-konva';
import colours from './colours'; // Import the colours function

const Automaton = () => {
  const [responseMessage, setResponseMessage] = useState('');
  const [states, setStates] = useState([]);
  const [PDAstates, setPDAStates] = useState([]);
  const [type, setType] = useState(true);
  const [transitions, setTransitions] = useState([]);
  const [PDATransitions, setPDATransitions] = useState([]);
  const [currTransition, setCurrTransition] = useState();
  const [inputChar, setInputChar] = useState('');
  const [stateTo, setStateTo] = useState('');
  const [stateFrom, setStateFrom] = useState('');
  const [validateString, setValidateString] = useState('');
  const [pop, setPop] = useState('');
  const [push, setPush] = useState('');
  const [acceptState, setAcceptState] = useState(false);
  const [state, selectState] = useState('');

  const stageRef = useRef(null);
  const containerRef = useRef(null);
  const positions = useRef(new Map()); // Map to store positions
  const coloursRef = useRef(new Map()); // Map to store colors

  const { getColour } = colours(); // Get the getColour function

  useEffect(() => {
    const initialState = type ? states[0] : PDAstates[0];
    selectState(initialState);
  }, [type, states, PDAstates]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && stageRef.current) {
        const container = containerRef.current;
        const stage = stageRef.current;
        stage.width(container.offsetWidth);
        stage.height(container.offsetHeight);
        stage.batchDraw();
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const changeAcceptState = () => {
    setAcceptState(!acceptState);
  };

  const handleCreateState = async () => {
    try {
      const { response } = await createState(type, acceptState, states, PDAstates);
      const name = response.response;
      const position = {
        x: Math.random() * (window.innerWidth - 100) + 50,
        y: Math.random() * (window.innerHeight - 100) + 50,
      };
      const color = getColour();
      positions.current.set(name, position);
      coloursRef.current.set(name, color);
      setResponseMessage(`State Created: ${name}`);
      if (type) {
        setStates((prevStates) => [...prevStates, name]);
      } else {
        setPDAStates((prevStates) => [...prevStates, name]);
      }
    } catch (error) {
      setResponseMessage(error.message);
    }
  };

  const handleDeleteState = async () => {
    try {
      if (type) {
        const lastState = states[states.length - 1];
        const response = await deleteState(type, lastState);
        setResponseMessage(`State Deleted: ${response.Message}`);
        positions.current.delete(lastState);
        coloursRef.current.delete(lastState);
        setStates((prevStates) => prevStates.slice(0, -1));
      } else {
        const lastState = PDAstates[PDAstates.length - 1];
        const response = await deleteState(type, lastState);
        setResponseMessage(`State Deleted: ${response.Message}`);
        positions.current.delete(lastState);
        coloursRef.current.delete(lastState);
        setPDAStates((prevStates) => prevStates.slice(0, -1));
      }
    } catch (error) {
      setResponseMessage(error.message);
    }
  };  
  

  const handleCreateTransition = async () => {
    try {
      const { response, transition } = await createTransition(type, stateTo, stateFrom, push, pop, inputChar);
      setResponseMessage(`Transition Created: ${response.Message}`);
      const transitionString = transition.toString();
      if (type) {
        setTransitions((prevStates) => [...prevStates, transitionString]);
      } else {
        setPDATransitions((prevStates) => [...prevStates, transitionString]);
      }
    } catch (error) {
      setResponseMessage(error.message);
    }
  };

  const handleDFASim = async () => {
    try {
      const response = await simDFA(validateString);
      setResponseMessage(response.result.toString());
      console.log(response.path);
    } catch (error) {
      setResponseMessage(error.message);
    }
  };

  const handleNFASim = async () => {
    try {
      const response = await simNFA(validateString);
      setResponseMessage(response.result.toString());
      console.log(response.tree);
    } catch (error) {
      setResponseMessage(error.message);
    }
  };

  const handleDeleteTransition = async () => {
    console.log(currTransition);
  };

  const LAYER_WIDTH = window.innerWidth - 200; // Adjust the value as needed
  const LAYER_HEIGHT = window.innerHeight - 200; // Adjust the value as needed

  return (
    <div className="container" ref={containerRef} style={{ display: 'flex', height: '98vh', padding: '10px', paddingTop: '15px', boxSizing: 'border-box' }}>
      <div className="controls" style={{ flex: '0 0 20%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingTop: '65px' }}>
        <button type="button" onClick={handleCreateState} className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 w-1/2">Create State</button>
        <button type="button" onClick={handleDeleteState} className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 w-1/2">Delete State</button>
        <button type="button" onClick={handleCreateTransition} className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 w-1/2">Create Transition</button>
        <button type="button" onClick={handleDeleteTransition} className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 w-1/2">Delete Transition</button>
        <button type="button" onClick={handleDFASim} className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 w-1/2">Simulate DFA</button>
        <button type="button" onClick={handleNFASim} className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 w-1/2">Simulate NFA</button>
        <p>{responseMessage}</p>
      </div>
      <div className="canvas-container" style={{ flexGrow: 1, border: '2px solid black', backgroundColor: 'lightgrey', position: 'relative' }}>
        <Stage width={window.innerWidth} height={window.innerHeight} ref={stageRef}>
          <Layer>
            {states.map((state) => (
              <Circle
                key={state}
                x={positions.current.get(state).x}
                y={positions.current.get(state).y}
                radius={20}
                fill={coloursRef.current.get(state)} // Use stored color
                draggable
                onDragEnd={(e) => {
                  const newPos = { x: e.target.x(), y: e.target.y() };
                  positions.current.set(state, newPos);
                }}                
              />
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
  
};

export default Automaton;
