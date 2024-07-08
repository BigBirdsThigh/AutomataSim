import React, { useState, useEffect } from 'react';
import { createState, deleteState, createTransition, simDFA, simNFA } from './HttpRequests'
import Transition from './Transition';
import './tailwind.css';

const Automaton = () => {

  const [effect, setEffect] = useState(false); // animation
  const [responseMessage, setResponseMessage] = useState('');
  
  const [states, setStates] = useState([]);
  const [PDAstates, setPDAStates] = useState([]);
  const [type, setType] = useState(true);
  const[transType, setTransType] = useState(false);
  const [transitions, setTransitions] = useState([]);
  const [PDATransitions, setPDATransitions] = useState([]);
  const[currTransition, setCurrTransition] = useState();


  const [inputChar, setInputChar] = useState('')
  const[stateTo, setStateTo] = useState("");
  const[stateFrom, setStateFrom] = useState("");
  const[validateString, setValidateString] = useState("")
  const[pop, setPop] = useState('')
  const[push, setPush] = useState("")
  const[acceptState, setAcceptState] = useState(false); 
  const[state, selectState] = useState("")  


  useEffect(() => {
    // Set the initial selected state
    const initialState = type ? states[0] : PDAstates[0];
    selectState(initialState);
  }, [type, states, PDAstates]);



  const changeAcceptState = () => {    
    setAcceptState(!acceptState)
    // console.log(acceptState)
  }

  const handleCreateState = async () => {
    try {
      const { response } = await createState(type, acceptState, states, PDAstates);
      
      const name = JSON.parse(JSON.stringify(response))
      setResponseMessage(`State Created: ${name.response}`);
      
      console.log(name.response)
      if(type){
        setStates((prevStates) => [...prevStates, name.response]);
      }else{
        setPDAStates((prevStates) => [...prevStates, name.response]);
      }
    } catch (error) {
      setResponseMessage(error.message);
    }
  };


  const handleDeleteState = async () => {
    try {
      const response = await deleteState(type, state);
      setResponseMessage(`State Deleted: ${response.Message}`);
      if(type){
        setStates((prevStates) => prevStates.filter(s => s !== state));
      } else {
        setPDAStates((prevStates) => prevStates.filter(s => s !== state));
      }
    } catch (error) {
      setResponseMessage(error.message);
    }
  };

  const handleCreateTransition = async () =>{
    try {          
      // console.log(stateTo, stateFrom)
      const {response, transition} = await createTransition(type, stateTo, stateFrom, push, pop, inputChar);      
      setResponseMessage(`Transition Created: ${response.Message}`);
      const transitionString = transition.toString();
      
      if(type){
        setTransitions((prevStates) => [...prevStates, transitionString])              
      }else{        
        setPDATransitions((prevStates) => [...prevStates, transitionString])        
      }

    } catch(error){
      setResponseMessage(error.message);
    }
  }

  const handleDFASim = async () => {
    try{
      const response = await simDFA(validateString)
      setResponseMessage(response.result);
      console.log(response.path);    
    } catch(error){
      setResponseMessage(error.message)
    }    
  }

  const handleNFASim = async () => {
    try{
      const response = await simNFA(validateString)
      setResponseMessage(response.result)
      console.log(response.tree);
    } catch(error){
      setResponseMessage(error.message)
    }
  }

  const handleDeleteTransition = async () => {
    console.log(currTransition)
  }

  

    return (
      <div className="flex h-screen flex-col justify-center items-center">
        <div className="flex justify-center">

          <form className="max-w-md mx-auto p-4">
            <div className="relative z-0 w-full mb-5 group">
              <p> States: {states.join(', ')}</p>
              <p> PDAStates: {PDAstates.join(', ')}</p>
            </div>

            <div className="relative z-0 w-full mb-5 group">
              <p> Transitions: {transitions.join(', ')} </p>
            </div>
            
            <div className="relative z-0 w-full mb-5 group">
            <label htmlFor="states" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Select your state</label>
            <select 
              id="states" 
              onChange={(e) => selectState(e.target.value)} 
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={state}
            >
              {(type ? states : PDAstates).map((state, index) => (
                <option key={index} value={state}>{state}</option>
              ))}
            </select>
            </div>
            
            <div className="relative z-0 w-full mb-5 group">
            <label htmlFor="transitions" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Select your transition</label>
              <select id="transitions" onChange={(e) => setCurrTransition(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                {transitions.map((transition, index) => (
                  <option key={index} value={transition}>{transition}</option>
                ))}
              </select>
            </div>
                
              
            <div className="relative z-0 w-full mb-5 group">
            <label htmlFor="type" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Select your transition</label>
              <select id="type" onChange={(e) => setTransType(e.target.value === "Normal")} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option>Normal</option>
                <option>PDA</option>                
                </select>
            </div>        

            <div className="relative z-0 w-full mb-5 group">
            <label htmlFor="type" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Select your state type</label>
              <select id="type" onChange={(e) => setType(e.target.value === "Normal")} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option>Normal</option>
                <option>PDA</option>                
                </select>
            </div>   

            <div className="grid md:grid-cols-2 md:gap-6">
            
            <div className="relative z-0 w-full mb-5 group">
              <label htmlFor="from" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">from</label>
                <select id="from" onChange={(e) => setStateFrom(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  {states.map((state, index) => (
                    <option key={index} value={state}>{state}</option>
                  ))}              
                </select>
              </div>

              <div className="relative z-0 w-full mb-5 group">
              <label htmlFor="to" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">to</label>
                <select id="to" onChange={(e) => setStateTo(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  {states.map((state, index) => (
                    <option key={index} value={state}>{state}</option>
                  ))}                
                  </select>
              </div>              
              
              <div className="relative z-0 w-full mb-5 group">
                <input type="text" id="large-input" maxLength={'1'} onChange={(e) => setInputChar(e.target.value)} placeholder='input char' class="block w-full p-4 text-black-900 border border-white-300 rounded-lg bg-black-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-300 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"></input>
              </div>

              <div className="relative z-0 w-full mb-5 group">
                <input type="text" id="large-input" onChange={(e) => setValidateString(e.target.value)} placeholder='input string to test' class="block w-full p-4 text-black-900 border border-white-300 rounded-lg bg-black-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-300 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"></input>
              </div>

              <div className="relative z-0 w-full mb-5 group">
                <input type="checkbox" onChange={changeAcceptState} id="some_id" />
                <p>{acceptState}</p>
                <label htmlFor="some_id"> Is accept state?</label>
              </div>

            </div>            
          </form>
        </div>
        <div className="flex justify-center mt-4">
          {/* create state */}
          <button
            className={`${effect && "animate-wiggle"} bg-blue-500 p-4 text-white rounded hover:bg-blue-700 hover:shadow-xl m-4`}
            onClick={() => {
              setEffect(true);
              handleCreateState();  // Call this function when the button is clicked
            }}
            onAnimationEnd={() => setEffect(false)}
          >
            Create State
          </button>
  
          {/* Delete State */}
          <button
            className={`${effect && "animate-wiggle"} bg-red-500 p-4 text-white rounded hover:bg-red-700 hover:shadow-xl ml-2 m-4`}
            onClick={() => {
              setEffect(true);
              handleDeleteState();  // Call this function when the button is clicked
            }}
            onAnimationEnd={() => setEffect(false)}
          >
            Delete State
          </button>
          
          {/* create Transition */}
          <button
            className={`${effect && "animate-wiggle"} bg-blue-500 p-4 text-white rounded hover:bg-blue-700 hover:shadow-xl m-4`}
            onClick={() => {
              setEffect(true);
              handleCreateTransition(); // Call this function when the button is clicked
            }}
            onAnimationEnd={() => setEffect(false)}
          >
            Create Transition
          </button>
  
          {/* Delete Transition */}
          <button
            className={`${effect && "animate-wiggle"} bg-red-500 p-4 text-white rounded hover:bg-red-700 hover:shadow-xl ml-2 m-4`}
            onClick={() => {
              setEffect(true);
              handleDeleteTransition();  // Call this function when the button is clicked
            }}
            onAnimationEnd={() => setEffect(false)}
          >
            Delete Transition
          </button>

          <button
            className={`${effect && "animate-wiggle"} bg-green-500 p-4 text-white rounded hover:bg-red-700 hover:shadow-xl ml-2 m-4`}
            onClick={() => {
              setEffect(true);
              handleDFASim();  // Call this function when the button is clicked
            }}
            onAnimationEnd={() => setEffect(false)}
          >
            Simulate
          </button>

          <button
            className={`${effect && "animate-wiggle"} bg-green-500 p-4 text-white rounded hover:bg-red-700 hover:shadow-xl ml-2 m-4`}
            onClick={() => {
              setEffect(true);
              handleNFASim();  // Call this function when the button is clicked
            }}
            onAnimationEnd={() => setEffect(false)}
          >
            SimulateNFA
          </button>


        </div>
        {responseMessage && (
          <p className="mt-4 text-lg text-center">
            {responseMessage}
          </p>
        )}
      </div>
    );
  };

export default Automaton;
