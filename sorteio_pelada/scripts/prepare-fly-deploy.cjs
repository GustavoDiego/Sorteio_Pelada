const fs = require('fs')
const path = require('path')

const rootDir = path.resolve(__dirname, '..')
const distDir = path.join(rootDir, 'dist', 'sorteio_pelada')
const deployDir = path.join(rootDir, 'angular-deploy')
const keepFiles = new Set(['Dockerfile', 'fly.toml'])

if (!fs.existsSync(distDir)) {
    console.error(`[deploy] Build output not found: ${distDir}`)
    process.exit(1)
}

if (!fs.existsSync(deployDir)) {
    fs.mkdirSync(deployDir, { recursive: true })
}

for (const entry of fs.readdirSync(deployDir)) {
    if (keepFiles.has(entry)) continue
    fs.rmSync(path.join(deployDir, entry), { recursive: true, force: true })
}

for (const entry of fs.readdirSync(distDir)) {
    copyRecursive(path.join(distDir, entry), path.join(deployDir, entry))
}

console.log('[deploy] angular-deploy atualizado com o build mais recente.')

function copyRecursive(source, target) {
    const stat = fs.statSync(source)
    if (stat.isDirectory()) {
        fs.mkdirSync(target, { recursive: true })
        for (const entry of fs.readdirSync(source)) {
            copyRecursive(path.join(source, entry), path.join(target, entry))
        }
        return
    }

    fs.copyFileSync(source, target)
}
