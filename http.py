#! /usr/bin/env python2

from collections import OrderedDict
from flask import Flask, request, jsonify, json
import re
import argparse

app = Flask(__name__, static_url_path='/static')

# the database :)
d = dict()

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
    # leaved here for readability, for performance compile outside this function
    regex_uuid = re.compile('[0-9a-f]{12}4[0-9a-f]{3}[89ab][0-9a-f]{15}\Z', re.I)
    if len(id) < 1 and not regex_uuid.match(id):
        return jsonify(result="fail", reason="invalid request: id")
    
    if id != request.json.get("id"):
        return jsonify(result="fail", reason="invalid value: id")
    
    if not isinstance(request.json.get("done"), bool): 
        return jsonify(result="fail", reason="invalid value: done")
        
    if not isinstance(request.json.get("order"), int):
        return jsonify(result="fail", reason="invalid value: order")
    
    if not d.get(id): d[id] = {}
    todo = d.get(id)
    
    todo["id"] = request.json.get("id")
    todo["title"] = request.json.get("title")
    todo["done"] = request.json.get("done")
    todo["order"] = request.json.get("order")
    
    return jsonify(result="ok")

# deletes an element
#@app.route("/api/todos/<string:id>", methods=['DELETE'])
#def delete_todo(id):
#    del d[id]
#    return jsonify(result="ok")

# run the http server
if __name__ == '__main__':
    parser = argparse.ArgumentParser(description = "runs the easytodo server")
    parser.add_argument("-d", "--debug", action="store_true", help="runs on debug mode, listening only on localhost")
    args = parser.parse_args()
    
    if args.debug:
        print("Running on debug mode")
        app.run(host="127.0.0.1", port=8001, debug=True)
    else:
        print("Running on production mode, use -d for debug mode")
        app.run(host="0.0.0.0", port=8001)
    
