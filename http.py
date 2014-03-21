#! /usr/bin/env python2

from collections import OrderedDict
from flask import Flask, request, jsonify, json

app = Flask(__name__, static_url_path='/static')

# the database :)
d = OrderedDict({})

#
# TODOS API: get / upsert / delete
#

# load all elements
@app.route("/api/todos", methods=["GET"])
def get_todos():
    return json.dumps(d.values())

# updates an element or insert it if it doesn't exists
@app.route("/api/todos/<string:id>", methods=['PUT'])
def upsert_todo(id):
    if not d.get(id): d[id] = {}
    todo = d.get(id)
    
    todo["id"] = request.json.get("id")
    todo["title"] = request.json.get("title")
    todo["done"] = request.json.get("done")
    
    return jsonify(result="ok")

# deletes an element
@app.route("/api/todos/<string:id>", methods=['DELETE'])
def delete_todo(id):
    del d[id]
    return jsonify(result="ok")

# run the http server
if __name__ == '__main__':
    app.run(debug=True, port=8001)
