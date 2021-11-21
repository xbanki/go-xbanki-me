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
                        <input type="radio" name="convention-european" value="CONVENTION_24H" id="convention-european" v-on:change="update_realtime_options" v-model="state.active_clock_convention">

                        <!-- Radio label element //-->
                        <label for="convention-european"> 24 Hour Clock </label>
                    </div>

                    <!-- American, or AM/PM clock convention //-->
                    <div class="convention-american">

                        <!-- Radio input element //-->
                        <input type="radio" name="convention-american" value="CONVENTION_AM_PM" id="convention-american" v-on:change="update_realtime_options" v-model="state.active_clock_convention">

                        <!-- Radio label element //-->
                        <label for="convention-american"> 12 Hour Clock </label>
                    </div>
                </div>

                <!-- Clock format delimiter title //-->
                <span class="right-title"> Date Format Delimiter </span>

                <!-- Clock format delimiter, or separator //-->
                <div class="right-delimiter">

                    <!-- Space delimiter //-->
                    <div class="delimiter-space">

                        <!-- Radio input element //-->
                        <input type="radio" name="delimiter-space" id="delimiter-space" value="DELIMITER_SPACE" v-on:change="update_realtime_options" v-model="state.active_format_delimiter">

                        <!-- Radio label element //-->
                        <label for="delimiter-space"> Blank </label>
                    </div>

                    <!-- Comma delimiter //-->
                    <div class="delimiter-comma">

                        <!-- Radio input element //-->
                        <input type="radio" name="delimiter-comma" id="delimiter-comma" value="DELIMITER_COMMA" v-on:change="update_realtime_options" v-model="state.active_format_delimiter">

                        <!-- Radio label element //-->
                        <label for="delimiter-comma"> Comma </label>
                    </div>

                    <!-- Slash delimiter //-->
                    <div class="delimiter-slash">

                        <!-- Radio input element //-->
                        <input type="radio" name="delimiter-slash" id="delimiter-slash" value="DELIMITER_SLASH" v-on:change="update_realtime_options" v-model="state.active_format_delimiter">

                        <!-- Radio label element //-->
                        <label for="delimiter-slash"> Slash </label>
                    </div>

                    <!-- Dash delimiter //-->
                    <div class="delimiter-dash">

                        <!-- Radio input element //-->
                        <input type="radio" name="delimiter-dash" id="delimiter-dash" value="DELIMITER_DASH" v-on:change="update_realtime_options" v-model="state.active_format_delimiter">

                        <!-- Radio label element //-->
                        <label for="delimiter-dash"> Dash </label>
                    </div>

                    <!-- Dot delimiter //-->
                    <div class="delimiter-dot">

                        <!-- Radio input element //-->
                        <input type="radio" name="delimiter-dot" id="delimiter-dot" value="DELIMITER_DOT" v-on:change="update_realtime_options" v-model="state.active_format_delimiter">

                        <!-- Radio label element //-->
                        <label for="delimiter-dot"> Period </label>
                    </div>
                </div>
            </div>

            <!-- Left-hand-side wrapper, for date display location //-->
            <div class="upper-left">

                <!-- Positioning section title //-->
                <span class="left-title"> Date Display Position </span>

                <!-- Positioning parent //-->
                <div class="left-parent">

                    <!-- Left-side column //-->
                    <div class="parent-left">

                        <!-- Automatically generated column cells //-->
                        <div v-for="n in 3" v-bind:key="n" class="column-cell">

                            <!-- Only display middle cell //-->
                            <input v-if="n == 2" type="radio" name="location-left" id="location-left" value="LOCATION_LEFT" v-on:change="update_realtime_options" v-model="state.active_date_display_location">

                            <!-- Cell label //-->
                            <label v-if="n == 2" for="location-left"> Left </label>
                        </div>
                    </div>

                    <!-- Middle column //-->
                    <div class="parent-middle">

                        <!-- Automatically generated column cells //-->
                        <div v-for="n in 3" v-bind:key="n" class="column-cell">

                            <!-- Only display top cell //-->
                            <input v-if="n == 1" type="radio" name="location-top" id="location-top" value="LOCATION_TOP" v-on:change="update_realtime_options" v-model="state.active_date_display_location">

                            <!-- Cell label //-->
                            <label v-if="n == 1" for="location-top"> Top </label>

                            <!-- Middle cell label //-->
                            <span v-if="n == 2" class="disabled"> Middle </span>

                            <!-- Only display bottom cell //-->
                            <input v-if="n == 3" type="radio" name="location-bottom" id="location-bottom" value="LOCATION_BOTTOM"  v-on:change="update_realtime_options" v-model="state.active_date_display_location">

                            <!-- Cell label //-->
                            <label v-if="n == 3" for="location-bottom"> Bottom </label>
                        </div>
                    </div>

                    <!-- Right-side column //-->
                    <div class="parent-right">

                        <!-- Automatically generated column cells //-->
                        <div v-for="n in 3" v-bind:key="n" class="column-cell">

                            <!-- Only display middle cell //-->
                            <input v-if="n == 2" type="radio" name="location-right" id="location-right" value="LOCATION_RIGHT" v-on:change="update_realtime_options" v-model="state.active_date_display_location">

                            <!-- Cell label //-->
                            <label v-if="n == 2" for="location-right"> Right </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts" src="./init_clock.ts"></script>
<style lang="scss" src="./init_clock.scss"></style>