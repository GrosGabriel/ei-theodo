from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/movies/recommandation/<int:userid>')
def recommandation_json(userid):
    # Dictionnaire de test très simple
    dico_test = {
        "userid": userid,
        "recommandations": [
            {"id": 1, "title": "Film test 1"},
            {"id": 2, "title": "Film test 2"}
        ]
    }
    return jsonify(dico_test)

if __name__ == "__main__":
    app.run(port=5000, debug=True)