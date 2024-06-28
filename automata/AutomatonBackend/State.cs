using System.Collections.Generic;

namespace AutomatonBackend.Controllers;


    public class State
    {
        public string Name { get; private set; }
        public bool IsAcceptState { get; private set; }
        private Dictionary<char, HashSet<State>> transitions;

        public State(string name, bool isAcceptState)
        {
            Name = name;
            IsAcceptState = isAcceptState;
            this.transitions = new Dictionary<char, HashSet<State>>();
        }

        public void AddTransition(char input, State state)
        {
            if (!this.transitions.ContainsKey(input))
            {
                this.transitions[input] = new HashSet<State>();
            }
            this.transitions[input].Add(state);
        }

        public void RemoveTransition(char input, State state)
        {
            if (this.transitions.ContainsKey(input))
            {
                this.transitions[input].Remove(state);
            }
        }

        public HashSet<State> GetNextState(char input)
        {            
            return this.transitions.GetValueOrDefault(input, new HashSet<State>());
        }

        // public bool IsAcceptState()
        // {
        //     return this.isAcceptState;
        // }
    }


