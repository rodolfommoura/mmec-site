// Open Graph image, rendered at build time from the brand files: the horizontal ink logo,
// unchanged, centred on cream. No third-party service is involved.
import { readFile } from "node:fs/promises";
import type { APIRoute } from "astro";
import sharp from "sharp";
import { readBrandColors } from "../../design/contrast";
import tokensCss from "../../styles/tokens.css?raw";
import { ogImage } from "../../config/site";

// 3600 x 1200 artboard (clear space included), scaled down to fit the card.
const logoWidth = 960;

export const GET: APIRoute = async () => {
  const logoSvg = await readFile("public/brand/svg/mmec-logo-horizontal-ink.svg");
  const logo = await sharp(logoSvg, { density: 72 }).resize({ width: logoWidth }).png().toBuffer();

  const image = await sharp({
    create: {
      width: ogImage.width,
      height: ogImage.height,
      channels: 3,
      background: readBrandColors(tokensCss).cream,
    },
  })
    .composite([{ input: logo, gravity: "centre" }])
    .png({ compressionLevel: 9 })
    .toBuffer();

  return new Response(new Uint8Array(image), { headers: { "Content-Type": "image/png" } });
};
