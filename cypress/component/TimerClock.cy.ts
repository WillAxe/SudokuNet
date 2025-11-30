//Tests the timerclock component to verify that the timer works as expected
import { mount } from "@cypress/vue"
import TimerClock from "../../src/components/TimerClock.vue"

// Extend Cypress' Chainable interface to include 'mount'
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount
    }
  }
}

describe("TimerClock.vue", () => {
  it("mounts TimerClock and verifies that it shows a timer that works as expected", () => {
    // Use cy.clock to control time in the tests and not the real timer
    cy.clock()
    cy.mount(TimerClock)
    cy.get("[data-cy='timer-string']").should("contain", "00:00")
    // Checks if the timer increase every second by 1 for every second passed
    cy.tick(1000)
    cy.get("[data-cy='timer-string']").should("contain", "00:01")
    cy.tick(1000)
    cy.get("[data-cy='timer-string']").should("contain", "00:02")
    // Checks if the timer shows 1 minute after 60 seconds has passed
    cy.tick(58000)
    cy.get("[data-cy='timer-string']").should("contain", "01:00")
  })
})
