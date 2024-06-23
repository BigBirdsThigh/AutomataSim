package automata.sim.automata;

import java.util.HashSet;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import org.springframework.boot.autoconfigure.web.WebProperties.Resources.Chain;

import com.fasterxml.jackson.databind.deser.std.NumberDeserializers.CharacterDeserializer;

import java.util.Arrays;
import java.util.List;
import java.util.*;

// Probs won't
public class PDAState {
    private String name;
    private Map<Pair<Character, Character>, Pair<PDAState, String>> transitions;
    private boolean isAcceptState;
    private char input;
    private char pop;
    private String push;

    public PDAState(String name, boolean isAcceptState) {
        this.name = name;
        this.pop = pop;
        this.push = push;
        this.input = input;
        this.isAcceptState = isAcceptState;
        this.transitions = new HashMap<>();
    }

    public Map<Pair<Character, Character>, Pair<PDAState, String>> addTransition(char input, char pop,
            PDAState newState, String push) {

        // using ? and : in the variables instead of multiple if statements. where ? is
        // to check if a condition is met and : is used as an else
        Pair<Character, Character> oneHalf = new Pair<>(input == ' ' ? 'ϵ' : input, pop == ' ' ? 'ϵ' : pop);

        Pair<PDAState, String> twoHalf = new Pair<>(newState,
                (push == null || push.trim().isEmpty()) ? "ϵ" : push);

        this.transitions.put(oneHalf, twoHalf);

        printTransitions();

        return transitions;

    }

    // Debugging Function
    public void printTransitions() {
        for (Map.Entry<Pair<Character, Character>, Pair<PDAState, String>> entry : transitions.entrySet()) {
            Pair<Character, Character> key = entry.getKey();
            Pair<PDAState, String> value = entry.getValue();
            System.out.println("Key: " + key + " -> Value: " + value);
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
