package automata.sim.automata;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;
import java.util.Stack;
import java.util.stream.Collector;
import java.util.stream.Collectors;
import java.util.Stack;
import java.util.List;
import java.util.ArrayList;

public class PDA {
    private PDAState startState;
    private static Stack stack;
    private char startSymbol;
    // private Set<State> currentStates;

    public PDA(PDAState startState, char startSymbol) {
        this.startState = startState;
        this.startSymbol = startSymbol; // unique char for bottom of stack
        stack.push('X');

    }

    public List<List<PDAState>> generateAllPaths(PDAState initialState, String input) {
        List<List<PDAState>> allPaths = null;
        generatePaths(initialState, input, 0, new ArrayList(), allPaths);
        return allPaths;
    }

    public void generatePaths(PDAState currState, String input, int index, ArrayList currPath,
            List<List<PDAState>> allPaths) {

        currPath.add(currState);

        // processed this path so add it to allPaths
        if (index == input.length()) {
            allPaths.add(new ArrayList<>(currPath));
            return;
        }

        Character currInput = input.charAt(index);
        // iterate over valid transitions
        for (Pair<PDAState, String> state : currState.getTransitions(currInput, (char) PDA.stack.peek())) {
            generatePaths(state.getKey(), input, index++, currPath, allPaths);
        }

        currPath.remove(currPath.size() - 1);

    }

    // TODO: recursive DFS method to check each path for validity
    public boolean simulate(String input, Stack stack) {
        generateAllPaths(startState, input);
        return false;
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
