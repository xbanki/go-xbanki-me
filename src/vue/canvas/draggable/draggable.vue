<template>

    <main class="component-draggable" v-bind:class="{ 'state-editing': state.edit }">

        <!-- Component actual display //-->
        <section class="draggable-content">

            <!-- Display slot //-->
            <slot name="default"/>
        </section>

        <!-- Component handles //-->
        <section class="draggable-handles" v-if="state.edit">

            <!-- Top left scale handle //-->
            <div class="handle-top-left" v-if="state.scaleable"/>

            <!-- Top scale handle //-->
            <div class="handle-top" v-if="state.scaleable"/>

            <!-- Top right scale handle //-->
            <div class="handle-top-right" v-if="state.scaleable"/>

            <!-- Left scale handle //-->
            <div class="handle-left" v-if="state.scaleable"/>

            <!-- Middle handle, which is used to drag the item around //-->
            <div class="handle-drag"/>

            <!-- Right scale handle //-->
            <div class="handle-right" v-if="state.scaleable"/>

            <!-- Bottom right scale handle //-->
            <div class="handle-bottom-right" v-if="state.scaleable"/>

            <!-- Bottom scale handle //-->
            <div class="handle-bottom" v-if="state.scaleable"/>

            <!-- Bottom left scale handle //-->
            <div class="handle-bottom-left" v-if="state.scaleable"/>
        </section>
    </main>
</template>

<script lang="ts" src="./draggable.ts"></script>
<style lang="scss" src="./draggable.scss"></style>