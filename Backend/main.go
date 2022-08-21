//install golang linux
//$ sudo apt install golang
//go mod init quickstart
//go get go.mongodb.org/mongo-driver
package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"reflect"
	"time"

	"github.com/gorilla/handlers" //go get -u github.com/gorilla/handlers
	"github.com/gorilla/mux"      //go get -u github.com/gorilla/mux

	//go get go.mongodb.org/mongo-driver
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	//"log"
)

//----------------------------- STRUCTS --------------------------------
type Carro struct {
	Placa  string `json: "Fuekd Str"`
	Marca  string `json: "Fuekd Str"`
	Modelo string `json: "Fuekd Str"`
	Serie  string `json: "Fuekd Str"`
	Color  string `json: "Fuekd Str"`
}

type Returnn struct {
	Estado bool `json: "Fuekd bool"`
}

type Modificar struct {
	Placa      string `json: "Fuekd Str"`
	NuevaPlaca string `json: "Fuekd Str"`
}

type Eliminar struct {
	Placa string `json: "Fuekd Str"`
}

type Filter struct {
	Tipofiltro string `json: "Fuekd Str"`
	Filtro     string `json: "Fuekd Str"`
}

//-----------------------------------------------------------------------

func main() {
	fmt.Println("Servidor de GO execute \nPort:4000\n...")

	//-------------------------------Inicio del servidor------------------
	router := mux.NewRouter()
	headers := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Autorization"})
	methods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE"})
	origins := handlers.AllowedOrigins([]string{"*"})
	http.Handle("/", router)

	//---------------------NOTA NO DIRECCIONES CON HIJOS --------------------------
	//------------------------------- RUTAS --------------------------------------
	router.HandleFunc("/read", GetAllData).Methods("GET")
	router.HandleFunc("/setauto", SetAuto).Methods("POST")
	//router.HandleFunc("/modificarauto", ModificarAuto).Methods("POST")
	router.HandleFunc("/deletecar", DeleteCarr).Methods("POST")
	router.HandleFunc("/filter", Filterfunc).Methods("POST")

	//------------------------------------------------------------------------- inicio cliente mongo------------------------------------------------------------------

	clientOptions := options.Client().ApplyURI("mongodb://localhost:5000")
	fmt.Println("Cliente tipo:", reflect.TypeOf(clientOptions), "\n")

	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		fmt.Println("Mongo.connect() Error: ", err)
		os.Exit(1)
	}

	ctx, _ := context.WithTimeout(context.Background(), 15*time.Second)

	col := client.Database("PracticaSO1").Collection("Carros")
	fmt.Println("Coleccion ", reflect.TypeOf(col), "\n")

	carro1 := Carro{
		Placa:  "P151sdf",
		Marca:  "Audi",
		Modelo: "TT",
		Serie:  "f555610",
		Color:  "Blue",
	}

	carro2 := Carro{
		Placa:  "P8854db",
		Marca:  "Mitzu",
		Modelo: "Lancer",
		Serie:  "f555980",
		Color:  "Red",
	}

	carros := []interface{}{carro1, carro2}

	result, insertErr := col.InsertMany(ctx, carros)
	if insertErr != nil {
		fmt.Println("InsertONE Error:", insertErr)
		os.Exit(1)
	} else {
		fmt.Println("InsertOne() Successful:", reflect.TypeOf(result))
		fmt.Println("InsertOne() api result type:", result)

		newID := result.InsertedIDs
		fmt.Println("InsertedOne() newID", newID)
		fmt.Println("InsertedOne() newID type", reflect.TypeOf(newID))
	}

	//------------------------------ servidor ------------------------------------
	log.Fatal(http.ListenAndServe(":4000", handlers.CORS(headers, methods, origins)(router)))

}

// Consulta get informacion
func GetData(w http.ResponseWriter, r *http.Request) {

	//w.Header().Set("Content-Type", "application/json")
	//w.Header().Set("Access-Control-Allow-Origin", "*")
	//w.WriteHeader(http.StatusOK)

	resultadojson := `[{"Placa":"p54151","Marca":"Mit","Modelo":"lancer","Serie":"f03203210","Color":"Azul"},{"Placa":"p7890sds","Marca":"Audi","Modelo":"A4","Serie":"f6540654","Color":"rojo"}]`
	var carros []Carro
	json.Unmarshal([]byte(resultadojson), &carros)
	json.NewEncoder(w).Encode(carros)
}

func GetAllData(w http.ResponseWriter, r *http.Request) {
	//enableCors(&w)
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")
	clientOptions := options.Client().ApplyURI("mongodb://localhost:5000")
	fmt.Println("Cliente tipo:", reflect.TypeOf(clientOptions), "\n")

	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		fmt.Println("Mongo.connect() Error: ", err)
		os.Exit(1)
	}

	col := client.Database("PracticaSO1").Collection("Carros")
	cursor, err := col.Find(context.TODO(), bson.D{})

	if err != nil {
		panic(err)
	}
	// convert the cursor result to bson
	var results []bson.M
	// check for errors in the conversion
	if err = cursor.All(context.TODO(), &results); err != nil {
		panic(err)
	}

	// display the documents retrieved
	fmt.Println("displaying all results in a collection")
	for _, result := range results {
		fmt.Println(result)
	}

	json.NewEncoder(w).Encode(results)
}

func SetAuto(w http.ResponseWriter, r *http.Request) {

	fmt.Println("Se obtubo: ")
	var datos Carro
	reqBody, _ := ioutil.ReadAll(r.Body)
	json.Unmarshal(reqBody, &datos)

	clientOptions := options.Client().ApplyURI("mongodb://localhost:5000")
	fmt.Println("Cliente tipo:", reflect.TypeOf(clientOptions), "\n")

	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		fmt.Println("Mongo.connect() Error: ", err)
		os.Exit(1)
	}

	col := client.Database("PracticaSO1").Collection("Carros")

	result, insertErr := col.InsertOne(context.TODO(), datos)
	if insertErr != nil {
		fmt.Println("InsertONE Error:", insertErr)
		ret := Returnn{
			Estado: false,
		}
		json.NewEncoder(w).Encode(ret)
		os.Exit(1)
	} else {
		newID := result.InsertedID
		fmt.Println("Insercion exitosa", newID)
		ret := Returnn{
			Estado: true,
		}
		json.NewEncoder(w).Encode(ret)
	}
}

func DeleteCarr(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Se obtubo: ")
	var delete Eliminar
	reqBody, _ := ioutil.ReadAll(r.Body)
	json.Unmarshal(reqBody, &delete)

	clientOptions := options.Client().ApplyURI("mongodb://localhost:5000")
	fmt.Println("Cliente tipo:", reflect.TypeOf(clientOptions), "\n")

	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		fmt.Println("Mongo.connect() Error: ", err)
		os.Exit(1)
	}

	col := client.Database("PracticaSO1").Collection("Carros")

	deleteResult, err := col.DeleteOne(context.TODO(), delete)
	if err != nil {
		json.NewEncoder(w).Encode(deleteResult)
		log.Fatal(err)
	}
	json.NewEncoder(w).Encode(deleteResult)
	fmt.Printf("Starship deleted", deleteResult.DeletedCount)

}

func Filterfunc(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Se obtubo: ")
	var filtrar Filter
	reqBody, _ := ioutil.ReadAll(r.Body)
	json.Unmarshal(reqBody, &filtrar)

	clientOptions := options.Client().ApplyURI("mongodb://localhost:5000")
	fmt.Println("Cliente tipo:", reflect.TypeOf(clientOptions), "\n")

	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		fmt.Println("Mongo.connect() Error: ", err)
		os.Exit(1)
	}

	col := client.Database("PracticaSO1").Collection("Carros")

	var result bson.M
	filtrocompuesto := bson.D{{filtrar.Tipofiltro, filtrar.Filtro}}
	// check for errors in the finding
	if err = col.FindOne(context.TODO(), filtrocompuesto).Decode(&result); err != nil {
		panic(err)
	}
	fmt.Println("Filtro realizado ", result)

	json.NewEncoder(w).Encode(result)

}

/*
func ModificarAuto(w http.ResponseWriter, r *http.Request) {

	fmt.Println("Se obtubo modificar: ")
	var modcarro Modificar
	reqBody, _ := ioutil.ReadAll(r.Body)
	json.Unmarshal(reqBody, &modcarro)

	clientOptions := options.Client().ApplyURI("mongodb://localhost:5000")
	fmt.Println("Cliente tipo:", reflect.TypeOf(clientOptions), "\n")

	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		fmt.Println("Mongo.connect() Error: ", err)
		os.Exit(1)
	}

	col := client.Database("PracticaSO1").Collection("Carros")

	result, err := col.UpdateOne(context.TODO(), bson.M{modificar})
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Carro eliminado", result.DeletedCount)
}*/
