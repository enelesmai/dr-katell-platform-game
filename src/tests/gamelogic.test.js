import { GameLogic } from '../Services/gamelogic';

describe('Game initial values', () => {
  it('Score is zero', () => {
    GameLogic.newGame();
    expect(GameLogic.currentScore()).toBe(0);
  });

  it('The player has 3 lives', () => {
    GameLogic.newGame();
    expect(GameLogic.currentLives()).toBe(3);
  });
});