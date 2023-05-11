from flask import Flask,jsonify
import openai
from transformers import pipeline
from flask_cors import CORS, cross_origin

pipe = pipeline('summarization', "iSayli/SilverLining")
sentiment_pipeline = pipeline("sentiment-analysis")

app = Flask(__name__)
CORS(app)

openai.api_key = "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"
transformation_type = "['growth']"

@app.route('/getAnswer/<string:input>/<string:decision>',methods = ['GET','POST'])
def reply(input,decision):
    print(input, decision)
    sentiment = sentiment_pipeline(input)
    print(sentiment[0]["label"])
    if sentiment[0]['label'] == "NEGATIVE":
        answer = pipe(input, max_length=1024)
        print(answer[0]["summary_text"])
        return jsonify("reply",answer[0]["summary_text"])
    else:
        ask = input + ". Reframe this into positive in 1 line."
        response = openai.Completion.create(
        model="text-davinci-003",
        prompt=ask,
        temperature=0.9,
        max_tokens=150,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0.6,
        stop=[" Human:", " AI:"]
        )
        reply = response["choices"][0]["text"]
        print(reply)
        return jsonify("reply",reply)

if __name__ == '__main__':
    app.run(host = "127.0.0.1", port = "5000",debug=True)