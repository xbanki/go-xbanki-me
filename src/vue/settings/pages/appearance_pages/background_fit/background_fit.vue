<template>

    <!-- Background Fit category page root element //-->
    <main class="component-background-fit">

        <!-- Background Fit component title display //-->
        <span class="background-fit-title" v-if="!standalone"> Background Image Fit </span>

        <!-- Background Fit selections container //-->
        <section class="background-fit-selections">

            <!-- Stretch item container //-->
            <div class="selections-item">

                <!-- Background Fit selection icon //-->
                <input type="radio" name="method-stretch" id="settings-background-fit-stretch" value="METHOD_STRETCH" v-on:change="update" v-model="state.selected_background_display_method">
            
                <!-- Background Fit name descriptor //-->
                <label for="method-stretch"> Stretch </label>
            </div>

            <!-- Fill item container //-->
            <div class="selections-item">

                <!-- Background Fit selection icon //-->
                <input type="radio" name="method-fill" id="settings-background-fit-fill" value="METHOD_FILL" v-on:change="update" v-model="state.selected_background_display_method">

                <!-- Background Fit name descriptor //-->
                <label for="method-fill"> Fill </label>
            </div>

            <!-- Fit item container //-->
            <div class="selections-item">

                <!-- Background Fit selection icon //-->
                <input type="radio" name="method-fit" id="settings-background-fill-fit" value="METHOD_FIT" v-on:change="update" v-model="state.selected_background_display_method">

                <!-- Background Fit name descriptor //-->
                <label for="method-fit"> Fit </label>
            </div>
        </section>
    </main>
</template>

<script lang="ts" src="./background_fit.ts"></script>
<style lang="scss" src="./background_fit.scss" scoped></style>