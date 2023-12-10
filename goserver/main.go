package main

import (
	"fmt"
	"log"
	// "net/http"

	socketio "github.com/googollee/go-socket.io"
)

func main() {

	fmt.Println("hello world")
	server := socketio.NewServer(nil)

	server.OnConnect("/", func(c socketio.Conn) error {
		log.Print("new connect")
		return nil
	})

	server.OnEvent("/", "msg", func(s socketio.Conn, msg string) string {
		fmt.Println(s.ID() + " say :" + msg)
		return msg
	})

}
