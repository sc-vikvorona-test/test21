interface GraphNode<T> { id: string; data: T; edges: Array<{ to: string; weight: number }>; }
interface Graph<T> { nodes: Map<string, GraphNode<T>>; directed: boolean; }

function createGraph<T>(directed = false): Graph<T> {
  return { nodes: new Map(), directed };
}

function addNode<T>(graph: Graph<T>, id: string, data: T): void {
  graph.nodes.set(id, { id, data, edges: [] });
}

function addEdge<T>(graph: Graph<T>, from: string, to: string, weight = 1): void {
  const src = graph.nodes.get(from);
  const dst = graph.nodes.get(to);
  if (!src || !dst) throw new Error(`Node not found`);
  src.edges.push({ to, weight });
  if (!graph.directed) dst.edges.push({ to: from, weight });
}

function dijkstra<T>(graph: Graph<T>, start: string): Map<string, number> {
  const dist = new Map<string, number>();
  const visited = new Set<string>();
  
  for (const id of graph.nodes.keys()) dist.set(id, Infinity);
  dist.set(start, 0);
  
  const pq: Array<{ id: string; dist: number }> = [{ id: start, dist: 0 }];
  
  while (pq.length > 0) {
    pq.sort((a, b) => a.dist - b.dist);
    const { id } = pq.shift()!;
    if (visited.has(id)) continue;
    visited.add(id);
    
    const node = graph.nodes.get(id)!;
    for (const edge of node.edges) {
      const newDist = dist.get(id)! + edge.weight;
      if (newDist < dist.get(edge.to)!) {
        dist.set(edge.to, newDist);
        pq.push({ id: edge.to, dist: newDist });
      }
    }
  }
  
  return dist;
}

function bfs<T>(graph: Graph<T>, start: string): string[] {
  const visited = new Set<string>();
  const order: string[] = [];
  const queue = [start];
  visited.add(start);
  
  while (queue.length > 0) {
    const id = queue.shift()!;
    order.push(id);
    const node = graph.nodes.get(id)!;
    for (const edge of node.edges) {
      if (!visited.has(edge.to)) {
        visited.add(edge.to);
        queue.push(edge.to);
      }
    }
  }
  
  return order;
}

function dfs<T>(graph: Graph<T>, start: string): string[] {
  const visited = new Set<string>();
  const order: string[] = [];
  
  function visit(id: string): void {
    visited.add(id);
    order.push(id);
    const node = graph.nodes.get(id)!;
    for (const edge of node.edges) {
      if (!visited.has(edge.to)) visit(edge.to);
    }
  }
  
  visit(start);
  return order;
}

function detectCycle<T>(graph: Graph<T>): boolean {
  const visited = new Set<string>();
  const inStack = new Set<string>();
  
  function hasCycle(id: string): boolean {
    visited.add(id);
    inStack.add(id);
    const node = graph.nodes.get(id)!;
    for (const edge of node.edges) {
      if (!visited.has(edge.to)) {
        if (hasCycle(edge.to)) return true;
      } else if (inStack.has(edge.to)) return true;
    }
    inStack.delete(id);
    return false;
  }
  
  for (const id of graph.nodes.keys()) {
    if (!visited.has(id)) {
      if (hasCycle(id)) return true;
    }
  }
  return false;
}

export { createGraph, addNode, addEdge, dijkstra, bfs, dfs, detectCycle };
export type { Graph, GraphNode };
