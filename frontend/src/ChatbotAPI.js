const apiCall = async (message, flag) => {
  console.log(message, flag);
  let ans = "Please try again later";
  await fetch(`http://127.0.0.1:5000/getAnswer/${message}/${flag}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data[1]);
      ans = data[1];
      console.log(ans);
    });
  return ans;
};

const API = {
  GetChatbotResponse: async (message, flag) => {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        if (
          message === "hi" ||
          message === "Hi" ||
          message === "Hey" ||
          message === "hey" ||
          message === "Hello" ||
          message === "hello"
        )
          resolve("Welcome to SilverLining.ai !");
        else resolve(apiCall(message, flag));
      });
    });
  },
};

export default API;
