import { createHash } from 'node:crypto'
import { readdirSync, readFileSync } from 'node:fs'
import { extname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = fileURLToPath(new URL('../', import.meta.url))

function read(relativePath) {
  return readFileSync(join(projectRoot, relativePath), 'utf8')
}

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function collectFiles(directory, extensions) {
  const files = []

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) files.push(...collectFiles(path, extensions))
    else if (extensions.has(extname(entry.name))) files.push(path)
  }

  return files
}

const vercel = JSON.parse(read('vercel.json'))
const catchAll = vercel.headers?.find((entry) => entry.source === '/(.*)')
assert(catchAll, 'vercel.json must define catch-all security headers.')

const headers = new Map(catchAll.headers.map(({ key, value }) => [key, value]))
const requiredHeaders = new Map([
  ['Cross-Origin-Opener-Policy', 'same-origin'],
  [
    'Permissions-Policy',
    'accelerometer=(), autoplay=(), camera=(), clipboard-read=(), clipboard-write=(self), display-capture=(), encrypted-media=(), fullscreen=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), usb=()',
  ],
  ['Referrer-Policy', 'strict-origin-when-cross-origin'],
  ['Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload'],
  ['X-Content-Type-Options', 'nosniff'],
  ['X-Frame-Options', 'DENY'],
  ['X-Permitted-Cross-Domain-Policies', 'none'],
  ['X-XSS-Protection', '0'],
])

for (const [name, expected] of requiredHeaders) {
    assert(headers.get(name) === expected, `${name} is missing or has an unexpected value.`)
}

const csp = headers.get('Content-Security-Policy')
assert(csp, 'Content-Security-Policy is required.')
assert(!csp.includes("'unsafe-eval'"), "Content-Security-Policy must not allow 'unsafe-eval'.")
assert(!csp.includes("'unsafe-inline'"), "Content-Security-Policy must not allow 'unsafe-inline'.")

const directives = new Map(
  csp.split(';').map((part) => {
    const [name, ...values] = part.trim().split(/\s+/)
    return [name, values]
  }),
)
const requiredDirectives = new Map([
  ['default-src', ["'self'"]],
  ['base-uri', ["'self'"]],
  ['connect-src', ["'self'"]],
  ['form-action', ["'none'"]],
  ['frame-ancestors', ["'none'"]],
  ['frame-src', ["'none'"]],
  ['object-src', ["'none'"]],
  ['script-src-attr', ["'none'"]],
  ['style-src', ["'self'"]],
  ['style-src-attr', ["'none'"]],
  ['worker-src', ["'none'"]],
])

for (const [name, expectedValues] of requiredDirectives) {
  const values = directives.get(name)
  assert(values, `CSP directive ${name} is required.`)
  for (const value of expectedValues) {
    assert(values.includes(value), `CSP directive ${name} must contain ${value}.`)
  }
}
assert(directives.has('upgrade-insecure-requests'), 'CSP must upgrade insecure requests.')

const builtHtml = read('dist/index.html')
const inlineScripts = [...builtHtml.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
  .filter(([, attributes]) => !/\bsrc\s*=/.test(attributes))
  .map(([, , contents]) => `'sha256-${createHash('sha256').update(contents).digest('base64')}'`)
const scriptSources = directives.get('script-src') ?? []
const declaredHashes = scriptSources.filter((source) => source.startsWith("'sha256-"))

assert(inlineScripts.length > 0, 'The build must contain the expected hashed inline scripts.')
for (const hash of inlineScripts) {
  assert(scriptSources.includes(hash), `CSP is missing inline-script hash ${hash}.`)
}
assert(
  declaredHashes.length === inlineScripts.length,
  'CSP contains a stale or unexpected inline-script hash.',
)

for (const match of builtHtml.matchAll(/<script\b([^>]*)>/gi)) {
  const source = match[1].match(/\bsrc\s*=\s*["']([^"']+)["']/i)?.[1]
  if (source) {
    assert(!/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(source), `External script is not allowed: ${source}`)
  }
}

const sourceFiles = collectFiles(join(projectRoot, 'src'), new Set(['.ts', '.tsx', '.js', '.jsx', '.css']))
const inspectedFiles = [join(projectRoot, 'index.html'), ...sourceFiles]
const forbiddenPatterns = new Map([
  ['dangerouslySetInnerHTML', /\bdangerouslySetInnerHTML\b/],
  ['innerHTML/outerHTML assignment', /\.(?:innerHTML|outerHTML)\s*=/],
  ['insertAdjacentHTML', /\binsertAdjacentHTML\s*\(/],
  ['document.write', /\bdocument\.write\s*\(/],
  ['eval', /(^|[^\w.])eval\s*\(/m],
  ['Function constructor', /\bnew\s+Function\s*\(/],
  ['string timer execution', /\bset(?:Timeout|Interval)\s*\(\s*["'`]/],
  ['dynamic import', /\bimport\s*\(/],
  ['JavaScript URL', /\bjavascript\s*:/i],
  ['insecure HTTP URL', /\bhttp:\/\//i],
])

for (const file of inspectedFiles) {
  const contents = readFileSync(file, 'utf8')
  const displayPath = relative(projectRoot, file)

  for (const [label, pattern] of forbiddenPatterns) {
    assert(!pattern.test(contents), `${displayPath} contains forbidden ${label}.`)
  }

  if (extname(file) === '.tsx') {
    for (const match of contents.matchAll(/<a\b[\s\S]*?>/g)) {
      const tag = match[0]
      if (!/\btarget\s*=\s*["']_blank["']/.test(tag)) continue

      const rel = tag.match(/\brel\s*=\s*["']([^"']+)["']/)?.[1]?.split(/\s+/) ?? []
      assert(
        rel.includes('noopener') && rel.includes('noreferrer'),
        `${displayPath} has target="_blank" without rel="noopener noreferrer".`,
      )
    }
  }
}

const publicationFiles = [
  ...sourceFiles,
  ...collectFiles(join(projectRoot, 'e2e'), new Set(['.ts', '.tsx', '.js', '.jsx'])),
  ...collectFiles(join(projectRoot, 'public'), new Set(['.html', '.json', '.txt', '.xml'])),
  join(projectRoot, 'index.html'),
  join(projectRoot, 'README.md'),
  join(projectRoot, 'SECURITY.md'),
  join(projectRoot, 'vercel.json'),
]
const publicPhonePattern = /(?:(?:\+|00)966[ -]*5\d(?:[ -]*\d){7}|(?<!\d)05\d(?:[ -]*\d){7})(?!\d)/

for (const file of publicationFiles) {
  const contents = readFileSync(file, 'utf8')
  assert(
    !publicPhonePattern.test(contents),
    `${relative(projectRoot, file)} contains a Saudi mobile number.`,
  )
}

for (const file of inspectedFiles) {
  const contents = readFileSync(file, 'utf8')
  assert(!/\bresumeFile\b/.test(contents), `${relative(projectRoot, file)} wires a resume file.`)
  assert(
    !/<a\b[^>]*\bdownload\b/i.test(contents),
    `${relative(projectRoot, file)} exposes a download link.`,
  )
}

console.log('Security policy verification passed.')
