using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace AutomatonBackend.Controllers;

[ApiController]
[Route("api/auto")]
public class AutomatonController : ControllerBase 
{
    private readonly ILogger<AutomatonController> _logger;        
    private static readonly Dictionary<String, State> states = new Dictionary<String, State>();
    private static readonly Dictionary<String, PDAState> PDAStates = new Dictionary<String, PDAState>();

    public AutomatonController(ILogger<AutomatonController> logger)
    {
        _logger = logger;
    }

[HttpPost("createAutomaton")]
public IActionResult SimulateAutomaton([FromBody] AutomatonData automatonData)
{
    var results = new List<bool>();
    foreach (var input in automatonData.Inputs){
        var isAccepted = Simulate(automatonData, input);
        results.Add(isAccepted);
    }
    return Ok(new {
        Inputs = automatonData.Inputs,
        Results = results
    });
}

private bool Simulate(AutomatonData automatonData, String input){
    
    switch(automatonData.Type){
                
        case 0: // DFA
            DFA dfa = new DFA(automatonData.startState);
            return dfa.Simulate(input);            

        case 1: // NFA
            NFA nfa = new NFA(automatonData.startState);
            return nfa.Simulate(input);
            

        default: // PDA
            PDA pda = new PDA(automatonData.pdaStartState, '#');
            return pda.Simulate(input);        
    }
}

[HttpPost("createState")]
public IActionResult CreateState([FromBody] StateData state)
{
    _logger.LogInformation("Received request to create state");

    try
    {
        if (state.Type)
        {
            // DFA state
            int stateNum = states.Count;
            string newStateName = "q" + stateNum;
            states.Add(newStateName, new State(newStateName, state.IsAcceptState));
            _logger.LogInformation("Added DFA state: {Name}", newStateName);
        }
        else
        {
            // PDA state
            int stateNum = PDAStates.Count;
            string newStateName = "q" + stateNum;
            PDAStates.Add(newStateName, new PDAState(newStateName, state.IsAcceptState));
            _logger.LogInformation("Added PDA state: {Name}", newStateName);
        }

        return Ok(new { Message = "State added successfully" });
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error creating state");
        return StatusCode(500, "Internal Server Error");
    }
}


[HttpPost("deleteState")]
public IActionResult DeleteState([FromBody] StateData state){
    
    _logger.LogInformation("Received request to delete state");
    
    try {
        if(state.Type){
            states.Remove(state.Name);
            _logger.LogInformation("Deleted State: {Name}", state.Name);
        } else{
            PDAStates.Remove(state.Name);
            _logger.LogInformation("Deleted State: {Name}", state.Name);
        } 
        return Ok(new { Message = "State deleted successfully" });
        }
    catch(Exception ex){
        _logger.LogError(ex, "Error deleting state");
        return StatusCode(500, "Internal Server Error");
    }
        
}




[HttpPost("createTransition")]
public IActionResult CreateTransition([FromBody] Transition transition)
{
    if(transition.Type){
        State from = states.GetValueOrDefault(transition.From);
        State to = states.GetValueOrDefault(transition.To);
        from.AddTransition(transition.Input, to);
    }
    else{
        PDAState from = PDAStates.GetValueOrDefault(transition.From);
        PDAState to = PDAStates.GetValueOrDefault(transition.To);
        from.AddTransition(transition.Input, transition.Pop, to, transition.Push);
    }

    return Ok(new { Message = "Transition added successfully" });
}


}

