<template>

    <!-- UI Layout category page root element //-->
    <main class="component-ui-layout">

        <!-- UI Layout component title display //-->
        <span class="ui-layout-title"> UI Layout </span>

        <!-- UI layout control buttons //-->
        <section class="ui-layout-buttons">
            
            <!-- Edit layout button //-->
            <button class="buttons-edit" v-on:click="handle_click_edit" v-bind:disabled="!state.disable.edit"> Edit UI Layout </button>

            <!-- Reset layout button //-->
            <button class="buttons-reset" v-on:click="handle_click_reset" v-bind:disabled="state.disable.reset"> Reset UI Layout </button>
        </section>
    </main>
</template>

<script lang="ts" src="./ui_layout.ts"></script>
<style lang="scss" src="./ui_layout.scss" scoped></style>