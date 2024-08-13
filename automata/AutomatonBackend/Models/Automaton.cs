    using AutomatonBackend.Controllers;

    namespace AutomatonBackend;

    public class AutomatonData
    {
        
        // public int Type { get; set; } // 0 = DFA, 1 = NFA, 2 = PDA
        // public List<State> States { get; set; }
        // public List<PDAState> pdaStates { get; set; }
        
        public List<string> Inputs { get; set; }
    }

    

    public class Response {
        public List<String> Path { get; set; }
    }

    public class StateCreate {
        
        public bool Type { get; set; } // true = default, false = PDA
        public bool IsAcceptState { get; set; }        
        
    }

    public class Positions{
        public string name {get; set;}
        public float[] position {get; set;}
    }

    public class StateDelete {
        public string Name { get; set; }
        public bool Type { get; set; }
    }


    public class Transition
    {
        public bool Type { get; set; } // true = default, false = PDA
        public string From { get; set; }
        public char Input { get; set; }
        public string To { get; set; }   
        public char? Pop {get; set; } 
        public string? Push {get; set;}
    }    
