FROM golang:1.15
WORKDIR /go/usr/server

RUN curl -sSfL https://raw.githubusercontent.com/cosmtrek/air/master/install.sh | sh -s -- -b /go/bin

CMD ["air"]