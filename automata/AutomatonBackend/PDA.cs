using System;
using System.Collections.Generic;
using System.Linq;
namespace AutomatonBackend.Controllers;

public class PDA
{
    private PDAState startState;
    private Stack<char> stack;
    private char startSymbol;

    public PDA(PDAState startState, char startSymbol)
    {
        this.startState = startState;
        this.startSymbol = startSymbol;
        stack = new Stack<char>();
        stack.Push(startSymbol);
    }

    public List<List<PDAState>> GenerateAllPaths(PDAState initialState, string input)
    {
        var allPaths = new List<List<PDAState>>();
        GeneratePaths(initialState, input, 0, new List<PDAState>(), allPaths);
        return allPaths;
    }

    private void GeneratePaths(PDAState currState, string input, int index, List<PDAState> currPath, List<List<PDAState>> allPaths)
    {
        currPath.Add(currState);

        if (index == input.Length)
        {
            if (stack.Count == 0 || stack.Peek() == startSymbol) // if the bottom of our stack is our start symbol or empty and our input is finished
            {
                allPaths.Add(new List<PDAState>(currPath));
                Console.WriteLine("Valid Path found");
            }
            currPath.RemoveAt(currPath.Count - 1);
            return;
        }

        char currInput = input[index];
        var transitions = currState.GetTransitions(currInput, CheckTop());

        foreach (var transition in transitions)
        {
            string transitionOutput = transition.Item2;
            PDAState nextState = transition.Item1;

            char transitionPop = currState.GetPopSymbolForTransition(currInput, CheckTop());
            bool popped = false;

            if (transitionPop != 'ε' && stack.Count > 0 && stack.Peek() == transitionPop)
            {
                stack.Pop();
                popped = true;
            }

            if (transitionOutput != "ε")
            {
                PushTo(transitionOutput);
            }

            GeneratePaths(nextState, input, index + 1, currPath, allPaths);

            if (transitionOutput != "ε")
            {
                for (int i = 0; i < transitionOutput.Length; i++)
                {
                    if (stack.Count > 0)
                    {
                        stack.Pop();
                    }
                }
            }

            if (popped)
            {
                stack.Push(transitionPop);
            }
        }

        currPath.RemoveAt(currPath.Count - 1);
    }

    public bool Simulate(String input){
        
        List<List<PDAState>> list = GenerateAllPaths(startState, input);

        if(list.Count() >= 1){
            foreach (List<PDAState> path in list){
                foreach (PDAState state in path){
                    Console.WriteLine(state.GetName());
                }
            }
        }

        return false;
    }

    public char CheckTop()
    {
        return stack.Peek();
    }

    public void PushTo(string input)
    {
        foreach (char c in input.Reverse())
        {
            stack.Push(c);
        }
    }
}
