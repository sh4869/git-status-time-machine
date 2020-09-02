FROM golang:1.15
WORKDIR /go/usr/server
COPY . .
RUN go mod download
RUN go get -u github.com/cosmtrek/air

CMD ["air"]