<template>
    <modal-component v-bind:display="state.render_state">
        
        <!-- Settings component parent wrapper //-->
        <main class="component-settings">
            <categories-component v-bind:state="state.categories_state" v-bind:data="state.categories_data" v-on:clicked="handle_category_clicked" v-on:close="handle_render_state_change"/>
            <pages-component v-bind:state="state.pages_state" v-on:close="handle_render_state_change($event)"/>
        </main>
    </modal-component>
</template>

<script lang="ts" src="./settings.ts"></script>
<style lang="scss" src="./settings.scss"></style>