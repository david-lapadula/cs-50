function isPositiveNumber(value) {
    const num = Number(value);
    if (typeof num === 'number' && isFinite(num) && num > 0) {
        return num;
    }
    return null;
}

module.exports = {
    isPositiveNumber
};