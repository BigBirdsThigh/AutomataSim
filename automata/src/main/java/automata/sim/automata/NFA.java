package automata.sim.automata;

import java.util.HashSet;
import java.util.Set;

public class NFA {
    private State startState;
    // private Set<State> currentStates;

    public NFA(State startState) {
        this.startState = startState;

    }

    public boolean simulate(String input) {
        Set<State> newStates = new HashSet<>();
        newStates.add(startState); // Always consider the start state for epsilon transitions

        // loop our input
        for (char c : input.toCharArray()) {
            Set<State> nextStates = new HashSet<>(); // new set to contain every possible state we could be in from our
                                                     // input char
            for (State state : newStates) {
                nextStates.addAll(state.getNextState(c)); // put all transitions state has when given input
                nextStates.addAll(state.getNextState('ϵ')); // ensures all epsilon transitions are added to our set
            }
            newStates = nextStates;

            if (newStates.isEmpty()) {
                return false;
            }

        }

        for (State state : newStates) {
            if (state.isAcceptState()) {
                return true;
            }
        }

        return false;
    }
}
