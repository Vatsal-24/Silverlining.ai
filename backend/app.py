from flask import Flask,jsonify, redirect, render_template
import openai
from transformers import pipeline
from flask_cors import CORS, cross_origin


pipe = pipeline('summarization', "dominguesm/positive-reframing-en")

app = Flask(__name__)
CORS(app)

openai.api_key = "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"
# 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
transformation_type = "['optimism']"
# text = input("Enter your text:")
# final_input = transformation_type + text

@app.route('/getAnswer/<string:input>/<string:decision>',methods = ['GET','POST'])
def reply(input,decision):
    print(input, decision)
    if decision == "yes":
        if " " in input:
            final_input = transformation_type + input
            answer = pipe(final_input, max_length=1024)
            return jsonify("reply",answer[0]["summary_text"])

        else:
            return jsonify("reply","Hey....How can i help you?")
    else:
        ask = input
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

        return jsonify("reply",reply)

if __name__ == '__main__':
    app.run(host = "127.0.0.1", port = "5000",debug=True)

