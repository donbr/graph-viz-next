'use client'
import React, { useState, useEffect, useRef, useMemo } from 'react';

import cytoscape from 'cytoscape';
import { nodeTypeColors, edgeTypeColors } from '../../utils/colors';

interface GraphNode {
  id: string;
  label: string;
  properties: Record<string, any>;
  layout?: {
    x: number;
    y: number;
  };
  temporal?: {
    validFrom?: string;
    validTo?: string;
  };
}

interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: string;
  properties: Record<string, any>;
  temporal?: {
    validFrom?: string;
    validTo?: string;
  };
}

// Either use the interface or export it for use elsewhere
export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  metadata?: {
    schemaVersion: string;
    graphType: string;
    description: string;
    author: string;
    lastUpdated: string;
    keyEvents?: Array<{
      timestamp: string;
      description: string;
    }>;
  };
}

interface GraphVisualizationProps {
  graphData: {
    nodes: GraphNode[];
    edges: GraphEdge[];
  };
  onNodeSelect: (node: GraphNode | null) => void;
  layoutType: string; // Add this prop
}

const GraphVisualization = React.memo(({ graphData, onNodeSelect, layoutType }: GraphVisualizationProps) => {
  const cyRef = useRef<cytoscape.Core | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!graphData || !containerRef.current) return;

    // First ensure any previous instance is properly destroyed
    if (cyRef.current) {
      cyRef.current.destroy();
      cyRef.current = null;
    }

    // Then create a new instance with a short delay to ensure DOM stability
    const timer = setTimeout(() => {
      if (!containerRef.current) return; // Double check container still exists

      // Convert the ontology-based graph data to Cytoscape elements
      const elements = {
        nodes: graphData.nodes.map((node: any) => ({
          data: {
            id: node.id,
            // Use the human-friendly name for display
            label: node.properties["schema:name"] || node.id,
            // Preserve the original ontology label (e.g., "schema:ClinicalTrial")
            ontology: node.label,
            ...node.properties
          },
          // Use provided layout if available; if not, let the layout algorithm compute positions.
          position: node.layout ? { x: node.layout.x, y: node.layout.y } : undefined
        })),
        edges: graphData.edges.map((edge: any) => ({
          data: {
            id: edge.id,
            source: edge.source,
            target: edge.target,
            // Use the edge type as label for styling
            label: edge.type,
            ...edge.properties
          }
        }))
      };

      // Define ontology-specific node styles using the new "ontology" property.
      const nodeStyles = nodeTypeColors;

      // Define edge styles based on relationship type.
      const edgeStyles = edgeTypeColors;

      cyRef.current = cytoscape({
        container: containerRef.current,
        elements,
        style: [
          {
            selector: 'node',
            style: {
              'width': 40,
              'height': 40,
              'background-color': '#ddd', // fallback color
              'border-width': 2,
              'border-color': '#888',
              'label': 'data(label)',
              'color': 'white',
              'text-halign': 'center',
              'text-valign': 'center',
              'font-size': '6px',
              'font-weight': 'bold',
              'text-wrap': 'wrap',
              'text-max-width': '100px'
            }
          },
          {
            selector: 'edge',
            style: {
              'width': 2,
              'line-color': '#a0aec0',
              'target-arrow-color': '#a0aec0',
              'target-arrow-shape': 'triangle',
              'curve-style': 'bezier',
              'label': 'data(label)',
              'font-size': '6px',
              'text-rotation': 'autorotate',
              'text-margin-y': -10
            }
          },
          // Apply ontology-specific node styles using the "ontology" property.
          ...Object.entries(nodeStyles).map(([ontology, style]) => ({
            selector: `node[ontology = "${ontology}"]`,
            style: style
          })),
          // Apply edge styles based on relationship type.
          ...Object.entries(edgeStyles).map(([edgeType, style]) => ({
            selector: `edge[label = "${edgeType}"]`,
            style: style
          })),
          {
            selector: 'node:selected',
            style: {
              'border-width': 4,
              'border-color': '#fff'
              // 'box-shadow': '0 0 0 2px #000'
            }
          }
        ],
        // Use a force-directed (physics-enabled) layout rather than a preset layout.
        layout: {
          name: layoutType,
          // animate: layoutType !== 'preset',
          // padding: 30,
          fit: true,
          randomize: true
        },
        userZoomingEnabled: true,
        userPanningEnabled: true,
        boxSelectionEnabled: false
      });

      cyRef.current.on('tap', 'node', event => {
        const node = event.target;
        const nodeData = graphData.nodes.find((n: any) => n.id === node.id());
        if (nodeData && onNodeSelect) onNodeSelect(nodeData);
      });

      cyRef.current.on('tap', event => {
        if (event.target === cyRef.current && onNodeSelect) onNodeSelect(null);
      });
    }, 50); // Short delay to ensure DOM is ready

    return () => {
      clearTimeout(timer);
      if (cyRef.current) {
        cyRef.current.destroy();
        cyRef.current = null;
      }
    };
  }, [graphData, onNodeSelect, layoutType]);

  useEffect(() => {
    // Add keyboard event listeners for navigation
    const handleKeyDown = (event) => {
      if (!cyRef.current) return;
      
      switch(event.key) {
        case 'ArrowUp':
          cyRef.current.panBy({ x: 0, y: 50 });
          break;
        case 'ArrowDown':
          cyRef.current.panBy({ x: 0, y: -50 });
          break;
        case 'ArrowLeft':
          cyRef.current.panBy({ x: 50, y: 0 });
          break;
        case 'ArrowRight':
          cyRef.current.panBy({ x: -50, y: 0 });
          break;
        case '+':
          cyRef.current.zoom(cyRef.current.zoom() * 1.1);
          break;
        case '-':
          cyRef.current.zoom(cyRef.current.zoom() / 1.1);
          break;
      }
    };
    
    containerRef.current.tabIndex = 0; // Make div focusable
    containerRef.current.addEventListener('keydown', handleKeyDown);
    
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
});

// Add display name
GraphVisualization.displayName = 'GraphVisualization';

// JSON schema for the clinical trials knowledge graph is defined externally.
// For this app, we focus on the ontology-based clinical trials data.

const defaultGraphData = {
  graph: {
    nodes: [
      {
        "id": "1",
        "label": "schema:MedicalOrganization",
        "properties": {
          "schema:name": "AstraZeneca",
          "schema:location": "UK"
        }
      },
      {
        "id": "2",
        "label": "schema:ClinicalTrial",
        "properties": {
          "schema:identifier": "NCT04516746",
          "schema:name": "AZD7442 for COVID-19 Prevention",
          "schema:phase": "Phase 3",
          "schema:status": "Completed",
          "schema:startDate": "2020-08-18",
          "schema:endDate": "2022-10-01"
        },
        "temporal": {
          "validFrom": "2020-08-18T00:00:00Z",
          "validTo": "2022-10-01T00:00:00Z"
        }
      },
      {
        "id": "3",
        "label": "schema:Drug",
        "properties": {
          "schema:name": "AZD7442",
          "schema:dosageForm": "Injection",
          "schema:mechanismOfAction": "Monoclonal Antibody",
          "schema:indication": "COVID-19 Prevention"
        }
      },
      {
        "id": "4",
        "label": "schema:MedicalCondition",
        "properties": {
          "schema:name": "COVID-19",
          "schema:ICD10": "U07.1"
        }
      },
      {
        "id": "5",
        "label": "schema:GovernmentOrganization",
        "properties": {
          "schema:name": "U.S. Food and Drug Administration",
          "schema:abbreviation": "FDA"
        }
      },
      {
        "id": "6",
        "label": "schema:RegulatoryApproval",
        "properties": {
          "schema:identifier": "EUA-AZD7442",
          "schema:status": "Emergency Use Authorization",
          "schema:approvalDate": "2021-12-08"
        },
        "temporal": {
          "validFrom": "2021-12-08T00:00:00Z"
        }
      }
    ],
    edges: [
      {
        "id": "e1",
        "source": "1",
        "target": "2",
        "type": "schema:fundedBy",
        "properties": {
          "schema:role": "Sponsor"
        }
      },
      {
        "id": "e2",
        "source": "2",
        "target": "3",
        "type": "schema:testedDrug",
        "properties": {
          "schema:dosage": "600 mg"
        }
      },
      {
        "id": "e3",
        "source": "2",
        "target": "4",
        "type": "schema:relatedTo",
        "properties": {
          "schema:focus": "COVID-19 Prevention"
        }
      },
      {
        "id": "e4",
        "source": "3",
        "target": "6",
        "type": "schema:approvedBy",
        "properties": {
          "schema:approvingAgency": "FDA"
        },
        "temporal": {
          "validFrom": "2021-12-08T00:00:00Z"
        }
      },
      {
        "id": "e5",
        "source": "6",
        "target": "5",
        "type": "schema:approvedBy",
        "properties": {
          "schema:approvingAgency": "FDA"
        }
      }
    ],
    metadata: {
      schemaVersion: "4.0",
      graphType: "directed",
      description: "Clinical trials and approvals of AstraZeneca's AZD7442 for COVID-19 prevention",
      author: "Clinical Graph Research Team",
      lastUpdated: "2025-02-28T00:00:00Z"
    }
  }
};

const LifeSciencesViz1 = () => {
  const [fullGraphData, setFullGraphData] = useState<GraphData>(defaultGraphData.graph);
  const [currentTime, setCurrentTime] = useState<number>(new Date("2025-02-28T00:00:00Z").getTime());
  const [timelineData, setTimelineData] = useState<any[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [metadataVisible, setMetadataVisible] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [layoutType, setLayoutType] = useState<string>('cose');

  // Create timeline data from key events (for simplicity, we'll simulate monthly points)
  useEffect(() => {
    const start = new Date("2020-08-01T00:00:00Z").getTime();
    const end = new Date("2025-02-28T00:00:00Z").getTime();
    const points = [];
    for (let time = start; time <= end; time += 1000 * 60 * 60 * 24 * 30) {
      points.push({
        timestamp: time,
        date: new Date(time).toLocaleDateString(),
        nodeCount: Math.floor(Math.random() * 10) + 5,
        edgeCount: Math.floor(Math.random() * 10) + 5,
        changes: Math.floor(Math.random() * 5)
      });
    }
    setTimelineData(points);
  }, []);

  // Update displayed graph based on current time (filter nodes/edges by temporal.validFrom/validTo)
  const displayedGraphData = useMemo(() => {
    if (!fullGraphData) return { nodes: [], edges: [] };
    
    // Filter nodes by temporal validity
    const filteredNodes = fullGraphData.nodes.filter((node: GraphNode) => {
      if (!node.temporal || !node.temporal.validFrom) return true;
      const validFrom = new Date(node.temporal.validFrom).getTime();
      const validTo = node.temporal.validTo ? new Date(node.temporal.validTo).getTime() : Infinity;
      return validFrom <= currentTime && currentTime <= validTo;
    });
  
    // Filter edges based on nodes and temporal data
    const filteredEdges = fullGraphData.edges.filter((edge: GraphEdge) => {
      // Check that source and target nodes exist
      const sourceExists = filteredNodes.some(node => node.id === edge.source);
      const targetExists = filteredNodes.some(node => node.id === edge.target);
      if (!sourceExists || !targetExists) return false;
      
      // Apply temporal filtering
      if (!edge.temporal || !edge.temporal.validFrom) return true;
      const validFrom = new Date(edge.temporal.validFrom).getTime();
      const validTo = edge.temporal.validTo ? new Date(edge.temporal.validTo).getTime() : Infinity;
      return validFrom <= currentTime && currentTime <= validTo;
    });
  
    return { nodes: filteredNodes, edges: filteredEdges };
  }, [fullGraphData, currentTime]);

  useEffect(() => {
    // Set loading to false after component mounts and data is processed
    setLoading(false);
  }, [displayedGraphData]); // Will run whenever filtered data changes
  
  // Timeline playback control
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && timelineData.length > 0) {
      interval = setInterval(() => {
        setCurrentTime(prevTime => {
          const currentIndex = timelineData.findIndex(item => item.timestamp >= prevTime);
          const nextIndex = (currentIndex + 1) % timelineData.length;
          return timelineData[nextIndex].timestamp;
        });
      }, 2000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timelineData, playbackSpeed]);

  // Export schema (for demonstration, export the JSON schema defined earlier)
  const exportSchema = () => {
    const schema = {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "title": "Clinical Trials Knowledge Graph",
      "type": "object",
      "properties": {
        "graph": {
          "type": "object",
          "required": ["nodes", "edges", "metadata"],
          "properties": {
            "nodes": {
              "type": "array",
              "items": {
                "type": "object",
                "required": ["id", "label", "properties"],
                "properties": {
                  "id": { "type": "string" },
                  "label": { "type": "string", "enum": [
                    "schema:ClinicalTrial",
                    "schema:Drug",
                    "schema:MedicalOrganization",
                    "schema:MedicalCondition",
                    "schema:RegulatoryApproval",
                    "schema:GovernmentOrganization"
                  ]},
                  "properties": { "type": "object" },
                  "layout": {
                    "type": "object",
                    "properties": {
                      "x": { "type": "number" },
                      "y": { "type": "number" }
                    }
                  },
                  "temporal": {
                    "type": "object",
                    "properties": {
                      "validFrom": { "type": "string", "format": "date-time" },
                      "validTo": { "type": "string", "format": "date-time" }
                    }
                  }
                }
              }
            },
            "edges": {
              "type": "array",
              "items": {
                "type": "object",
                "required": ["id", "source", "target", "type"],
                "properties": {
                  "id": { "type": "string" },
                  "source": { "type": "string" },
                  "target": { "type": "string" },
                  "type": { "type": "string", "enum": [
                    "schema:fundedBy",
                    "schema:testedDrug",
                    "schema:approvedBy",
                    "schema:hasOutcome",
                    "schema:relatedTo"
                  ]},
                  "properties": { "type": "object" },
                  "temporal": {
                    "type": "object",
                    "properties": {
                      "validFrom": { "type": "string", "format": "date-time" }
                    }
                  }
                }
              }
            },
            "metadata": {
              "type": "object",
              "properties": {
                "schemaVersion": { "type": "string" },
                "graphType": { "type": "string", "enum": ["directed"] },
                "description": { "type": "string" },
                "author": { "type": "string" },
                "lastUpdated": { "type": "string", "format": "date-time" }
              }
            }
          }
        }
      }
    };
    const blob = new Blob([JSON.stringify(schema, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clinical-trials-schema.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export current graph data
  const exportGraphData = () => {
    const exportData = { graph: fullGraphData };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clinical-trials-graph.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import graph data from a JSON file
  const importGraphData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (!file) return;
    setImportError(null);
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        const newGraph = imported.graph ? imported.graph : imported;
        // Basic validation: check if nodes and edges exist
        if (newGraph.nodes && newGraph.edges && newGraph.metadata) {
          setFullGraphData(newGraph);
          setCurrentTime(new Date("2020-08-18T00:00:00Z").getTime());
        } else {
          setImportError("Imported file does not match the required schema format.");
        }
      } catch (error) {
        setImportError("Failed to parse imported file. Please ensure it is valid JSON.");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Reset to default clinical trials data
  const resetToDefault = () => {
    setFullGraphData(defaultGraphData.graph);
    setCurrentTime(new Date("2020-08-18T00:00:00Z").getTime());
    setImportError(null);
  };

  const formatDate = (timestamp: number) => new Date(timestamp).toLocaleDateString();

  const currentTimelinePoint = timelineData.find(item => item.timestamp === currentTime) || {};
  const keyEvents = fullGraphData.metadata && fullGraphData.metadata.graphType === "directed" ? [
    { timestamp: new Date("2020-08-18T00:00:00Z").getTime(), description: "Trial Launched" },
    { timestamp: new Date("2021-12-08T00:00:00Z").getTime(), description: "EUA Granted" }
  ] : [];
  const currentEvent = keyEvents.find(event => {
    const eventDate = new Date(event.timestamp);
    const currentDate = new Date(currentTime);
    return eventDate.getMonth() === currentDate.getMonth() &&
           eventDate.getFullYear() === currentDate.getFullYear();
  });

  const filteredBySearchTerm = (data: { nodes: GraphNode[]; edges: GraphEdge[] }) => {
    if (!searchTerm) return data;
    
    const matchedNodes = data.nodes.filter(node => 
      node.properties['schema:name']?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const nodeIds = new Set(matchedNodes.map(node => node.id));
    
    const matchedEdges = data.edges.filter(edge => 
      nodeIds.has(edge.source) || 
      nodeIds.has(edge.target) ||
      edge.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return { nodes: matchedNodes, edges: matchedEdges };
  };

  const dataToDisplay = filteredBySearchTerm(displayedGraphData);

  const handleNodeSelect = (node: GraphNode | null) => {
    setSelectedNode(node);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Clinical Trials Graph Explorer</h1>
          <div className="flex items-center space-x-4">
            <div className="px-4 py-2 bg-white bg-opacity-20 rounded">{formatDate(currentTime)}</div>
            <div className="flex">
              <button onClick={() => setMetadataVisible(!metadataVisible)} className="bg-white bg-opacity-20 px-3 py-2 rounded-l hover:bg-opacity-30 transition" title="View metadata">Info</button>
              <button onClick={exportSchema} className="bg-white bg-opacity-20 px-3 py-2 hover:bg-opacity-30 transition" title="Export schema">Schema</button>
              <button onClick={exportGraphData} className="bg-white bg-opacity-20 px-3 py-2 hover:bg-opacity-30 transition" title="Export graph data">Export</button>
              <button onClick={() => fileInputRef.current && fileInputRef.current.click()} className="bg-white bg-opacity-20 px-3 py-2 hover:bg-opacity-30 transition" title="Import graph data">Import</button>
              <button onClick={resetToDefault} className="bg-white bg-opacity-20 px-3 py-2 rounded-r hover:bg-opacity-30 transition" title="Reset to default">Reset</button>
              <input type="file" accept="application/json" ref={fileInputRef} onChange={importGraphData} style={{ display: 'none' }} />
            </div>
          </div>
        </div>
      </header>

      {/* Import Error Alert */}
      {importError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          <div className="flex items-center">
            <svg className="h-6 w-6 text-red-500 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-bold">Import Error</p>
              <p className="text-sm">{importError}</p>
            </div>
            <button onClick={() => setImportError(null)} className="ml-auto text-red-500 hover:text-red-700">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Metadata Panel */}
      {metadataVisible && fullGraphData.metadata && (
        <div className="bg-white border-b shadow-sm p-4">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Graph Metadata</h2>
              <button onClick={() => setMetadataVisible(false)} className="text-gray-500 hover:text-gray-700">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-500">Description</span>
                <p className="text-sm">{fullGraphData.metadata.description}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Schema Version</span>
                <p className="text-sm">{fullGraphData.metadata.schemaVersion}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Graph Type</span>
                <p className="text-sm">{fullGraphData.metadata.graphType}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Last Updated</span>
                <p className="text-sm">{new Date(fullGraphData.metadata.lastUpdated).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Author</span>
                <p className="text-sm">{fullGraphData.metadata.author}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Filters */}
        <div className="w-64 bg-white shadow-md p-4 flex flex-col overflow-auto">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Search</label>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border rounded" 
              placeholder="Search nodes and edges..."
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Node Labels</label>
            <div className="space-y-2 border p-2 rounded max-h-32 overflow-y-auto">
              {Array.from(new Set(fullGraphData.nodes.map((node: any) => node.label))).map((label: string) => (
                <div key={label} className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Edge Types</label>
            <div className="space-y-2 border p-2 rounded max-h-32 overflow-y-auto">
              {Array.from(new Set(fullGraphData.edges.map((edge: any) => edge.type))).map((type: string) => (
                <div key={type} className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span>{type}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Layout Type</label>
            <select 
              value={layoutType}
              onChange={(e) => setLayoutType(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="cose">Force-Directed (Physics)</option>
              <option value="grid">Grid</option>
              <option value="circle">Circle</option>
              <option value="concentric">Concentric</option>
              <option value="preset">Preset (Use Fixed Positions)</option>
            </select>
          </div>
          <div className="mt-auto">
            <h3 className="text-md font-medium mb-2">Ask AI Assistant</h3>
            <textarea className="w-full p-2 border rounded h-24 text-sm" placeholder="Ask a question about the graph data..."></textarea>
            <button className="w-full mt-2 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">Ask AI</button>
          </div>
        </div>

        {/* Main Panel */}
        <div className="flex-1 flex flex-col">
          {/* Timeline Control */}
          {timelineData.length > 0 && (
            <div className="bg-white border-b p-4 flex flex-col space-y-4">
              <div className="flex items-center space-x-4">
                <button onClick={() => setIsPlaying(!isPlaying)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center justify-center w-24">
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
                <div className="flex space-x-2">
                  <button onClick={() => setPlaybackSpeed(0.5)} className={`px-2 py-1 rounded text-xs ${playbackSpeed === 0.5 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>0.5x</button>
                  <button onClick={() => setPlaybackSpeed(1)} className={`px-2 py-1 rounded text-xs ${playbackSpeed === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>1x</button>
                  <button onClick={() => setPlaybackSpeed(2)} className={`px-2 py-1 rounded text-xs ${playbackSpeed === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>2x</button>
                </div>
                <div className="text-sm font-medium">{formatDate(currentTime)}</div>
                {currentEvent && (
                  <div className="flex-1 ml-4 text-sm bg-blue-50 p-2 rounded border-l-4 border-blue-500">
                    <span className="font-medium">Event:</span> {currentEvent.description}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input type="range" min={timelineData[0].timestamp} max={timelineData[timelineData.length - 1].timestamp} value={currentTime} onChange={(e) => setCurrentTime(parseInt(e.target.value))} className="w-full" />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <>
                    <span>{timelineData[0].date}</span>
                    <span>{timelineData[Math.floor(timelineData.length / 2)].date}</span>
                    <span>{timelineData[timelineData.length - 1].date}</span>
                  </>
                </div>
              </div>
            </div>
          )}

          {/* Graph Visualization */}
          <div className="flex-1 overflow-auto p-6">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <div className="ml-4 text-lg">Loading graph data...</div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-4 h-full relative">
                {/* Graph metadata */}                
                <div className="absolute top-4 left-4 bg-white p-2 rounded shadow-sm z-10">
                  <div className="text-sm font-medium border-b pb-1 mb-1">Graph Statistics</div>
                  <div className="text-sm"><strong>Nodes:</strong> {dataToDisplay.nodes.length}</div>
                  <div className="text-sm"><strong>Edges:</strong> {dataToDisplay.edges.length}</div>
                  <div className="text-sm"><strong>Changes:</strong> {currentTimelinePoint.changes || 0}</div>
                </div>

                {/* Cytoscape visualization */}
                <GraphVisualization 
                  graphData={dataToDisplay} 
                  onNodeSelect={handleNodeSelect}
                  layoutType={layoutType} // Pass the state value
                />
                
                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white p-2 rounded shadow-sm">
                  <div className="text-sm font-medium mb-1">Node Types</div>
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                      <span className="text-xs">MedicalOrganization</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-xs">ClinicalTrial</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                      <span className="text-xs">Drug</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-orange-300 mr-2"></div>
                      <span className="text-xs">MedicalCondition</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-xs">RegulatoryApproval</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
                      <span className="text-xs">GovernmentOrganization</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Node Details */}
        <div className="w-72 bg-white shadow-md p-4 overflow-auto">
          {selectedNode ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Node Details</h2>
                <button className="text-gray-400 hover:text-gray-600" onClick={() => setSelectedNode(null)}>×</button>
              </div>
              <div className="mb-4">
                <div className="text-sm text-gray-500">ID</div>
                <div className="font-medium">{selectedNode.id}</div>
              </div>
              <div className="mb-4">
                <div className="text-sm text-gray-500">Label</div>
                <div className="inline-block px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: '#edf2f7', color: '#2d3748' }}>
                  {selectedNode.label}
                </div>
              </div>
              {selectedNode.temporal && (
                <div className="mb-4">
                  <div className="text-sm text-gray-500">Temporal Data</div>
                  <div className="flex py-1 border-b border-gray-100">
                    <div className="font-medium text-sm w-1/3">Valid From:</div>
                    <div className="text-sm">{new Date(selectedNode.temporal.validFrom).toLocaleDateString()}</div>
                  </div>
                  {selectedNode.temporal.validTo && (
                    <div className="flex py-1 border-b border-gray-100">
                      <div className="font-medium text-sm w-1/3">Valid To:</div>
                      <div className="text-sm">{new Date(selectedNode.temporal.validTo).toLocaleDateString()}</div>
                    </div>
                  )}
                </div>
              )}
              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-1">Properties</div>
                {Object.entries(selectedNode.properties).map(([key, value]) => (
                  <div key={key} className="flex py-1 border-b border-gray-100">
                    <div className="font-medium text-sm w-1/3">{key}:</div>
                    <div className="text-sm">{value}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <button className="w-full py-2 mb-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition">Find Related Nodes</button>
                <button className="w-full py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition">View History</button>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-semibold mb-4">AI Assistant</h2>
              <div className="bg-blue-50 p-3 rounded mb-4">
                <p className="text-sm">Ask me anything about the clinical trials graph!</p>
                <ul className="text-xs text-gray-600 mt-2 ml-4 list-disc">
                  <li>Analyze trial progress over time</li>
                  <li>Find relationships between trials and drugs</li>
                  <li>Explain approval events</li>
                  <li>Discover connections among entities</li>
                </ul>
              </div>
              <div className="mb-4">
                <div className="text-sm mb-2 font-medium">Suggested Questions</div>
                <div className="space-y-2">
                  <div className="bg-gray-100 text-xs p-2 rounded cursor-pointer hover:bg-gray-200">
                    How did the clinical trial progress over time?
                  </div>
                  <div className="bg-gray-100 text-xs p-2 rounded cursor-pointer hover:bg-gray-200">
                    What relationships exist between AstraZeneca and the trial?
                  </div>
                  <div className="bg-gray-100 text-xs p-2 rounded cursor-pointer hover:bg-gray-200">
                    When was the EUA granted?
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LifeSciencesViz1;
