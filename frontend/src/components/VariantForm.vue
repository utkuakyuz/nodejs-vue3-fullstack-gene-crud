<template>
  <v-card class="pa-6">
    <v-card-title class="text-h5 mb-4">
      {{ isEditing ? 'Edit Variant' : 'Add New Variant' }}
    </v-card-title>
    <v-card-subtitle class="pb-4">
      {{ isEditing ? 'Update the information below.' : 'Fill the details to add a new variant.' }}
    </v-card-subtitle>

    <v-form @submit.prevent="handleSubmit" ref="form">
      <v-container fluid>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="formData.gene"
              label="Gene Name *"
              required
              variant="outlined"
              placeholder="e.g., BRCA1, TP53"
              :error-messages="errors.gene"
              prepend-inner-icon="mdi-dna"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-select
              v-model="formData.variant_type"
              label="Variant Type *"
              required
              variant="outlined"
              :items="variantTypes"
              :error-messages="errors.variant_type"
              prepend-inner-icon="mdi-tag"
            ></v-select>
          </v-col>

          <v-col cols="12" md="6">
            <v-select
              v-model="formData.clinical_significance"
              label="Clinical Significance *"
              required
              variant="outlined"
              :items="clinicalSignificances"
              :error-messages="errors.clinical_significance"
              prepend-inner-icon="mdi-heart-pulse"
            ></v-select>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.chromosome"
              label="Chromosome"
              variant="outlined"
              placeholder="e.g., 1, X, Y"
              :error-messages="errors.chromosome"
              prepend-inner-icon="mdi-chromosome"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model.number="formData.position"
              label="Genomic Position"
              type="number"
              variant="outlined"
              placeholder="e.g., 43057051"
              :error-messages="errors.position"
              prepend-inner-icon="mdi-map-marker"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.reference_allele"
              label="Reference Allele"
              variant="outlined"
              placeholder="e.g., A, ATCT"
              :error-messages="errors.reference_allele"
              prepend-inner-icon="mdi-alpha-a-circle"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.alternate_allele"
              label="Alternate Allele"
              variant="outlined"
              placeholder="e.g., G, A"
              :error-messages="errors.alternate_allele"
              prepend-inner-icon="mdi-alpha-g-circle"
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-textarea
              v-model="formData.description"
              label="Description"
              variant="outlined"
              placeholder="Additional description or notes about the variant..."
              :error-messages="errors.description"
              rows="3"
              prepend-inner-icon="mdi-text"
            ></v-textarea>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" class="d-flex justify-end gap-3 pt-6">
            <v-btn
              variant="outlined"
              @click="$emit('cancel')"
              :disabled="loading"
            >
              Cancel
            </v-btn>
            <v-btn
              color="primary"
              type="submit"
              :loading="loading"
              :disabled="loading"
              prepend-icon="mdi-content-save"
            >
              {{ isEditing ? 'Update Variant' : 'Add Variant' }}
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </v-card>
</template>

<script setup>
import { reactive, computed, watch, ref } from 'vue'
import { useVariantsStore } from '@/stores/variants'

const props = defineProps({
  variant: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel'])

const variantsStore = useVariantsStore()
const form = ref(null)

const isEditing = computed(() => !!props.variant)

const variantTypes = [
  { title: 'SNV', value: 'SNV' },
  { title: 'INDEL', value: 'INDEL' },
  { title: 'CNV', value: 'CNV' },
  { title: 'SV', value: 'SV' }
]

const clinicalSignificances = [
  { title: 'Pathogenic', value: 'Pathogenic' },
  { title: 'Likely Pathogenic', value: 'Likely_Pathogenic' },
  { title: 'VUS (Variant of Uncertain Significance)', value: 'VUS' },
  { title: 'Likely Benign', value: 'Likely_Benign' },
  { title: 'Benign', value: 'Benign' }
]

const formData = reactive({
  gene: '',
  variant_type: '',
  clinical_significance: '',
  chromosome: '',
  position: null,
  reference_allele: '',
  alternate_allele: '',
  description: ''
})

const errors = reactive({
  gene: '',
  variant_type: '',
  clinical_significance: '',
  chromosome: '',
  position: '',
  reference_allele: '',
  alternate_allele: '',
  description: ''
})

// Initialize form with variant data if editing
watch(() => props.variant, (newVariant) => {
  if (newVariant) {
    Object.keys(formData).forEach(key => {
      formData[key] = newVariant[key] || ''
    })
  } else {
    // Reset form
    Object.keys(formData).forEach(key => {
      formData[key] = key === 'position' ? null : ''
    })
  }
}, { immediate: true })

const validateForm = () => {
  // Clear previous errors
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })

  let isValid = true

  // Required field validation
  if (!formData.gene.trim()) {
    errors.gene = 'Gene name is required'
    isValid = false
  }

  if (!formData.variant_type) {
    errors.variant_type = 'Variant type is required'
    isValid = false
  }

  if (!formData.clinical_significance) {
    errors.clinical_significance = 'Clinical significance is required'
    isValid = false
  }

  // Optional field validation
  if (formData.position && formData.position < 0) {
    errors.position = 'Position must be a positive number'
    isValid = false
  }

  if (formData.chromosome && !/^[1-9]|[1-2][0-9]|X|Y|MT$/i.test(formData.chromosome)) {
    errors.chromosome = 'Invalid chromosome format'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  const submitData = { ...formData }
  
  // Convert empty strings to null for optional fields
  Object.keys(submitData).forEach(key => {
    if (submitData[key] === '') {
      submitData[key] = null
    }
  })

  emit('submit', submitData)
}
</script> 