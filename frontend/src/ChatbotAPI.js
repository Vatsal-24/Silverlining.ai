const apiCall = async (message) => {
  console.log(message);
  let ans = "Please try again later";
  await fetch(`http://127.0.0.1:5000/getAnswer/${message}`)
    .then((response) => response.json())
    .then((data) => {
      ans = data[1][0].summary_text;
      console.log(ans);
    });
  return ans;
};

const API = {
  GetChatbotResponse: async (message) => {
    return new Promise(function (resolve, reject) {
      console.log("Me idhar hu");
      setTimeout(function () {
        if (message === "hi") resolve("Welcome to chatbot!");
        else resolve(apiCall(message));
      });
    });
  },
};

export default API;
