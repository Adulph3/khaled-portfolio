let input = ''

for await (const chunk of process.stdin) input += chunk

const trackedFiles = input.split('\0').filter(Boolean)

if (trackedFiles.length === 0) {
  throw new Error('No tracked files were received; the Git index is unavailable or empty.')
}

const forbiddenPatterns = [
  /(^|\/)node_modules\//,
  /(^|\/)(?:dist|coverage|test-results|playwright-report|blob-report|\.vite|\.cache|\.tmp|tmp|temp|screenshots|\.idea|\.vscode|\.agents|\.codex)\//,
  /(^|\/)e2e\/screenshots\//,
  /(^|\/)\.env(?:\.|$)/,
  /(^|\/)[^/]+\.env$/,
  /(^|\/)\.npmrc$/,
  /(^|\/).*credentials.*\.json$/i,
  /(^|\/).*service[-_]account.*\.json$/i,
  /(^|\/)(?:id_rsa|id_ed25519).*$/i,
  /(^|\/)(?:gitleaks|trufflehog|secret-scan|secrets|detect-secrets)-report\.[^/]+$/i,
  /(^|\/)(?:\.DS_Store|Thumbs\.db|trace\.zip|npm-debug\.log.*)$/i,
  /(?:\.actual|\.diff|\.snap)\.png$/i,
  /\.(?:docx|pdf|pem|key|p12|pfx|jks|keystore|crt|cer|der|csr|db|sqlite|sqlite3|dump|bak|backup|zip|7z|tar|gz|rar|tgz|xz|bz2|log|webm)$/i,
]

const forbiddenFiles = trackedFiles.filter((file) =>
  forbiddenPatterns.some((pattern) => pattern.test(file)),
)

if (forbiddenFiles.length > 0) {
  throw new Error(`Forbidden files are tracked:\n${forbiddenFiles.join('\n')}`)
}

console.log(`Tracked-file policy passed for ${trackedFiles.length} files.`)
