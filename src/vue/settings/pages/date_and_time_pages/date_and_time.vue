<template>
    <!-- Date & Time pages root element //-->
    <main class="component-date-and-time">

        <!-- Date & Time pages titlebar //-->
        <section class="date-and-time-bar">

            <!-- Date & Time title display itself //-->
            <span class="bar-title"> Date & Time </span>
        </section>

        <!-- Date & Time pages content wrapper //-->
        <section class="date-and-time-content" ref="parent">

            <!-- Example clock for easier configuration //-->
            <div class="content-example">
                
                <!-- Display wrapper for both date & time displays. //-->
                <div class="example-display">

                    <!-- Larger time display //-->
                    <span class="display-time">
                        {{ state.time }}
                    </span>

                    <!-- Smaller current date display //-->
                    <span class="display-date">
                        {{ state.date }}
                    </span>
                </div>
            </div>

            <!-- Clock time convention display option section //-->
            <div class="content-item" ref="time-convention-category">
                <time-convention-page-component/>
            </div>

            <!-- Time display format option section //-->
            <div class="content-item" ref="time-display-category">
                <time-display-page-component/>
            </div>

            <!-- Date display format option section //-->
            <div class="content-item" ref="date-display-category">
                <date-display-page-component/>
            </div>
        </section>
    </main>
</template>

<script lang="ts" src="./date_and_time.ts"></script>
<style lang="scss" src="./date_and_time.scss" scoped></style>