// src/Utils/generateTimeSeriesData.js
export const generateTimeSeriesData = (baseValue, count = 10, variance = 0.1) => {
    const data = [];
    for (let i = 0; i < count; i++) {
        const value = baseValue * (1 + (Math.random() - 0.5) * 2 * variance);
        data.push(value);
    }
    return data;
};
