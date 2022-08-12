<template>
    <main class="component-date">

        <!-- Current date format render item //-->
        <span class="date-display" v-bind:class="{ revealed: state.render }" ref="renderer"> {{ state.date }} </span>
    </main>
</template>

<script lang="ts" src="./date.ts"></script>
<style lang="scss" src="./date.scss"></style>