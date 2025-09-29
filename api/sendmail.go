package handler

import (
	"bytes"
	"crypto/tls"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/smtp"
	"os"
	"regexp"
	"strings"
	"time"

	"github.com/jordan-wright/email"
)

var (
	rateLimit       = make(map[string]time.Time)
	rateLimitWindow = 10 * time.Second
	emailRegex      = regexp.MustCompile(`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`)
	allowedExt      = map[string]bool{
		".pdf":  true,
		".doc":  true,
		".docx": true,
	}
	maxFileSize int64 = 30 << 20 // 30 MB
)

func Handler(w http.ResponseWriter, r *http.Request) {
	log.Println("Recebida requisição:", r.Method, r.RemoteAddr)

	origin := "https://www.karvan.com.br"
	w.Header().Set("Access-Control-Allow-Origin", origin)
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
		log.Println("Requisição OPTIONS respondida")
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != http.MethodPost {
		log.Println("Método não permitido")
		http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
		return
	}

	ip := strings.Split(r.RemoteAddr, ":")[0]
	if last, exists := rateLimit[ip]; exists && time.Since(last) < rateLimitWindow {
		log.Println("Rate limit atingido para IP:", ip)
		http.Error(w, "Muitas requisições, aguarde alguns segundos", http.StatusTooManyRequests)
		return
	}
	rateLimit[ip] = time.Now()

	r.Body = http.MaxBytesReader(w, r.Body, maxFileSize)
	err := r.ParseMultipartForm(maxFileSize)
	if err != nil {
		log.Println("Erro ao ler formulário:", err)
		http.Error(w, "Erro ao ler formulário", http.StatusBadRequest)
		return
	}

	nome := sanitizeInput(r.FormValue("name"))
	emailPessoa := sanitizeInput(r.FormValue("email"))
	mensagem := sanitizeInput(r.FormValue("message"))

	log.Printf("Campos recebidos - Nome: %s, Email: %s, Mensagem: %d chars\n", nome, emailPessoa, len(mensagem))

	if nome == "" || emailPessoa == "" || mensagem == "" {
		log.Println("Campos obrigatórios ausentes")
		http.Error(w, "Campos obrigatórios ausentes", http.StatusBadRequest)
		return
	}

	if !emailRegex.MatchString(emailPessoa) {
		log.Println("Email inválido:", emailPessoa)
		http.Error(w, "E-mail inválido", http.StatusBadRequest)
		return
	}

	e := email.NewEmail()
	from := os.Getenv("SMTP_USER")
	pass := os.Getenv("SMTP_PASS")
	to := os.Getenv("SMTP_TO")

	e.From = from
	e.To = []string{to}
	e.Text = []byte(fmt.Sprintf("Mensagem de: %s <%s>\n\n%s", nome, emailPessoa, mensagem))
	e.Subject = fmt.Sprintf("[CONTATO RECEBIDO] - %s - %s", nome, emailPessoa)

	arquivo, header, err := r.FormFile("arquivo")
	if err != nil {
		if err == http.ErrMissingFile {
			log.Println("Nenhum arquivo enviado")
		} else {
			log.Println("Erro ao obter arquivo:", err)
			http.Error(w, "Erro ao ler arquivo", http.StatusBadRequest)
			return
		}
	}

	if arquivo != nil {
		defer arquivo.Close()
		log.Println("Arquivo recebido:", header.Filename, "Size:", header.Size)

		if !isAllowedFile(header.Filename) {
			log.Println("Tipo de arquivo não permitido:", header.Filename)
			http.Error(w, "Tipo de arquivo não permitido", http.StatusBadRequest)
			return
		}

		data, err := io.ReadAll(arquivo)
		if err != nil {
			log.Println("Erro ao ler conteúdo do arquivo:", err)
			http.Error(w, "Erro ao ler arquivo", http.StatusInternalServerError)
			return
		}

		if int64(len(data)) > maxFileSize {
			log.Println("Arquivo excede tamanho máximo:", len(data))
			http.Error(w, "Arquivo maior que 30MB", http.StatusBadRequest)
			return
		}

		_, err = e.Attach(bytes.NewReader(data), header.Filename, header.Header.Get("Content-Type"))
		if err != nil {
			log.Println("Erro ao anexar arquivo:", err)
			http.Error(w, "Erro ao anexar arquivo", http.StatusInternalServerError)
			return
		}
		e.Subject = fmt.Sprintf("[CURRÍCULO RECEBIDO] - %s - %s", nome, emailPessoa)
	}

	host := os.Getenv("SMTP_HOST")
	port := os.Getenv("SMTP_PORT")
	addr := host + ":" + port

	tlsconfig := &tls.Config{
		InsecureSkipVerify: false,
		ServerName:         host,
	}

	log.Println("Enviando e-mail para:", to)
	err = e.SendWithTLS(addr, smtp.PlainAuth("", from, pass, host), tlsconfig)
	if err != nil {
		log.Println("Erro ao enviar e-mail:", err)
		http.Error(w, "Erro ao enviar e-mail", http.StatusInternalServerError)
		return
	}

	log.Println("E-mail enviado com sucesso")
	w.WriteHeader(http.StatusOK)
	fmt.Fprintln(w, "E-mail enviado com sucesso")
}

func sanitizeInput(input string) string {
	input = strings.ReplaceAll(input, "\r", "")
	input = strings.ReplaceAll(input, "\n", "")
	return strings.TrimSpace(input)
}

func isAllowedFile(filename string) bool {
	ext := strings.ToLower(getFileExt(filename))
	return allowedExt[ext]
}

func getFileExt(filename string) string {
	if dot := strings.LastIndex(filename, "."); dot != -1 {
		return filename[dot:]
	}
	return ""
}
