import Buttons from "../../src/components/Buttons.vue"

const propsMock: { numberCount: Record<number, number> } = {
  numberCount: { 1: 9, 2: 5, 3: 3, 4: 3, 5: 1, 6: 3, 8: 3, 9: 6 }
}

describe("Buttons.vue component", () => {
  it("mounts the button component", () => {
    cy.mount(Buttons, { props: propsMock })
  })

  it("checks that all of the buttons are shown", () => {
    cy.mount(Buttons, { props: propsMock })
    cy.get("[data-cy='number-buttons']").should("have.length", 9)
  })
})
