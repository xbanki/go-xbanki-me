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
                <input

                    id="settings-background-fit-stretch"

                    v-model="state.method"

                    value="METHOD_STRETCH"

                    name="method-stretch"

                    v-on:change="update"

                    type="radio"

                >

                <!-- Background Fit name descriptor //-->
                <label for="method-stretch"> Stretch </label>
            </div>

            <!-- Fill item container //-->
            <div class="selections-item">

                <!-- Background Fit selection icon //-->
                <input

                    id="settings-background-fit-fill"

                    v-model="state.method"

                    v-on:change="update"

                    value="METHOD_FILL"

                    name="method-fill"
                
                    type="radio"
                    
                >

                <!-- Background Fit name descriptor //-->
                <label for="method-fill"> Fill </label>
            </div>

            <!-- Fit item container //-->
            <div class="selections-item">

                <!-- Background Fit selection icon //-->
                <input

                    id="settings-background-fill-fit"

                    v-model="state.method"

                    v-on:change="update"

                    value="METHOD_FIT"

                    name="method-fit"

                    type="radio"

                >

                <!-- Background Fit name descriptor //-->
                <label for="method-fit"> Fit </label>
            </div>
        </section>
    </main>
</template>

<script lang="ts" src="./background_fit.ts"></script>
<style lang="scss" src="./background_fit.scss" scoped></style>