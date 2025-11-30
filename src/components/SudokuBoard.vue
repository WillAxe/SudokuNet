<script setup lang="ts">
  import Buttons from "./Buttons.vue"
  import TimerClock from "./TimerClock.vue"
  import CongratMessage from "./CongratMessage.vue"
  import { ref, watch } from "vue"
  import type { Ref } from "vue"
  import { computed } from "vue"

  interface Grid {
    difficulty: string
    value: (number | string)[][]
    solution: number[][]
  }

  interface ActiveCell {
    col: string | number
    row: string | number
  }

  const board = ref<(string | number)[][]>([])
  const userBoard = ref<(number | string)[][]>([])
  const difficulty = ref<string>("")
  const solution = ref<number[][]>([])

  fetch(
    "https://sudoku-api.vercel.app/api/dosuku?query{newboard(limit:1){grids{value}}}"
  )
    .then((response) => response.json())
    .then((result) => {
      console.log(result)
      const grid: Grid = result.newboard.grids[0]
      console.log(grid)
      for (let i: number = 0; i < grid.value.length; i++) {
        for (let n: number = 0; n < grid.value[i]!.length; n++) {
          if (grid.value[i]![n] === 0) {
            grid.value[i]![n] = ""
          }
        }
      }
      difficulty.value = grid.difficulty
      board.value = grid.value.map((row) =>
        row.map((cell) => (cell === 0 ? "" : cell))
      )
      solution.value = grid.solution.map((row) =>
        row.map((cell) => Number(cell))
      )

      //Declare the empty cells to make them editable
      userBoard.value = board.value.map((row: (string | number)[]) =>
        row.map((cell) => (cell === 0 ? "" : ""))
      )
    })

  const highlightedNumber = ref<number | undefined>()
  //set the interface for the constant
  const activeCell = ref<ActiveCell>({ row: "", col: "" })

  //Highlight the cell that the player press and highlight the column and row for that cell
  function onClick(row: string | number, col: string | number) {
    if (board.value[row as number]?.[col as number] === "") {
      activeCell.value = { row, col }
    }
  }

  function removeHighlight() {
    activeCell.value = { row: "", col: "" }
  }

  //The buttons highlights the corresponding numbers

  function highlightCells(number: number | null) {
    highlightedNumber.value = number as number
  }
  //Making it possbiblefor the user to fill in the empty cells with a number
  function printNumber(number: number) {
    if (activeCell.value.row !== null && activeCell.value.col !== null) {
      const row = userBoard.value[activeCell.value.row as number]
      if (row) {
        row[activeCell.value.col as number] = Number(number)
        userBoard.value = [...userBoard.value] // force reactivity
      }
    }
  }

  //checks if the number is correct
  function checkSolution(row: number, col: number, value: string | number) {
    const num = value ? parseInt(value.toString()) : ""
    if (userBoard.value[row]) {
      userBoard.value[row][col] = isNaN(num || NaN) ? "" : num
    }
  }

  // count how many of each number there is in the grid
  const numberCount = computed(() => {
    const count: Record<string | number, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0
    }

    board.value.flat().forEach((num: string | number) => {
      const n = Number(num)
      if (n && !isNaN(n) && n >= 1 && n <= 9) {
        ;(count as any)[n]++
      }
    })

    userBoard.value.flat().forEach((num: number | string) => {
      if (num !== null && num !== "") {
        const n = Number(num)
        if (!isNaN(n) && n >= 1 && n <= 9) {
          ;(count as any)[n]++
        }
      }
    })
    return count
  })

  //Hide the panel that popup when you complete the game
  const showPanel = ref<boolean>(false)

  //Checks if the board is complete and correct
  const isGameComplete = computed<boolean>(() => {
    if (solution.value.length === 0) return false
    const complete = userBoard.value.every(
      (row: (number | string)[], rowCell: number) =>
        row.every((cell: number | string, colCell: number) => {
          if (board.value[rowCell] && board.value[rowCell][colCell] === "") {
            const userInput = cell !== null && cell !== "" ? Number(cell) : ""
            const solutionValue = solution.value[rowCell]
              ? solution.value[rowCell][colCell]
              : ""
            console.log(
              `Comapring user input ${userInput} with solution ${solutionValue}`
            )
            return userInput === solutionValue
          }
          return true
        })
    )
    console.log("isGameComplete:", complete)
    return complete
  })

  // consts for time functionality
  const timerRef = ref<any>("")
  const finalTime = ref<string>("")

  watch(
    isGameComplete,
    (newValue) => {
      if (newValue) {
        if (timerRef.value) {
          timerRef.value.stopTimer()
          finalTime.value = timerRef.value.formatTime()
          localStorage.setItem("lastTime", finalTime.value)
        }
        showPanel.value = true
      }
    },
    { deep: true }
  )

  function closePanel() {
    showPanel.value = false
  }
</script>

<template>
  <CongratMessage
    :message="'You have succesfully completed the sudoku!'"
    :show="showPanel"
    :finalTime="finalTime"
    @close="closePanel"
  />
  <div @click="removeHighlight">
    <!--Clicking outside to remove the highlight -->
    <h3>Difficulty: {{ difficulty }}</h3>
    <TimerClock ref="timerRef" />
    <table data-cy="sudoku-table" border="1px" @click.stop>
      <tbody>
        <tr v-for="(row, rowCell) in board" :key="rowCell">
          <td
            data-cy="sudoku-td-cell"
            v-for="(cell, colCell) in (row as (string | number)[])"
            :key="colCell"
            align="center"
            @click="onClick(rowCell, colCell)"
            :class="{
              highlight:
                rowCell === activeCell.row || colCell === activeCell.col,
              'highlight-number': cell === highlightedNumber,
              wrong:
                userBoard[rowCell as number]?.[colCell as number] !== '' &&
                userBoard[rowCell as number]?.[colCell as number] !== solution[rowCell as number]?.[colCell as number]
            }"
          >
            <button
              class="cell-button"
              v-if="cell === ''"
              @click.stop="onClick(rowCell, colCell)"
              :class="{
                active: activeCell.row === rowCell && activeCell.col === colCell
              }"
            >
              {{ userBoard[rowCell as number]?.[colCell as number] || "" }}
            </button>
            <span v-else>{{ cell }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <Buttons
    data-cy="number-btn"
    @write-number="printNumber"
    @highlight-number="highlightCells"
    :numberCount="numberCount"
  />
</template>

<style scoped>
  h3 {
    text-align: center;
  }

  table {
    border-collapse: collapse;
    margin: 5px auto;
    max-width: 100%;
    width: fit-content;
  }

  td {
    width: 40px;
    height: 40px;
    max-width: 10vw;
    max-height: 10vw;
    text-align: center;
    font-size: 24px;
  }
  .cell-button {
    width: 50px;
    height: 50px;
    background-color: #fcfcfc;
    border: none;
    font-size: 23px;
    font-weight: 100;
    color: #8c02ae;
  }

  td:nth-child(3n) {
    border-right: 2px solid #000000;
  }

  tr:nth-child(3n) td {
    border-bottom: 2px solid #000000;
  }

  .highlight {
    background-color: #f0f0ee;
  }

  .highlight .cell-button {
    background-color: #f0f0ee;
  }

  .cell-button:focus {
    background-color: #f6f6dd;
  }

  .highlight-number {
    background-color: #f6f6d0;
  }

  .wrong .cell-button {
    background-color: #e72020;
    animation: shake 0.3s ease-in-out;
    color: #ffffff;
  }

  button {
    color: #ffffff;
    padding: 12px 20px;
    font-size: 18px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  button:active {
    transform: scale(0.95);
  }

  /* This is what makes the square shake when wrong */

  @keyframes shake {
    0% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(-5px);
    }
    50% {
      transform: translateX(5px);
    }
    75% {
      transform: translateX(-5px);
    }
    100% {
      transform: translateX(0);
    }
  }

  @media (max-width: 560px) {
    @media (prefers-color-scheme: dark) {
      table {
        border: solid 4px #f4f4f4;
      }

      .cell-button {
        background-color: #1b1b1b;
        color: #d352f3;
      }
      td {
        background-color: #010101;
        color: #fefefe;
      }

      td:nth-child(3n) {
        border-right: 4px solid #f4f4f4;
      }

      tr:nth-child(3n) td {
        border-bottom: 4px solid #f4f4f4;
      }
      .highlight {
        background-color: #454545;
      }
      .highlight .cell-button {
        background-color: #454545;
      }
      .cell-button:focus {
        background-color: #9f9d9d;
      }

      .highlight-number {
        background-color: #aeacac;
        color: #010101;
      }

      .wrong .cell-button {
        background-color: #c70909;
        animation: shake 0.3s ease-in-out;
        color: #fcfbfb;
      }
    }
  }

  /* media query for mobile screen and other small screens */
  @media (max-width: 685px) {
    table {
      width: 25%;
      margin: 0 auto;
    }

    td {
      width: 10vw;
      height: 10vw;
      font-size: 4vw;
    }

    .cell-button {
      width: 10vw;
      height: 10vw;
      font-size: 4vw;
    }

    input {
      width: 10vw;
      height: 10vw;
      font-size: 4vw;
    }

    button {
      width: 100%;
      font-size: 4vw;
      padding: 10px;
    }

    h3 {
      font-size: 5vw;
      margin-top: 15px;
      margin-bottom: 4px;
    }
  }

  @media (max-width: 400px) {
    @media (prefers-color-scheme: dark) {
      table {
        border: none;
      }

      td:nth-child(3n) {
        border-right: 2px solid #f4f4f4;
      }

      tr:nth-child(3n) td {
        border-bottom: 2px solid #f4f4f4;
      }
    }
  }
</style>
