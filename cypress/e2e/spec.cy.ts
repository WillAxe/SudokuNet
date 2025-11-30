import { diff } from "util"
import SudokuBoard from "../../src/components/SudokuBoard.vue"

describe("My Vite project", function () {
  it("visits my site", function () {
    cy.visit("http://localhost:5173/")
    cy.contains("h1", "Welcome to SudokuNet")
    cy.get("nav").contains("Home")
  })

  //Check that the links works using the within method to scope elements inside the nav tag
  it("has working links inside the nav", function () {
    cy.visit("http://localhost:5173/")
    cy.get("nav").within(() => {
      cy.get("[data-cy='play-sudoku']").click()
      cy.get("[data-cy='daily-challange']").click()
      cy.get("[data-cy='home']").click()
    })
  })

  //Test to check that the links sends to the correct url
  it("links send to the correct url", function () {
    cy.visit("http://localhost:5173/")
    cy.get("nav").within(() => {
      cy.get("[data-cy='play-sudoku']").click()
      cy.url().should("include", "/play-sudoku")
      cy.url().should("eq", "http://localhost:5173/#/play-sudoku")
      cy.get("[data-cy='daily-challange']").click()
      cy.url().should("include", "/daily-challange")
      cy.url().should("eq", "http://localhost:5173/#/daily-challange")
      cy.get("[data-cy='home']").click()
      cy.url().should("eq", "http://localhost:5173/#/")
    })
  })

  it("has a working cell that can be filled with a number and are interactive", function () {
    cy.visit("http://localhost:5173/#/play-sudoku")
    cy.get("h3").should("contain", "Difficulty:")

    // Intercept the API call to mock the sudoku board
    cy.intercept(
      {
        method: "GET",
        url: "https://sudoku-api.vercel.app/api/dosuku?query{newboard(limit:1){grids{value}}}"
      },
      {
        body: {
          newboard: {
            grids: [
              {
                value: [
                  ["", "", "", "", "", 9, "", "", ""],
                  [9, "", "", 6, "", 7, "", "", 4],
                  ["", "", "", "", "", "", "", "", ""],
                  ["", 8, "", "", 5, "", "", "", ""],
                  ["", "", "", 3, "", 8, 9, "", ""],
                  ["", 3, 5, "", "", "", "", "", 6],
                  ["", "", 6, "", "", 3, "", "", ""],
                  [3, "", "", "", "", "", "", "", ""],
                  ["", "", "", "", 7, 6, "", 9, ""]
                ],
                solution: [
                  [4, 2, 8, 5, 1, 9, 6, 3, 7],
                  [9, 1, 3, 6, 2, 7, 5, 8, 4],
                  [5, 6, 7, 8, 3, 4, 1, 2, 9],
                  [6, 8, 9, 7, 5, 1, 3, 4, 2],
                  [2, 7, 4, 3, 6, 8, 9, 1, 5],
                  [1, 3, 5, 9, 4, 2, 8, 7, 6],
                  [7, 9, 6, 2, 8, 3, 4, 5, 1],
                  [3, 4, 2, 1, 9, 5, 7, 6, 8],
                  [8, 5, 1, 4, 7, 6, 2, 9, 3]
                ],
                difficulty: "Hard"
              }
            ]
          }
        }
      }
    )

    const number: number = 1 || 2 || 3 || 4 || 5 || 6 || 7 || 8 || 9
    //Test to check that the sudoku board loads correctly and has 81 cells and that the empty cells are interactable
    cy.get("[data-cy='sudoku-table']").should("exist")
    cy.get("[data-cy='sudoku-td-cell']").should("have.length", 81)
    cy.get("[data-cy='sudoku-td-cell']")
      .eq(0)
      .click()
      .should("have.class", "highlight")
    cy.get("[data-cy='sudoku-td-cell']").contains(number).should("exist")
  })
})
