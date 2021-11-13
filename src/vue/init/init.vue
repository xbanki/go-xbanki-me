<template>
    
    <modal-component v-on:ready="data.ev = $event">
        
        <!-- Initialization component wrapper //-->
        <main class="component-init">

            <!-- Temporary warning for ugly styling //-->
            <span class="init-warning"> ATTENTION! Don't mind the dust and the ugly styling, everything is still heavily work in progress :) </span>
        </main>
    </modal-component>
</template>

<script lang="ts" src="./init.ts"></script>
<style lang="scss" src="./init.scss"></style>