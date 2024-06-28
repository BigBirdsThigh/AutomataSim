using System;
using System.Collections.Generic;

namespace AutomatonBackend.Controllers;

    public class DFA
    {
        private State startState;

        public DFA(State startState)
        {
            this.startState = startState;            
        }

        public bool Simulate(string input)
        {
            State currState = startState;

            foreach (char c in input)
            {                
                HashSet<State> nextStates = currState.GetNextState(c);

                // Check if there are any valid next states
                if (nextStates.Count == 0)
                {
                    return false;
                }

                // Get the first valid next state (assuming DFA should only have one next state per input)
                State nextState = nextStates.FirstOrDefault();  // This will be null if nextStates is empty

                if (nextState == null)
                {
                    return false;  // No valid transition found
                }

                currState = nextState;  // Move to the next state
            }

            // Check if the current state at the end of input is an accepting state
            return currState.IsAcceptState;
        }

    }


