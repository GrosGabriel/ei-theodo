import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.metrics.pairwise import cosine_similarity
import sqlite3
from flask import Flask, jsonify

app = Flask(__name__)

conn  = sqlite3.connect(db_path,check_same_thread=False)
cursor = conn.cursor()


# Pondération des caract
poids_genre = 2.0  
poids_synopsis = 1.0   
poids_real = 0.5  

# Suq que dico_movie est {movie_id: {title, genre, director, synopsis, ...}}
movies = list(dico_movie.values())

# Matrice tf-idf des synopsis 
tfidf = TfidfVectorizer(stop_words='english') #la formule avec un log là
synopsis_matrix = tfidf.fit_transform([m['synopsis'] or '' for m in movies]) #matrice de taille nombre de films * nopmbre de mots

# Vecteur du genre zéro ou un 
mlb = MultiLabelBinarizer() #pour pondération binaire
genre_matrix = mlb.fit_transform([m['genre'].split(',') if m['genre'] else [] for m in movies])

# Vecteur du réalisateur : zéro ou un 
directors = list(set(m['director'] for m in movies if m['director']))
director_map = {d: i for i, d in enumerate(directors)}
director_matrix = np.zeros((len(movies), len(directors)))
for idx, m in enumerate(movies):
    if m['director'] in director_map:
        director_matrix[idx, director_map[m['director']]] = 1


# Concaténation pondérée
X = np.hstack([
    poids_genre* genre_matrix,
    poids_real * director_matrix,
    poids_synopsis * synopsis_matrix.toarray()
])

# Similarité cosinus entre tous les films
sim_matrix = cosine_similarity(X)



#A CREUSER
# Pour recommander à partir d'un film préféré (ex: movie_idx)
movie_idx = 0  # index du film de référence
similarities = sim_matrix[movie_idx]
# On trie les indices des films les plus similaires (hors lui-même)
recommended_indices = similarities.argsort()[::-1][1:6]
recommended_movies = [movies[i] for i in recommended_indices]