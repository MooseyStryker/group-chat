const generateRandomSeed = () => {
    return Math.random().toString(36).substr(2, 16).padEnd(16, '0'); // Generates a seed with exactly 16 characters
};

module.exports = {
    generateRandomSeed
}
