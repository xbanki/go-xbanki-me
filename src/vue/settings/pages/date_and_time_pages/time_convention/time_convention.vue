<template>

    <!-- Time convention category page root element //-->
    <main class="component-time-convention">

        <!-- Time Convention component title display //-->
        <span class="time-convention-title" v-if="!standalone"> Time Convention </span>

        <!-- Time Convention selections container //-->
        <section class="time-convention-selections">

            <!-- Time Convention item container //-->
            <div class="selections-item">

                <!-- Time Convention selection icon //-->
                <input type="radio" name="item-european" id="time-convention-european" value="CONVENTION_24H" v-on:change="update" v-model="state.selected_clock_convention">

                <!-- Time Convention name descriptor //-->
                <label for="item-european"> 24 Hour Clock </label>
            </div>

            <!-- Time Convention item container //-->
            <div class="selections-item">

                <!-- Time Convention selection icon //-->
                <input type="radio" name="item-american" id="time-convention-american" value="CONVENTION_AM_PM" v-on:change="update" v-model="state.selected_clock_convention">

                <!-- Time Convention name descriptor //-->
                <label for="item-american"> 12 Hour Clock (AM/PM) </label>
            </div>
        </section>
    </main>
</template>

<script lang="ts" src="./time_convention.ts"></script>
<style lang="scss" src="./time_convention.scss" scoped></style>