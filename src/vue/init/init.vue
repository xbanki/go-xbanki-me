<template>
    <modal-component v-on:ready="data.ev = $event" v-on:confirm="confirm_init_settings" v-on:cancel="revert_realtime_options">

        <!-- Initialization component wrapper //-->
        <main class="component-init">

            <!-- Temporary warning for ugly styling //-->
            <span class="init-warning"> <strong style="color: red;"> ATTENTION! </strong> Don't mind the dust and the ugly styling, everything is still heavily work in progress :) </span>

            <!-- Background image display format //-->
            <div class="init-display">

                <!-- Stretch type //-->
                <div class="display-stretch">
                    <input type="radio" name="display-stretch" id="init-display-stretch" value="METHOD_STRETCH" v-on:change="update_realtime_options('METHOD_STRETCH')" v-model="state.selected_background_display_method">
                    <label for="display-stretch"> Stretch </label>
                </div>

                <!-- Fill type //-->
                <div class="display-fill">
                    <input type="radio" name="display-fill" id="init-display-fill" value="METHOD_FILL" v-on:change="update_realtime_options('METHOD_FILL')" v-model="state.selected_background_display_method">
                    <label for="display-fill"> Fill </label>
                </div>

                <!-- Fit type //-->
                <div class="display-fit">
                    <input type="radio" name="display-fit" id="init-display-fit" value="METHOD_FIT" v-on:change="update_realtime_options('METHOD_FIT')" v-model="state.selected_background_display_method">
                    <label for="display-fit"> Fit </label>
                </div>
            </div>
        </main>
    </modal-component>
</template>

<script lang="ts" src="./init.ts"></script>
<style lang="scss" src="./init.scss"></style>