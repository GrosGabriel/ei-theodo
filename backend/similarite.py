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
                dico[user_id]= {movie_id: valeur_note}
            else : 
                dico[user_id][movie_id] = valeur_note
    return dico

#print(similarity_dict())




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
    """Fonction qui calcule la similarité entre deux utilisateurs en utilisant la corrélation de Pearson.
    """

    user_dict_1 = dico[user_id1]

    user_dict_2 = dico[user_id2]

    user_1_moy = moy_notes(user_dict_1)
    user_2_moy = moy_notes(user_dict_2) 

    user_dict_1_filtered,user_dict_2_filtered = link_two_couple_lists(user_dict_1, user_dict_2)

    denom1 = sum((note - user_1_moy) ** 2 for _, note in user_dict_1_filtered.items())
    denom2 = sum((note - user_2_moy) ** 2 for _, note in user_dict_2_filtered.items())
    
    nominateur = sum((note1 - user_1_moy) * (note2 - user_2_moy)
               for (id1, note1), (id2, note2) in zip(user_dict_1_filtered.items(), user_dict_2_filtered.items()))

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

    note_x_film=user_x_moy
    denom = 0
    compteur=0
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
    cursor.execute("SELECT filmid FROM movies WHERE id NOT IN (SELECT film FROM notes WHERE userid = ?)", (user_id,))
    results = cursor.fetchall()
    return [row[0] for row in results]


def get_recommendations(user_id, N=5):
    films_pas_notes_par_user = film_non_note(user_id)
    resultat = []
    for film_id in films_pas_notes_par_user:
        resultat.append((film_id, prediction_note_film_pour_un_user(user_id, film_id, classement_similarite(user_id, similarity_dict()), similarity_dict(), N)))
    resultat.sort(key=lambda x: x[1], reverse=True)
    return resultat

conn.close()

    

