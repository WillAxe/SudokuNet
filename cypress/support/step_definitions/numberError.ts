import { When, Then, Given } from "@badeball/cypress-cucumber-preprocessor"
import SudokuApi from "../step_definitions/sudokuApi"

Given("I'm playing sudoku on the page", () => {
  cy.visit("http://localhost:5173/#/play-sudoku")
  SudokuApi()
})

// here we say to cypress to select a number that is not 4(which is the correct number for the first cell) because we want to test the error handling feature
When("I have filled a cell with the wrong number", () => {
  cy.get("[data-cy='sudoku-td-cell']").eq(0).click()
  cy.get("[data-cy='number-btn']").contains("1").click()
})

Then("it change color to red", () => {
  cy.get("[data-cy='sudoku-td-cell']").eq(0).should("have.class", "wrong")
})
