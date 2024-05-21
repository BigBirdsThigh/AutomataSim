package automata.sim.automata;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;

public class DFA {
    private State starState;

    // private HashMap<Character, State> transitions;

    public DFA(State starState) {
        this.starState = starState;
    }

    public boolean simulate(String input) {

        State currState = starState;

        // loop over input
        for (char c : input.toCharArray()) {

            Set<State> nextStates = currState.getNextState(c); // next state(s) after current

            if (nextStates.isEmpty()) { // does a possible state exist
                return false;
            }
        }

        return currState.isAcceptState(); // is our ending state and accepting state?

    }

}
