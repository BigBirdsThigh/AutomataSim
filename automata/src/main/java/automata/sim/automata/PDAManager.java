package automata.sim.automata;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

public class PDAManager {
    private Set<PDAState> states;

    public PDAManager() {
        this.states = new HashSet<>();
    }

    // Method to find possible transitions given the current state, input character,
    // and stack top
    public Set<PDAState> getPossibleNextStates(PDAState currentState, char input, char stackTop) {
        return currentState.getTransitions().stream()
                .filter(t -> t.getInput() == input && t.getPop() == stackTop)
                .map(PDATransition::getNextState)
                .collect(Collectors.toSet());
    }

    // Method to get the push instructions for a given transition
    public Set<String> getPushInstructions(PDAState currentState, char input, char stackTop) {
        return currentState.getTransitions().stream()
                .filter(t -> t.getInput() == input && t.getPop() == stackTop)
                .map(PDATransition::getPush)
                .collect(Collectors.toSet());
    }
}
