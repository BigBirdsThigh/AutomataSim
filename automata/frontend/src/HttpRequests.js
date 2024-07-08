import Transition from './Transition';

export const createState = async (type, acceptState, states, PDAstates) => {

    

  // Data packet
  const stateData = JSON.stringify({
      Type: type,
      IsAcceptState: acceptState,
      // Name: newStateName
  });

  // HTTP endpoint
  const stateCreate = new XMLHttpRequest();
  stateCreate.open("POST", "https://localhost:7238/api/auto/createState");
  stateCreate.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

  // Promise-based handling for async behavior
  return new Promise((resolve, reject) => {
      stateCreate.onload = () => {
          if (stateCreate.readyState === 4 && stateCreate.status === 200) {
              const newStateName = JSON.parse(stateCreate.responseText);
              resolve({ response: JSON.parse(stateCreate.responseText) });
          } else {
              reject(new Error(`Error Creating State: ${stateCreate.status}`));
          }
      };

      stateCreate.onerror = () => reject(new Error('Network error occurred'));
      stateCreate.send(stateData); // Send data
  });
};



// export const deleteState(type, state)




export const deleteState = async (type, stateName) => {
    const stateData = JSON.stringify({
        Type: type,
        Name: stateName
    });

    // HTTP Endpoint
    const stateDelete = new XMLHttpRequest();
    stateDelete.open("POST", "https://localhost:7238/api/auto/deleteState");
    stateDelete.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

    // Promise-based handling for async behavior
    return new Promise((resolve, reject) => {
        stateDelete.onload = () => {
            if (stateDelete.readyState === 4 && stateDelete.status === 200) {
                resolve(JSON.parse(stateDelete.responseText));
            } else {
                reject(new Error(`Error Deleting State: ${stateDelete.status}`));
            }
        };

        stateDelete.onerror = () => reject(new Error('Network error occurred'));
        stateDelete.send(stateData); // Send data
    });
};

export const simDFA = async (input) => {
  const dfaData = JSON.stringify({
    Inputs: [input]
  })
    // HTTP endpoint
    const simDFA = new XMLHttpRequest();
    simDFA.open("POST", "https://localhost:7238/api/auto/SimDFA");
    simDFA.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
  
    return new Promise((resolve, reject) => {
      simDFA.onload = () => {
        if (simDFA.readyState === 4 && simDFA.status === 200) {
          const response = JSON.parse(simDFA.responseText);          

          resolve(response);
        } else {
          reject(new Error(`Error Creating Transition: ${simDFA.status}`));
        }
      };
      
      simDFA.onerror = () => reject(new Error('Network error occurred'));
      simDFA.send(dfaData);
    });


}

export const simNFA = async (input) => {
  const nfaData = JSON.stringify({
    Inputs: [input]
  })
  const simNFA = new XMLHttpRequest();
  simNFA.open("POST", "https://localhost:7238/api/auto/SimNFA")
  simNFA.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

  return new Promise((resolve, reject) => {
    simNFA.onload = () => {
      if(simNFA.readyState === 4 && simNFA.status === 200){
        const response = JSON.parse(simNFA.responseText);

        resolve(response);        
      }else{
        reject(new Error(`error simulating nfa: ${simNFA.status}`));        
      }
    };
    simNFA.onerror = () => reject(new Error("Network Error Occured"));
    simNFA.send(nfaData);
  });

  
}


export const createTransition = async (type, to, from, push, pop, input) => {
  let transData;

  if (type) {
    transData = JSON.stringify({
      Type: type,
      From: from.replace(/"/g, ''), // remove extra quotes
      Input: replaceWithEpsilon(input),
      To: to.replace(/"/g, ''), // remove extra quotes
      Pop: " ",
      Push: " "
    });
  } else {
    transData = JSON.stringify({
      Type: type,
      From: from.replace(/"/g, ''), // remove extra quotes
      Input: replaceWithEpsilon(input),
      To: to.replace(/"/g, ''), // remove extra quotes
      Pop: pop,
      Push: push
    });
  }

  console.log(transData);

  // HTTP endpoint
  const createTrans = new XMLHttpRequest();
  createTrans.open("POST", "https://localhost:7238/api/auto/createTransition");
  createTrans.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

  return new Promise((resolve, reject) => {
    createTrans.onload = () => {
      if (createTrans.readyState === 4 && createTrans.status === 200) {
        const response = JSON.parse(createTrans.responseText);
        const transition = new Transition(to, from, input);
        resolve({ response, transition });
      } else {
        reject(new Error(`Error Creating Transition: ${createTrans.status}`));
      }
    };

    createTrans.onerror = () => reject(new Error('Network error occurred'));
    createTrans.send(transData);
  });
};



function replaceWithEpsilon(value) {
  return value.trim() === '' ? 'ϵ' : value;
}