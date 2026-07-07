const reshaper = require('arabic-persian-reshaper');
const bidiFactory = require('bidi-js');
const bidi = bidiFactory();

function fixRTLText(text) {
    if (!text) return "";

    // 1. Reshape Arabic letters
    const shaped = reshaper.ArabicShaper.convertArabic(text);

    // 2. Perform BiDi reordering
    // We use "ltr" as the base direction because react-pdf renders in LTR layout.
    const embeddingLevels = bidi.getEmbeddingLevels(shaped, "ltr");
    const flips = bidi.getReorderSegments(shaped, embeddingLevels);

    const arr = shaped.split("");
    flips.forEach(([start, end]) => {
        const segment = arr.slice(start, end + 1).reverse();
        arr.splice(start, segment.length, ...segment);
    });

    // Mirror characters in RTL levels (odd levels)
    for (let i = 0; i < arr.length; i++) {
        const level = embeddingLevels.levels[i];
        if (level % 2 === 1) {
            const mirrored = bidi.getMirroredCharacter(arr[i]);
            if (mirrored) {
                arr[i] = mirrored;
            }
        }
    }

    return arr.join("");
}

console.log("Original: 'Survey Calculation Report: مشروع (EF)'");
console.log("Fixed:    '" + fixRTLText("Survey Calculation Report: مشروع (EF)") + "'");

console.log("\nOriginal: 'Survey Calculation Report: (EE)'");
console.log("Fixed:    '" + fixRTLText("Survey Calculation Report: (EE)") + "'");

console.log("\nOriginal: 'مشروع الفتح'");
console.log("Fixed:    '" + fixRTLText("مشروع الفتح") + "'");
