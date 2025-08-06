<template>
  <v-card class="pa-6">
    <div class="d-flex align-center justify-space-between mb-4">
      <h3 class="text-h6">Search-Filters</h3>
      <v-btn
        variant="text"
        color="primary"
        size="small"
        @click="clearSearch"
        prepend-icon="mdi-refresh"
      >
        Clear
      </v-btn>
    </div>

    <v-row>
      <v-col cols="12" md="6" lg="4">
        <v-text-field
          v-model="localSearch"
          label="Search by gene name"
          variant="outlined"
          density="compact"
          placeholder="Search Genes"
          prepend-inner-icon="mdi-magnify"
          @input="debounceSearch"
          clearable
        ></v-text-field>
      </v-col>
      
      <v-col cols="12" md="6" lg="4">
        <v-select
          v-model="localSelectedType"
          label="Variant Type"
          variant="outlined"
          density="compact"
          :items="variantTypes"
          clearable
          @update:model-value="updateTypeFilter"
          prepend-inner-icon="mdi-tag"
        ></v-select>
      </v-col>
      
      <v-col cols="12" md="6" lg="4">
        <v-select
          v-model="localSelectedSignificance"
          label="Clinical Significance"
          variant="outlined"
          density="compact"
          :items="clinicalSignificances"
          clearable
          @update:model-value="updateSignificanceFilter"
          prepend-inner-icon="mdi-heart-pulse"
        ></v-select>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useVariantsStore } from '@/stores/variants'

const variantsStore = useVariantsStore()

const localSearch = ref('')
const localSelectedType = ref(null)
const localSelectedSignificance = ref(null)

const variantTypes = [
  { title: 'SNV', value: 'SNV' },
  { title: 'INDEL', value: 'INDEL' },
  { title: 'CNV', value: 'CNV' },
  { title: 'SV', value: 'SV' }
]

const clinicalSignificances = [
  { title: 'Pathogenic', value: 'Pathogenic' },
  { title: 'Likely Pathogenic', value: 'Likely_Pathogenic' },
  { title: 'VUS', value: 'VUS' },
  { title: 'Likely Benign', value: 'Likely_Benign' },
  { title: 'Benign', value: 'Benign' }
]

// Debounce
let searchTimeout = null
const debounceSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    variantsStore.setSearch(localSearch.value)
  }, 300)
}

const updateTypeFilter = () => {
  variantsStore.setSelectedType(localSelectedType.value)
}

const updateSignificanceFilter = () => {
  variantsStore.setSelectedSignificance(localSelectedSignificance.value)
}

const clearSearch = () => {
  localSearch.value = ''
  localSelectedType.value = null
  localSelectedSignificance.value = null
  variantsStore.clearFilters()
}

// Watch for store changes to sync local state
watch(() => variantsStore.getSearch, (newSearch) => {
  localSearch.value = newSearch || ''
}, { immediate: true })

watch(() => variantsStore.getSelectedType, (newType) => {
  localSelectedType.value = newType
}, { immediate: true })

watch(() => variantsStore.getSelectedSignificance, (newSignificance) => {
  localSelectedSignificance.value = newSignificance
}, { immediate: true })
</script> 