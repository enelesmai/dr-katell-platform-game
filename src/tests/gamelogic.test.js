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

describe('update values', () => {
  it('Score is incremented by 25 when no value is defined', () => {
    GameLogic.newGame();
    GameLogic.scoreUp();
    expect(GameLogic.currentScore()).toBe(25);
  });

  it('Score is incremented by the defined value', () => {
    GameLogic.newGame();
    GameLogic.scoreUp(100);
    expect(GameLogic.currentScore()).toBe(100);
  });

  it('Does not increment value when defined is null', () => {
    GameLogic.newGame();
    GameLogic.scoreUp(null);
    expect(GameLogic.currentScore()).toBe(0);
  });

  it('Does not increment negative values', () => {
    GameLogic.newGame();
    GameLogic.scoreUp(-852);
    expect(GameLogic.currentScore()).toBe(0);
  });

  it('Lives are decremented by one', () => {
    GameLogic.newGame();
    GameLogic.liveDown();
    expect(GameLogic.currentLives()).toBe(2);
  });

  it('Decrements lives until its value is zero', () => {
    GameLogic.newGame();
    GameLogic.liveDown();
    GameLogic.liveDown();
    GameLogic.liveDown();
    GameLogic.liveDown();
    GameLogic.liveDown();
    expect(GameLogic.currentLives()).toBe(0);
  });
});

describe('Restart Game', () => {
  it('Score value is zero after calling newGame', () => {
    GameLogic.newGame();
    GameLogic.liveDown();
    GameLogic.liveDown();
    GameLogic.scoreUp();
    GameLogic.scoreUp();
    GameLogic.newGame();
    expect(GameLogic.currentScore()).toBe(0);
  });
  it('Lives value is 3 after calling newGame', () => {
    GameLogic.newGame();
    GameLogic.liveDown();
    GameLogic.liveDown();
    GameLogic.scoreUp();
    GameLogic.scoreUp();
    GameLogic.newGame();
    expect(GameLogic.currentLives()).toBe(3);
  });
});