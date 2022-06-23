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
                <input type="radio" name="date-delimiter-space" id="date-delimiter-space" value="DELIMITER_SPACE" v-on:change="update_delimiter" v-model="state.format.delimiter">

                <!-- Radio label element //-->
                <label for="date-delimiter-space"> Blank </label>
            </div>

            <!-- Comma delimiter //-->
            <div class="selections-item">

                <!-- Radio input element //-->
                <input type="radio" name="date-delimiter-comma" id="date-delimiter-comma" value="DELIMITER_COMMA" v-on:change="update_delimiter" v-model="state.format.delimiter">

                <!-- Radio label element //-->
                <label for="date-delimiter-comma"> Comma </label>
            </div>

            <!-- Slash delimiter //-->
            <div class="selections-item">

                <!-- Radio input element //-->
                <input type="radio" name="date-delimiter-slash" id="date-delimiter-slash" value="DELIMITER_SLASH" v-on:change="update_delimiter" v-model="state.format.delimiter">

                <!-- Radio label element //-->
                <label for="date-delimiter-slash"> Slash </label>
            </div>

            <!-- Dash delimiter //-->
            <div class="selections-item">

                <!-- Radio input element //-->
                <input type="radio" name="date-delimiter-dash" id="date-delimiter-dash" value="DELIMITER_DASH" v-on:change="update_delimiter" v-model="state.format.delimiter">

                <!-- Radio label element //-->
                <label for="date-delimiter-dash"> Dash </label>
            </div>

            <!-- Dot delimiter //-->
            <div class="selections-item">

                <!-- Radio input element //-->
                <input type="radio" name="date-delimiter-dot" id="date-delimiter-dot" value="DELIMITER_DOT" v-on:change="update_delimiter" v-model="state.format.delimiter">

                <!-- Radio label element //-->
                <label for="date-delimiter-dot"> Period </label>
            </div>

            <!-- Colon delimiter //-->
            <div class="selections-item">

                <!-- Radio input element //-->
                <input type="radio" name="date-delimiter-colon" id="date-delimiter-colon" value="DELIMITER_COLON" v-on:change="update_delimiter" v-model="state.format.delimiter">

                <!-- Radio label element //-->
                <label for="date-delimiter-colon"> Colon </label>
            </div>
        </section>
    </main>
</template>

<script lang="ts" src="./date_display.ts"></script>
<style lang="scss" src="./date_display.scss" scoped></style>