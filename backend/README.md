# Backend Setup (Detailed)

1. Navigate to the backend directory:
```bash
cd backend
```

2. Restore dependencies and build:
```bash
dotnet restore
dotnet build
```

3. Run database migrations:
```bash
export PATH="$PATH:/home/greg/.dotnet/tools"
dotnet ef database update
```

4. Run the API:
```bash
dotnet run
```

The API will be available at `http://localhost:5247`.

5. (Optional) Run tests:
```bash
dotnet test
```