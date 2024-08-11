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

        public (bool, StateTreeNode) Simulate(string input)
        {

            StateTreeNode root = new StateTreeNode(startState, 0); // Root of the state tree
            List<StateTreeNode> currentNodes = new List<StateTreeNode> { root }; // Current nodes at each depth
            HashSet<State> newStates = new HashSet<State>();
            newStates.Add(startState); // Always consider the start state for epsilon transitions

            // loop our input
           // Loop through input
            for (int i = 0; i < input.Length; i++)
            {
                char c = input[i];
                HashSet<State> nextStates = new HashSet<State>(); // New set to contain every possible state we could be in from our input char
                List<StateTreeNode> nextNodes = new List<StateTreeNode>(); // List of next nodes for the tree

                foreach (StateTreeNode node in currentNodes)
                {
                    HashSet<State> transitions = node.State.GetNextState(c);
                    transitions.UnionWith(node.State.GetNextState('ϵ')); // Ensure all epsilon transitions are added to our set

                    foreach (State state in transitions)
                    {
                        StateTreeNode childNode = new StateTreeNode(state, i + 1); // Create a child node for each transition
                        node.AddChild(childNode); // Add the child node to the current node
                        nextStates.Add(state);
                        nextNodes.Add(childNode);
                    }
                }

                newStates = nextStates;
                currentNodes = nextNodes;

                if (newStates.Count == 0)
                {
                    return (false, root); // Return the tree even if the simulation fails
                }
            }

            foreach (State state in newStates)
            {
                if (state.IsAcceptState)
                {
                    return (true, root); // Return the tree along with the result
                }
            }

            return (false, root);
        }
    }


