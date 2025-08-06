<template>
  <v-card>
    <v-card-text v-if="loading" class="text-center pa-8">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      ></v-progress-circular>
      <div class="mt-4 text-body-1">Loading variants...</div>
    </v-card-text>

    <v-card-text v-else-if="error" class="text-center pa-8">
      <v-icon
        icon="mdi-alert-circle"
        color="error"
        size="64"
        class="mb-4"
      ></v-icon>
      <h3 class="text-h6 mb-2">Error Loading Variants</h3>
      <p class="text-body-2 mb-4">{{ error }}</p>
      <v-btn
        color="primary"
        @click="retry"
        prepend-icon="mdi-refresh"
      >
        Try Again
      </v-btn>
    </v-card-text>

    <div v-else>
      <v-card-text v-if="filteredVariants.length === 0" class="text-center pa-8">
        <v-icon
          icon="mdi-database-off"
          color="grey"
          size="64"
          class="mb-4"
        ></v-icon>
        <h3 class="text-h6 mb-2">No variants found</h3>
        <p class="text-body-2">
          {{ variants.length === 0 ? 'Get started by creating a new variant.' : 'No variants match your current filters.' }}
        </p>
      </v-card-text>

      <v-data-table
        v-else
        :headers="headers"
        :items="filteredVariants"
        class="elevation-1"
        density="comfortable"
      >
        <template v-slot:item.gene="{ item }">
          <span class="font-weight-medium">{{ item.gene }}</span>
        </template>

        <template v-slot:item.variant_type="{ item }">
          <v-chip
            color="primary"
            size="small"
            variant="outlined"
          >
            {{ item.variant_type }}
          </v-chip>
        </template>

        <template v-slot:item.clinical_significance="{ item }">
          <v-chip
            :color="getSignificanceColor(item.clinical_significance)"
            size="small"
            variant="elevated"
          >
            {{ item.clinical_significance }}
          </v-chip>
        </template>

        <template v-slot:item.chromosome="{ item }">
          {{ item.chromosome || '-' }}
        </template>

        <template v-slot:item.position="{ item }">
          {{ item.position ? item.position.toLocaleString() : '-' }}
        </template>

        <template v-slot:item.description="{ item }">
          <span class="text-truncate d-inline-block" style="max-width: 200px;" :title="item.description">
            {{ item.description || '-' }}
          </span>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn
            icon="mdi-eye"
            size="small"
            color="primary"
            variant="text"
            @click="$emit('view', item)"
            title="View variant details"
          ></v-btn>
          <v-btn
            icon="mdi-delete"
            size="small"
            color="error"
            variant="text"
            @click="confirmDelete(item)"
            title="Delete variant"
          ></v-btn>
        </template>
      </v-data-table>
    </div>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'
import { useVariantsStore } from '@/stores/variants'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['view', 'delete'])

const variantsStore = useVariantsStore()

const variants = computed(() => variantsStore.getVariants)
const filteredVariants = computed(() => variantsStore.getFilteredVariants)

const headers = [
  { title: 'Gene', key: 'gene', sortable: true },
  { title: 'Type', key: 'variant_type', sortable: true },
  { title: 'Clinical Significance', key: 'clinical_significance', sortable: true },
  { title: 'Chromosome', key: 'chromosome', sortable: true },
  { title: 'Position', key: 'position', sortable: true },
  { title: 'Description', key: 'description', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false, align: 'center' }
]

const retry = () => {
  variantsStore.clearError()
  variantsStore.fetchVariants()
}

const confirmDelete = (variant) => {
  if (confirm(`Are you sure you want to delete the variant for gene ${variant.gene}?`)) {
    emit('delete', variant)
  }
}

const getSignificanceColor = (significance) => {
  const colors = {
    'Pathogenic': 'error',
    'Likely_Pathogenic': 'orange',
    'VUS': 'warning',
    'Likely_Benign': 'info',
    'Benign': 'success'
  }
  return colors[significance] || 'grey'
}
</script> 