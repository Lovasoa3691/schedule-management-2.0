FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
EXPOSE 8000

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY edt_api.sln .
COPY edt_api/ edt_api/
RUN dotnet restore

WORKDIR /src/edt_api
RUN dotnet publish -c Release -o /app/publish

FROM runtime
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "edt_api.dll"]
