from flask import Flask,jsonify,request
import openai
from transformers import pipeline
from flask_cors import CORS, cross_origin
import random


pipe = pipeline('summarization', "iSayli/SilverLining")
sentiment_pipeline = pipeline("sentiment-analysis")

app = Flask(__name__)
CORS(app)

openai.api_key = "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"
transformation_type = "['thankfulness']: "

greet = ["It's okay to feel so, think of it in this way, ", "Think of it in this way, ", "I understand it's difficult but you can say, ","I get its hard but you can think of it this way, " ]
@app.route('/getAnswer',methods = ['GET','POST'])
def reply():
    # print(input, decision)/
    print(request,"sdsdkjsjd")
    inp = str(request.json.get("message"))
    print(inp)
    final=transformation_type + inp
    sentiment = sentiment_pipeline(inp)
    print(sentiment[0]["label"])
    if sentiment[0]['label'] == "NEGATIVE":
        answer = pipe( final, max_length=1024)
        print(answer[0]["summary_text"])
        return jsonify("reply",random.choice(greet) + answer[0]["summary_text"])
    else:
        ask = inp + ".\n This is user's input, please identify the sentiment and return something optimistic. Limit to 50 words. "
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