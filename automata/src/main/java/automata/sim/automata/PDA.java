package automata.sim.automata;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;
import java.util.Stack;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import org.springframework.boot.origin.SystemEnvironmentOrigin;

import java.util.Arrays;
import java.util.List;
import java.util.ArrayList;

public class PDA {
    private PDAState startState;
    private Stack<Character> stack;
    private char startSymbol;
    // private Set<State> currentStates;

    public PDA(PDAState startState, char startSymbol) {
        this.startState = startState;
        this.startSymbol = startSymbol; // unique char for bottom of stack
        this.stack = new Stack<>(); // Initialize the stack here
        this.stack.push(startSymbol); // Push the start symbol onto the stack

    }

    public List<List<PDAState>> generateAllPaths(PDAState initialState, String input) {
        List<List<PDAState>> allPaths = new ArrayList<>();
        generatePaths(initialState, input, 0, new ArrayList(), allPaths);
        return allPaths;
    }

    public void printStack() {
        if (stack.isEmpty()) {
            System.out.println("Stack is empty");
            return;
        }
        System.out.print("Stack contents (top to bottom): ");
        for (int i = stack.size() - 1; i >= 0; i--) {
            System.out.print(stack.get(i) + " ");
        }
        System.out.println(); // Move to the next line after printing the stack
    }

    public void generatePaths(PDAState currState, String input, int index, ArrayList<PDAState> currPath,
            List<List<PDAState>> allPaths) {
        // printStack();

        currPath.add(currState);

        if (index == input.length()) {
            // check if our special stack symbol is at the bottom again
            if (stack.isEmpty() || stack.peek() == startSymbol) {
                allPaths.add(new ArrayList<>(currPath));
                System.out.println("Valid Path found");
                printStack();
            }
            currPath.remove(currPath.size() - 1);
            return;
        }

        // current character in put we are on
        Character currInput = input.charAt(index);

        // All valid transitions from out state
        Set<Pair<PDAState, String>> transitions = currState.getTransitions(currInput, checkTop());

        // loop over each transition
        // We go to the first transition, pop and push based on the transition and then
        // recurse into the valid transitions of the next state dictated by the
        // transition
        for (Pair<PDAState, String> transition : transitions) {
            String transitionOutput = transition.getValue();
            PDAState nextState = transition.getKey();

            char transitionPop = currState.getPopSymbolForTransition(currInput, checkTop());
            boolean popped = false;

            // Handle popping from the stack
            if (transitionPop != 'ϵ' && !stack.isEmpty() && stack.peek() == transitionPop) {
                stack.pop();
                popped = true; // Mark that we have popped the character
            }

            // Push new characters onto the stack as specified by the transition
            if (transitionOutput.charAt(0) != 'ϵ') {
                pushTo(transitionOutput);
            }

            // recurse into next state, add 1 to index to move up our input
            generatePaths(nextState, input, index + 1, currPath, allPaths);

            // Undo the push operations made during this path
            if (transitionOutput.charAt(0) != 'ϵ') {
                for (int i = 0; i < transitionOutput.length(); i++) {
                    if (!stack.isEmpty()) {
                        stack.pop();
                    }
                }
            }

            // Correctly restore the stack by pushing the popped character only if we
            // actually popped it
            if (popped) {
                stack.push(transitionPop);
            }
        }

        currPath.remove(currPath.size() - 1);
    }

    // TODO: recursive DFS method to check each path for validity
    public boolean simulate(String input) {

        List<List<PDAState>> list = generateAllPaths(startState, input);

        if (list.size() >= 1) {
            for (List<PDAState> path : list) {
                for (PDAState state : path) {
                    System.out.println(state.getName());
                }
            }
        }

        // System.out.println("false");
        return false;
    }

    // push to our stack
    @SuppressWarnings("unchecked")
    public void pushTo(String input) {
        if (input.length() > 1) {
            for (int i = 0; i <= 1; i++) {
                stack.push(input.charAt(i));
            }
        } else {
            stack.push(input.charAt(0));
        }
    }

    // to check if our stack matches the transition condition
    public char checkTop() {
        return (char) stack.peek();
    }

}
