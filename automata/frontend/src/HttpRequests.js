import Transition from './Transition';

const apiUrl = "http://localhost:5027/api/auto"; // Using HTTP for simplicity

export const createState = async (type, acceptState) => {
  const stateData = JSON.stringify({
      Type: type,
      IsAcceptState: acceptState,
  });

  console.log("Sending state data:", stateData);

  const stateCreate = new XMLHttpRequest();
  stateCreate.open("POST", `${apiUrl}/createState`);
  stateCreate.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

  return new Promise((resolve, reject) => {
      stateCreate.onload = () => {
          console.log("State create request completed with status:", stateCreate.status);
          if (stateCreate.readyState === 4 && stateCreate.status === 200) {
              console.log("State created successfully:", stateCreate.responseText);
              resolve({ response: JSON.parse(stateCreate.responseText) });
          } else {
              console.error("Error Creating State:", stateCreate.status, stateCreate.responseText);
              reject(new Error(`Error Creating State: ${stateCreate.status}`));
          }
      };

      stateCreate.onerror = () => {
          console.error('Network error occurred');
          reject(new Error('Network error occurred'));
      };
      stateCreate.send(stateData);
  });
};


export const refresh = async () => {
    const refreshRequest = new XMLHttpRequest();
    refreshRequest.open("GET", `${apiUrl}/refresh`);
    refreshRequest.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

    return new Promise((resolve, reject) => {
      refreshRequest.onload = () => {
        if(refreshRequest.readyState === 4 && refreshRequest.status === 200){
          resolve(JSON.parse(refreshRequest.responseText))          
        }else{
          reject(new Error(`Error Connecting: ${refreshRequest.status}`))
        }
      }
      refreshRequest.onerror = () => reject(new Error(`Network error occured`))
      refreshRequest.send("")
    })
}


export const updatePositions = async (name, position, colour) => {
  const updateRequest = new XMLHttpRequest();
  updateRequest.open("POST", `${apiUrl}/update`);
  updateRequest.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

  const request = JSON.stringify({
    name: name,
    position: position || [],
    colour: colour || ""
  })

  return new Promise((resolve, reject) => {
    updateRequest.onload = () => {
      if(updateRequest.readyState === 4 && updateRequest.status === 200 ){
        resolve(JSON.parse(updateRequest.responseText))
      }else{
        reject(new Error(`Error connection: ${updateRequest.status}`))
      }
    }
    console.log(position)
    updateRequest.onerror = () => reject(new Error("Network Error Occurred"))

    updateRequest.send(request)
  })

}

export const changeType = async (type) => {
  const change = new XMLHttpRequest();
  change.open("POST", `${apiUrl}/setType`)
  change.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

  const body = JSON.stringify(type);

  return new Promise((resolve, reject) =>{
    change.onload = () => {
      if(change.readyState === 4 & change.status === 200){
        resolve(JSON.parse(change.responseText))
      }else{
        reject(new Error(`Error changing type ${change.status}`))
      }
    }
    change.onerror = () => reject(new Error("Network Error Occured"))
    change.send(parseInt(type));
  })
}

  export const retrievePositions = async (state) => {
    const retrieve = new XMLHttpRequest();
    retrieve.open("GET", `${apiUrl}/retrieve?args=${state}`)
    retrieve.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    
    return new Promise((resolve, reject) => {
      retrieve.onload = () => {
        if(retrieve.readyState === 4 && retrieve.status === 200){
          resolve(JSON.parse(retrieve.responseText))
        }else{
          reject(new Error(`Error retrieving position ${retrieve.status}`))
        }
      }
      retrieve.onerror =() => reject(new Error(`Network error occured`))
      retrieve.send("")
    }
    
  )
  }

export const deleteState = async (type, stateName) => {
    const stateData = JSON.stringify({
        Type: true,
        Name: stateName
    });

    // HTTP Endpoint
    const stateDelete = new XMLHttpRequest();
    stateDelete.open("POST", `${apiUrl}/deleteState`);
    stateDelete.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    console.log("Attempting Deletion: " + stateName)
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
  });

  const simDFA = new XMLHttpRequest();
  simDFA.open("POST", `${apiUrl}/SimDFA`);
  simDFA.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

  return new Promise((resolve, reject) => {
      simDFA.onload = () => {
          if (simDFA.readyState === 4 && simDFA.status === 200) {
              const response = JSON.parse(simDFA.responseText);
              resolve(response);
          } else {
              reject(new Error(`Error Simulating DFA: ${simDFA.status}`));
          }
      };

      simDFA.onerror = () => reject(new Error('Network error occurred'));
      simDFA.send(dfaData);
  });
};

export const simNFA = async (input) => {
  const nfaData = JSON.stringify({
    Inputs: [input]
  });

  const simNFA = new XMLHttpRequest();
  simNFA.open("POST", `${apiUrl}/SimNFA`);
  simNFA.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

  return new Promise((resolve, reject) => {
      simNFA.onload = () => {
          if (simNFA.readyState === 4 && simNFA.status === 200) {
              const response = JSON.parse(simNFA.responseText);
              resolve(response);
          } else {
              reject(new Error(`Error Simulating NFA: ${simNFA.status}`));
          }
      };

      simNFA.onerror = () => reject(new Error('Network error occurred'));
      simNFA.send(nfaData);
  });
};

export const createTransition = async (type, to, from, push, pop, input) => {
  let transData;

  if (type) {
    transData = JSON.stringify({
      Type: true,
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
  createTrans.open("POST", `${apiUrl}/createTransition`);
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



export const deleteTransition = async(type, to, from, push, pop, input) => {
  let transData;

  if(type){
    transData = JSON.stringify({
      Type: type,
      From: from.replace(/"/g, ''), // remove extra quotes
      Input: replaceWithEpsilon(input),
      To: to.replace(/"/g, ''), // remove extra quotes
      Pop: " ",
      Push: " "
    })
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

  // HTTP endpoint
  const deleteTrans = new XMLHttpRequest();
  deleteTrans.open("POST", `${apiUrl}/deleteTransition`);
  deleteTrans.setRequestHeader("Content-Type", "application/json; charset=UTF-8");  

  return new Promise((resolve, reject) => {
    deleteTrans.onload = () => {
      if(deleteTrans.readyState === 4 && deleteTrans.status === 200){
        const response = JSON.parse(deleteTrans.responseText);
        const transition = new Transition(to, from, input);
        resolve({ response, transition });
      }else{
        reject(new Error(`Error deleting transition ${deleteTrans.status}`));
      }

      deleteTrans.onerror = () => {reject(new Error(`Network error occurred`))}
        deleteTrans.send(transData);
      
    }
  })

}

function replaceWithEpsilon(value) {
  return value.trim() === '' ? 'ϵ' : value;
}
