# ActivTrak Code Challenge

## Requirements to run code
A most recent NodeJS runtime or NodeJS 12.0.0.0+

### Install dependencies
```bash
npm install
```

## Run scripts
```bash
  npm run test #run test cases
  npm run dev # run the index.mjs
  # or
  node ./index.mjs
  node ./tests.mjs
```

## Change input
A variable called `grid` is in the `index.mjs` file. It initialized with the matrix from the PDF. Feel free to change it.

```js
const grid = [
    [0, 80, 45, 95, 170, 145],
    [115, 210, 60, 5, 230, 220],
    [5, 0, 145, 250, 245, 140],
    [15, 5, 175, 250, 185, 160],
    [0, 5, 95, 115, 165, 250],
    [5, 0, 25, 5, 145, 250],
];
```

## Test case covered

1. Testing main functionality (the example in the PDF)
2. Testing threshold boundaries
3. Testing connectivity rules
4. Testing edge cases
  1. Empty grid
  2. Single cell above threshold:
  3. Invalid values
  4. Irregular grid
6. Testing region merging

## Assumptions 
### Calculation of center of mass

I did some googling, and I found the formula
`Center of Mass = Σ(position * mass) / Σ(mass)`

In our case, mass is replaced by the signal value of each cell Position is the (x,y) coordinates

So

Each cell has a position (x,y) and a value (which acts as its "weight")

`totalWeight` = the sum of all values.
`weightedSumX` = multiply each x position times the weight 
`weightedSumY` = multipley each y position times the weight

x: weightedSumX / totalWeight 
y: weightedSumY / totalWeight

### Grid Size
I assumed grid are regular (square).