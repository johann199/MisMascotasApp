import numpy as np
from PIL import Image
import tensorflow as tf
import os

# Cargar modelo MobileNet una única vez
print("Cargando modelo MobileNetV2...")
model = tf.keras.applications.MobileNetV2(
    weights="imagenet",
    include_top=False,
    pooling="avg",
    input_shape=(224, 224, 3)
)
print(" Modelo cargado exitosamente")

def load_and_preprocess(image_path):
    """
    Carga y preprocesa una imagen para el modelo
    """
    try:
        print(f"Abriendo imagen: {image_path}")
        
        # Verificar que el archivo existe
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Archivo no encontrado: {image_path}")
        
        # Abrir y convertir imagen
        img = Image.open(image_path).convert("RGB")
        print(f"Tamaño original: {img.size}")
        
        # Redimensionar
        img = img.resize((224, 224))
        
        # Convertir a array
        img_array = np.array(img)
        print(f"Shape del array: {img_array.shape}")
        
        # Preprocesar para MobileNetV2
        img_array = tf.keras.applications.mobilenet_v2.preprocess_input(img_array)
        img_array = np.expand_dims(img_array, axis=0)
        
        return img_array
    
    except Exception as e:
        print(f"Error en load_and_preprocess: {str(e)}")
        raise


def generate_embedding(image_path):
    """
    Genera un embedding vectorial de una imagen usando MobileNetV2
    """
    try:
        img_tensor = load_and_preprocess(image_path)
        
        print("Generando embedding...")
        embedding = model.predict(img_tensor, verbose=0)[0]
        
        print(f"Embedding generado. Shape: {embedding.shape}, Tipo: {type(embedding)}")
        
        return embedding
    
    except Exception as e:
        print(f"Error en generate_embedding: {str(e)}")
        raise


def cosine_similarity(a, b):
    """
    Calcula la similitud del coseno entre dos vectores
    Retorna un valor entre -1 y 1, donde 1 es idéntico
    """
    try:
        dot = np.dot(a, b)
        norm_a = np.linalg.norm(a)
        norm_b = np.linalg.norm(b)
        
        if norm_a == 0 or norm_b == 0:
            print("Warning: Uno de los vectores tiene norma 0")
            return 0.0
        
        similarity = dot / (norm_a * norm_b)
        
        return similarity
    
    except Exception as e:
        print(f"Error en cosine_similarity: {str(e)}")
        raise