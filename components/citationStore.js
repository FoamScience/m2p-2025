import { reactive } from 'vue'

export const citationStore = reactive({
  citations: [],
  add(citation) {
    if (!this.citations.find(c => c.citeKey === citation.citeKey)) {
      this.citations.push(citation)
    }
  },
  clear() {
    this.citations = []
  },
})
