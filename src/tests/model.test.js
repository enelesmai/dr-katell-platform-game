import Model from '../Services/model';

test('expect music is on at the beggining of the game', () => {
  const myModel = new Model();
  expect(myModel.musicOn).toEqual(true);
});

test('expect musicOn can be set to false', () => {
  const myModel = new Model();
  myModel.musicOn = false;
  expect(myModel.musicOn).toEqual(false);
});

test('expect sound is on at the beggining of the game', () => {
  const myModel = new Model();
  expect(myModel.soundOn).toEqual(true);
});

test('expect sound can be set to false', () => {
  const myModel = new Model();
  myModel.soundOn = false;
  expect(myModel.soundOn).toEqual(false);
});

test('expect bgMusicPlaying is off at the beggining of the game', () => {
  const myModel = new Model();
  expect(myModel.bgMusicPlaying).toEqual(false);
});

test('expect bgMusicPlaying can be set to true', () => {
  const myModel = new Model();
  myModel.bgMusicPlaying = true;
  expect(myModel.bgMusicPlaying).toEqual(true);
});

test('expect score is zero at the beggining of the game', () => {
  const myModel = new Model();
  expect(myModel.score).toEqual(0);
});

test('expect score can be updated', () => {
  const myModel = new Model();
  myModel.score = 25;
  expect(myModel.score).toEqual(25);
});

test('expect playerName is Anonymous at the beggining of the game', () => {
  const myModel = new Model();
  expect(myModel.playerName).toEqual('Anonymous');
});

test('expect playerName can be updated', () => {
  const myModel = new Model();
  myModel.playerName = 'Selene';
  expect(myModel.playerName).toEqual('Selene');
});

test('expect fontStyleTitle is an object', () => {
  const myModel = new Model();
  expect(myModel.fontStyleTitle).toMatchObject({ fontSize: 26, fill: '#fff' });
});

test('expect fontStyleLabel is an object', () => {
  const myModel = new Model();
  expect(myModel.fontStyleLabel).toMatchObject({ fontSize: 22, fill: '#fff' });
});

test('expect fontStyleTitle atrribute fontSize contains a number', () => {
  const myModel = new Model();
  expect(myModel.fontStyleTitle).toEqual(expect.objectContaining({ fontSize: expect.any(Number) }));
});

test('expect fontStyleLabel attribute fontSize contains a number', () => {
  const myModel = new Model();
  expect(myModel.fontStyleLabel).toEqual(expect.objectContaining({ fontSize: expect.any(Number) }));
});