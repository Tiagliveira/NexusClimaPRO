from datetime import datetime

def definir_categoria(temp, chuva_prob, vento, hora):
    """
    Define a CATEGORIA (Tag) para o Front escolher a frase.
    """
    if chuva_prob > 80 or (chuva_prob > 60 and vento > 20):
        return "TEMPESTADE"
    
    if chuva_prob > 50:
        return "CHUVA"

    if temp > 33:
        return "CALOR_INFERNAL"
    
    if temp > 28:
        return "CALOR_PRAIA"
    
    if temp < 8:
        return "FRIO_CONGELANTE"
    
    if temp < 17:
        return "FRIO_LEVE"

    return "NEUTRO"

def gerar_saudacao(hora_local_str):
    try:
        hora = int(hora_local_str.split('T')[1].split(':')[0])
        
        if 5 <= hora < 12: return "Bom dia"
        if 12 <= hora < 18: return "Boa tarde"
        if 18 <= hora <= 23: return "Boa noite"
        return "Boa madrugada"
    except:
        return "Olá"

def montar_insights_final(dados_api):
    try:
        # Dados principais
        temp_atual = dados_api['current']['temperature_2m']
        chuva_prob = dados_api['daily']['precipitation_probability_max'][0] # Hoje
        vento = dados_api['current']['wind_speed_10m']
        hora_local = dados_api['current']['time']

        categoria = definir_categoria(temp_atual, chuva_prob, vento, hora_local)
        
        saudacao = gerar_saudacao(hora_local)

        return {
            "categoria": categoria, 
            "saudacao": saudacao,   
            "hora_local": hora_local
        }
    
    except Exception as e:
        print(f"Erro na analise: {e}")
        return {
            "categoria": "NEUTRO",
            "saudacao": "Olá",
            "hora_local": ""
        }