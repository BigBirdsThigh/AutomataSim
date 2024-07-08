import React, { useState, useEffect } from 'react';
import { createState, deleteState, createTransition, simDFA, simNFA } from './HttpRequests'
import Transition from './Transition';
import './tailwind.css';

import { Stage, Layer, Rect, Circle, Arrow } from 'react-konva';


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
  const[pos, setPos] = useState([])  


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
  }; //1st commit

  


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
     <></> 
    )    
  };

export default Automaton;
