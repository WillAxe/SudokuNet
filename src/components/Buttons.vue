<script setup lang="ts">
  import { defineEmits, defineProps } from "vue"

  // allow numeric indexing like props.numberCount[1]
  interface NumberCount {
    [key: number]: number
  }

  const props = defineProps<{
    numberCount: NumberCount
  }>()

  const emit = defineEmits<{
    (e: "highlight-number", value: number | null): void
    (e: "write-number", value: number): void
  }>()

  function highlightNumber(number: number) {
    emit("highlight-number", number)
  }

  function removeHighlight() {
    emit("highlight-number", null)
  }

  function writeOutNumber(number: number) {
    emit("write-number", number)
  }
</script>
<template>
  <div>
    <button
      data-cy="number-buttons"
      v-for="n in 9"
      :key="n"
      @mouseover="highlightNumber(n)"
      @mouseleave="removeHighlight"
      @click="writeOutNumber(n)"
      :disabled="props.numberCount[n]! >= 9"
    >
      {{ n }}
      <span data-cy="number-counter" class="number_counts">{{
        9 - (props.numberCount[n] || 0)
      }}</span>
      <span class="number_counts">{{ 9 - (numberCount[n] || 0) }}</span>
    </button>
  </div>
</template>

<style scoped>
  div {
    display: flex;
    flex-wrap: nowrap;
    margin: auto;
    justify-content: center;
    max-width: 100%;
  }

  button {
    position: relative;
    padding: 1.35em;
    margin: 0.1px 4px;
    border: outset #c917ba 2px;
    background-color: #f7e4f5;
    flex: 0 0 auto;
    white-space: nowrap;
  }

  button:disabled {
    background-color: #ffebcd;
  }

  button:hover {
    background-color: #f7e4f5a1;
  }

  .number_counts {
    position: absolute;
    top: 4px;
    right: 6px;
    font-size: 0.6em;
    margin-left: 4px;
    padding-bottom: 15px;
  }

  @media (max-width: 685px) {
    div {
      margin: 13px;
    }
    button {
      padding: 1.28em;
      width: 9%;
      text-align: center;
    }
  }

  @media (max-width: 400px) {
    div {
      margin: 0;
      width: 100%;
      justify-content: center;
    }
    button {
      padding: 1em;
      width: 2%;
      text-align: center;
      margin: 1vw;
    }

    .number_counts {
      padding: 0;
    }
  }
</style>
