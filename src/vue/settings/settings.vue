<template>
    <teleport to="main#go-xbanki-ui">

        <!-- Open settings button //-->
        <button class="component-settings-open" v-on:click="handle_settings_open" v-if="!eventBusStore.render_settings"> ⚙ </button>
    </teleport>

    <modal-component v-bind:display="eventBusStore.render_settings">

        <!-- Settings component parent wrapper //-->
        <main class="component-settings">

            <categories-component
                
                v-on:category-clicked="handle_category_clicked"
                
                v-on:parent-clicked="handle_parent_clicked"

                v-bind:data="state.categories_data"

            />

            <pages-component v-bind:state="state.pages_state"/>
        </main>
    </modal-component>
</template>

<script lang="ts" src="./settings.ts"></script>
<style lang="scss" src="./settings.scss"></style>