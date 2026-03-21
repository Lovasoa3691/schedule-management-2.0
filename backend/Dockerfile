FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS build
WORKDIR /src

COPY edt_api.sln .
COPY edt_api/ edt_api/

RUN dotnet restore

WORKDIR /src/edt_api
RUN dotnet publish -c Release -o /app/publish \
    -p:PublishTrimmed=true \
    -p:PublishSingleFile=true \
    --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine
WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 8000
ENTRYPOINT ["./edt_api"]