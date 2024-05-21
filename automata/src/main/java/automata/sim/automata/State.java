package automata.sim.automata;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public class State {
    private String name;
    private boolean isAcceptState;
    private Map<Character, Set<State>> transitions;

    public State(String name, Boolean isAcceptState) {
        this.name = name;
        this.isAcceptState = isAcceptState;
        this.transitions = new HashMap<>();
    }

    public void addTransition(char input, State state) {
        this.transitions.computeIfAbsent(input, k -> new HashSet<>()).add(state);
    }

    public void removeTransition(char input, State state) {
        this.transitions.remove(input, state);
    }

    public Set<State> getNextState(char input) { // valid states from given input
        return this.transitions.getOrDefault(input, new HashSet<>());
    }

    public boolean isAcceptState() {
        return isAcceptState;
    }
}
