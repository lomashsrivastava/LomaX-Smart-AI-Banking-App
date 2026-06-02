# LomaX NEO: The Financial Singularity OS 🌌

LomaX NEO is a next-generation financial operating system featuring a futuristic, highly immersive spatial interface, AI-driven financial logic, and a fully functional backend infrastructure.

## Architecture & Data Flow

```mermaid
graph TD;
    subgraph Frontend (Next.js App Router)
      A[Zustand Store] -->|Syncs| B[Dashboard Layout];
      B --> C[Holographic Canvas Engine];
      B --> D[AI CFO Panel];
      B --> E[Digital Twin Simulator];
      B --> F[Vault / UPI / Cards];
    end
    
    subgraph Backend (Next.js APIs)
      A -->|Fetch / Mutate| G[API Routes /api/*];
      G <--> H[/api/ai/chat/];
      G <--> I[/api/twin/simulate/];
    end
    
    subgraph Database Layer
      G --> J[(MongoDB Database)];
      J --> K[User & Account Schemas];
      J --> L[Transaction Ledger];
      J --> M[Cards & UpiMandates];
    end
```

## Features Complete 🚀
1. **Holographic 60fps Canvas Engine**: 3D particle visualization of the user's Net Worth Singularity and Account Moons.
2. **AI CFO (Loma)**: Analyzes ledger data on the backend to provide financial insights.
3. **Digital Twin Monte Carlo Engine**: Projects 36-month probabilistic outcomes for user goals.
4. **Full-Stack Persistent Ledger**: Live MongoDB integration for double-entry transactions, virtual card management, and autonomous UPI AutoPay mandates.

## How to Run Locally

### Requirements
- Node.js 18+
- MongoDB instance (local or Atlas)

### 1. Install & Configure
```bash
git clone <repo-url>
cd LomaX
npm install
```
Rename `.env.example` to `.env.local` and add your MongoDB connection string.

### 2. Seed the Database
To populate the hyper-realistic mock financial data:
```bash
npm run dev
# In another terminal window:
curl -X POST http://localhost:3000/api/seed
```

### 3. Experience the Singularity
Open `http://localhost:3000` in your web browser.

## Production Deployment (Docker)

We have provided a multi-stage `Dockerfile` to instantly deploy LomaX NEO anywhere.

```bash
# Build the image
docker build -t lomax-neo .

# Run the container
docker run -p 3000:3000 -e MONGODB_URI="mongodb://your-db-uri" lomax-neo
```
