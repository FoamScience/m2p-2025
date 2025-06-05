// For docs on available styles and how to add more:
// https://github.com/citation-js/citation-js/tree/main/packages/plugin-csl
import fs from 'fs'
import path from 'path'
import { parse } from '@retorquere/bibtex-parser'
// @ts-ignore
import Cite from 'citation-js'

const args = process.argv.slice(2)
const inputPath = args[0] ? path.resolve(process.cwd(), args[0]) : null
const styleName = args[1] || 'apa' // Default to APA style
console.log(`Citation formatting uses ${styleName} style`)
const outputPath = path.resolve(process.cwd(), 'dist', 'assets', 'citations.json')

if (!inputPath) {
  console.error('❌ Usage: node parse-bibtex.js <path-to-bibtex-file> [style:apa,vancouver,harvard1]')
  process.exit(1)
}

async function formatCitations(entry: any, style: string): Promise<string> {
  const Cite = require('citation-js')
  
  try {
    const entryCopy = JSON.parse(JSON.stringify(entry))
    if (entryCopy.fields.author) {
      if (typeof entryCopy.fields.author !== 'string') {
        //console.log(JSON.stringify(entryCopy.fields.author, null, 2))
        if (Array.isArray(entryCopy.fields.author)) {
          entryCopy.fields.author = entryCopy.fields.author.map((author: any) => 
            typeof author === 'string' ? author :
            `${author.lastName || ''}, ${author.firstName || ''}`
          ).join(' and ')
        } else {
          const author: any = entryCopy.fields.author
          entryCopy.fields.author = `${author.family || ''}, ${author.given || ''}`
        }
      }
    }
    let bibtexStr = `@${entryCopy.type}{${entryCopy.key},\n`
    for (const [key, value] of Object.entries(entryCopy.fields)) {
      bibtexStr += `  ${key} = {${value}},\n`
    }
    bibtexStr += '}'
    
    const citation = await Cite.async(bibtexStr)
    const formatted = citation.format('bibliography', {
      format: 'text',
      template: style,
      lang: 'en-US'
    })
    return formatted.trim().replace(/\n\s+/g, ' ')
  } catch (error) {
    console.error(`Error formatting citation for ${entry.key}:`, error)
    return `[Error formatting citation for ${entry.key}]`
  }
}

async function main() {
  const bib = fs.readFileSync(inputPath!, 'utf8')
  const parsed = parse(bib)

  const entries = await Promise.all(parsed.entries.map(async entry => ({
    citeKey: entry.key,
    // @ts-ignore
    identifier: `${entry.fields.author[0].lastName}, ${entry.fields.year}`,
    formatted: await formatCitations(entry, styleName)
  })))

  if (!fs.existsSync(path.dirname(outputPath))) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  }

  fs.writeFileSync(outputPath, JSON.stringify(entries, null, 2))
  console.log(`✅ ${entries.length} citations saved to ${outputPath}`)
}

main().catch(err => {
  console.error(err)
})
