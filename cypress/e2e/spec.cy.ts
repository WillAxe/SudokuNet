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

  // it("has a working cell that can be filled with a number and show if it correct or not", function () {
  //   cy.visit("http://localhost:5173/#/play-sudoku")
  //   cy.get("h3").should("contain", "Difficulty:")
  // })
})
