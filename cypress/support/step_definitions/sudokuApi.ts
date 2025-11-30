function SudokuApi() {
  cy.intercept(
    { method: "GET", url: "**/api/dosuku*" },
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

              // The solution to the mocked grid
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
  ).as("getSudoku")

  //Note that sometimes cypress fails the test because it timesout before getting a response. So just run test again till it works as the code for the test is written correct.
  cy.wait("@getSudoku")
}

export default SudokuApi
