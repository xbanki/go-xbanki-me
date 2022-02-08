<template>
    <modal-component v-bind:display="true">
        
        <!-- Settings component parent wrapper //-->
        <main class="component-settings">
            <categories-component v-bind:state="state.categories_state" v-bind:data="state.categories_data"/>
        </main>
    </modal-component>
</template>

<script lang="ts" src="./settings.ts"></script>
<style lang="scss" src="./settings.scss"></style>