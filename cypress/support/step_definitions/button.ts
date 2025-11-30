import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor"
import SudokuApi from "../step_definitions/sudokuApi"

Given("I'm playing sudoku and filling the cells", () => {
  cy.visit("http://localhost:5173/#/play-sudoku")
  SudokuApi()
})

When("I have filled a cell with a specific number", () => {
  cy.get("[data-cy='sudoku-td-cell']").eq(0).click()
  cy.get("[data-cy='number-btn']").contains("4").click()
})

Then("the count on that number is decreased", () => {
  cy.get("[data-cy='number-btn']")
    .contains("4")
    .children("[data-cy='number-counter']")
    .should("contain", 7)
})
