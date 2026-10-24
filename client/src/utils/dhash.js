// On-Device NCII Perceptual Difference Hashing (dHash) using HTML5 Canvas API
// Guarantees private intimate images NEVER leave the user's client browser device

export async function computeImageDHash(imageFileOrBlob) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(imageFileOrBlob);

    img.onload = () => {
      try {
        // Step 1: Create an offscreen canvas of exactly 9x8 pixels
        const canvas = document.createElement('canvas');
        canvas.width = 9;
        canvas.height = 8;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          URL.revokeObjectURL(url);
          return reject(new Error('Canvas 2D context not available'));
        }

        // Draw and downscale image to 9x8
        ctx.drawImage(img, 0, 0, 9, 8);
        const imageData = ctx.getImageData(0, 0, 9, 8);
        const data = imageData.data;

        // Step 2: Convert to 9x8 grayscale matrix
        const grayMatrix = [];
        for (let y = 0; y < 8; y++) {
          const row = [];
          for (let x = 0; x < 9; x++) {
            const idx = (y * 9 + x) * 4;
            // Standard luminance weighting: 0.299 R + 0.587 G + 0.114 B
            const gray = Math.round(data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114);
            row.push(gray);
          }
          grayMatrix.push(row);
        }

        // Step 3: Compute adjacent pixel gradient (64 bits total)
        let binaryHash = "";
        for (let y = 0; y < 8; y++) {
          for (let x = 0; x < 8; x++) {
            // Compare left pixel with right neighbor
            const left = grayMatrix[y][x];
            const right = grayMatrix[y][x + 1];
            binaryHash += left > right ? "1" : "0";
          }
        }

        URL.revokeObjectURL(url);
        resolve(binaryHash);
      } catch (err) {
        URL.revokeObjectURL(url);
        reject(err);
      }
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image file for perceptual hashing: ' + err));
    };

    img.src = url;
  });
}

// Convert 64-bit binary hash string to 16-character hexadecimal for readable display
export function binaryHashToHex(binStr) {
  let hex = "";
  for (let i = 0; i < binStr.length; i += 4) {
    const chunk = binStr.substring(i, i + 4);
    hex += parseInt(chunk, 2).toString(16);
  }
  return hex.toUpperCase();
}

// Calculate Hamming distance between two 64-bit binary strings
export function calculateHammingDistance(hashA, hashB) {
  if (hashA.length !== hashB.length) return 64;
  let dist = 0;
  for (let i = 0; i < hashA.length; i++) {
    if (hashA[i] !== hashB[i]) dist++;
  }
  return dist;
}

