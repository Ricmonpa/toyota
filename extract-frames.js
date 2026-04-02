const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

let ffmpegPath;
let ffprobePath;
try {
  ffmpegPath = require("ffmpeg-static");
  ffprobePath = require("ffprobe-static").path;
} catch {
  console.error(
    "Faltan dependencias. Ejecuta: npm install ffmpeg-static ffprobe-static --save-dev"
  );
  process.exit(1);
}

const W = 800;
const H = 600;

const input = path.resolve(__dirname, "yaris_spin.mp4");
const outDir = path.resolve(__dirname, "public", "frames");

if (!fs.existsSync(input)) {
  console.error("No se encontró yaris_spin.mp4 en la raíz del proyecto.");
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });

const probe = spawnSync(
  ffprobePath,
  [
    "-v",
    "error",
    "-show_entries",
    "format=duration",
    "-of",
    "default=nk=1:nw=1",
    input,
  ],
  { encoding: "utf8" }
);

if (probe.status !== 0) {
  console.error("Error ejecutando ffprobe:\n", probe.stderr);
  process.exit(probe.status || 1);
}

const duration = parseFloat(probe.stdout.trim());
if (!Number.isFinite(duration) || duration <= 0) {
  console.error("No se pudo leer la duración del video.");
  process.exit(1);
}

// Escala manteniendo aspect ratio, rellena 800×600 y recorta el centro (sin bandas).
const vf = `scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},fps=36/${duration}`;

const ffmpeg = spawnSync(
  ffmpegPath,
  [
    "-y",
    "-i",
    input,
    "-vf",
    vf,
    "-frames:v",
    "36",
    "-c:v",
    "libwebp",
    "-quality",
    "72",
    "-compression_level",
    "6",
    path.join(outDir, "frame_%d.webp"),
  ],
  { stdio: "inherit" }
);

if (ffmpeg.status !== 0) {
  process.exit(ffmpeg.status || 1);
}

console.log(
  `Listo: 36 frames ${W}×${H} en public/frames (frame_1.webp … frame_36.webp).`
);
