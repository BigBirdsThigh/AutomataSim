package automata.sim.automata;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;
import java.util.Stack;
import java.util.stream.Collector;
import java.util.stream.Collectors;

public class PDA {
    private PDAState startState;
    private Stack stack;
    private char startSymbol;
    // private Set<State> currentStates;

    public PDA(PDAState startState, char startSymbol) {
        this.startState = startState;
        this.startSymbol = startSymbol; // unique char for bottom of stack

    }

    // push to our stack
    @SuppressWarnings("unchecked")
    public void pushTo(char input) {
        stack.push(input);
    }

    // to check if our stack matches the transition condition
    public char checkTop() {
        return (char) stack.peek();
    }

    public boolean simulate(String input) {

        return false;
    }

}
