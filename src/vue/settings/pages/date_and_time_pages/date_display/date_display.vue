<template>

    <!-- Date display category page root element //-->
    <main class="component-date-display">

        <!-- Date Display component title display //-->
        <span class="date-display-title"> Date Display </span>

        <!-- Delimiter choise section //-->
        <section class="date-display-delimiter">

            <!-- Space delimiter //-->
            <div class="selections-item">

                <!-- Radio input element //-->
                <input type="radio" name="delimiter-space" id="delimiter-space" value="DELIMITER_SPACE" v-on:change="update_delimiter" v-model="state.format.delimiter">

                <!-- Radio label element //-->
                <label for="delimiter-space"> Blank </label>
            </div>

            <!-- Comma delimiter //-->
            <div class="selections-item">

                <!-- Radio input element //-->
                <input type="radio" name="delimiter-comma" id="delimiter-comma" value="DELIMITER_COMMA" v-on:change="update_delimiter" v-model="state.format.delimiter">

                <!-- Radio label element //-->
                <label for="delimiter-comma"> Comma </label>
            </div>

            <!-- Slash delimiter //-->
            <div class="selections-item">

                <!-- Radio input element //-->
                <input type="radio" name="delimiter-slash" id="delimiter-slash" value="DELIMITER_SLASH" v-on:change="update_delimiter" v-model="state.format.delimiter">

                <!-- Radio label element //-->
                <label for="delimiter-slash"> Slash </label>
            </div>

            <!-- Dash delimiter //-->
            <div class="selections-item">

                <!-- Radio input element //-->
                <input type="radio" name="delimiter-dash" id="delimiter-dash" value="DELIMITER_DASH" v-on:change="update_delimiter" v-model="state.format.delimiter">

                <!-- Radio label element //-->
                <label for="delimiter-dash"> Dash </label>
            </div>

            <!-- Dot delimiter //-->
            <div class="selections-item">

                <!-- Radio input element //-->
                <input type="radio" name="delimiter-dot" id="delimiter-dot" value="DELIMITER_DOT" v-on:change="update_delimiter" v-model="state.format.delimiter">

                <!-- Radio label element //-->
                <label for="delimiter-dot"> Period </label>
            </div>

            <!-- Colon delimiter //-->
            <div class="selections-item">

                <!-- Radio input element //-->
                <input type="radio" name="delimiter-colon" id="delimiter-colon" value="DELIMITER_COLON" v-on:change="update_delimiter" v-model="state.format.delimiter">

                <!-- Radio label element //-->
                <label for="delimiter-colon"> Colon </label>
            </div>
        </section>
    </main>
</template>

<script lang="ts" src="./date_display.ts"></script>
<style lang="scss" src="./date_display.scss" scoped></style>