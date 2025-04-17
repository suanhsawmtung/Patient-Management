export function getArrayDifferences<T>(array1: T[], array2: T[]) {
    const set1 = new Set(array1);
    const set2 = new Set(array2);

    const differences = [
        ...array1.filter((x) => !set2.has(x)),
        ...array2.filter((x) => !set1.has(x)),
    ];

    const newItems = differences.filter((x) => set2.has(x));
    const removedItems = differences.filter((x) => !set2.has(x));

    return { newItems, removedItems };
}
