namespace AutomatonBackend.Controllers;

public class StateTreeNode
    {
        public State State { get; private set; }
        public int Depth { get; private set; }
        public List<StateTreeNode> Children { get; private set; }

        public StateTreeNode(State state, int depth)
        {
            State = state;
            Depth = depth;
            Children = new List<StateTreeNode>();
        }

        public void AddChild(StateTreeNode child)
        {
            Children.Add(child);
        }
    }