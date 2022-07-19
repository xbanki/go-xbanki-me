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
                <input

                    id="time-convention-european"

                    v-model="state.convention"

                    value="CONVENTION_24H"

                    v-on:change="update"

                    name="item-european"
                
                    type="radio"
                    
                >

                <!-- Time Convention name descriptor //-->
                <label for="item-european"> 24 Hour Clock </label>
            </div>

            <!-- Time Convention item container //-->
            <div class="selections-item">

                <!-- Time Convention selection icon //-->
                <input

                    id="time-convention-american"

                    v-model="state.convention"

                    value="CONVENTION_AM_PM"

                    v-on:change="update"

                    name="item-american"

                    type="radio"

                >

                <!-- Time Convention name descriptor //-->
                <label for="item-american"> 12 Hour Clock (AM/PM) </label>
            </div>
        </section>
    </main>
</template>

<script lang="ts" src="./time_convention.ts"></script>
<style lang="scss" src="./time_convention.scss" scoped></style>