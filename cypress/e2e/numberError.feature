Feature: Error feedback
As a user that play sudoku I want to know if the number I fill in the cell is correct or not.
Scenario: Filling in wrong number
Given I'm playing sudoku on the page
When I have filled a cell with the wrong number
Then it change color to red


