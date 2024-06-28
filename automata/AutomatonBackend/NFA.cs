using System;
using System.Collections.Generic;

namespace AutomatonBackend.Controllers;

    public class NFA
    {
        private State startState;

        public NFA(State startState)
        {
            this.startState = startState;
        }

        public bool Simulate(string input)
        {
            HashSet<State> newStates = new HashSet<State>();
            newStates.Add(startState); // Always consider the start state for epsilon transitions

            // loop our input
            foreach (char c in input.ToCharArray())
            {
                HashSet<State> nextStates = new HashSet<State>(); // new set to contain every possible state we could be in from our input char
                foreach (State state in newStates)
                {
                    nextStates.UnionWith(state.GetNextState(c)); // put all transitions state has when given input
                    nextStates.UnionWith(state.GetNextState('ϵ')); // ensures all epsilon transitions are added to our set
                }
                newStates = nextStates;

                if (newStates.Count == 0)
                {
                    return false;
                }
            }

            foreach (State state in newStates)
            {
                if (state.IsAcceptState)
                {
                    return true;
                }
            }

            return false;
        }
    }


