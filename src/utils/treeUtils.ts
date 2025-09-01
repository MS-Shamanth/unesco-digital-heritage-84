// Shared utility for tree growth logic
export const getTreeStage = (correctAnswers: number) => {
  if (correctAnswers < 2) return {
    stage: 'seed',
    icon: '🌱',
    text: 'Just planted!',
    color: '#8B4513'
  };
  if (correctAnswers < 4) return {
    stage: 'sprout',
    icon: '🌱',
    text: 'Growing strong!',
    color: '#7CB342'
  };
  if (correctAnswers < 7) return {
    stage: 'sapling',
    icon: '🌿',
    text: 'Taking root!',
    color: '#2ECC71'
  };
  return {
    stage: 'tree',
    icon: '🌳',
    text: 'Fully grown!',
    color: '#2ECC71'
  };
};

export const getCorrectAnswersFromStorage = (): number => {
  try {
    const gameData = localStorage.getItem('gameData');
    if (gameData) {
      const data = JSON.parse(gameData);
      return data.correctAnswers || 0;
    }
  } catch (error) {
    console.error('Failed to parse game data:', error);
  }
  return 0;
};

export const updateCorrectAnswers = (newCount: number) => {
  try {
    const gameData = localStorage.getItem('gameData');
    let data = {};
    if (gameData) {
      data = JSON.parse(gameData);
    }
    const updatedData = { ...data, correctAnswers: newCount };
    localStorage.setItem('gameData', JSON.stringify(updatedData));
  } catch (error) {
    console.error('Failed to update correct answers:', error);
  }
};