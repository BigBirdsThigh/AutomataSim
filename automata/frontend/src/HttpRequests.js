// api.js

export const createState = async (type, acceptState, states, PDAstates) => {
    const newStateName = type ? "q" + states.length : "q" + PDAstates.length;
  
    // Data packet
    const stateData = JSON.stringify({
      Type: type,
      IsAcceptState: acceptState,
      Name: newStateName
    });
  
    // HTTP endpoint
    const stateCreate = new XMLHttpRequest();
    stateCreate.open("POST", "https://localhost:7238/api/auto/createState");
    stateCreate.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
  
    // Promise-based handling for async behavior
    return new Promise((resolve, reject) => {
      stateCreate.onload = () => {
        if (stateCreate.readyState === 4 && stateCreate.status === 200) {
          resolve({ response: JSON.parse(stateCreate.responseText), newStateName });
        } else {
          reject(new Error(`Error Creating State: ${stateCreate.status}`));
        }
      };
  
      stateCreate.send(stateData); // Send data
    });
  };
  
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
  
      stateDelete.send(stateData); // Send data
    });
  };
  