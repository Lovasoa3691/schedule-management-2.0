# ===== BUILD =====
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY edt_api.sln .
COPY edt_api/ edt_api/
RUN dotnet restore

WORKDIR /src/edt_api
RUN dotnet publish -c Release -o /app/publish --no-restore

# ===== RUNTIME DISTROLESS =====
FROM mcr.microsoft.com/dotnet/aspnet:8.0-jammy-chiseled
WORKDIR /app

ENV ASPNETCORE_URLS=http://+:8000

COPY --from=build /app/publish .

EXPOSE 8000

ENTRYPOINT ["dotnet", "edt_api.dll"]