<template>
  <v-app>
    <!-- Header -->
    <v-app-bar color="primary" dark>
      <v-app-bar-title>
        <div class="d-flex align-center">
          <v-icon icon="mdi-dna" class="mr-3"></v-icon>
          <div>
            <div class="text-h6">Genetic Variants</div>
          </div>
        </div>
      </v-app-bar-title>
      
      <v-spacer></v-spacer>
      
      <v-btn
        color="white"
        variant="outlined"
        prepend-icon="mdi-plus"
        @click="showAddForm = true"
      >
        Add Variant
      </v-btn>
    </v-app-bar>

    <!-- Content -->
    <v-main class="bg-grey-lighten-4">
      <v-container class="pa-6">
        <div class="mb-6">
          <VariantFilters />
        </div>

        <div class="mb-6">
          <VariantTable
            :loading="loading"
            :error="error"
            @view="handleView"
            @delete="handleDelete"
          />
        </div>
      </v-container>
    </v-main>

    <v-dialog
      v-model="showAddForm"
      max-width="800px"
      persistent
    >
      <VariantForm
        :loading="loading"
        @submit="handleFormSubmit"
        @cancel="closeModal"
      />
    </v-dialog>

    <v-dialog
      v-model="viewingVariant"
      max-width="600px"
    >
      <v-card v-if="viewingVariant">
        <v-card-title class="text-h5">
          Variant Details
        </v-card-title>
        
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon icon="mdi-dna" color="primary"></v-icon>
                </template>
                <v-list-item-title>Gene</v-list-item-title>
                <v-list-item-subtitle>{{ viewingVariant.gene }}</v-list-item-subtitle>
              </v-list-item>
            </v-col>
            
            <v-col cols="12" md="6">
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon icon="mdi-tag" color="primary"></v-icon>
                </template>
                <v-list-item-title>Type</v-list-item-title>
                <v-list-item-subtitle>{{ viewingVariant.variant_type }}</v-list-item-subtitle>
              </v-list-item>
            </v-col>
            
            <v-col cols="12" md="6">
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon icon="mdi-heart-pulse" color="primary"></v-icon>
                </template>
                <v-list-item-title>Clinical Significance</v-list-item-title>
                <v-list-item-subtitle>{{ viewingVariant.clinical_significance }}</v-list-item-subtitle>
              </v-list-item>
            </v-col>
            
            <v-col cols="12" md="6">
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon icon="mdi-chromosome" color="primary"></v-icon>
                </template>
                <v-list-item-title>Chromosome</v-list-item-title>
                <v-list-item-subtitle>{{ viewingVariant.chromosome || '-' }}</v-list-item-subtitle>
              </v-list-item>
            </v-col>
            
            <v-col cols="12" md="6">
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon icon="mdi-map-marker" color="primary"></v-icon>
                </template>
                <v-list-item-title>Position</v-list-item-title>
                <v-list-item-subtitle>{{ viewingVariant.position ? viewingVariant.position.toLocaleString() : '-' }}</v-list-item-subtitle>
              </v-list-item>
            </v-col>
            
            <v-col cols="12">
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon icon="mdi-text" color="primary"></v-icon>
                </template>
                <v-list-item-title>Description</v-list-item-title>
                <v-list-item-subtitle>{{ viewingVariant.description || '-' }}</v-list-item-subtitle>
              </v-list-item>
            </v-col>
          </v-row>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            variant="outlined"
            @click="closeViewModal"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="toast.show"
      :color="toast.type === 'success' ? 'success' : 'error'"
      timeout="3000"
      location="top right"
    >
      <div class="d-flex align-center">
        <v-icon
          :icon="toast.type === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle'"
          class="mr-2"
        ></v-icon>
        {{ toast.message }}
      </div>
      
      <template v-slot:actions>
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="hideToast"
        ></v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useVariantsStore } from '@/stores/variants'
import VariantTable from '@/components/VariantTable.vue'
import VariantForm from '@/components/VariantForm.vue'
import VariantFilters from '@/components/VariantFilters.vue'

const variantsStore = useVariantsStore()

const showAddForm = ref(false)
const viewingVariant = ref(null)
const toast = reactive({
  show: false,
  message: '',
  type: 'success'
})

const variants = computed(() => variantsStore.getVariants)
const loading = computed(() => variantsStore.getLoading)
const error = computed(() => variantsStore.getError)

const handleView = (variant) => {
  viewingVariant.value = variant
}

const handleDelete = async (variant) => {
  const result = await variantsStore.deleteVariant(variant.id)
  if (result.success) {
    showToast('Variant deleted', 'success')
  } else {
    showToast(result.error || 'Failed to delete variant', 'error')
  }
}

const handleFormSubmit = async (formData) => {
  const result = await variantsStore.createVariant(formData)
  
  if (result.success) {
    showToast('Variant created successfully', 'success')
    closeModal()
  } else {
    showToast(result.error || 'Failed to save variant', 'error')
  }
}

const closeModal = () => {
  showAddForm.value = false
}

const closeViewModal = () => {
  viewingVariant.value = null
}

const showToast = (message, type = 'success') => {
  toast.message = message
  toast.type = type
  toast.show = true
}

const hideToast = () => {
  toast.show = false
}

onMounted(() => {
  variantsStore.fetchVariants()
})
</script> 