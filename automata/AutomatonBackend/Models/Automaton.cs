    using AutomatonBackend.Controllers;

    namespace AutomatonBackend;

    public class AutomatonData
    {
        public State startState { get; set; }
        public PDAState pdaStartState { get; set; }
        public int Type { get; set; } // 0 = DFA, 1 = NFA, 2 = PDA
        public List<State> States { get; set; }
        public List<PDAState> pdaStates { get; set; }
        // public List<Transition> Transitions { get; set; }
        public List<string> Inputs { get; set; }
    }

    public class StateData {
        
        public bool Type { get; set; } // true = default, false = PDA
        public bool IsAcceptState { get; set; }
        public string Name { get; set; }
        
    }


    public class Transition
    {
        public bool Type { get; set; } // true = default, false = PDA
        public string From { get; set; }
        public char Input { get; set; }
        public string To { get; set; }   
        public char Pop {get; set; } 
        public string Push {get; set;}
    }
