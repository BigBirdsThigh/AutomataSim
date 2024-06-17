package automata.sim.automata;

import java.util.HashSet;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.Arrays;
import java.util.List;

public class PDAState {
    private String name;
    private Map<Character, String[]> transitions;
    private boolean isAcceptState;

    public PDAState(String name, boolean isAcceptState) {
        this.name = name;
        this.isAcceptState = isAcceptState;
        this.transitions = new HashMap<>();
    }

    // PDA states will hold transition of mapping from char to array
    // {nextState, pop, push}
    public void addTransition(char input, String[] transition) {
        transitions.computeIfAbsent(input, k -> transition);
    }

    // Get valid states
    public String[] getNextStates(char input) {
        String[] empty = new String[0];
        // return transitions.get(input);
        if (transitions.get(input) != null) {
            return transitions.get(input);
        } else {
            return empty;
        }
    }

    public String[] getPopsAndStates(char input) {
        String[] temp = getNextStates(input);
        String[] emtpy = new String[0];
        if (temp.length == 0) {
            return emtpy;
        } else {
            String[] output = { temp[0], temp[1] };
            return output;

        }

    }

    // Getters

    public String getName() {
        return name;
    }

    public boolean isAcceptState() {
        return isAcceptState;
    }

}
