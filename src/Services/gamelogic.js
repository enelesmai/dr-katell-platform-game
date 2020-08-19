export const GameLogic = (() => {
  let lives = 3;
  let score = 0;

  const newGame = () => {
    lives = 3;
    score = 0;
  };

  const liveDown = () => {
    if (lives > 0) {
      lives -= 1;
    }
  };

  const currentLives = () => lives;

  const currentScore = () => score;

  const scoreUp = (points = 25) => {
    if (points > 0) {
      score += points;
    }
  };

  return {
    newGame,
    liveDown,
    currentLives,
    currentScore,
    scoreUp,
  };
})();

export default GameLogic;