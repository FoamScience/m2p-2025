<template>
  <span><strong>[{{ citationIdentifier }}]</strong></span>
  <div :class="[ `${position}-6`, `text-${position}`, `${citeElevation}` ]" class="fixed text-xs text-gray-500 w-1/2 py-2">
    <hr v-if="divider" :class="[ position === 'right' ? 'ml-auto' : 'mr-auto' ]" class="my-2 border-t border-gray-300 w-1/2" />
    <div v-if="citation" class="px-4">
      <strong>[{{ citationIdentifier }}]</strong> {{ citation.formatted }}
    </div>
    <p v-else>Loading citation...</p>
    <p v-if="error" class="text-red-500">{{ error }}</p>
  </div>
</template>

<script>
export default {
  props: {
    citeKey: {
      type: String,
      required: true,
    },
    citeElevation: {
      type: String,
      default: "default-10",
    },
    divider: {
      type: Boolean,
      default: true,
    },
    position: {
      type: String,
      default: 'left', // 'left' or 'right'
    },
  },
  data() {
    return {
      citation: null,
      citationIdentifier: "",
      error: null,
    };
  },
  mounted() {
    this.loadCitationData();
  },
  methods: {
    async loadCitationData() {
      try {
        const response = await fetch('dist/assets/citations.json');
        if (!response.ok) {
          throw new Error('Failed to load citations');
        }
        const data = await response.json();
        this.citation = data.find((item) => item.citeKey === this.citeKey);
        console.log(this.citation.identifier)
        if (!this.citation) {
          this.error = `Citation with key "${this.key}" not found.`;
        }
        this.citationIdentifier = this.citation.identifier
      } catch (err) {
        this.error = `Error loading citation: ${err.message}`;
      }
    },
  },
};
</script>
