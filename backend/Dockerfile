# ========= BUILD =========
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY edt_api.sln .
COPY edt_api/edt_api.csproj edt_api/

RUN dotnet restore

COPY edt_api/ edt_api/

WORKDIR /src/edt_api
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 8000
ENTRYPOINT ["dotnet", "edt_api.dll"]
