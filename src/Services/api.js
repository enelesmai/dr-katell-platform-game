const api = (() => {
  const url = 'https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/bPWQ2DSLlGN376pNZEH4/scores/';
  const getScore = async () => {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    const list = data.result.sort((a, b) => b.score - a.score);
    return list.slice(0, 10);
  };

  const saveScore = async (name, score) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: name,
        score,
      }),
    });
    const data = await response.json();
    return data;
  };

  return { getScore, saveScore };
})();

export default api;