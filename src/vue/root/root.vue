<template>
    <background-component/>

    <!-- Content display master element //-->
    <main class="component-root">

        <teleport to="main#go-xbanki-ui">
            <button v-on:click="debug_stretch"> Stretch </button>
            <button v-on:click="debug_fit"> Fit </button>
            <button v-on:click="debug_fill"> Fill </button>
        </teleport>
    </main>
</template>

<script lang="ts" src="./root.ts"></script>
<style lang="scss" src="./root.scss"></style>