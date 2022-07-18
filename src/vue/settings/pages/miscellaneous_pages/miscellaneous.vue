<template>

    <!-- Miscellaneous pages root element //-->
    <main class="component-miscellaneous">

        <!-- Miscellaneous pages titlebar //-->
        <section class="miscellaneous-bar">

            <!-- Miscellaneous title display itself //-->
            <span
            
                v-bind:class="{
                    interactable: state.active != 'MISC_TAB_DEFAULT' && !state.disable
                }"

                v-on:click="handle_return_click"
                
                class="bar-title" 
                
                > Miscellaneous </span>

            <!-- Bar slash separator, that is only visible outside of the default view //-->
            <span class="bar-separator" v-if="state.active != 'MISC_TAB_DEFAULT' && !state.disable"> / </span>

            <!-- Sub-route (current page) label //-->
            <span class="bar-label" v-if="state.active != 'MISC_TAB_DEFAULT' && !state.disable"> {{ state.label }} </span>
        </section>

        <!-- Miscellaneous pages content wrapper //-->
        <section class="miscellaneous-content" v-if="state.active == 'MISC_TAB_DEFAULT'"  ref="parent">

            <!-- Application changelog option section //-->
            <div class="content-item" ref="changelog-category">
                <changelog-page-component/>
            </div>

            <!-- Privacy & safety statement option section //-->
            <div class="content-item" ref="privacy-and-safety-category">
                <privacy-and-safety-page-component  v-on:clicked="handle_click_event"/>
            </div>

            <!-- User persisted data delete option section //-->
            <div class="content-item" ref="delete-data-category">
                <delete-data-page-component/>
            </div>
        </section>

        <!-- Dynamically selected statement component //-->
        <section class="miscellaneous-content" v-else>
            <component v-bind:is="state.active"/>
        </section>
    </main>
</template>

<script lang="ts" src="./miscellaneous.ts"></script>
<style lang="scss" src="./miscellaneous.scss" scoped></style>