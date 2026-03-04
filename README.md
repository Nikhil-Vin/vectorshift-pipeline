# VectorShift Pipeline Builder

A full-stack AI workflow builder that lets you visually compose pipelines by dragging, connecting, and configuring nodes on an interactive canvas — then validate the graph structure via a FastAPI backend.

![Tech Stack](https://img.shields.io/badge/React-18-61dafb?style=flat&logo=react)
![ReactFlow](https://img.shields.io/badge/ReactFlow-11-3b82f6?style=flat)
![Zustand](https://img.shields.io/badge/Zustand-4-f59e0b?style=flat)
![FastAPI](https://img.shields.io/badge/FastAPI-0.134-10b981?style=flat&logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.10+-3776ab?style=flat&logo=python)

---

## Features

- **9 Node Types** — Input, Output, LLM, Text, Math, Delay, API Call, Filter, Logger
- **BaseNode Abstraction** — single shared component powers all nodes
- **Dynamic Text Variables** — type `{{variable}}` and watch input handles appear in real time
- **DAG Validation** — Kahn's Algorithm detects cycles in your pipeline
- **Dark Theme UI** — sidebar layout, glowing handles, gradient edges
- **Full Stack** — React frontend + FastAPI backend connected end-to-end

---

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── BaseNode.jsx          # Shared node shell — all nodes extend this
│   │   ├── Layout.jsx            # App shell (sidebar + canvas + submit)
│   │   ├── Sidebar.jsx           # Left node palette with drag support
│   │   └── FloatingSubmit.jsx    # Run Pipeline button → POST to backend
│   │
│   ├── nodes/
│   │   ├── InputNode.jsx         # 0 inputs → 1 output (value)
│   │   ├── OutputNode.jsx        # 1 input (value) → 0 outputs
│   │   ├── LLMNode.jsx           # 2 inputs (system, prompt) → 1 output (response)
│   │   ├── TextNode.jsx          # Dynamic {{variable}} handle generation
│   │   ├── MathNode.jsx          # 2 inputs (a, b) → 1 output (result)
│   │   ├── DelayNode.jsx         # 1 input → 1 output, configurable ms
│   │   ├── APINode.jsx           # 2 inputs → 2 outputs, method + url
│   │   ├── FilterNode.jsx        # 1 input → pass/fail outputs
│   │   └── LoggerNode.jsx        # 1 input → 1 output, logs to console
│   │
│   ├── App.jsx                   # Root component
│   ├── PipelineUI.jsx            # ReactFlow canvas + nodeTypes registry
│   ├── store.js                  # Zustand global state (nodes + edges)
│   ├── index.css                 # Full dark theme
│   └── index.js                  # Entry point
│
├── backend/
│   └── main.py                   # FastAPI — parse pipeline + DAG detection
│
├── public/
│   └── index.html
└── package.json
```

---

## How It Works

### Full Data Flow

```
┌─────────────────────────────────────────────────────┐
│                BROWSER (localhost:3000)              │
│                                                     │
│  Sidebar ──drag──→ Canvas (ReactFlow)               │
│                       │                             │
│                  nodes[] + edges[]                  │
│                       │                             │
│                  Zustand Store                      │
│                       │                             │
│              click "Run Pipeline"                   │
│                       │                             │
│           FloatingSubmit.jsx                        │
│           POST /pipelines/parse                     │
└───────────────────────┼─────────────────────────────┘
                        │ { nodes, edges }
                        ▼
┌─────────────────────────────────────────────────────┐
│               BACKEND (localhost:8000)               │
│                                                     │
│  1. Count nodes    → num_nodes                      │
│  2. Count edges    → num_edges                      │
│  3. Kahn's Algorithm → is_dag (true/false)          │
│                                                     │
│  Return { num_nodes, num_edges, is_dag }            │
└───────────────────────┬─────────────────────────────┘
                        │
                        ▼
              Browser alert with result
```

### Step by Step

| Step | Action | What Happens |
|------|--------|-------------|
| 1 | Drag node from sidebar | `onDrop` fires → `addNode()` → saved to Zustand |
| 2 | Connect two nodes | `onConnect` fires → `addEdge()` → saved to Zustand |
| 3 | Type `{{variable}}` in Text node | Regex extracts variable → new Handle renders on left side |
| 4 | Click Run Pipeline | Reads store → POSTs `{ nodes, edges }` to FastAPI |
| 5 | Backend processes | Counts nodes/edges → runs Kahn's Algorithm |
| 6 | Alert appears | Shows `num_nodes`, `num_edges`, `is_dag` |

---

## Getting Started

### Prerequisites

- Node.js v18+
- Python 3.10+
- npm v9+

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/Nikhil-Vin/vectorshift-pipeline.git
cd vectorshift-pipeline
```

**2. Install frontend dependencies**

```bash
npm install
```

**3. Install backend dependencies**

```bash
cd backend
pip install fastapi uvicorn
```

### Running the App

Open **two terminals**:

**Terminal 1 — Frontend**
```bash
npm start
```
Runs at → `http://localhost:3000`

**Terminal 2 — Backend**
```bash
cd backend
python -m uvicorn main:app --reload --port 8000
```
Runs at → `http://localhost:8000`

---

## API Reference

### `POST /pipelines/parse`

Called by the frontend when user clicks **Run Pipeline**.

**Request Body**
```json
{
  "nodes": [
    { "id": "input-1", "type": "customInput", "position": { "x": 100, "y": 200 }, "data": {} }
  ],
  "edges": [
    { "id": "e1", "source": "input-1", "target": "llm-1" }
  ]
}
```

**Response**
```json
{
  "num_nodes": 3,
  "num_edges": 2,
  "is_dag": true
}
```

### `GET /health`
Returns `{ "status": "ok" }` — use to verify backend is running.

---

## Node Types

| Node | Inputs | Outputs | Config |
|------|--------|---------|--------|
| **Input** | — | value | name, type (Text/File) |
| **Output** | value | — | name, type (Text/File) |
| **LLM** | system, prompt | response | — |
| **Text** | `{{variables}}` (dynamic) | out | textarea with auto-resize |
| **Math** | a, b | result | operation (+, -, *, /) |
| **Delay** | in | out | milliseconds |
| **API Call** | body, headers | response, status | method, url |
| **Filter** | in | pass, fail | condition expression |
| **Logger** | in | out | — |

---

## DAG Detection — Kahn's Algorithm

The backend checks if your pipeline is a valid **Directed Acyclic Graph** (DAG) — meaning data flows in one direction with no loops.

```
Valid DAG ✅           Invalid (cycle) ❌
Input → LLM → Output   A → B → C → A (loop!)
```

**Algorithm:**
1. Build adjacency list from edges
2. Count in-degree of each node
3. Queue all nodes with in-degree = 0
4. Process queue — reduce neighbors' in-degree
5. If visited count == total nodes → ✅ DAG
6. If visited count < total nodes → ❌ Has cycle

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| UI Framework | React 18 | Component rendering |
| Canvas | ReactFlow 11 | Node graph + drag/drop |
| State | Zustand 4 | Global nodes/edges store |
| Styling | CSS Variables | Dark theme system |
| Backend | FastAPI | REST API |
| Validation | Pydantic | Request/response models |
| Graph | Kahn's Algorithm | DAG cycle detection |

---

## License

MIT
