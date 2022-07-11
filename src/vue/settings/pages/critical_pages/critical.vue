<template>

    <!-- Critical only pages root element //-->
    <main class="component-critical">

        <!-- Upper title bar //-->
        <section class="critical-bar">

            <!-- Title display //-->
            <span class="bar-title"> First-time Initialization </span>

            <!-- Sub-category separator //-->
            <span class="bar-separator"> / </span>

            <!-- Sub-category label //-->
            <span class="bar-label"> {{ state.active.name }} </span>
        </section>

        <!-- Automatically rendered critical setting component //-->
        <component v-bind:is="state.active.id" v-bind:standalone="true" v-on:close="pass_close"/>
    </main>
</template>

<script lang="ts" src="./critical.ts"></script>
<style lang="scss" src="./critical.scss"></style>