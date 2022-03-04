<template>
    <!-- Date & Time pages root element //-->
    <main class="component-date-and-time">

        <!-- Date & Time pages titlebar //-->
        <section class="date-and-time-bar">

            <!-- Date & Time title display itself //-->
            <span class="bar-title"> Date & Time </span>
        </section>

        <!-- Date & Time pages content wrapper //-->
        <section class="date-and-time-content">

            <!-- Clock time convention display option section //-->
            <div class="content-item">
                <time-convention-page-component/>
            </div>

            <!-- Date display format option section //-->
            <div class="content-item">
                <date-display-page-component/>
            </div>

            <!-- Time display format option section //-->
            <div class="content-item">
                <time-display-page-component/>
            </div>
        </section>
    </main>
</template>

<script lang="ts" src="./date_and_time.ts"></script>
<style lang="scss" src="./date_and_time.scss" scoped></style>