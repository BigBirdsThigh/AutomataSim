using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Text.Json;

namespace AutomatonBackend.Controllers;

[ApiController]
[Route("api/auto")]
public class AutomatonController : ControllerBase 
{
       private readonly ILogger<AutomatonController> _logger;
        private static readonly Dictionary<string, State> states = new Dictionary<string, State>();
        private static readonly Dictionary<string, PDAState> PDAStates = new Dictionary<string, PDAState>();
        private static readonly Dictionary<string, List<Transition>> transitions = new Dictionary<string, List<Transition>>();
        private static readonly Dictionary<string, List<PDAState>> PDAtransitions = new Dictionary<string, List<PDAState>>();
        private static int stateCounter = 0;

    public AutomatonController(ILogger<AutomatonController> logger)
    {
        _logger = logger;
    }




   [HttpPost("createState")]
    public IActionResult CreateState([FromBody] StateCreate state)
    {
        _logger.LogInformation("Received request to create state");

        try
        {
            string namePass = "q" + stateCounter++;
            if (state.Type)
            {
                states.Add(namePass, new State(namePass, state.IsAcceptState));
                _logger.LogInformation("Added DFA state: {Name}", namePass);
            }
            else
            {
                PDAStates.Add(namePass, new PDAState(namePass, state.IsAcceptState));
                _logger.LogInformation("Added PDA state: {Name}", namePass);
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
            if (state.Type)
            {
                states.Remove(state.Name);
                _logger.LogInformation("Deleted State: {Name}", state.Name);
                stateCounter--;
            }
            else
            {
                PDAStates.Remove(state.Name);
                _logger.LogInformation("Deleted State: {Name}", state.Name);
                stateCounter--;
            }
            return Ok(new { Message = "State deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting state");
            return StatusCode(500, "Internal Server Error");
        }
    }

[HttpPost("SimDFA")]
public IActionResult SimulateDfa([FromBody] AutomatonData input)
{
    _logger.LogInformation("Received Request to simulate DFA");

    if (states.ContainsKey("q0"))
    {
        DFA dfa = new DFA(states.GetValueOrDefault("q0"));
        // _logger.LogInformation("STATE NAME:", states.GetValueOrDefault("q0").GetNextState('c').First().Name);
        String test = input.Inputs.FirstOrDefault();
        _logger.LogInformation("Input string to simulate: {test}", test);
        _logger.LogInformation("state {state}", states.GetValueOrDefault("q0"));

        bool result = dfa.Simulate(test);

        _logger.LogInformation(result ? "DFA simulation passed" : "DFA simulation failed");
        List<String> path = dfa.GetPath();

        return Ok(new { Result = result, Path = path });
    }
    else
    {
        _logger.LogInformation("No start state");
        return StatusCode(500, "Internal Server Error");
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
        if (transition.Type)
        {
            string key = $"{transition.From}-{transition.Input}-{transition.To}";
            _logger.LogInformation("Checking transition key: {key}", key);

            if (!transitions.ContainsKey(key))
            {
                if (states.TryGetValue(transition.From, out State from) && states.TryGetValue(transition.To, out State to))
                {
                    from.AddTransition(transition.Input, to);
                    _logger.LogInformation("Added Transition: From={From}, To={To}, Input={Input}", transition.From, transition.To, transition.Input);
                    transitions[key] = new List<Transition> { new Transition { From = from.Name, To = to.Name, Input = transition.Input } };
                }
                else
                {
                    
                    return BadRequest(new { Message = "Invalid state names provided." });
                }
            }
            else
            {
                _logger.LogInformation("Transition already exists: From={From}, To={To}, Input={Input}", transition.From, transition.To, transition.Input);
                return BadRequest(new { Message = "Transition already exists: From={From}, To={To}, Input={Input}", transition.From, transition.To, transition.Input });
            }
        }
        else
        {
            string key = $"{transition.From}-{transition.Input}-{transition.To}-{transition.Pop}-{transition.Push}";
            _logger.LogInformation("Checking PDA transition key: {key}", key);

            if (!PDAtransitions.ContainsKey(key))
            {
                if (PDAStates.TryGetValue(transition.From, out PDAState from) && PDAStates.TryGetValue(transition.To, out PDAState to))
                {
                    from.AddTransition(transition.Input, (char)transition.Pop, to, transition.Push);
                    _logger.LogInformation("Added PDA Transition: From={From}, To={To}, Input={Input}, Pop={Pop}, Push={Push}",
                        transition.From, transition.To, transition.Input, transition.Pop, transition.Push);
                    PDAtransitions[key] = new List<PDAState> { from, to };
                }
                else
                {
                    _logger.LogWarning("Invalid PDA state names provided: From={From}, To={To}", transition.From, transition.To);
                    
                    return BadRequest(new { Message = "Invalid PDA state names provided." });
                }
            }
            else
            {
                _logger.LogInformation("PDA Transition already exists: From={From}, To={To}, Input={Input}, Pop={Pop}, Push={Push}",
                    transition.From, transition.To, transition.Input, transition.Pop, transition.Push);
            }
        }

        

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
        if(transition.Type){
            if(transitions.ContainsKey(key)){ // valid transition
                transitions.Remove(key); // take key out of transition list

                states.TryGetValue(transition.From, out State from); // get from
                states.TryGetValue(transition.To, out State to); // get to

                from.RemoveTransition(transition.Input, to); // remove transition from states dictionary
                _logger.LogInformation("Transition From = {from}, To={to}, Input={transition.Input} deleted");
                return Ok(new {Message = "transition succesfully removed"});
            }
        }else{
            if(PDAtransitions.ContainsKey(key)){ // valid transition
                PDAtransitions.Remove(key); // take key out of transition list

                PDAStates.TryGetValue(transition.From, out PDAState from); // get from
                PDAStates.TryGetValue(transition.To, out PDAState to); // get to

                // from.RemoveTransition(transition.Input, to); // remove transition from states dictionary
                _logger.LogInformation("Transition From = {from}, To={to}, Input={transition.Input} deleted");
                return Ok(new {Message = "transition succesfully removed"});
        }
        
    }
    return Ok(new {Message = "transition succesfully removed"});


    } catch(Exception ex){
        _logger.LogError(ex, "Error deleting transition");
        return StatusCode(500, "Internal Server Error");
    }

}


    }




