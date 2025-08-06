import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "axios";

export const useVariantsStore = defineStore("variants", () => {
  // State
  const variants = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const search = ref("");
  const selectedType = ref(null);
  const selectedSignificance = ref(null);

  const getVariants = computed(() => variants.value);
  const getLoading = computed(() => loading.value);
  const getError = computed(() => error.value);
  const getSearch = computed(() => search.value);
  const getSelectedType = computed(() => selectedType.value);
  const getSelectedSignificance = computed(() => selectedSignificance.value);

  const getFilteredVariants = computed(() => {
    let filtered = variants.value;

    if (search.value) {
      const searchLower = search.value.toLowerCase();
      filtered = filtered.filter(
        (variant) =>
          variant.gene?.toLowerCase().includes(searchLower) ||
          variant.description?.toLowerCase().includes(searchLower) ||
          variant.chromosome?.toLowerCase().includes(searchLower)
      );
    }

    if (selectedType.value) {
      filtered = filtered.filter(
        (variant) => variant.variant_type === selectedType.value
      );
    }

    if (selectedSignificance.value) {
      filtered = filtered.filter(
        (variant) =>
          variant.clinical_significance === selectedSignificance.value
      );
    }

    return filtered;
  });

  const fetchVariants = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.get("/api/variants");

      if (response.data.success) {
        variants.value = response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch");
      }
    } catch (err) {
      error.value =
        err.response?.data?.message || err.message || "An error occurred";
      console.error("Error fetching variants:", err);
    } finally {
      loading.value = false;
    }
  };

  const createVariant = async (variantData) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.post("/api/variants", variantData);

      if (response.data.success) {
        await fetchVariants();
        return { success: true, data: response.data.data };
      } else {
        throw new Error(response.data.message || "Failed to create variant");
      }
    } catch (err) {
      error.value =
        err.response?.data?.message || err.message || "An error occurred";
      console.error("Error creating variant:", err);
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  const deleteVariant = async (id) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.delete(`/api/variants/${id}`);

      if (response.data.success) {
        variants.value = variants.value.filter((v) => v.id !== id);
        return { success: true };
      } else {
        throw new Error(response.data.message || "Failed to delete variant");
      }
    } catch (err) {
      error.value =
        err.response?.data?.message || err.message || "An error occurred";
      console.error("Error deleting variant:", err);
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  const setSearch = (newSearch) => {
    search.value = newSearch;
  };

  const setSelectedType = (type) => {
    selectedType.value = type;
  };

  const setSelectedSignificance = (significance) => {
    selectedSignificance.value = significance;
  };

  const clearFilters = () => {
    search.value = "";
    selectedType.value = null;
    selectedSignificance.value = null;
  };

  const clearError = () => {
    error.value = null;
  };

  return {
    // State
    variants,
    loading,
    error,
    search,
    selectedType,
    selectedSignificance,

    // Getters
    getVariants,
    getLoading,
    getError,
    getSearch,
    getSelectedType,
    getSelectedSignificance,
    getFilteredVariants,

    // Actions
    fetchVariants,
    createVariant,
    deleteVariant,
    setSearch,
    setSelectedType,
    setSelectedSignificance,
    clearFilters,
    clearError,
  };
});
