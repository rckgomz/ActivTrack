import { calculateCenterOfMass, findSignalRegions } from "./utils.mjs";

function runComprehensiveTests() {
    console.log("Running Comprehensive Tests\n");

    // 1. Main functionality test with known grid
    const mainGrid = [
        [0, 80, 45, 95, 170, 145],
        [115, 210, 60, 5, 230, 220],
        [5, 0, 145, 250, 245, 140],
        [15, 5, 175, 250, 185, 160],
        [0, 5, 95, 115, 165, 250],
        [5, 0, 25, 5, 145, 250],
    ];

    console.log("1. Testing main functionality:");
    const regions = findSignalRegions(mainGrid, 200);
    console.log(`Found ${regions.length} regions above threshold 200`);
    regions.forEach((region, i) => {
        console.log(`\nRegion ${i + 1}:`);
        console.log(`Points: ${region.points.map(([x, y]) => `(${x},${y})`).join(', ')}`);
        console.log(`Center of Mass: (${region.centerOfMass.x}, ${region.centerOfMass.y})`);
        console.log(`Values: ${region.points.map(([x, y]) => mainGrid[y][x]).join(', ')}`);
    });

    // 2. Threshold boundary tests
    console.log("\n2. Testing threshold boundaries:");
    const thresholdGrid = [
        [200, 201, 199],
        [198, 200, 202],
    ];
    const thresholdTests = [
        { threshold: 200, expectedRegions: 1, description: 'Values must be > threshold' }, 
        { threshold: 199, expectedRegions: 1, description: 'Connected region of values > 199' }, 
        { threshold: 201, expectedRegions: 1, description: 'Only one point > 201' }
    ];

    thresholdTests.forEach(test => {
        const result = findSignalRegions(thresholdGrid, test.threshold);
        console.log(`\nThreshold ${test.threshold} (${test.description}):`);
        console.log(`Found ${result.length} regions (Expected ${test.expectedRegions})`);
        console.log(result.length === test.expectedRegions ? '✅ Passed' : '❌ Failed');
        result.forEach((region, i) => {
            console.log(`Region ${i + 1} points:`, 
                region.points.map(([x, y]) => `(${x},${y}): ${thresholdGrid[y][x]}`).join(', '));
        });
    });

    // 3. Connectivity tests
    console.log("\n3. Testing connectivity rules:");
    const connectivityGrid = [
        [250, 0, 250],
        [0, 0, 0],
        [250, 0, 250],
    ];
    const connectedRegions = findSignalRegions(connectivityGrid, 200);
    console.log(`Found ${connectedRegions.length} separate regions (Expected 4 due to diagonal connectivity)`);
    connectedRegions.forEach((region, i) => {
        console.log(`Region ${i + 1} points: ${region.points.map(([x, y]) => `(${x},${y})`).join(', ')}`);
    });

    // 4. Edge cases
    console.log("\n4. Testing edge cases:");
    const edgeCases = [
        {
            name: "Empty grid",
            grid: [],
            expectedResult: [],
        },
        {
            name: "Single cell above threshold",
            grid: [[250]],
            expectedPoints: 1,
        },
        {
            name: "Invalid values",
            grid: [
                [NaN, 250, Infinity],
                [250, null, 250],
            ],
            expectedValidPoints: [[1, 0], [0, 1], [2, 1]], // Only finite, valid numbers
        },
        {
            name: "Irregular grid",
            grid: [[250], [250, 250]],
            expectedResult: [],
        },
    ];

    edgeCases.forEach(test => {
        try {
            const result = findSignalRegions(test.grid, 200);
            console.log(`\n${test.name}:`);
            if (test.expectedResult) {
                console.log(JSON.stringify(result) === JSON.stringify(test.expectedResult) ? 
                    '✅ Passed' : '❌ Failed');
            } else if (test.expectedPoints) {
                console.log(result.length > 0 && 
                    result[0].points.length === test.expectedPoints ? 
                    '✅ Passed' : '❌ Failed');
            } else if (test.expectedValidPoints) {
                const hasAllValidPoints = test.expectedValidPoints.every(([x, y]) => 
                    result.some(region => 
                        region.points.some(([px, py]) => px === x && py === y)
                    )
                );
                console.log(hasAllValidPoints ? '✅ Passed' : '❌ Failed');
            }
            console.log('Result:', result);
        } catch (error) {
            console.log(`${test.name}: ❌ Error - ${error.message}`);
        }
    });

    // 5. Region merging test
    console.log("\n5. Testing region merging:");
    const mergingGrid = [
        [250, 250, 250],
        [0, 250, 0],
        [250, 250, 250],
    ];
    const mergedRegions = findSignalRegions(mergingGrid, 200);
    console.log(`Found ${mergedRegions.length} region(s) (Expected 1 connected region)`);
    mergedRegions.forEach((region, i) => {
        console.log(`Region ${i + 1} points: ${region.points.map(([x, y]) => `(${x},${y})`).join(', ')}`);
    });
}

// Run all tests
runComprehensiveTests();