import { findSignalRegions } from "./utils.mjs";

const grid = [
    [0, 80, 45, 95, 170, 145],
    [115, 210, 60, 5, 230, 220],
    [5, 0, 145, 250, 245, 140],
    [15, 5, 175, 250, 185, 160],
    [0, 5, 95, 115, 165, 250],
    [5, 0, 25, 5, 145, 250]
];

// Main execution
const threshold = 200;
const regions = findSignalRegions(grid, threshold);

// Print results in required format
console.log("\nSubregions of interest and their centers of mass:");
regions.forEach((region, index) => {
    const coordsStr = region.points.map(([x, y]) => `(${x},${y})`).join(', ');
    console.log(`\nRegion ${index + 1}:`);
    console.log(`Coordinates: { ${coordsStr} }`);
    if (region.centerOfMass) {
        console.log(`Center of Mass: (${region.centerOfMass.x}, ${region.centerOfMass.y})`);
    } else {
        console.log('Center of Mass: Could not be calculated');
    }
});

