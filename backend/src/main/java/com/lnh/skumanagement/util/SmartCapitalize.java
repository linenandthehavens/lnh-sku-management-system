package com.lnh.skumanagement.util;

import org.springframework.stereotype.Component;

@Component
public class SmartCapitalize {

    public String smartCapitalize(String input) {
        if (input == null || input.trim().isEmpty()) {
            return input;
        }

        String[] words = input.trim().split("\\s+");
        StringBuilder result = new StringBuilder();

        for (String word : words) {
            if (!word.isEmpty()) {
                result.append(
                        word.substring(0, 1).toUpperCase()
                                + word.substring(1).toLowerCase()
                ).append(" ");
            }
        }
        return result.toString().trim();
    }
}
