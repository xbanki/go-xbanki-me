<template>

    <!-- Clock component wrapper parent //-->
    <main class="component-clock">

        <!-- Clock date display //-->
        <span class="clock-date"> {{ state.active_time_data }} </span>

        <!-- CLock current time display //-->
        <span class="clock-time"> {{ state.active_date_data }} </span>
    </main>
</template>

<script lang="ts" src="./clock.ts"></script>
<style lang="scss" src="./clock.scss"></style>