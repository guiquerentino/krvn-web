package handler

import (
	"bytes"
	"crypto/tls"
	"fmt"
	"io"
	"net/http"
	"net/smtp"
	"os"
	"regexp"
	"strings"
	"time"

	"github.com/jordan-wright/email"
)

var (
	// Limite de requisições por IP (simples)
	rateLimit       = make(map[string]time.Time)
	rateLimitWindow = 10 * time.Second

	// Validação de e-mail
	emailRegex = regexp.MustCompile(`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`)

	// Arquivos permitidos
	allowedExt = map[string]bool{
		".pdf":  true,
		".doc":  true,
		".docx": true,
	}
)

func Handler(w http.ResponseWriter, r *http.Request) {
	origin := "https://www.karvan.com.br"
	w.Header().Set("Access-Control-Allow-Origin", origin)
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != http.MethodPost {
		http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
		return
	}

	ip := r.RemoteAddr
	if last, exists := rateLimit[ip]; exists && time.Since(last) < rateLimitWindow {
		http.Error(w, "Muitas requisições, aguarde alguns segundos", http.StatusTooManyRequests)
		return
	}
	rateLimit[ip] = time.Now()

	// Limitar tamanho total do corpo (10MB)
	r.Body = http.MaxBytesReader(w, r.Body, 10<<20)

	err := r.ParseMultipartForm(10 << 20)
	if err != nil {
		http.Error(w, "Erro ao ler formulário", http.StatusBadRequest)
		return
	}

	nome := sanitizeInput(r.FormValue("name"))
	emailPessoa := sanitizeInput(r.FormValue("email"))
	mensagem := sanitizeInput(r.FormValue("message"))

	if nome == "" || emailPessoa == "" || mensagem == "" {
		http.Error(w, "Campos obrigatórios ausentes", http.StatusBadRequest)
		return
	}

	if !emailRegex.MatchString(emailPessoa) {
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
	if err == nil && arquivo != nil {
		defer arquivo.Close()

		if !isAllowedFile(header.Filename) {
			http.Error(w, "Tipo de arquivo não permitido", http.StatusBadRequest)
			return
		}

		data, err := io.ReadAll(arquivo)
		if err != nil {
			http.Error(w, "Erro ao ler arquivo", http.StatusInternalServerError)
			return
		}

		e.Attach(bytesReader(data), header.Filename, header.Header.Get("Content-Type"))
		e.Subject = fmt.Sprintf("[CURRÍCULO RECEBIDO] - %s - %s", nome, emailPessoa)
	}

	host := os.Getenv("SMTP_HOST")
	port := os.Getenv("SMTP_PORT")
	addr := host + ":" + port

	tlsconfig := &tls.Config{
		InsecureSkipVerify: false,
		ServerName:         host,
	}

	err = e.SendWithTLS(addr, smtp.PlainAuth("", from, pass, host), tlsconfig)
	if err != nil {
		http.Error(w, "Erro ao enviar e-mail", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	fmt.Fprintln(w, "E-mail enviado com sucesso")
}

// Sanitiza entradas para evitar header injection e caracteres de controle
func sanitizeInput(input string) string {
	input = strings.ReplaceAll(input, "\r", "")
	input = strings.ReplaceAll(input, "\n", "")
	return strings.TrimSpace(input)
}

// Verifica se a extensão do arquivo é permitida
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

// Gera um *bytes.Reader a partir do conteúdo do arquivo
func bytesReader(data []byte) *bytes.Reader {
	return bytes.NewReader(data)
}
