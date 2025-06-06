import numpy as np
import sqlite3
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.metrics.pairwise import cosine_similarity
from flask import Flask, jsonify
app = Flask(__name__)



db_path = "database.sqlite3"

#Connection à la base de données
conn  = sqlite3.connect(db_path,check_same_thread=False)
cursor = conn.cursor()


#USER BASED
def similarity_dict():
    """
    Récupère les notes des utilisateurs et les stocke dans un dictionnaire où la clé est l'ID de l'utilisateur et la valeur est un dictionnaire des films notés par cet utilisateur avec leurs notes.
    La structure du dictionnaire est la suivante : 
    {user_id: {movie_id: note, ...}, ...}
    """
    cursor.execute("SELECT* FROM user")
    dico = {} 
    results_users = cursor.fetchall()
    
    for row in results_users:
        user_id = row[0]
        cursor.execute("SELECT* FROM note WHERE userid = ?", (user_id,))
        results_user_notes = cursor.fetchall()
        for note in results_user_notes:
            movie_id = note[1]
            valeur_note = note[2] 
            if user_id not in dico:
                dico[user_id]= {movie_id: valeur_note}
            else : 
                dico[user_id][movie_id] = valeur_note
    return dico



def movie_info_dict():
    """
    Renvoie un dictionnaire {movie_id: {colonne: valeur, ...}} pour tous les films de la base.
    """
    cursor.execute("SELECT * FROM movie")
    results = cursor.fetchall()
    movie_dict={}
    for row in results:
        movie_id = row[0]
        movie_dict[movie_id] = {
            "id": row[0],
            "title": row[1],
            "director": row[2],
            "genre": row[3],
            "synopsis": row[4],
            "popularity": row[5],
            "release_date": row[6],  
            "vote_average": row[7],
            "poster_path": row[8]
        }

    return movie_dict

dico_movie = movie_info_dict()

def link_two_couple_lists(l1,l2):
    """
    Coupe les dictionnaires l1 et l2 (qui sont des dictionnaires {film:note} en fonction de leur premier élément.
    C'est à dire qu'on souhaite les listes où les premiers éléments des couples sont tous deux égaux. Il faut qu'il soit présent dans les deux listes.

    Reviens à calculer l'ensemble Sxy du cours qui correspond aux éléments notés par x et par y.
    
    """
 
    l1_filtered = {}
    for key,note in l1.items():
        if key in l2:
            l1_filtered[key] = note
    
    l2_filtered = {}
    for key,note in l2.items():
        if key in l1:
            l2_filtered[key] = note
    return l1_filtered, l2_filtered

def moy_notes(l1):
    """Fonction qui calcule la moyenne des notes d'un dictionnaire {id:note}

    Args:
        l1 (dictionnaire) : {id,note}

    Returns:
        float: Moyenne des notes.
    """
    sum=0
    for id,note in l1.items():
        sum += note
    if len(l1) == 0:
        return 0.0
    else:
        return sum / len(l1)
 

def Pearson_correlation(user_id1,user_id2,dico):
    """

    Fonction qui calcule la similarité entre deux utilisateurs en utilisant la corrélation de Pearson.
    
    """

    user_dict_1 = dico[user_id1]

    user_dict_2 = dico[user_id2]

    user_1_moy = moy_notes(user_dict_1)
    user_2_moy = moy_notes(user_dict_2) 

    user_dict_1_filtered,user_dict_2_filtered = link_two_couple_lists(user_dict_1, user_dict_2)

    denom1 = sum((note - user_1_moy) ** 2 for _, note in user_dict_1_filtered.items())
    denom2 = sum((note - user_2_moy) ** 2 for _, note in user_dict_2_filtered.items())
    

    nominateur = 0
    for k in user_dict_1_filtered.keys():
        nominateur += (user_dict_1_filtered[k] - user_1_moy) * (user_dict_2_filtered[k] - user_2_moy)


    if nominateur == 0 :
        return 0.0
    else: 
        return nominateur / (np.sqrt(denom1) * np.sqrt(denom2))

def classement_similarite(user_id, dico):

    classement = []
    for user_id2 in dico:
        if user_id != user_id2:
            sim = Pearson_correlation(user_id, user_id2, dico)
            classement.append((user_id2, sim))
    classement.sort(key=lambda x: x[1], reverse=True)

    return classement
    

def prediction_note_film_pour_un_user(user_id_x,film_id,classement,dico,N):
    """Fonction qui prédit la note d'un utilisateur pour un film en utilisant la similarité de Pearson."""

    user_list_x = dico[user_id_x]

    user_x_moy = moy_notes(user_list_x)

    
    denom = 0
    compteur = 0
    nominateur  = 0
    for y,sim in classement: #On ne prend que les N premiers utilisateurs les plus similaires
        if compteur >= N:
            break
        if film_id in dico[y].keys():
            compteur += 1
            note_y_film = dico[y][film_id]
            moy_y = moy_notes(dico[y])
         
            denom += abs(sim)
            nominateur += sim * (note_y_film - moy_notes(dico[y]))
    return user_x_moy + (nominateur / denom) if denom != 0 else user_x_moy

def film_non_note(user_id):
    """Fonction qui récupère les films non notés par l'utilisateur.

    Args:
        user_id (type): description

    Returns:
        type: description
    """
    cursor.execute("SELECT id FROM movie WHERE id NOT IN (SELECT filmid FROM note WHERE userid = ?)", (user_id,))
    results = cursor.fetchall()
    return [row[0] for row in results]


def get_recommandations(user_id, N=5):
    films_pas_notes_par_user = film_non_note(user_id)
    resultat = []
    dico = similarity_dict()
    for film_id in films_pas_notes_par_user:
        resultat.append((film_id, prediction_note_film_pour_un_user(user_id, film_id, classement_similarite(user_id, dico), dico, N)))
    resultat.sort(key=lambda x: x[1], reverse=True)
    return resultat

def recommandations_json(user_id,N=5):
    recos = get_recommandations(user_id, N)
    res = []
    dico_movie = movie_info_dict()
    for movie_id, predicted_note in recos:
        res.append(dico_movie[movie_id])

    return res



@app.route('/movies/recommandation/<int:userid>')
def recommandations(userid):
    res = recommandations_json(userid)
    return res



#CONTENT BASED 

def recommandation_content(movie_id, poids_genre=2.0, poids_synopsis=1.0, poids_real=10):
    """
    Recommande des films similaires à partir d'un film donné en utilisant la similarité cosinus sur les synopsis, genres et réalisateurs.
    """
    # Récupération des infos du film
    dico_movie = movie_info_dict()
    
    # Matrice de caractéristiques pour tous les films
    movies = list(dico_movie.values())

    # Matrice tf-idf des synopsis 
    tfidf = TfidfVectorizer(stop_words='english')
    synopsis_matrix = tfidf.fit_transform([m['synopsis'] or '' for m in movies])

    # Vecteur du genre zéro ou un 
    mlb = MultiLabelBinarizer()
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
        poids_genre * genre_matrix,
        poids_real * director_matrix,
        poids_synopsis * synopsis_matrix.toarray()
    ])

    # Similarité cosinus entre tous les films
    sim_matrix = cosine_similarity(X)

    # Pour recommander à partir du film donné
    movie_idx = next((i for i, m in enumerate(movies) if m['id'] == movie_id), None)
    
    if movie_idx is None:
        return []

    similarities = sim_matrix[movie_idx]
    
    # On trie les indices des films les plus similaires (hors lui-même)
    recommended_indices = similarities.argsort()[::-1][1:6]
    
    recommended_movies = [movies[i] for i in recommended_indices]
    return recommended_movies

def recommandation_content_user(userid, poids_genre=2.0, poids_synopsis=1.0, poids_real=0.5):
    """
    Recommande des films similaires à partir de tous les films notés par l'utilisateur,
    en pondérant chaque film par la note donnée.
    """
    # Récupère tous les films notés et leurs notes
    cursor.execute("SELECT filmid, note FROM note WHERE userid = ?", (userid,))
    results = cursor.fetchall()
    if not results:
        return []

    movie_ids = [row[0] for row in results]
    notes = [row[1] for row in results]

    dico_movie = movie_info_dict()
    movies = list(dico_movie.values())

    # Matrice tf-idf des synopsis 
    tfidf = TfidfVectorizer(stop_words='english')
    synopsis_matrix = tfidf.fit_transform([m['synopsis'] or '' for m in movies])

    # Vecteur du genre zéro ou un 
    mlb = MultiLabelBinarizer()
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
        poids_genre * genre_matrix,
        poids_real * director_matrix,
        poids_synopsis * synopsis_matrix.toarray()
    ])

    # Construction du "profil utilisateur" pondéré par la note
    movie_ids = [int(mid) for mid in movie_ids]
    movies_ids_all = [int(m['id']) for m in movies]
    user_indices = [i for i, mid in enumerate(movies_ids_all) if mid in movie_ids]
    # Associer chaque id de film à sa note
    note_dict = dict(zip(movie_ids, notes))
    # Récupérer les notes dans le même ordre que user_indices
    user_notes = [note_dict[movies_ids_all[i]] for i in user_indices]
    user_vectors = X[user_indices]
    print(user_notes)
    if sum(user_notes) == 0:
        return []
    user_profile = np.average(user_vectors, axis=0, weights=user_notes)

    user_indices = [i for i, m in enumerate(movies) if m['id'] in movie_ids]
    user_notes = []
    for mid in movie_ids:
        idx = next((i for i, m in enumerate(movies) if m['id'] == mid), None)
        if idx is not None:
            user_notes.append(notes[movie_ids.index(mid)])
    user_vectors = X[user_indices]
    print("on est la")
    print (user_notes)
    if sum(user_notes) == 0:
        return []
    user_profile = np.average(user_vectors, axis=0, weights=user_notes)

    # Calcul de la similarité cosinus entre le profil utilisateur et tous les films
    similarities = cosine_similarity([user_profile], X)[0]

    # On exclut les films déjà notés
    not_seen_indices = [i for i, m in enumerate(movies) if m['id'] not in movie_ids]
    recommended_indices = sorted(not_seen_indices, key=lambda i: similarities[i], reverse=True)[:12]

    recommended_movies = [movies[i] for i in recommended_indices]
    return recommended_movies




@app.route('/movies/recommandation_content/<int:movieid>')
def recommandation_content_get(movieid):
    res = recommandation_content(movieid)
    return res

@app.route('/movies/recommandation_content_user/<int:userid>')
def recommandation_content_user_get(userid):
    res = recommandation_content_user(userid)
    return res





if __name__ == "__main__":
    app.run(port=5000, debug=True)
    conn.close()
    

