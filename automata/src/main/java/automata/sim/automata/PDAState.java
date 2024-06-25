package automata.sim.automata;

import java.util.HashSet;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import org.springframework.boot.autoconfigure.web.WebProperties.Resources.Chain;

import com.fasterxml.jackson.databind.deser.std.NumberDeserializers.CharacterDeserializer;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.*;

import java.util.*;

public class PDAState {
    private String name;
    private Map<Pair<Character, Character>, Pair<PDAState, String>> transitions;
    private boolean isAcceptState;

    public PDAState(String name, boolean isAcceptState) {
        this.name = name;
        this.isAcceptState = isAcceptState;
        this.transitions = new HashMap<>();
    }

    public void addTransition(char input, char pop, PDAState newState, String push) {
        // Normalize inputs for transitions
        char normalizedInput = input == ' ' ? 'ϵ' : input;
        char normalizedPop = pop == ' ' ? 'ϵ' : pop;
        String normalizedPush = (push == null || push.trim().isEmpty()) ? "ϵ" : push;

        Pair<Character, Character> key = new Pair<>(normalizedInput, normalizedPop);
        Pair<PDAState, String> value = new Pair<>(newState, normalizedPush);

        transitions.put(key, value);
    }

    // Utility method in PDAState to get the actual pop symbol for a given
    // transition
    public char getPopSymbolForTransition(char input, char topOfStack) {
        char normalizedTop = topOfStack == ' ' ? 'ϵ' : topOfStack;
        return transitions.entrySet().stream()
                .filter(entry -> entry.getKey().getKey() == input && entry.getKey().getValue() == normalizedTop)
                .map(entry -> entry.getKey().getValue()) // Get the pop symbol
                .findFirst().orElse('ϵ'); // Default to 'ϵ' if no matching transition found
    }

    public Set<Pair<PDAState, String>> getTransitions(char input, char pop) {
        char normalizedPop = pop == ' ' ? 'ϵ' : pop;
        return transitions.entrySet().stream()
                .filter(entry -> entry.getKey().getKey() == input &&
                        (entry.getKey().getValue() == normalizedPop || entry.getKey().getValue() == 'ϵ'))
                .map(Map.Entry::getValue)
                .collect(Collectors.toSet());
    }

    public void printTransitions() {
        transitions.forEach((key, value) -> System.out
                .println("Transition from state " + name + ": on input " + key.getKey() + " and pop " + key.getValue()
                        + ", go to state " + value.getKey().getName() + " and push " + value.getValue()));
    }

    // Getters
    public String getName() {
        return name;
    }

    public boolean isAcceptState() {
        return isAcceptState;
    }
}
