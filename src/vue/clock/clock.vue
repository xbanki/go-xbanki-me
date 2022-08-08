<template>

    <main class="component-clock">

        <!-- CLock current time display //-->
        <span class="clock-time" v-bind:class="{ revealed: state.render }"> {{ state.time }} </span>
    </main>
</template>

<script lang="ts" src="./clock.ts"></script>
<style lang="scss" src="./clock.scss"></style>