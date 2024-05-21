package automata.sim.automata;

import java.util.HashSet;
import java.util.Set;

public class PDAState {
    private String name;
    private Set<PDATransition> transitions;

    public PDAState(String name) {
        this.name = name;
        this.transitions = new HashSet<>();
    }

    public void addTransition(PDATransition transition) {
        transitions.add(transition);
    }

    public Set<PDATransition> getTransitions() {
        return transitions;
    }

    public String getName() {
        return name;
    }
}
