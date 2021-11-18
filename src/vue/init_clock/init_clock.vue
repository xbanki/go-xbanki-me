<template>
    
    <!-- Clock & time of date component settings //-->
    <section class="component-init-clock">

        <!-- Upper half of the clock component settings //-->
        <div class="component-init-upper">

            <!-- Right-hand-side wrapper //-->
            <div class="upper-right">
                
                <!-- Clock display format title //-->
                <span class="right-title"> Time Convention </span>

                <!-- Clock display format, 24H or AM/PM //-->
                <div class="right-convention">

                    <!-- European, or 24 hour clock convention //-->
                    <div class="convention-european">

                        <!-- Radio input element //-->
                        <input type="radio" name="convention-european" value="CONVENTION_24H" id="convention-european" v-model="state.active_clock_convention">

                        <!-- Radio label element //-->
                        <label for="convention-european"> 24 Hour Clock </label>
                    </div>

                    <!-- American, or AM/PM clock convention //-->
                    <div class="convention-american">

                        <!-- Radio input element //-->
                        <input type="radio" name="convention-american" value="CONVENTION_AM_PM" id="convention-american" v-model="state.active_clock_convention">

                        <!-- Radio label element //-->
                        <label for="convention-american"> 12 Hour Clock </label>
                    </div>
                </div>

                <!-- Clock format delimiter title //-->
                <span class="right-title"> Format Delimiter </span>

                <!-- Clock format delimiter, or separator //-->
                <div class="right-delimiter">

                    <!-- Space delimiter //-->
                    <div class="delimiter-space">

                        <!-- Radio input element //-->
                        <input type="radio" name="delimiter-space" id="delimiter-space" value="DELIMITER_SPACE" v-model="state.active_format_delimiter">

                        <!-- Radio label element //-->
                        <label for="delimiter-space"> Blank </label>
                    </div>

                    <!-- Comma delimiter //-->
                    <div class="delimiter-comma">

                        <!-- Radio input element //-->
                        <input type="radio" name="delimiter-comma" id="delimiter-comma" value="DELIMITER_COMMA" v-model="state.active_format_delimiter">

                        <!-- Radio label element //-->
                        <label for="delimiter-comma"> Comma </label>
                    </div>

                    <!-- Slash delimiter //-->
                    <div class="delimiter-slash">

                        <!-- Radio input element //-->
                        <input type="radio" name="delimiter-slash" id="delimiter-slash" value="DELIMITER_SLASH" v-model="state.active_format_delimiter">

                        <!-- Radio label element //-->
                        <label for="delimiter-slash"> Slash </label>
                    </div>

                    <!-- Dash delimiter //-->
                    <div class="delimiter-dash">

                        <!-- Radio input element //-->
                        <input type="radio" name="delimiter-dash" id="delimiter-dash" value="DELIMITER_DASH" v-model="state.active_format_delimiter">

                        <!-- Radio label element //-->
                        <label for="delimiter-dash"> Dash </label>
                    </div>

                    <!-- Dot delimiter //-->
                    <div class="delimiter-dot">

                        <!-- Radio input element //-->
                        <input type="radio" name="delimiter-dot" id="delimiter-dot" value="DELIMITER_DOT" v-model="state.active_format_delimiter">

                        <!-- Radio label element //-->
                        <label for="delimiter-dot"> Period </label>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts" src="./init_clock.ts"></script>
<style lang="scss" src="./init_clock.scss"></style>