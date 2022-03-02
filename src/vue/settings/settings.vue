<template>
    <modal-component v-bind:display="true">
        
        <!-- Settings component parent wrapper //-->
        <main class="component-settings">
            <categories-component v-bind:state="state.categories_state" v-bind:data="state.categories_data" v-on:clicked="handle_category_clicked"/>
            <pages-component v-bind:state="state.pages_state"/>
        </main>
    </modal-component>
</template>

<script lang="ts" src="./settings.ts"></script>
<style lang="scss" src="./settings.scss"></style>