package automata.sim.automata;

public class PDATransition {
    private PDAState currentState;
    private PDAState nextState;
    private char input; // The input character required for this transition
    private char pop; // The character to pop from the stack for this transition
    private String push; // The string to push onto the stack for this transition

    public PDATransition(PDAState currentState, PDAState nextState, char input, char pop, String push) {
        this.currentState = currentState;
        this.nextState = nextState;
        this.input = input;
        this.pop = pop;
        this.push = push;
    }

    // Getters
    public PDAState getCurrentState() {
        return currentState;
    }

    public PDAState getNextState() {
        return nextState;
    }

    public char getInput() {
        return input;
    }

    public char getPop() {
        return pop;
    }

    public String getPush() {
        return push;
    }
}
