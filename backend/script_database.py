import requests
import sqlite3
import time

# Ton token d'authentification TMDB (Bearer token v4)
TMDB_API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo"
HEADERS = {
    "Authorization": f"Bearer {TMDB_API_KEY}",
    "accept": "application/json"
}


DB_PATH = "database.sqlite3"
NB_PAGES = 20  # Tu peux ajuster selon tes besoins

def get_movie_details(movie_id):
    url = f"https://api.themoviedb.org/3/movie/{movie_id}?language=us-EN"
    r = requests.get(url, headers=HEADERS)
    return r.json() if r.status_code == 200 else {}

def get_movie_credits(movie_id):
    url = f"https://api.themoviedb.org/3/movie/{movie_id}/credits?language=us-EN"
    r = requests.get(url, headers=HEADERS)
    return r.json() if r.status_code == 200 else {}

def insert_movie(conn, movie):
    cursor = conn.execute("""
        INSERT INTO movie (title, director, genre, synopsis, popularity, release_date, vote_average, poster_path)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        movie["title"],
        movie.get("director", ""),
        movie.get("genre", ""),
        movie.get("synopsis", ""),
        float(movie.get("popularity", 0.0)),
        movie.get("release_date", ""),  # <-- Ajouté ici
        float(movie.get("vote_average", 0.0)),
        movie.get("poster_path", "")
    ))
    conn.commit()
    return cursor.lastrowid

def insert_actors(conn, actor_list, movie_id):
    for actor in actor_list:
        name = actor.get("name")
        if name:
            conn.execute("INSERT INTO actor (actor, movieid) VALUES (?, ?)", (name, movie_id))
    conn.commit()

def get_main_actors(credits, limit=5):
    return credits.get("cast", [])[:limit]

def fetch_and_store_movies():
    conn = sqlite3.connect(DB_PATH)

    for page in range(1, NB_PAGES + 1):
        print(f"📦 Traitement de la page {page}...")
        r = requests.get(f"https://api.themoviedb.org/3/movie/popular?language=us-EN&page={page}", headers=HEADERS)
        if r.status_code != 200:
            print(f"❌ Erreur lors de la récupération de la page {page} : {r.status_code}")
            continue

        for movie in r.json().get("results", []):
            movie_id_tmdb = movie["id"]
            details = get_movie_details(movie_id_tmdb)
            credits = get_movie_credits(movie_id_tmdb)

            genres = ", ".join([g["name"] for g in details.get("genres", [])])
            director = next((p["name"] for p in credits.get("crew", []) if p.get("job") == "Director"), "")

            movie_data = {
                "title": movie.get("title", ""),
                "director": director,
                "genre": genres,
                "synopsis": details.get("overview", ""),
                "popularity": details.get("popularity", 0.0),
                "release_date": details.get("release_date", ""),  # <-- Ajouté ici
                "vote_average": details.get("vote_average", 0.0),
                "poster_path": movie.get("poster_path", "")
            }

            try:
                movie_row_id = insert_movie(conn, movie_data)
                actors = get_main_actors(credits)
                insert_actors(conn, actors, movie_row_id)
                print(f"✅ Film ajouté : {movie_data['title']} avec {len(actors)} acteurs")
            except Exception as e:
                print(f"⚠️ Erreur sur {movie_data['title']}: {e}")

            time.sleep(0.3)  # Respecter le rate limit de TMDB

    conn.close()

if __name__ == "__main__":
    fetch_and_store_movies()
