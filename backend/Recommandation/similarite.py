import numpy as np

def cosine_similarity(a, b):
    """
    Calculate the cosine similarity between two vectors.
    
    Parameters:
    a (np.ndarray): First vector.
    b (np.ndarray): Second vector.
    
    Returns:
    float: Cosine similarity between the two vectors.
    """
    if np.linalg.norm(a) == 0 or np.linalg.norm(b) == 0:
        return 0.0
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

