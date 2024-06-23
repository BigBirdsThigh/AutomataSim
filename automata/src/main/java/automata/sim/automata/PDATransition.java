package automata.sim.automata;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class PDATransition {
    private PDAState newState;
    private State currentState;
    private String name;
    private char input; // The input character required for this transition
    private char pop; // The character to pop from the stack for this transition
    private String push; // The string to push onto the stack for this transition
    private Object details;

    public PDATransition(char input, char pop, String push, PDAState newState) {
        this.input = input;
        this.pop = pop;
        this.push = push;
        this.newState = newState; // why is this coloured oddly
    }

}
