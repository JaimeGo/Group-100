async function jsonRequest(path, options = {}) {
  const result = await fetch(path, {
    ...options,
    headers: { ...options.headers, Accept: 'application/json' },
  });
  const json = await result.json();
  if (result.status !== 200) {
    throw Object.assign(new Error(), json);
  }
  return json;
}

export default {
  // async get (questionId) => jsonRequest(
  //     `/questions/${questionId}`
  //   )
  async newAnswer(questionId){
    return jsonRequest(`/questions/${questionId}/answer/new`)
  },
  async createAnswer(questionId){
    return jsonRequest(`/questions/${questionId}/answer/new`), {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      // body: JSON.stringify(signData),      
    }
  }
};