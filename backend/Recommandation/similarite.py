import numpy as np
import sqlite3


db_path = "../database.sqlite3"

#Connection à la base de données
conn  = sqlite3.connect(db_path)
cursor = conn.cursor()

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
    cursor.execute("SELECT* FROM movies")
    results = cursor.fetchall()
    features_dico = {}
    for row in results:
        for item in row : 
            if item not in features_dico:
                features_dico[item] = 0
                
    return features_dico



def get_movie_vector(movie_id):
    dico = creation_dico_features()
    
    cursor.execute("SELECT* FROM notes WHERE id = ?", (movie_id,))
    results = cursor.fetchall()
    for row in results:
        for elt in row :
            dico[elt] = 1
    return np.array(list(dico.values()))
 
 
 


conn.close()

    

