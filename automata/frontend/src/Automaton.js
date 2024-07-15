import React, { useState, useEffect, useRef } from 'react';
import { createState, deleteState, createTransition, simDFA, simNFA } from './HttpRequests';
import './tailwind.css';
import { Stage, Layer, Text, Arrow } from 'react-konva';

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
      const response = await deleteState(type, state);
      setResponseMessage(`State Deleted: ${response.Message}`);
      if (type) {
        setStates((prevStates) => prevStates.filter(s => s !== state));
      } else {
        setPDAStates((prevStates) => prevStates.filter(s => s !== state));
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

  return (
    <div className="container" ref={containerRef} style={{ display: 'flex', height: '98vh', padding: '10px', paddingTop: '15px', boxSizing: 'border-box' }}>      
      <div className="controls" style={{ flex: '0 0 20%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingTop: '65px'}}>      
      <button type="button" onClick={handleCreateState} class="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 w-1/2">Create State</button>
      <button type="button" onClick={handleDeleteState} class="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 w-1/2">Delete State</button>
      <button type="button" onClick={handleCreateTransition} class="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 w-1/2">Create Transition</button>
      <button type="button" onClick={handleDeleteTransition} class="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 w-1/2">Delete Transition</button>        
      <button type="button" onClick={handleDFASim} class="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 w-1/2">Simulate DFA</button>        
      <button type="button" onClick={handleNFASim} class="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 w-1/2">Simulate NFA</button>                
        <p>{responseMessage}</p>
      </div>
      <div className="canvas-container" style={{ flexGrow: 1, border: '2px solid black', backgroundColor: 'lightgrey', position: 'relative' }}>
        {/* ToDO: Make the canvas it's own JS element that our main page will interact with */}
        {/* Possibly hashmap states to coordinates and when we add transitions just getValue on the hashmap for our state */}
        <Stage width={window.innerWidth} height={window.innerHeight} ref={stageRef}>
          <Layer>
            <Text
              text="test"
              x={50}
              y={50}
              align='center'
              verticalAlign='middle'
              fontSize={40}
              fill="black"
            />
            <Arrow
              points={[60, 60, 120, 120]}
              pointerLength={10}
              pointerWidth={10}
              fill="black"
              stroke="black"
            />
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default Automaton;
