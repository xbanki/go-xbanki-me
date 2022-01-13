<template>
    <modal-component v-bind:display="true">
        
        <!-- Settings component parent wrapper //-->
        <main class="component-settings">
            <categories-component/>
        </main>
    </modal-component>
</template>

<script lang="ts" src="./settings.ts"></script>
<style lang="scss" src="./settings.scss"></style>