Feature: Button tha are not clickable
As a user that play sudoku I want to know how many of each numbers there are left and when there are none of that number left not be able to select that button
Scenario: Filling in a number
Given I'm playing sudoku and filling the cells
When I have filled a cell with a specific number
Then the count on that number is decreased
