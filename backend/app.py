from flask import Flask,jsonify, redirect, render_template

from transformers import pipeline
from flask_cors import CORS

pipe = pipeline('summarization', "dominguesm/positive-reframing-en")


app = Flask(__name__)
CORS(app)

@app.route('/getAnswer/<string:input>',methods = ['GET','POST'])
def reply(input):
    text = "['growth']: " + input

    return jsonify("reply",pipe(text, max_length=1024))

if __name__ == '__main__':
    app.run(host = "127.0.0.1", port = "5000",debug=True)

