<template>
    
    <!-- //-->
    <section class="component-init-clock">

        <!-- Clock display format title //-->
        <span class="init-clock-title"> Time Convention </span>

        <!-- Clock display format, 24H or AM/PM //-->
        <div class="init-clock-convention">

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
    </section>
</template>

<script lang="ts" src="./init_clock.ts"></script>
<style lang="scss" src="./init_clock.scss"></style>