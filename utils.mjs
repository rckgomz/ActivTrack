// validate grid edge cases
export function validateGrid(grid) {
    if (!grid || !Array.isArray(grid) || grid.length === 0) {
        return false;
    }
    const width = grid[0].length;
    return grid.every(row => Array.isArray(row) && row.length === width);
}

// validate cell to be valid number
export function validateCell(value) {
    return isFinite(value) && !isNaN(value);
}

// find all adjacent cells, including diagonals
export function getAdjacentPoints(x, y, grid) {
    /*
  (-1,-1) (-1,0) (-1,1)
          \ | /
  (0,-1) -- 5 -- (0,1)
          / | \
   (1,-1) (1,0) (1,1)
    */
    const directions = [
        [-1, -1], // top-left diagonal
        [-1, 0], // top
        [-1, 1], // top-right diagonal
        [0, -1], // left
        [0, 1], // right
        [1, -1], // bottom-left diagonal
        [1, 0], // bottom
        [1, 1], // bottom-right diagonal
    ];
    
    return directions
        // creating deltas based on directions
        .map(([dx, dy]) => [x + dx, y + dy])
        // filtering out the outbounds values
        .filter(([newX, newY]) => 
            newX >= 0 && newX < grid[0].length &&
            newY >= 0 && newY < grid.length
        );
}

// calculate center of mass for a subregion
export function calculateCenterOfMass(points, grid) {
    let totalWeight = 0;
    let weightedSumX = 0;
    let weightedSumY = 0;

    for (const [x, y] of points) {
        const value = grid[y][x];
        if (!validateCell(value)) {
            throw new Error('Invalid cell value encountered');
        }

        totalWeight += value;
        weightedSumX += x * value;
        weightedSumY += y * value;
    }

    if (!isFinite(totalWeight) || totalWeight === 0) {
        throw new Error('Invalid total weight for center of mass calculation');
    }

    return {
        x: Number((weightedSumX / totalWeight).toFixed(2)),
        y: Number((weightedSumY / totalWeight).toFixed(2))
    };
}

// main function to find subregions and their centers of mass
export function findSignalRegions(grid, threshold) {
    if (!validateGrid(grid)) {
        return [];
    }

    const visited = new Set();
    const regions = [];

    // iterate through each cell in the grid
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[0].length; x++) {
            const pointKey = `${x},${y}`;
            if (visited.has(pointKey)) continue;

            const value = grid[y][x];
            if (validateCell(value) && value > threshold) {
                const points = exploreRegion(grid, x, y, threshold, visited);
                if (points.length > 0) {
                    try {
                        const centerOfMass = calculateCenterOfMass(points, grid);
                        regions.push({
                            points: points,
                            centerOfMass: centerOfMass
                        });
                    } catch (error) {
                        console.warn(`Warning: Skipping center of mass calculation for region - ${error.message}`);
                        regions.push({
                            points: points,
                            centerOfMass: null
                        });
                    }
                }
            } else {
                visited.add(pointKey);// mark non-qualifying point as visited
            }
        }
    }

    return regions;
}

// find a subregion starting from a point using DFS iterative
export function exploreRegion(grid, startX, startY, threshold, visited) {
    const stack = [[startX, startY]];
    const points = [];

    while (stack.length > 0) {
        const [x, y] = stack.pop();
        const pointKey = `${x},${y}`;

        if (visited.has(pointKey)) continue;
        visited.add(pointKey);

        const value = grid[y][x];
        if (validateCell(value) && value > threshold) {
            points.push([x, y]);

            getAdjacentPoints(x, y, grid)
                .filter(([nx, ny]) => !visited.has(`${nx},${ny}`)) // ignoring visited points from the adjacent list
                .forEach(point => stack.push(point));
        }
    }

    return points;
}
