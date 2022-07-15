<template>
    <teleport to="main#go-xbanki-ui">

        <!-- Open settings button //-->
        <button class="component-settings-open" v-on:click="handle_settings_open" v-if="!state.render_state"> ⚙ </button>
    </teleport>

    <modal-component v-bind:display="state.render_state">

        <!-- Settings component parent wrapper //-->
        <main class="component-settings">

            <categories-component
                
                v-on:category-clicked="handle_category_clicked"
                
                v-on:parent-clicked="handle_parent_clicked"

                v-on:close="handle_render_state_change"

                v-bind:state="state.categories_state"

                v-bind:data="state.categories_data"

            />

            <pages-component v-bind:state="state.pages_state" v-on:close="handle_render_state_change($event)"/>
        </main>
    </modal-component>
</template>

<script lang="ts" src="./settings.ts"></script>
<style lang="scss" src="./settings.scss"></style>