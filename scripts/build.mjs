import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = (file) => readFileSync(join(root, 'src', file), 'utf8');
const dist = join(root, 'dist');

rmSync(dist, { recursive: true, force: true });
mkdirSync(join(dist, 'fonts'), { recursive: true });
cpSync(join(root, 'public'), dist, { recursive: true });

const fonts = [
  ['Silkscreen', 400, '@fontsource/silkscreen/files/silkscreen-latin-400-normal.woff2'],
  ['Silkscreen', 700, '@fontsource/silkscreen/files/silkscreen-latin-700-normal.woff2'],
  ['Nunito', 600, '@fontsource/nunito/files/nunito-latin-600-normal.woff2'],
  ['Nunito', 800, '@fontsource/nunito/files/nunito-latin-800-normal.woff2'],
];
let fontCss = '';
for (const [family, weight, file] of fonts) {
  const name = file.split('/').pop();
  cpSync(join(root, 'node_modules', file), join(dist, 'fonts', name));
  fontCss += `@font-face{font-family:"${family}";font-weight:${weight};font-display:swap;src:url(fonts/${name}) format("woff2")}\n`;
}

const shell = src('shell.html')
  .replace('</style>', `${fontCss}${src('quest.css')}</style>`);

const app = src('app.js')
  .replace("addEventListener('hashchange',route);route();", '')
  .replace('window.__t={calc,DEF,COURSE,TERMS};', '')
  .replace("'Take chapter test'", "'Fight the boss'");

const script = ['macros.js', 'c1.js', 'c2.js', 'c3.js', 'extra.js'].map(src).join('\n')
  + `\n${app}\n${src('quest.js')}`;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#100726">
<meta name="description" content="A nine-level BRRRR real estate course for first-time investors in New York's Capital Region.">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icons/icon-192.png">
<link rel="apple-touch-icon" href="icons/icon-192.png">
<style>*{box-sizing:border-box}body{margin:0}[hidden]{display:none!important}:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}</style>
</head>
<body>
${shell}
<script>
${script}
</script>
<script>if('serviceWorker'in navigator&&location.protocol.startsWith('http'))addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));</script>
</body>
</html>
`;
writeFileSync(join(dist, 'index.html'), html);
console.log('Built dist/index.html');
