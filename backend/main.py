from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any, Optional

app = FastAPI(title="VectorShift Pipeline API", version="1.0.0")

# ── CORS ─────────────────────────────────────────────────────────────────────
# Allows the React dev server (localhost:3000) to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Pydantic Models ───────────────────────────────────────────────────────────
# Matches the exact shape ReactFlow sends: { nodes: [...], edges: [...] }

class NodeData(BaseModel):
    id: str
    type: Optional[str] = None
    position: Optional[dict] = None
    data: Optional[dict] = None

    class Config:
        extra = "allow"  # accept any extra ReactFlow fields


class EdgeData(BaseModel):
    id: str
    source: str
    target: str
    sourceHandle: Optional[str] = None
    targetHandle: Optional[str] = None

    class Config:
        extra = "allow"  # accept any extra ReactFlow fields


class Pipeline(BaseModel):
    nodes: list[NodeData]
    edges: list[EdgeData]


class PipelineResult(BaseModel):
    num_nodes: int
    num_edges: int
    is_dag: bool


# ── DAG Detection (Kahn's Algorithm) ─────────────────────────────────────────

def check_is_dag(nodes: list[NodeData], edges: list[EdgeData]) -> bool:
    """
    Kahn's topological sort.
    Returns True  → valid DAG (no cycles).
    Returns False → cycle detected.
    """
    node_ids = {n.id for n in nodes}
    adj: dict[str, list[str]] = {id_: [] for id_ in node_ids}
    in_degree: dict[str, int] = {id_: 0 for id_ in node_ids}

    for edge in edges:
        src, tgt = edge.source, edge.target
        if src in adj and tgt in adj:
            adj[src].append(tgt)
            in_degree[tgt] += 1

    queue = [n for n in node_ids if in_degree[n] == 0]
    visited = 0

    while queue:
        node = queue.pop()
        visited += 1
        for neighbor in adj[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    return visited == len(node_ids)


# ── Graph Helpers ─────────────────────────────────────────────────────────────

def get_node_type_counts(nodes: list[NodeData]) -> dict[str, int]:
    counts: dict[str, int] = {}
    for node in nodes:
        t = node.type or "unknown"
        counts[t] = counts.get(t, 0) + 1
    return counts


def get_orphan_nodes(nodes: list[NodeData], edges: list[EdgeData]) -> list[str]:
    """Nodes with no connections at all."""
    connected = set()
    for edge in edges:
        connected.add(edge.source)
        connected.add(edge.target)
    return [n.id for n in nodes if n.id not in connected]


# ── Routes ────────────────────────────────────────────────────────────────────

@app.get("/")
def read_root():
    return {"Ping": "Pong", "status": "VectorShift API is running"}


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/pipelines/parse", response_model=PipelineResult)
def parse_pipeline(pipeline: Pipeline):
    """
    Called by FloatingSubmit.jsx when user clicks 'Run Pipeline'.

    Frontend sends:
        POST /pipelines/parse
        { "nodes": [...ReactFlowNodes], "edges": [...ReactFlowEdges] }

    Returns:
        { "num_nodes": int, "num_edges": int, "is_dag": bool }
    """
    if not pipeline.nodes:
        raise HTTPException(status_code=400, detail="Pipeline has no nodes.")

    return PipelineResult(
        num_nodes=len(pipeline.nodes),
        num_edges=len(pipeline.edges),
        is_dag=check_is_dag(pipeline.nodes, pipeline.edges),
    )


@app.post("/pipelines/analyze")
def analyze_pipeline(pipeline: Pipeline):
    """
    Extended analysis — richer metadata for future dashboard features.

    Returns node type breakdown, orphan nodes, and overall validity.
    A pipeline is 'valid' if it's a DAG and has no orphan nodes.
    """
    if not pipeline.nodes:
        raise HTTPException(status_code=400, detail="Pipeline has no nodes.")

    is_dag       = check_is_dag(pipeline.nodes, pipeline.edges)
    orphans      = get_orphan_nodes(pipeline.nodes, pipeline.edges)
    node_types   = get_node_type_counts(pipeline.nodes)

    return {
        "num_nodes":    len(pipeline.nodes),
        "num_edges":    len(pipeline.edges),
        "is_dag":       is_dag,
        "node_types":   node_types,
        "orphan_nodes": orphans,
        "has_orphans":  len(orphans) > 0,
        "is_valid":     is_dag and len(orphans) == 0,
    }
