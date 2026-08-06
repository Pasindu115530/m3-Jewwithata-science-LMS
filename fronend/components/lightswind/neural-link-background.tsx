"use client";

import React, { useEffect, useRef } from "react";

export type NeuralInteraction = "router" | "pulse" | "gravity" | "none";

interface NeuralLinkProps {
  nodeColor?: string;      // Base node color (Hex or CSS)
  lineColor?: string;      // Base connection line color (Hex or CSS)
  packetColor?: string;    // Base packet color (Hex or CSS)
  nodeCount?: number;      // Number of floating nodes
  maxDistance?: number;    // Distance threshold to connect nodes
  interactionMode?: NeuralInteraction;
  interactive?: boolean;
  packetFrequency?: number; // Automatic packet spawn interval in ms (0 to disable)
  className?: string;
}

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseSpeed: number;
  pulseScale: number;
}

interface Packet {
  id: number;
  x: number;
  y: number;
  path: number[];
  pathIndex: number;
  progress: number;
  speed: number;
  size: number;
  color: string;
}

const hexToRgb = (colorStr: string): string => {
  if (!colorStr) return "99, 102, 241";
  if (colorStr.startsWith("rgb")) {
    const match = colorStr.match(/\(([^)]+)\)/);
    return match ? match[1] : "99, 102, 241";
  }
  let c = colorStr.replace("#", "");
  if (c.length === 3) c = c.split("").map((x) => x + x).join("");
  const num = parseInt(c, 16);
  if (isNaN(num)) return "99, 102, 241";
  return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
};

const NeuralLinkBackground: React.FC<NeuralLinkProps> = ({
  nodeColor = "#6366f1", // indigo-500
  lineColor = "#818cf8", // indigo-400
  packetColor = "#06b6d4", // cyan-500
  nodeCount = 90,
  maxDistance = 120,
  interactionMode = "router",
  interactive = true,
  packetFrequency = 1200,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse tracking state
  const mouseRef = useRef({
    x: -1000,
    y: -1000,
    active: false,
    radius: 180,
    lastInjectedX: -1000,
    lastInjectedY: -1000,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let nodes: Node[] = [];
    let packets: Packet[] = [];
    let lastTime = performance.now();
    let packetIdCounter = 0;
    let autoSpawnTimer = 0;

    const createNode = (width: number, height: number): Node => {
      const angle = Math.random() * Math.PI * 2;
      const baseSpeed = 0.3 + Math.random() * 0.5;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.cos(angle) * baseSpeed,
        vy: Math.sin(angle) * baseSpeed,
        radius: 2.0 + Math.random() * 2.5,
        baseSpeed,
        pulseScale: 1.0,
      };
    };

    const resizeCanvas = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      let width = rect?.width || window.innerWidth;
      let height = rect?.height || window.innerHeight;

      if (width === 0) width = window.innerWidth;
      if (height === 0) height = window.innerHeight;

      const sizeChanged = canvas.width !== width || canvas.height !== height;

      canvas.width = width;
      canvas.height = height;

      // Re-initialize nodes if empty or if canvas size changed
      if (nodes.length === 0 || sizeChanged) {
        nodes = [];
        for (let i = 0; i < nodeCount; i++) {
          nodes.push(createNode(width, height));
        }
        packets = [];
      }
    };

    resizeCanvas();

    // Helper: Find neighbors of a node
    const getNeighbors = (nodeIdx: number): number[] => {
      const neighbors: number[] = [];
      const n1 = nodes[nodeIdx];
      if (!n1) return neighbors;

      for (let i = 0; i < nodes.length; i++) {
        if (i === nodeIdx) continue;
        const n2 = nodes[i];
        const dx = n2.x - n1.x;
        const dy = n2.y - n1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDistance) {
          neighbors.push(i);
        }
      }
      return neighbors;
    };

    // Helper: Spawn a path-hopping packet
    const spawnPacket = (startIdx: number, fromCursor = false) => {
      if (nodes.length === 0) return;
      
      const path: number[] = [startIdx];
      let currentIdx = startIdx;
      const maxHops = 4 + Math.floor(Math.random() * 3);

      for (let hop = 0; hop < maxHops; hop++) {
        const neighbors = getNeighbors(currentIdx).filter(n => !path.includes(n));
        if (neighbors.length === 0) break;
        const next = neighbors[Math.floor(Math.random() * neighbors.length)];
        path.push(next);
        currentIdx = next;
      }

      if (path.length > 1) {
        const speed = 0.045 + Math.random() * 0.035;
        const size = 3.0 + Math.random() * 2.0;
        
        const mouse = mouseRef.current;
        const startX = fromCursor ? mouse.x : nodes[startIdx].x;
        const startY = fromCursor ? mouse.y : nodes[startIdx].y;

        packets.push({
          id: packetIdCounter++,
          x: startX,
          y: startY,
          path,
          pathIndex: 0,
          progress: 0.0,
          speed,
          size,
          color: packetColor,
        });

        nodes[startIdx].pulseScale = 2.5;
      }
    };

    // Spawn initial packets
    for (let i = 0; i < 3; i++) {
      if (nodes.length > 0) {
        spawnPacket(Math.floor(Math.random() * nodes.length), false);
      }
    }

    // Window / Container event listeners for responsive cursor tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouse = mouseRef.current;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        mouse.x = x;
        mouse.y = y;
        mouse.active = true;

        if (interactionMode === "router" && nodes.length > 0) {
          const dx = mouse.x - mouse.lastInjectedX;
          const dy = mouse.y - mouse.lastInjectedY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist > 30) {
            let closestIdx = 0;
            let minDist = Infinity;
            for (let i = 0; i < nodes.length; i++) {
              const ndx = nodes[i].x - mouse.x;
              const ndy = nodes[i].y - mouse.y;
              const d = Math.sqrt(ndx * ndx + ndy * ndy);
              if (d < minDist) {
                minDist = d;
                closestIdx = i;
              }
            }

            if (minDist < mouse.radius) {
              spawnPacket(closestIdx, true);
              mouse.lastInjectedX = mouse.x;
              mouse.lastInjectedY = mouse.y;
            }
          }
        }
      } else {
        mouse.active = false;
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const handleClick = (e: MouseEvent) => {
      if (!interactive || nodes.length === 0) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        const mouse = mouseRef.current;
        const nodeDists = nodes.map((n, idx) => {
          const dx = n.x - x;
          const dy = n.y - y;
          return { idx, dist: Math.sqrt(dx * dx + dy * dy) };
        });

        nodeDists.sort((a, b) => a.dist - b.dist);
        const count = Math.min(5, nodeDists.length);
        for (let i = 0; i < count; i++) {
          if (nodeDists[i].dist < mouse.radius * 1.5) {
            spawnPacket(nodeDists[i].idx, true);
          }
        }
      }
    };

    if (interactive) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseleave", handleMouseLeave);
      window.addEventListener("click", handleClick);
    }

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      const now = performance.now();
      const dt = now - lastTime;
      lastTime = now;

      const lineRgb = hexToRgb(lineColor);

      // Clear canvas transparently
      ctx.clearRect(0, 0, width, height);

      // Handle auto-spawning packets
      if (packetFrequency > 0) {
        autoSpawnTimer += dt;
        if (autoSpawnTimer >= packetFrequency) {
          autoSpawnTimer = 0;
          if (nodes.length > 0) {
            const startIdx = Math.floor(Math.random() * nodes.length);
            spawnPacket(startIdx, false);
          }
        }
      }

      const mouse = mouseRef.current;

      // 1. Move and update nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];

        if (interactive && mouse.active && interactionMode === "gravity") {
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const pull = (1.0 - dist / mouse.radius) * 0.2;
            n.vx += (dx / dist) * pull;
            n.vy += (dy / dist) * pull;
          }
        }

        n.x += n.vx;
        n.y += n.vy;

        const speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
        if (speed > n.baseSpeed) {
          n.vx *= 0.95;
          n.vy *= 0.95;
        }

        if (n.x < 0) n.x = width;
        else if (n.x > width) n.x = 0;
        if (n.y < 0) n.y = height;
        else if (n.y > height) n.y = 0;

        if (n.pulseScale > 1.0) {
          n.pulseScale -= 0.05;
        } else {
          n.pulseScale = 1.0;
        }
      }

      // 2. Draw connections (synapse lines)
      ctx.lineWidth = 1.2;
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1.0 - dist / maxDistance) * 0.35;
            ctx.strokeStyle = `rgba(${lineRgb}, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }

        // Connection from cursor to nearby nodes
        if (interactive && mouse.active) {
          const dx = mouse.x - n1.x;
          const dy = mouse.y - n1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const alpha = (1.0 - dist / mouse.radius) * 0.55;
            ctx.strokeStyle = `rgba(${lineRgb}, ${alpha})`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(n1.x, n1.y);
            ctx.stroke();
          }
        }
      }

      // 3. Draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        ctx.fillStyle = nodeColor;

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius * n.pulseScale, 0, Math.PI * 2);
        ctx.fill();

        if (n.pulseScale > 1.1) {
          ctx.strokeStyle = nodeColor;
          ctx.lineWidth = 1.5;
          ctx.globalAlpha = (n.pulseScale - 1.0) / 1.5;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius * n.pulseScale * 2.0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.globalAlpha = 1.0;
        }
      }

      // 4. Update and draw packets (hopping signals)
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.progress += p.speed;

        if (p.progress >= 1.0) {
          p.progress = 0.0;
          p.pathIndex++;

          if (p.pathIndex >= p.path.length - 1) {
            packets.splice(i, 1);
            continue;
          }

          const reachedNodeIdx = p.path[p.pathIndex];
          if (nodes[reachedNodeIdx]) {
            nodes[reachedNodeIdx].pulseScale = 2.2;
          }
        }

        const nodeA = nodes[p.path[p.pathIndex]];
        const nodeB = nodes[p.path[p.pathIndex + 1]];

        if (!nodeA || !nodeB) {
          packets.splice(i, 1);
          continue;
        }

        p.x = nodeA.x + (nodeB.x - nodeA.x) * p.progress;
        p.y = nodeA.y + (nodeB.y - nodeA.y) * p.progress;

        ctx.shadowBlur = 12;
        ctx.shadowColor = packetColor;
        ctx.fillStyle = packetColor;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (interactive) {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseleave", handleMouseLeave);
        window.removeEventListener("click", handleClick);
      }
    };
  }, [nodeColor, lineColor, packetColor, nodeCount, maxDistance, interactionMode, interactive, packetFrequency]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
      />
    </div>
  );
};

export default NeuralLinkBackground;
