using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
namespace AutomatonBackend.Controllers;


public class NFAStateOperation : IStateOperation{
    private readonly Dictionary<string, State> _states;
    private readonly Dictionary<string, List<Transition>> _transitions;
    private readonly ILogger _logger;
    private readonly Dictionary<string,float[]> Npositions = new Dictionary<string, float[]>();
    private readonly Dictionary<string,string> _colours = new Dictionary<string, string>();

    public NFAStateOperation(Dictionary<string,State> states, Dictionary<string, List<Transition>> transitions, ILogger logger, Dictionary<string, float[]> positions, Dictionary<string, string> colours){
        _states = states;
        _transitions = transitions;
        _logger = logger;
        Npositions = positions;
        _colours = colours;
    }

    public void AddState(string name, Boolean IsAcceptState){
        _states.Add(name, new State(name, IsAcceptState));
        _logger.LogInformation("Added DFA State: {name}", name);
    }

    public void deleteState(StateDelete state){
            if (_states.TryGetValue(state.Name, out var stateToRemove)){ // check if a state exists with our name
                // Remove state from transitions in other _states
                foreach (var kvp in _states)
                {
                    kvp.Value.RemoveStateFromTransitions(stateToRemove);
                }

                // Remove transitions where the state being deleted is involved
                List<string> keysToRemove = new List<string>();
                foreach (var entry in _transitions)
                {
                    string[] parts = entry.Key.Split('-');
                    string from = parts[0];
                    string input = parts[1];
                    string to = parts[2];

                    if (from == stateToRemove.Name || to == stateToRemove.Name) // is their a transition containing this state?
                    {
                        keysToRemove.Add(entry.Key); // flag it for removal
                    }
                }

                foreach (var key in keysToRemove) // loop and remove flagged keys (from our backends transitions dict)
                {
                    _transitions.Remove(key);
                }

                // Remove the state from the _states dictionary
                _states.Remove(stateToRemove.Name);
                _logger.LogInformation("Deleted State: {Name}", stateToRemove.Name);
                
            }
    }

    public void AddTransition(Transition transition){
        
        string key = $"{transition.From}-{transition.Input}-{transition.To}"; // a unique key for our transitions
        _logger.LogInformation("Checking transition key: {key}", key);

        if (!_transitions.ContainsKey(key)) // if the transition does not exist already
        {
            if (_states.TryGetValue(transition.From, out State from) && _states.TryGetValue(transition.To, out State to)) // check these _states exist
            {
                from.AddTransition(transition.Input, to); // add the transition to the state object
                _logger.LogInformation("Added Transition: From={From}, To={To}, Input={Input}", transition.From, transition.To, transition.Input);
                _transitions[key] = new List<Transition> { new Transition { From = from.Name, To = to.Name, Input = transition.Input } };
            }
            else
            {
                
                // return BadRequest(new { Message = "Invalid state names provided." });
            }
        }
        else
        {
            _logger.LogInformation("Transition already exists: From={From}, To={To}, Input={Input}", transition.From, transition.To, transition.Input);
            // return BadRequest(new { Message = "Transition already exists: From={From}, To={To}, Input={Input}", transition.From, transition.To, transition.Input });
        }
    }

    public void DeleteTransition(Transition transition){

        _logger.LogInformation("Received request to delete transition");
        string key = $"{transition.From}-{transition.Input}-{transition.To}";

        if(_transitions.ContainsKey(key)){ // valid transition
                        _transitions.Remove(key); // take key out of transition list

                        _states.TryGetValue(transition.From, out State from); // get from
                        _states.TryGetValue(transition.To, out State to); // get to

                        from.RemoveTransition(transition.Input, to); // remove transition from _states dictionary
                        _logger.LogInformation("Transition From = {from}, To={to}, Input={transition.Input} deleted");
            }
    }

    public void update(Positions positions){
        if (positions.position != null) {
                    if(Npositions.ContainsKey(positions.name)){
                        
                        Npositions.Remove(positions.name);
                    }
                    Npositions.Add(positions.name, positions.position);
                }

                 // Check if the colour property is not an empty string
                if (positions.colour != "")
                {
                    if(_colours.ContainsKey(positions.name)){
                        _colours.Remove(positions.name);
                    }
                    _colours.Add(positions.name, positions.colour);
                    
                }
    }

   public PositionResponse retrieve(string args)
    {
        float[] position = null;
        string colour = "";

        if (Npositions.ContainsKey(args))
        {
            position = Npositions[args];
            _logger.LogInformation("Position for {StateName}: {Position}", args, position);
        }

        if (_colours.ContainsKey(args))
        {
            colour = _colours[args];
        }

        return new PositionResponse
        {
            Position = position,
            Colour = colour
        };
    }

    public MachineResponse<bool, T> simulate<T>(string test){
        if(_states.ContainsKey("q0")){
        
        NFA nfa = new NFA(_states.GetValueOrDefault("q0"));
        

        _logger.LogInformation("Input string to simulate: {test}", test);
        _logger.LogInformation("state {state}", _states.GetValueOrDefault("q0"));
        
        (bool result, StateTreeNode tree) = nfa.Simulate(test);
         return new MachineResponse<bool, T>{
            Result = result,
            Path = (T)(object)tree
        };
    }
     return new MachineResponse<bool, T>{
            Result = false,
            Path = (T)(object)"No Path Found"
        };
    
}
    
}



