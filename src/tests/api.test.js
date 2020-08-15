import api from '../Services/api';

test('expect save score return a promise', () => {
  api.saveScore('Selene', 10)
    .then((response) => {
      expect(response).resolves.toBe('Leaderboard score created correctly.');
    });
});

test('expect get all scores from service', () => {
  api.getScore()
    .then((response) => {
      expect(response).resolves.toBe('return a promise');
    });
});