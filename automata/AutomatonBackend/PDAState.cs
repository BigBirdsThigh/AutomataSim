using System;
using System.Collections.Generic;
using System.Linq;
// namespace automata.sim.automata;

public class PDAState
{
    public string Name { get; private set; }
    public bool IsAcceptState { get; private set; }
    private Dictionary<(char, char), (PDAState, string)> transitions;

    public PDAState(string name, bool isAcceptState)
    {
        Name = name;
        IsAcceptState = isAcceptState;
        transitions = new Dictionary<(char, char), (PDAState, string)>();
    }

    public void AddTransition(char input, char pop, PDAState newState, string push)
    {
        // Normalize inputs for transitions
        char normalizedInput = input == ' ' ? 'ε' : input;
        char normalizedPop = pop == ' ' ? 'ε' : pop;
        string normalizedPush = string.IsNullOrEmpty(push?.Trim()) ? "ε" : push;

        var key = (normalizedInput, normalizedPop);
        var value = (newState, normalizedPush);

        transitions[key] = value;
    }

    public String GetName(){
        return Name;
    }

    public char GetPopSymbolForTransition(char input, char topOfStack)
    {
        char normalizedTop = topOfStack == ' ' ? 'ε' : topOfStack;
        return transitions.Where(entry => entry.Key.Item1 == input && entry.Key.Item2 == normalizedTop)
                          .Select(entry => entry.Key.Item2) // Get the pop symbol
                          .FirstOrDefault('ε'); // Default to 'ε' if no matching transition found
    }

    public IEnumerable<(PDAState, string)> GetTransitions(char input, char pop)
    {
        char normalizedInput = input == ' ' ? 'ε' : input;
        char normalizedPop = pop == ' ' ? 'ε' : pop;

        return transitions.Where(entry => (entry.Key.Item1 == normalizedInput || entry.Key.Item1 == 'ε') &&
                                          (entry.Key.Item2 == normalizedPop || entry.Key.Item2 == 'ε'))
                          .Select(entry => entry.Value);
    }

    public void PrintTransitions()
    {
        foreach (var entry in transitions)
        {
            Console.WriteLine($"Transition from state {Name}: on input {entry.Key.Item1} and pop {entry.Key.Item2}, go to state {entry.Value.Item1.Name} and push {entry.Value.Item2}");
        }
    }
}
