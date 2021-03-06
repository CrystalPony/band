package driver

import (
	"testing"

	"github.com/bandprotocol/band/go/dt"
)

func TestEplEspnSuccess(t *testing.T) {
	resolver := &EplEspn{}
	score, err := resolver.QueryEplScore("20190901", "ARS-TOT")
	if err != nil {
		t.Errorf("Query ARS-TOT error: %s", err)
	}
	if score[0] != 2 && score[1] != 2 {
		t.Errorf("Wrong result")
	}
}

func TestEplEspnFail(t *testing.T) {
	resolver := &EplEspn{}
	_, err := resolver.QueryEplScore("20190801", "ARS-TOT")
	if err == nil {
		t.Errorf("Query ARS-TOT error: %s", err)
	}
}

func TestEqlEspnSuccessHash(t *testing.T) {
	resolver := &EplEspn{}
	output := resolver.Query([]byte("EPL/20190901/ARS-TOT"))
	if output.Option != dt.Answered {
		t.Errorf("Query EPL error: %s", output.Option)
	}
	if output.Value.Hex() != "0x0202000000000000000000000000000000000000000000000000000000000000" {
		t.Errorf("Wrong result")
	}
}
