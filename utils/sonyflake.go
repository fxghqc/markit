package utils

import (
	"log"
	"time"

	"github.com/osamingo/indigo"
)

var g *indigo.Generator

func init() {
	g = indigo.New(indigo.Settings{
		StartTime: time.Unix(1514764800, 0),
	})

	_, err := g.NextID()
	if err != nil {
		log.Fatalln(err)
	}
}

// NextID ...
func NextID() string {
	id, err := g.NextID()
	if err != nil {
		log.Fatalln(err)
	}

	return id
}
