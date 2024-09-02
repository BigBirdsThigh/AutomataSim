using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;

namespace AutomatonBackend.Controllers;

[ApiController]
[Route("api/auto")]
public class AutomatonController : ControllerBase 
{
       private readonly ILogger<AutomatonController> _logger;
        private static readonly Dictionary<string, State> states = new Dictionary<string, State>();
        private static readonly Dictionary<string, State> NFAStates = new Dictionary<string, State>();
        private static readonly Dictionary<string, PDAState> PDAStates = new Dictionary<string, PDAState>();

        private static readonly Dictionary<string, List<Transition>> transitions = new Dictionary<string, List<Transition>>();
        private static readonly Dictionary<string, List<PDAState>> PDAtransitions = new Dictionary<string, List<PDAState>>();
        private static readonly Dictionary<string, List<Transition>> NFAtransitions = new Dictionary<string, List<Transition>>();

        private static readonly Dictionary<string,float[]> DFAPositions = new Dictionary<string, float[]>();
        private static readonly Dictionary<string,string> DFAColours = new Dictionary<string, string>();
        private static readonly Dictionary<string,float[]> NFAPositions = new Dictionary<string, float[]>();
        private static readonly Dictionary<string,string> NFAColours = new Dictionary<string, string>();
        private static readonly Dictionary<string,float[]> PDAPositions = new Dictionary<string, float[]>();
        private static readonly Dictionary<string,string> PDAColours = new Dictionary<string, string>();
        

        private readonly Dictionary<int, IStateOperation> _stateOperations;

        private static int type=1;

        private static int stateCounter = 0;
        private static int PDAstateCounter = 0;
        private static int NFAstateCounter = 0;

        private static readonly object _lock = new object();

    public AutomatonController(ILogger<AutomatonController> logger)
    {
        _logger = logger;        
        // Initialize the strategy dictionary
        _stateOperations = new Dictionary<int, IStateOperation>
        {
            { 1, new DFAStateOperation(states, transitions, _logger, DFAPositions, DFAColours) }, // Type 1 for DFA
            // { 2, new PDAStateOperation(PDAStates, PDAtransitions, _logger) }, // Type 2 for PDA
            { 3, new NFAStateOperation(NFAStates, NFAtransitions, _logger, NFAPositions, NFAColours) } // Type 3 for NFA
        };        
        
    }
    


    [HttpPost("update")]
    public IActionResult update([FromBody] Positions positions){
        _logger.LogInformation("Received request to update positions");
        try {
            lock (_lock) {
            if (_stateOperations.TryGetValue(type, out var operation))
                {
                    operation.update(positions);
                }

            }           

            return Ok(new {message = "ok"});
        }catch(Exception ex){
            _logger.LogError(ex, "Error updating");
            return StatusCode(500, "Internal server error");
        }
    }

   
    [HttpGet("retrieve")]
    public IActionResult retrieve([FromQuery] string args)
    {
        _logger.LogInformation("Received request to retrieve positions");

        try
        {
            if (_stateOperations.TryGetValue(type, out var operation))
            {
                // Use the retrieve method from the appropriate operation class
                PositionResponse response = operation.retrieve(args); // Ensure retrieve returns PositionResponse

                // Return the response object containing position and colour
                return Ok(response);
            }
            else
            {
                _logger.LogWarning("No operation found for type: {Type}", type);
                return NotFound(new { Message = "Operation type not found." });
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving positions");
            return StatusCode(500, "Internal server error");
        }

        
    }




    [HttpPost("setType")]
public IActionResult SetType([FromBody] int Type)
{
    lock (_lock)
    {
        _logger.LogInformation("Received request to set automaton type");

        try
        {
            if (Type < 1 || Type > 3)
            {
                return BadRequest("Invalid type specified. Please use an integer between 1 and 3.");
            }

            type = Type;
            _logger.LogInformation("Set automaton type to: {Type}", type);

            return Ok(new { Message = $"Automaton type set to {type}" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error setting automaton type");
            return StatusCode(500, "Internal server error");
        }
    }
}



    [HttpGet("refresh")]
    public IActionResult refresh(){
        _logger.LogInformation("Received request to refresh with type = " + type);
        
            // ToDO: in future return differing sets of states and transitions based on current type
            if(type == 1){
                try{
                    return Ok(new { States = states.Keys.ToList(), Transitions = transitions.Keys.ToList() });
                }catch (Exception ex){
                    _logger.LogError(ex, "Error refreshing");
                    return StatusCode(500, "Internal server error");
                }
                
            }else if(type == 3){
                try{
                    return Ok(new { States = NFAStates.Keys.ToList(), Transitions = NFAtransitions.Keys.ToList() });
                }
                catch (Exception ex){
                    _logger.LogError(ex, "Error refreshing");
                    return StatusCode(500, "Internal server error");
                }
                
            }

            else{
                return StatusCode(500, "Internal server error");
            }
            
        
    }


   [HttpPost("createState")]
    public IActionResult CreateState([FromBody] StateCreate state)
    {
        _logger.LogInformation("Received request to create state");

        try
        {

            string namePass = "";
            _logger.LogInformation("NFA COUNTER: " + NFAstateCounter);
            if(type == 1){                
                namePass = "q" + stateCounter; // name of state e.g q1, q2, ...
                stateCounter++;
            }
            if(type == 2){                
                namePass = "q" + PDAstateCounter; // name of state e.g q1, q2, ...
                PDAstateCounter++;
            }
            if(type == 3){                
                namePass = "q" + NFAstateCounter; // name of state e.g q1, q2, ...
                NFAstateCounter++;
                }
            _logger.LogInformation("Type: " + type);
            // if (state.Type)
            // {
            //     states.Add(namePass, new State(namePass, state.IsAcceptState)); // create a new state and map it to a name
            //     _logger.LogInformation("Added DFA state: {Name}", namePass);
            // }
            // else
            // {
            //     PDAStates.Add(namePass, new PDAState(namePass, state.IsAcceptState));
            //     _logger.LogInformation("Added PDA state: {Name}", namePass);
            // }

             if (_stateOperations.TryGetValue(type, out var operation))
            {
                operation.AddState(namePass, state.IsAcceptState);
            }

             

            return Ok(new { Response = namePass });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating state");
            
            return StatusCode(500, "Internal Server Error");
        }
    }

[HttpPost("deleteState")]
public IActionResult DeleteState([FromBody] StateDelete state)
{
    _logger.LogInformation("Received request to delete state");

    try
    {

         if (_stateOperations.TryGetValue(type, out var operation))
            {
                operation.deleteState(state);

                if(type == 1){stateCounter--;}
                if(type == 2){PDAstateCounter--;}
                if(type == 3){NFAstateCounter--;}
                
            }
        // if (state.Type)
        // {
        //     if (states.TryGetValue(state.Name, out var stateToRemove)) // check if a state exists with our name
        //     {
        //         // Remove state from transitions in other states
        //         foreach (var kvp in states)
        //         {
        //             kvp.Value.RemoveStateFromTransitions(stateToRemove);
        //         }

        //         // Remove transitions where the state being deleted is involved
        //         List<string> keysToRemove = new List<string>();
        //         foreach (var entry in transitions)
        //         {
        //             string[] parts = entry.Key.Split('-');
        //             string from = parts[0];
        //             string input = parts[1];
        //             string to = parts[2];

        //             if (from == stateToRemove.Name || to == stateToRemove.Name) // is their a transition containing this state?
        //             {
        //                 keysToRemove.Add(entry.Key); // flag it for removal
        //             }
        //         }

        //         foreach (var key in keysToRemove) // loop and remove flagged keys (from our backends transitions dict)
        //         {
        //             transitions.Remove(key);
        //         }

        //         // Remove the state from the states dictionary
        //         states.Remove(stateToRemove.Name);
        //         _logger.LogInformation("Deleted State: {Name}", stateToRemove.Name);
        //         stateCounter--;
        //     }
        //     else
        //     {
        //         _logger.LogInformation("State {Name} not found", state.Name);
        //         return NotFound(new { Message = "State not found" });
        //     }
        // }
        // else
        // {
        //     if (PDAStates.TryGetValue(state.Name, out var stateToRemove))
        //     {
        //         // Remove state from transitions in other states
        //         foreach (var kvp in PDAStates)
        //         {
        //             // kvp.Value.RemoveStateFromTransitions(stateToRemove);
        //         }

        //         // Remove transitions where the state being deleted is involved
        //         List<string> keysToRemove = new List<string>();
        //         foreach (var entry in PDAtransitions)
        //         {
        //             string[] parts = entry.Key.Split('-');
        //             string from = parts[0];
        //             string input = parts[1];
        //             string to = parts[2];

        //             if (from == stateToRemove.Name || to == stateToRemove.Name)
        //             {
        //                 keysToRemove.Add(entry.Key);
        //             }
        //         }

        //         foreach (var key in keysToRemove)
        //         {
        //             PDAtransitions.Remove(key);
        //         }

        //         // Remove the state from the PDAStates dictionary
        //         PDAStates.Remove(stateToRemove.Name);
        //         _logger.LogInformation("Deleted State: {Name}", stateToRemove.Name);
        //         stateCounter--;
        //     }
        //     else
        //     {
        //         _logger.LogInformation("State {Name} not found", state.Name);
        //         return NotFound(new { Message = "State not found" });
        //     }
        // }

        return Ok(new { Message = "State deleted successfully" });
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error deleting state");
        return StatusCode(500, "Internal Server Error");
    }
}


[HttpPost("SimDFA")]
public IActionResult Simulate([FromBody] AutomatonData data)
{
    // _logger.LogInformation("Received simulation request for input: {Input}", test);

    try
    {
        string test = data.Inputs.FirstOrDefault();
        // Assuming `type` determines if it's a DFA or NFA operation
        if (_stateOperations.TryGetValue(type, out var operation))
        {
            // For DFA, we expect the Path to be a List<string>
            if (type == 1)
            {
                MachineResponse<bool, List<string>> response = operation.simulate<List<string>>(test);
                return Ok(response);
            }
            // For NFA, we expect the Path to be a StateTreeNode
            else if (type == 3)
            {
                MachineResponse<bool, StateTreeNode> response = operation.simulate<StateTreeNode>(test);
                return Ok(response);
            }
            else
            {
                _logger.LogWarning("Unknown operation type: {Type}", type);
                return BadRequest(new { Message = "Unsupported automaton type." });
            }
        }
        else
        {
            _logger.LogWarning("No operation found for type: {Type}", type);
            return NotFound(new { Message = "Operation type not found." });
        }
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error during simulation");
        return StatusCode(500, "Internal server error");
    }
}


[HttpPost("SimNFA")]
public IActionResult SimNFA([FromBody] AutomatonData input){
    _logger.LogInformation("Received Request to simulate DFA");

    if(states.ContainsKey("q0")){
        
        NFA nfa = new NFA(states.GetValueOrDefault("q0"));
        String test = input.Inputs.FirstOrDefault();

        _logger.LogInformation("Input string to simulate: {test}", test);
        _logger.LogInformation("state {state}", states.GetValueOrDefault("q0"));
        
        (bool result, StateTreeNode tree) = nfa.Simulate(test);

        return Ok(new { Result = result, Tree = tree });                

    }
    else{
            _logger.LogInformation("No start state");
            return StatusCode(500, "Internal Server Error");
        }
}




 [HttpPost("createTransition")]
public IActionResult CreateTransition([FromBody] Transition transition)
{
    _logger.LogInformation("Received request to create transition");

    try
    {
        
        if(_stateOperations.TryGetValue(type, out var operation)){
            operation.AddTransition(transition);
        }
        
        
        // else
        // {
        //     string key = $"{transition.From}-{transition.Input}-{transition.To}-{transition.Pop}-{transition.Push}";
        //     _logger.LogInformation("Checking PDA transition key: {key}", key);

        //     if (!PDAtransitions.ContainsKey(key))
        //     {
        //         if (PDAStates.TryGetValue(transition.From, out PDAState from) && PDAStates.TryGetValue(transition.To, out PDAState to))
        //         {
        //             from.AddTransition(transition.Input, (char)transition.Pop, to, transition.Push);
        //             _logger.LogInformation("Added PDA Transition: From={From}, To={To}, Input={Input}, Pop={Pop}, Push={Push}",
        //                 transition.From, transition.To, transition.Input, transition.Pop, transition.Push);
        //             PDAtransitions[key] = new List<PDAState> { from, to };
        //         }
        //         else
        //         {
        //             _logger.LogWarning("Invalid PDA state names provided: From={From}, To={To}", transition.From, transition.To);
                    
        //             return BadRequest(new { Message = "Invalid PDA state names provided." });
        //         }
        //     }
        //     else
        //     {
        //         _logger.LogInformation("PDA Transition already exists: From={From}, To={To}, Input={Input}, Pop={Pop}, Push={Push}",
        //             transition.From, transition.To, transition.Input, transition.Pop, transition.Push);
        //     }
        

        

        return Ok(new { Message = "Transition added successfully" });
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error creating transition");
        return StatusCode(500, "Internal Server Error");
    }
}

[HttpPost("deleteTransition")]
public IActionResult DeleteTransition([FromBody] Transition transition){
    _logger.LogInformation("Received request to delete transition");
    string key = $"{transition.From}-{transition.Input}-{transition.To}";

    try{

        if(_stateOperations.TryGetValue(type, out var operation)){
                operation.AddTransition(transition);
           }
    //     else{
    //         if(PDAtransitions.ContainsKey(key)){ // valid transition
    //             PDAtransitions.Remove(key); // take key out of transition list

    //             PDAStates.TryGetValue(transition.From, out PDAState from); // get from
    //             PDAStates.TryGetValue(transition.To, out PDAState to); // get to

    //             // from.RemoveTransition(transition.Input, to); // remove transition from states dictionary
    //             _logger.LogInformation("Transition From = {from}, To={to}, Input={transition.Input} deleted");
    //             return Ok(new {Message = "transition succesfully removed"});
    //     }
        
    // }
    return Ok(new {Message = "transition succesfully removed"});


    } catch(Exception ex){
        _logger.LogError(ex, "Error deleting transition");
        return StatusCode(500, "Internal Server Error");
    }

    }


}




