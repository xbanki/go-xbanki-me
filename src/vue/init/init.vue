<template>
    <modal-component v-on:ready="data.ev = $event" v-on:confirm="confirm_init_settings" v-on:cancel="revert_realtime_options">

        <!-- Initialization component wrapper //-->
        <main class="component-init">

            <!-- Temporary warning for ugly styling //-->
            <span class="init-warning"> <strong style="color: red;"> ATTENTION! </strong> Don't mind the dust and the ugly styling, everything is still heavily work in progress :) </span>

            <!-- Background image display format title //-->
            <span class="init-title"> Background Image Fit </span>

            <!-- Background image display format //-->
            <div class="init-display">

                <!-- Stretch type //-->
                <div class="display-stretch">
                    <input type="radio" name="display-stretch" id="init-display-stretch" value="METHOD_STRETCH" v-on:change="update_realtime_options" v-model="state.selected_background_display_method">
                    <label for="display-stretch"> Stretch </label>
                </div>

                <!-- Fill type //-->
                <div class="display-fill">
                    <input type="radio" name="display-fill" id="init-display-fill" value="METHOD_FILL" v-on:change="update_realtime_options" v-model="state.selected_background_display_method">
                    <label for="display-fill"> Fill </label>
                </div>

                <!-- Fit type //-->
                <div class="display-fit">
                    <input type="radio" name="display-fit" id="init-display-fit" value="METHOD_FIT" v-on:change="update_realtime_options" v-model="state.selected_background_display_method">
                    <label for="display-fit"> Fit </label>
                </div>
            </div>

            <!-- User theme display title //-->
            <span class="init-title"> Application Theme </span>

            <!-- Availlable user themes //-->
            <div class="init-theme">

                <!-- Light Theme //-->
                <div class="theme-light">
                    <input type="radio" name="theme-light" id="init-theme-light" value="THEME_LIGHT" v-on:change="update_realtime_options" v-model="state.selected_application_theme">
                    <label for="theme-light"> Light </label>
                </div>

                <!-- Dark Theme //-->
                <div class="theme-dark">
                    <input type="radio" name="theme-dark" id="init-theme-dark" value="THEME_DARK" v-on:change="update_realtime_options" v-model="state.selected_application_theme">
                    <label for="theme-dark"> Dark </label>
                </div>

                <!-- Light Theme //-->
                <div class="theme-system">
                    <input type="radio" name="theme-system" id="init-theme-system" value="THEME_SYSTEM" v-on:change="update_realtime_options" v-model="state.selected_application_theme" v-bind:disabled="!eventBusStore.supports_system_theme_switch">
                    <label for="theme-system" v-bind:class="{ disabled: !eventBusStore.supports_system_theme_switch }"> System </label>
                </div>
            </div>

            <!-- Clock display settings title //-->
            <span class="init-title"> Clock Settings </span>

            <!-- Clock component settings //-->
            <div class="init-clock">
                <init-clock-component/>
            </div>
        </main>
    </modal-component>
</template>

<script lang="ts" src="./init.ts"></script>
<style lang="scss" src="./init.scss"></style>