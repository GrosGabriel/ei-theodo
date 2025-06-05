import numpy as np
import sqlite3
from flask import Flask
app = Flask(__name__)



db_path = "./database.sqlite3"

#Connection à la base de données
conn  = sqlite3.connect(db_path)
cursor = conn.cursor()

@app.route('/recommandation/movies/<int:userid>')
def recommandation_json(userid):
    return "GAB ENVOIE TA FONCTION"
app.run(port=5000)



def get_user_vector(user_id):
    """Fonction qui récupère le vecteur d'utilisateur où les coordonnées sont les notes qu'il a données aux films. 

    Args:
        user_id (_type_): _description_

    Returns:
        _type_: _description_
    """
    cursor.execute("SELECT* FROM notes WHERE id = ?", (user_id,))
    results = cursor.fetchall()
    vecteur = [row[1] for row in results]
    return np.array(vecteur) if vecteur else None


def cosinus_similarite(a, b):
    if np.linalg.norm(a) == 0 or np.linalg.norm(b) == 0:
        return 0.0
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))


def creation_dico_features():
    """Fonction qui initialise un dictionnaire avec les caractéristiques des films en clé et des 0 en valeurs.

    Returns:
         dico: _description_
    """
    cursor.execute("SELECT* FROM movie")
    results = cursor.fetchall()
    features_dico = {}
    for row in results:
        for item in row : 
            if item not in features_dico:
                features_dico[item] = 0
                
    return features_dico



def get_movie_vector(movie_id):
    dico = creation_dico_features()
    
    cursor.execute("SELECT* FROM notes WHERE filmid = ?", (movie_id,))
    results = cursor.fetchall()
    for row in results:
        for elt in row :
            dico[elt] = 1
    return np.array(list(dico.values()))
 
 

 #USER BASED

def similarity_dict():
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
                dico[user_id]= [(movie_id,valeur_note)]
            else : 
                dico[user_id].append((movie_id, valeur_note))
    return dico

print(similarity_dict())




def link_two_couple_lists(l1,l2):
    """
    Coupe les listes l1 et l2 (qui sont des listes de couples) en fonction de leur premier élément.
    C'est à dire qu'on souhaite les listes où les premiers éléments des couples sont tous deux égaux. Il faut qu'il soit présent dans les deux listes.

    Reviens à calculer l'ensemble Sxy du cours qui correspond aux éléments notés par x et par y.
    
    """
 
    l1_filtered = [elt for elt in l1 if elt[0] in [elt[0] for elt in l2]]
    l2_filtered = [elt for elt in l2 if elt[0] in [elt[0] for elt in l1]]
    return l1_filtered, l2_filtered

def moy_notes(l1):
    """Fonction qui calcule la moyenne des notes d'une liste de couples (id, note).

    Args:
        l1 (list): Liste de couples (id, note).

    Returns:
        float: Moyenne des notes.
    """
    if not l1:
        return 0
    return sum(note for _, note in l1) / len(l1)
 
def Pearson_correlation(user_id1,user_id2,dico):
    """Fonction qui calcule la similarité entre deux utilisateurs en utilisant la corrélation de Pearson.
    """

    user_list_1 = dico[user_id1]

    user_list_2 = dico[user_id2]

    user_1_moy = moy_notes(user_list_1)
    user_2_moy = moy_notes(user_list_2) 

    user_list_1_filtered,user_list_2_filtered = link_two_couple_lists(user_list_1, user_list_2)

    denom1 = sum((note - user_1_moy) ** 2 for _, note in user_list_1_filtered)
    denom2 = sum((note - user_2_moy) ** 2 for _, note in user_list_2_filtered)
    
    nominateur = sum((note1 - user_1_moy) * (note2 - user_2_moy)
               for (id1, note1), (id2, note2) in zip(user_list_1_filtered, user_list_2_filtered))

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




    

