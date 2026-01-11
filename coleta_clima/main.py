import pika
import requests
import json
import time
import os
from pymongo import MongoClient

RABBITMQ_HOST = os.getenv('RABBITMQ_HOST', 'rabbitmq')
MONGO_URI = os.getenv("MONGO_URI", "mongodb://mongodb:27017")

def conectar_mongo():
    while True:
        try:
            client = MongoClient(MONGO_URI)
            client.admin.command('ping')
            db = client["nexus_clima"]
            print("Python conectado ao MongoDB!")
            return db
        except Exception as e:
            print(f"Aguardando MongoDB... Erro: {e}")
            time.sleep(5)

def conectar_rabbitmq():
    try:
        connection = pika.BlockingConnection(
            pika.ConnectionParameters(host=RABBITMQ_HOST)
        )
        return connection
    except Exception as e:
        print(f"Falha ao conectar RabbitMQ: {e}")
        return None

def buscar_dados_climaticos(cidade):
    try:
        geo_url = f"https://geocoding-api.open-meteo.com/v1/search?name={cidade}&count=1&language=pt&format=json"
        geo_res = requests.get(geo_url)
        geo_data = geo_res.json()

        if not geo_data.get("results"):
            return None

        local = geo_data["results"][0]
        
        weather_url = (
            f"https://api.open-meteo.com/v1/forecast?"
            f"latitude={local['latitude']}&longitude={local['longitude']}&"
            f"current=temperature_2m,relative_humidity_2m,is_day,precipitation,wind_speed_10m,cloud_cover&"
            f"daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&"
            f"timezone=auto&forecast_days=7"
        )
        w_res = requests.get(weather_url)
        w_data = w_res.json()
        
        current = w_data["current"]
        daily = w_data["daily"]

        temp = current["temperature_2m"]
        chuva = current["precipitation"]
        cat = "NEUTRO"
        
        if temp > 30: cat = "CALOR_INFERNAL"
        elif temp > 25 and chuva == 0: cat = "CALOR_PRAIA"
        elif temp < 10: cat = "FRIO_CONGELANTE"
        elif temp < 18: cat = "FRIO_LEVE"
        elif chuva > 5: cat = "TEMPESTADE"
        elif chuva > 0: cat = "CHUVA"

        return {
            "city": local["name"],
            "temp": temp,
            "humidity": current["relative_humidity_2m"],
            "rain": chuva,
            "wind_speed": current["wind_speed_10m"],
            "is_day": bool(current["is_day"]),
            "cloud_cover": current["cloud_cover"],
            "max_temp": daily["temperature_2m_max"][0],
            "min_temp": daily["temperature_2m_min"][0],
            "rain_prob": daily["precipitation_probability_max"][0],
            "insight_categoria": cat,
            "saudacao_sistema": "Atualizacao Automatica",
            "data_hora_local": current["time"],
            "timezone": w_data.get("timezone", "UTC"), 
            "daily": daily
        }

    except Exception as e:
        print(f"Erro na cidade {cidade}: {e}")
        return None

def main():
    db = conectar_mongo()
    print("Nexus Worker Dinamico Iniciado.")

    while True:
        connection = conectar_rabbitmq()
        tempo_espera = 60 

        if connection:
            try:
                channel = connection.channel()
                channel.queue_declare(queue='weather_data', durable=True)

                cidades_no_banco = db.weathers.distinct("cidade_nome")
                lista_monitoramento = cidades_no_banco if cidades_no_banco else ["São Paulo"]
                
                print(f"Monitorando {len(lista_monitoramento)} cidades.")

                for cidade in lista_monitoramento:
                    dados = buscar_dados_climaticos(cidade)

                    if dados:
                        msg = json.dumps(dados)
                        channel.basic_publish(
                            exchange='',
                            routing_key='weather_data',
                            body=msg,
                            properties=pika.BasicProperties(delivery_mode=2)
                        )
                        print(f"Atualizado: {dados['city']}")
                    
                    time.sleep(2)
                
                print("Ciclo concluido com sucesso.")
                tempo_espera = 1800 

            except Exception as e:
                print(f"Erro durante o ciclo: {e}")
                tempo_espera = 60
            
            finally:
                try:
                    connection.close()
                except:
                    pass
        else:
            print("RabbitMQ inacessivel. Tentando novamente em breve...")
            tempo_espera = 60

        print(f"Aguardando {tempo_espera} segundos...")
        time.sleep(tempo_espera)

if __name__ == "__main__":
    main()