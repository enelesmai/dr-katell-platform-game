import api from '../Services/api';

describe('Get an array of results', () => {
  it('It is an array of results', () => {
    expect(api.getScore()).toContainObject({ name: '.*' });
  });
});