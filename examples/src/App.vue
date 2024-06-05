<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { vec2 } from '@4bitlabs/vec2';
import * as M from 'transformation-matrix';
import { watercolorize } from '@watercolorizer/watercolorizer';

import { mustExist } from './helpers/exists.ts';
import { pathPoly } from './helpers/polygons.ts';
import { gaussRng } from './helpers/gauss-rng.ts';
import { randomWeights } from './helpers/random-weights.ts';
import { generateFillStyle, colors } from './helpers/palette-helpers.ts';

const canvasRef = ref<HTMLCanvasElement | null>(null);
const cancelRef = ref<number>(0);

const nGon = (length: number) =>
  Array.from({ length: length }, (_, i) =>
    vec2(
      Math.cos((i / length) * (Math.PI * 2)),
      -Math.sin((i / length) * (Math.PI * 2)),
    ),
  );

const hex = M.applyToPoints(M.scale(100, 100), nGon(6));
const dodecagon = M.applyToPoints(M.scale(100, 100), nGon(12));
const square = M.applyToPoints(
  M.compose(M.rotate(Math.PI / 4), M.scale(100, 100)),
  nGon(4),
);

const gons = [
  M.applyToPoints(M.translate(-270, 0), hex),
  M.applyToPoints(M.translate(0, 0), dodecagon),
  M.applyToPoints(M.translate(270, 0), square),
];

onMounted(() => {
  const el = mustExist(canvasRef.value);
  const ctx = mustExist(el.getContext('2d'));
  const matrix = M.translate(el.width / 2, el.height / 2);

  function render() {
    ctx.clearRect(0, 0, el.width, el.height);

    // sketch
    gons.forEach((points) => {
      const polygon = M.applyToPoints(matrix, points);
      pathPoly(ctx, polygon);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(164 221 237 / 100%)';
      ctx.stroke();
    });

    ctx.globalCompositeOperation = 'multiply';

    // paint
    gons.forEach((points) => {
      const polygon = M.applyToPoints(matrix, points);

      const vertexWeights = randomWeights(points, 0.1);

      const options = {
        preEvolutions: 4,
        evolutions: 2,
        layersPerEvolution: 4,
        layerEvolutions: 2,
        vertexWeights,
      };

      const base = colors[Math.floor(Math.random() * colors.length)];
      for (const layer of watercolorize(polygon, options)) {
        pathPoly(ctx, layer);

        ctx.fillStyle = generateFillStyle(ctx, layer, base);
        ctx.fill();

        if (Math.random() < 0.5) {
          ctx.lineWidth = gaussRng(1, 1 / 3);
          ctx.strokeStyle = generateFillStyle(ctx, layer, base);
          ctx.stroke();
        }
      }
    });
  }

  render();
  let pt = 0;
  (function tick(t: DOMHighResTimeStamp) {
    if (t - pt > 1000 / 0.5) {
      pt = t;
      render();
    }
    cancelRef.value = requestAnimationFrame(tick);
  })(performance.now());
  // el.addEventListener('click', render);
});

onUnmounted(() => {
  cancelAnimationFrame(cancelRef.value);
});
</script>

<template>
  <canvas width="1200" height="800" ref="canvasRef"></canvas>
</template>

<style scoped>
:global(:root) {
  min-height: 100vh;
  width: 100vw;
  display: grid;
  align-items: center;
  justify-items: center;
}
canvas {
  mix-blend-mode: multiply;
}
</style>
