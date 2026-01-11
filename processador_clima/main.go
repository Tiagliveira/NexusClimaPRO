package main

import (
	"context"
	"encoding/json"
	"log"
	"os"
	"time"

	"github.com/streadway/amqp"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type DailyData struct {
	Time                 []string  `json:"time"`
	TempMax              []float64 `json:"temperature_2m_max"`
	TempMin              []float64 `json:"temperature_2m_min"`
	PrecipitationProbMax []int     `json:"precipitation_probability_max"`
}

type WeatherData struct {
	City             string    `json:"city"`
	Temp             float64   `json:"temp"`
	Humidity         float64   `json:"humidity"`
	Rain             float64   `json:"rain"`
	WindSpeed        float64   `json:"wind_speed"`
	IsDay            bool      `json:"is_day"`
	CloudCover       int       `json:"cloud_cover"`
	MaxTemp          float64   `json:"max_temp"`
	MinTemp          float64   `json:"min_temp"`
	RainProb         int       `json:"rain_prob"`
	InsightCategoria string    `json:"insight_categoria"`
	SaudacaoSistema  string    `json:"saudacao_sistema"`
	DataHoraLocal    string    `json:"data_hora_local"`
	Timezone         string    `json:"timezone"`
	Daily            DailyData `json:"daily"`
}

func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

func main() {
	mongoURI := os.Getenv("MONGO_URI")
	if mongoURI == "" {
		mongoURI = "mongodb://mongo:27017"
	}

	clientOptions := options.Client().ApplyURI(mongoURI)
	client, err := mongo.Connect(context.TODO(), clientOptions)
	failOnError(err, "Falha ao conectar no MongoDB")

	err = client.Ping(context.TODO(), nil)
	failOnError(err, "MongoDB nao respondeu ao Ping")
	log.Println("Conectado ao MongoDB")

	collection := client.Database("nexus_clima").Collection("weathers")

	rabbitMQURL := os.Getenv("RABBITMQ_URL")
	if rabbitMQURL == "" {
		rabbitMQURL = "amqp://guest:guest@rabbitmq:5672/"
	}

	var conn *amqp.Connection

	for i := 0; i < 15; i++ {
		conn, err = amqp.Dial(rabbitMQURL)
		if err == nil {
			break
		}
		log.Println("Aguardando RabbitMQ iniciar...")
		time.Sleep(2 * time.Second)
	}
	failOnError(err, "Falha ao conectar no RabbitMQ")
	defer conn.Close()

	ch, err := conn.Channel()
	failOnError(err, "Falha ao abrir canal RabbitMQ")
	defer ch.Close()

	q, err := ch.QueueDeclare(
		"weather_data",
		true,
		false,
		false,
		false,
		nil,
	)
	failOnError(err, "Falha ao declarar fila")

	msgs, err := ch.Consume(
		q.Name,
		"",
		true,
		false,
		false,
		false,
		nil,
	)
	failOnError(err, "Falha ao registrar consumidor")

	log.Println("Processador Go iniciado. Aguardando mensagens...")

	forever := make(chan bool)

	go func() {
		for d := range msgs {
			var data WeatherData
			err := json.Unmarshal(d.Body, &data)
			if err != nil {
				log.Printf("Erro ao decodificar JSON: %s", err)
				continue
			}

			document := bson.M{
				"cidade_nome":         data.City,
				"temperatura":         data.Temp,
				"umidade":             data.Humidity,
				"chuva":               data.Rain,
				"velocidade_vento":    data.WindSpeed,
				"eh_dia":              data.IsDay,
				"condicao_ceu":        data.CloudCover,
				"temp_max":            data.MaxTemp,
				"temp_min":            data.MinTemp,
				"probabilidade_chuva": data.RainProb,
				"insight_categoria":   data.InsightCategoria,
				"saudacao_sistema":    data.SaudacaoSistema,
				"data_hora_local":     data.DataHoraLocal,
				"timezone":            data.Timezone,
				"daily":               data.Daily,
				"createdAt":           time.Now(),
			}

			_, err = collection.InsertOne(context.TODO(), document)
			if err != nil {
				log.Printf("Erro ao salvar no Mongo: %s", err)
			} else {
				log.Printf("Dados salvos: %s", data.City)
			}
		}
	}()

	<-forever
}
