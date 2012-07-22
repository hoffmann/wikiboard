from flask import Flask
from flask import render_template, request, jsonify

from wiki import db

app = Flask(__name__)
app.config['DB'] = 'sqlite:///test.db'

@app.route('/')
def page_index():
    return render_template('index.html')

@app.route('/item/')
def page_search():
    q = request.args.get('q')
    store = db.DB(app.config['DB'])
    if q:
        r = store.search(q)
    else:
        r = store.list()
    return jsonify(items=[dict(x) for x in r])


@app.route('/item/<sha1>')
def page_get(sha1):
    store = db.DB(app.config['DB'])
    item = store.get(sha1)
    if item:
        return jsonify(dict(item))
    return jsonify({})
