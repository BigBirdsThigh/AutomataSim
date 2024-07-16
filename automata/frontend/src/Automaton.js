import React, { useState, useEffect, useRef } from 'react';
import { createState, deleteState, createTransition, simDFA, simNFA, deleteTransition } from './HttpRequests';
import './tailwind.css';
import { Stage, Layer, Circle } from 'react-konva';
import Canvas from './Canvas';
import colours from './colours'; // Import the colours function
import Modal from './Modal'

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedState, setSelectedState] = useState(null);
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
    console.log(acceptState)
  };

  const handleInputChange = (event) => {
    setValidateString(event.target.value); // Update validateString state with input value
    console.log(validateString)
  };

  const handleCreateState = async () => {
    try {
      const { response } = await createState(true, acceptState, states, []);
      const name = response.response;
      const position = {
        x: Math.random() * (window.innerWidth - 500) + 50,
        y: Math.random() * (window.innerHeight - 200) + 50,
      };
      const color = getColour();
      positions.current.set(name, position);
      coloursRef.current.set(name, color);
      setResponseMessage(`State Created: ${name}`);
      setStates((prevStates) => [...prevStates, name]);
    } catch (error) {
      setResponseMessage(error.message);
    }
  };

  const handleDeleteState = async () => {
    try {
      let deletedState;
      if (type) {
        const lastState = states[states.length - 1];
        const response = await deleteState(type, lastState);
        setResponseMessage(`State Deleted: ${response.Message}`);
        deletedState = lastState;
        setStates((prevStates) => prevStates.slice(0, -1));        

        // Filter out transitions involving the deleted state
        setTransitions((prevTransitions) =>
          prevTransitions.filter((transition) => transition.from !== deletedState && transition.to !== deletedState)
        );

      } else {
        const lastState = PDAstates[PDAstates.length - 1];
        const response = await deleteState(type, lastState);
        setResponseMessage(`State Deleted: ${response.Message}`);
        
        deletedState = lastState;

        setPDATransitions((prevTransitions) =>
          prevTransitions.filter((transition) => transition.from !== deletedState && transition.to !== deletedState)
        );

        setPDAStates((prevStates) => prevStates.slice(0, -1));
      }        
  
      positions.current.delete(deletedState);
      coloursRef.current.delete(deletedState);
    } catch (error) {
      setResponseMessage(error.message);
    }
  };
  
  
  
 
  const updateTransitionPositions = () => {
    setTransitions((prevTransitions) =>
      prevTransitions.map((transition) => {
        const fromPos = positions.current.get(transition.from);
        const toPos = positions.current.get(transition.to);
        return { ...transition, from: fromPos, to: toPos };
      })
    );
  };
  

 
  const handleCreateTransition = async ({ stateTo, stateFrom, push, pop, inputChar }) => {
    try {
      const { response, transition } = await createTransition(type, stateTo, stateFrom, push, pop, inputChar);
      setResponseMessage(`Transition Created: ${response.Message}`);
      const transitionObject = { from: stateFrom, to: stateTo, input: inputChar };
      if (type) {
        setTransitions((prevStates) => [...prevStates, transitionObject]);
      } else {
        setPDATransitions((prevStates) => [...prevStates, transitionObject]);
      }
      handleCloseModal(); // Close the modal after creating the transition
    } catch (error) {
      setResponseMessage(error.message);
    }
  };

  const handleDeleteTransition = async ({stateTo, stateFrom, push, pop, inputChar}) => {
    try{
      const {response, transition} = await deleteTransition(type, stateTo, stateFrom, push, pop, inputChar)
      setResponseMessage(`Transition Deleted: ${response.message}`)
      const transitionObject = {from: stateFrom, to: stateTo, input: inputChar }
      if(type){
        setTransitions((prevTransitions) =>
          prevTransitions.filter((transition) => transition.from !== stateFrom, transition.to !== stateTo, transition.input !== inputChar)
        );
      }else{
        setTransitions((prevTransitions) =>
          prevTransitions.filter((transition) => transition.from !== stateFrom, transition.to !== stateTo, transition.input !== inputChar)
      );
      }
    } catch(error) {
      setResponseMessage(error.message)
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



  const handleOpenModal = (state) => {
    setSelectedState(state);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedState(null);
  };

  const LAYER_WIDTH = window.innerWidth - 400; 
  const LAYER_HEIGHT = window.innerHeight - 200; 

  return (
    <div className="container" style={{ display: 'flex', height: '98vh', padding: '10px', paddingTop: '15px', boxSizing: 'border-box' }}>
      <div className="controls" style={{ flex: '0 0 20%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingTop: '65px' }}>
        <button type="button" onClick={handleCreateState} className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2 w-1/2">Create State</button>
        <button type="button" onClick={handleDeleteState} className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2 w-1/2">Delete State</button>
        <button type="button" onClick={handleDeleteTransition} className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2 w-1/2">Delete Transition</button>
        <button type="button" onClick={handleDFASim} className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2 w-1/2">Sim DFA</button>
        <button type="button" onClick={changeAcceptState} className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2 w-1/2">Set Accept State</button>
        <input type="text" value = {validateString} onChange={handleInputChange} id="first_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required />
        <p>{responseMessage}</p>
      </div>
      <div className="canvas-container" style={{ flexGrow: 1, border: '2px solid black', backgroundColor: 'lightgrey', position: 'relative' }}>
        <Canvas
          states={states}
          transitions={transitions}
          positions={positions}
          coloursRef={coloursRef}
          onCircleClick={handleOpenModal}
          updateTransitionPositions={updateTransitionPositions}
        />
        <Modal
           isOpen={isModalOpen}
           onClose={handleCloseModal}
           title="State Details"
           selectedState={selectedState} // Pass the selected state  
           onCreateTransition={handleCreateTransition}
        />
      </div>
    </div>
  );
  
  
};

export default Automaton;
