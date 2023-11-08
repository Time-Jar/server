## Build
FROM golang:alpine AS build

WORKDIR /usr/src/app

COPY go.mod go.sum ./
RUN go mod download && go mod verify

COPY . .

RUN go install github.com/swaggo/swag/cmd/swag@latest && swag init

# -v option for verbose, CGO_ENABLED=0 means we don't need libc library on host container
RUN CGO_ENABLED=0 go build -o /server main.go

## Deploy
FROM gcr.io/distroless/static-debian11:latest

COPY --from=build /server /server

ENV PORT=6000
EXPOSE $PORT

ENTRYPOINT ["/server"]