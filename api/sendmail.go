package handler

import (
	"fmt"
	"net/http"
	"net/smtp"
	"os"

	"github.com/jordan-wright/email"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
		return
	}

	err := r.ParseMultipartForm(30 << 20)
	if err != nil {
		http.Error(w, "Erro ao ler formulário: "+err.Error(), http.StatusBadRequest)
		return
	}

	nome := r.FormValue("nome")
	emailPessoa := r.FormValue("email")
	mensagem := r.FormValue("mensagem")

	e := email.NewEmail()
	from := os.Getenv("SMTP_USER")
	pass := os.Getenv("SMTP_PASS")
	to := os.Getenv("SMTP_USER")

	e.From = from
	e.To = []string{to}
	e.Text = []byte(mensagem)

	arquivo, header, err := r.FormFile("arquivo")
	if err == nil && arquivo != nil {
		defer arquivo.Close()
		_, err := e.Attach(arquivo, header.Filename, "application/octet-stream")
		if err != nil {
			http.Error(w, "Erro ao anexar arquivo: "+err.Error(), http.StatusInternalServerError)
			return
		}
		e.Subject = fmt.Sprintf("[CURRÍCULO RECEBIDO] - %s - %s", nome, emailPessoa)
	} else {
		e.Subject = fmt.Sprintf("[CONTATO RECEBIDO] - %s - %s", nome, emailPessoa)
	}

	host := os.Getenv("SMTP_HOST")
	port := os.Getenv("SMTP_PORT")
	addr := host + ":" + port

	err = e.Send(addr, smtp.PlainAuth("", from, pass, host))
	if err != nil {
		http.Error(w, "Erro ao enviar e-mail: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	fmt.Fprintln(w, "E-mail enviado com sucesso")
}
