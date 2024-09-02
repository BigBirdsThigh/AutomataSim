namespace AutomatonBackend.Controllers
{
    public class MachineResponse<TResult, TPath>
    {
        public TResult Result { get; set; }
        public TPath Path { get; set; } // TPath can be any type, e.g., List<string> or StateTreeNode
    }
}
