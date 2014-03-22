#! /usr/bin/env python2

from collections import OrderedDict
from flask import Flask, request, jsonify, json

app = Flask(__name__, static_url_path='/static')

# the database :)
d = dict()
d["xxxx0"] = {"done": False, "id": "xxxx0", "order": 0, "title": "0"}
d["xxxx1"] = {"done": False, "id": "xxxx1", "order": 1, "title": "1"}
d["xxxx2"] = {"done": False, "id": "xxxx2", "order": 2, "title": "2"}
d["xxxx3"] = {"done": False, "id": "xxxx3", "order": 3, "title": "3"}
d["xxxx4"] = {"done": False, "id": "xxxx4", "order": 4, "title": "4"}

#
# TODOS API: get / upsert / delete
#

# load all elements
@app.route("/api/todos", methods=["GET"])
def get_todos():
    ordered = sorted(d.values(), key=lambda v: v["order"])
    return json.dumps(ordered)

# updates an element or insert it if it doesn't exists
@app.route("/api/todos/<string:id>", methods=['PUT'])
def upsert_todo(id):
    if not d.get(id): d[id] = {}
    todo = d.get(id)
    
    todo["id"] = request.json.get("id")
    todo["title"] = request.json.get("title")
    todo["done"] = request.json.get("done")
    todo["order"] = request.json.get("order")
    
    return jsonify(result="ok")

# deletes an element
@app.route("/api/todos/<string:id>", methods=['DELETE'])
def delete_todo(id):
    del d[id]
    return jsonify(result="ok")

# run the http server
if __name__ == '__main__':
    app.run(debug=True, port=8001)
