//install golang linux
//$ sudo apt install golang
package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux" //go get -u github.com/gorilla/mux
	//"log"
)

func main() {
	fmt.Println("Servidor de GO execute \nPort:4500\n...")

	//-------------------------------Inicio del servidor------------------
	router := mux.NewRouter().StrictSlash(true)
	http.Handle("/", router)

	//---------------------NOTA NO DIRECCIONES CON HIJOS --------------------------
	//------------------------------- RUTAS --------------------------------------
	router.HandleFunc("/read", GetData).Methods("GET")
	//router.HandleFunc().Methods("")
	//router.HandleFunc().Methods("")
	//router.HandleFunc().Methods("")

	//------------------------------ servidor ------------------------------------
	log.Fatal(http.ListenAndServe(":4500", router))
}

// Consulta get informacion
func GetData(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.WriteHeader(http.StatusOK)
}
