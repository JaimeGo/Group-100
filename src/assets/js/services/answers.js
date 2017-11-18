async function jsonRequest(path, options = {}) {
  console.log("\n\nJSON REQUEST\n\n");
  const result = await fetch(path, {
    ...options,
    headers: { ...options.headers, Accept: 'application/json' },
  });
  console.log("JSON1 ",result, typeof result);
  console.log(result.body);
  const json = await result.json();
  console.log("JSON2 ",json);
  if (result.status !== 200) {
    throw Object.assign(new Error(), json);
  }
  return json;
}

export default {
  async newAnswer(questionId) {
    console.log("\n\n\nANSWERING!!!!!!!\n\n\n\n")
    return jsonRequest(`/questions/new`)
  },
  async createAnswer(questionId){
    console.log(questionId, "createAnswer")
    return jsonRequest(`/questions/${questionId}/answer/new`), {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      // body: JSON.stringify(signData),
    }
  }
};
