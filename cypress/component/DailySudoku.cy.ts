import DailySudoku from "../../src/components/DailySudoku.vue"

describe("DailySudoku.vue", () => {
  it("mounts DailySudoku component and checks that it displays the todays date correctly", () => {
    cy.mount(DailySudoku)
    cy.get("[data-cy='date-string']").should(
      "contain",
      new Date().toDateString()
    )
  })
})
