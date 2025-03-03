'use client'
import React, { useState, useEffect, useRef } from 'react';

import cytoscape from 'cytoscape';

// Graph Visualization Component using Cytoscape.js
const GraphVisualization = ({ graphData, onNodeSelect }) => {
  const cyRef = useRef(null);
  const containerRef = useRef(null);

  // Initialize Cytoscape instance
  useEffect(() => {
    if (!graphData || !containerRef.current) return;

    // Convert graph data to Cytoscape format using the updated layout field
    const elements = {
      nodes: graphData.nodes.map(node => ({
        data: { 
          id: node.id,
          label: node.label, 
          ...node.properties
        },
        position: node.layout ? { x: node.layout.x, y: node.layout.y } : { x: 0, y: 0 }
      })),
      edges: graphData.edges.map(edge => ({
        data: { 
          id: edge.id, 
          source: edge.source, 
          target: edge.target, 
          label: edge.type,
          ...edge.properties
        }
      }))
    };

    // Define node styles based on label
    const nodeStyles = {
      'Person': {
        'background-color': '#4299e1',
        'border-color': '#2b6cb0'
      },
      'Company': {
        'background-color': '#ed8936',
        'border-color': '#c05621'
      },
      'Project': {
        'background-color': '#48bb78',
        'border-color': '#2f855a'
      },
      'Technology': {
        'background-color': '#9f7aea',
        'border-color': '#6b46c1'
      }
    };

    // Define edge styles based on type
    const edgeStyles = {
      'WORKS_AT': {
        'line-color': '#a0aec0',
        'target-arrow-color': '#a0aec0'
      },
      'MANAGES': {
        'line-color': '#fc8181',
        'target-arrow-color': '#fc8181'
      },
      'WORKS_ON': {
        'line-color': '#fbd38d',
        'target-arrow-color': '#fbd38d'
      },
      'USES': {
        'line-color': '#d6bcfa',
        'target-arrow-color': '#d6bcfa'
      }
    };

    // Create new Cytoscape instance
    cyRef.current = cytoscape({
      container: containerRef.current,
      elements: elements,
      style: [
        {
          selector: 'node',
          style: {
            'width': 40,
            'height': 40,
            'background-color': '#4299e1',
            'border-width': 2,
            'border-color': '#2b6cb0',
            'label': 'data(name)', // Show name if available, fallback to id
            'color': 'white',
            'text-halign': 'center',
            'text-valign': 'center',
            'font-size': '12px',
            'font-weight': 'bold',
            'text-wrap': 'wrap',
            'text-max-width': '100px'
          }
        },
        {
          selector: 'node[?id]',
          style: {
            'label': 'data(id)' // Fallback if name is not available
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
            'font-size': '10px',
            'text-rotation': 'autorotate',
            'text-margin-y': -10
          }
        },
        // Apply node styles based on label
        ...Object.entries(nodeStyles).map(([label, style]) => ({
          selector: `node[label = "${label}"]`,
          style: style
        })),
        // Apply edge styles based on type
        ...Object.entries(edgeStyles).map(([type, style]) => ({
          selector: `edge[label = "${type}"]`,
          style: style
        })),
        // Selected node style
        {
          selector: 'node:selected',
          style: {
            'border-width': 4,
            'border-color': '#fff',
            'box-shadow': '0 0 0 2px #000'
          }
        }
      ],
      layout: {
        name: 'preset'
      },
      userZoomingEnabled: true,
      userPanningEnabled: true,
      boxSelectionEnabled: false
    });

    // Add event listeners
    cyRef.current.on('tap', 'node', event => {
      const node = event.target;
      const nodeData = graphData.nodes.find(n => n.id === node.id());
      if (nodeData && onNodeSelect) {
        onNodeSelect(nodeData);
      }
    });

    cyRef.current.on('tap', function(event) {
      if (event.target === cyRef.current) {
        // Clicked on background
        if (onNodeSelect) {
          onNodeSelect(null);
        }
      }
    });

    // Clean up
    return () => {
      if (cyRef.current) {
        cyRef.current.destroy();
      }
    };
  }, [graphData, onNodeSelect]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
  );
};

// JSON Schema for Temporal Graph Data
const graphSchema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Temporal Graph Schema",
  "type": "object",
  "required": ["graph"],
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
              "label": { "type": "string" },
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
            "required": ["id", "source", "target", "type", "properties"],
            "properties": {
              "id": { "type": "string" },
              "source": { "type": "string" },
              "target": { "type": "string" },
              "type": { "type": "string" },
              "properties": { "type": "object" },
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
        "metadata": {
          "type": "object",
          "properties": {
            "schemaVersion": { "type": "string" },
            "graphType": { "type": "string", "enum": ["directed", "undirected"] },
            "description": { "type": "string" },
            "author": { "type": "string" },
            "lastUpdated": { "type": "string", "format": "date-time" },
            "indexedProperties": { "type": "array", "items": { "type": "string" } },
            "keyEvents": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "timestamp": { "type": "string", "format": "date-time" },
                  "description": { "type": "string" }
                }
              }
            }
          }
        }
      }
    }
  }
};

// Main App Component
const CytoscapeGraphViz3 = () => {
  // Default sample data conforming to the schema
  const defaultGraphData = {
    graph: {
      nodes: [
        { id: "1", label: "Person", properties: { name: "John Smith", age: 34 }, layout: { x: 100, y: 100 } },
        { id: "2", label: "Person", properties: { name: "Emma Johnson", age: 29 }, layout: { x: 250, y: 150 } },
        { id: "3", label: "Company", properties: { name: "Acme Corp", foundedDate: "2005-01-01" }, layout: { x: 175, y: 250 } },
        { id: "4", label: "Project", properties: { name: "Website Redesign", budget: 50000 }, layout: { x: 300, y: 120 }, 
          temporal: { validFrom: "2023-02-01T00:00:00Z" } },
        { id: "5", label: "Technology", properties: { name: "React", version: "18.2" }, layout: { x: 400, y: 170 }, 
          temporal: { validFrom: "2023-04-01T00:00:00Z" } },
        { id: "6", label: "Project", properties: { name: "Mobile App", budget: 75000 }, layout: { x: 350, y: 250 }, 
          temporal: { validFrom: "2023-05-01T00:00:00Z" } },
        { id: "7", label: "Person", properties: { name: "Alex Chen", age: 31 }, layout: { x: 150, y: 350 }, 
          temporal: { validFrom: "2023-07-01T00:00:00Z" } },
        { id: "8", label: "Technology", properties: { name: "Node.js", version: "18.0" }, layout: { x: 450, y: 300 }, 
          temporal: { validFrom: "2023-09-01T00:00:00Z" } },
      ],
      edges: [
        { id: "e1", source: "1", target: "3", type: "WORKS_AT", properties: { startDate: "2018-01-01" } },
        { id: "e2", source: "2", target: "3", type: "WORKS_AT", properties: { startDate: "2020-01-01" } },
        { id: "e3", source: "3", target: "4", type: "MANAGES", properties: { startDate: "2023-02-15" }, 
          temporal: { validFrom: "2023-02-01T00:00:00Z" } },
        { id: "e4", source: "1", target: "4", type: "WORKS_ON", properties: { role: "Project Manager" }, 
          temporal: { validFrom: "2023-03-01T00:00:00Z" } },
        { id: "e5", source: "2", target: "4", type: "WORKS_ON", properties: { role: "Developer" }, 
          temporal: { validFrom: "2023-03-01T00:00:00Z" } },
        { id: "e6", source: "4", target: "5", type: "USES", properties: { criticalityLevel: "High" }, 
          temporal: { validFrom: "2023-04-01T00:00:00Z" } },
        { id: "e7", source: "3", target: "6", type: "MANAGES", properties: { startDate: "2023-05-10" }, 
          temporal: { validFrom: "2023-05-01T00:00:00Z" } },
        { id: "e8", source: "2", target: "6", type: "WORKS_ON", properties: { role: "Team Lead" }, 
          temporal: { validFrom: "2023-06-01T00:00:00Z" } },
        { id: "e9", source: "7", target: "3", type: "WORKS_AT", properties: { startDate: "2023-07-01" }, 
          temporal: { validFrom: "2023-07-01T00:00:00Z" } },
        { id: "e10", source: "7", target: "6", type: "WORKS_ON", properties: { role: "Developer" }, 
          temporal: { validFrom: "2023-08-01T00:00:00Z" } },
        { id: "e11", source: "6", target: "8", type: "USES", properties: { criticalityLevel: "Medium" }, 
          temporal: { validFrom: "2023-09-01T00:00:00Z" } },
        { id: "e12", source: "7", target: "4", type: "WORKS_ON", properties: { role: "Support" }, 
          temporal: { validFrom: "2023-10-01T00:00:00Z" } },
      ],
      metadata: {
        schemaVersion: "1.0",
        graphType: "directed",
        description: "A directed temporal graph modeling employee-project relationships at Acme Corp during 2023",
        author: "Temporal Graph Explorer Team",
        lastUpdated: "2023-11-01T00:00:00Z",
        indexedProperties: ["name", "startDate", "role"],
        keyEvents: [
          { timestamp: "2023-02-01T00:00:00Z", description: "Website Redesign project started" },
          { timestamp: "2023-04-01T00:00:00Z", description: "React technology adopted" },
          { timestamp: "2023-05-01T00:00:00Z", description: "Mobile App project launched" },
          { timestamp: "2023-07-01T00:00:00Z", description: "Alex Chen joined the company" },
          { timestamp: "2023-09-01T00:00:00Z", description: "Node.js implemented in Mobile App" }
        ]
      }
    }
  };

  // State management
  const [fullGraphData, setFullGraphData] = useState(defaultGraphData);
  const [displayedGraphData, setDisplayedGraphData] = useState({ nodes: [], edges: [] });
  const [currentTime, setCurrentTime] = useState(new Date("2023-11-01T00:00:00Z").getTime());
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);
  const [timelineData, setTimelineData] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [importError, setImportError] = useState(null);
  const [metadataVisible, setMetadataVisible] = useState(false);
  const fileInputRef = useRef(null);

  // Convert key events to timeline points
  useEffect(() => {
    if (fullGraphData?.graph?.metadata?.keyEvents) {
      // Generate monthly timeline data points
      const startTime = new Date("2023-01-01T00:00:00Z").getTime();
      const endTime = new Date("2023-12-01T00:00:00Z").getTime();
      const monthlyData = [];
      
      let currentTime = startTime;
      let month = 0;
      
      while (currentTime <= endTime) {
        const date = new Date(currentTime);
        const monthName = date.toLocaleString('default', { month: 'short', year: 'numeric' });
        
        // Calculate counts for this month (simplified simulation)
        const nodeCount = 45 + Math.floor(month * 4.5);
        const edgeCount = 67 + Math.floor(month * 10.5);
        const changes = month === 0 ? 0 : 5 + Math.floor(Math.random() * 20);
        
        monthlyData.push({
          timestamp: currentTime,
          date: monthName,
          nodeCount,
          edgeCount,
          changes
        });
        
        // Move to next month
        month++;
        date.setMonth(date.getMonth() + 1);
        currentTime = date.getTime();
      }
      
      setTimelineData(monthlyData);
    }
  }, [fullGraphData]);

  // Load graph data based on current time
  useEffect(() => {
    updateDisplayedGraph(currentTime);
  }, [currentTime, fullGraphData]);

  // Play/pause timeline animation
  useEffect(() => {
    let interval;
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

  // Update displayed graph based on time
  const updateDisplayedGraph = (timestamp) => {
    setLoading(true);
    
    setTimeout(() => {
      if (fullGraphData && fullGraphData.graph) {
        const { nodes, edges } = fullGraphData.graph;
        
        // Filter nodes based on temporal.validFrom (if present)
        const filteredNodes = nodes.filter(node => 
          !node.temporal || !node.temporal.validFrom || 
          new Date(node.temporal.validFrom).getTime() <= timestamp
        );
        
        // Filter edges based on temporal.validFrom (if present)
        const filteredEdges = edges.filter(edge => 
          !edge.temporal || !edge.temporal.validFrom || 
          new Date(edge.temporal.validFrom).getTime() <= timestamp
        );
        
        setDisplayedGraphData({
          nodes: filteredNodes,
          edges: filteredEdges
        });
      }
      
      setLoading(false);
    }, 300);
  };

  // Format timestamp to readable date
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  // Get current timeline data point
  const currentTimelinePoint = timelineData.find(item => item.timestamp === currentTime) || 
    timelineData.find(item => item.timestamp < currentTime) || {};

  // Get key events from metadata
  const keyEvents = fullGraphData?.graph?.metadata?.keyEvents?.map(event => ({
    timestamp: new Date(event.timestamp).getTime(),
    description: event.description
  })) || [];

  // Get current event if there is one
  const currentEvent = keyEvents.find(event => {
    // Check if current time is within the month of this event
    const eventDate = new Date(event.timestamp);
    const currentDate = new Date(currentTime);
    return eventDate.getMonth() === currentDate.getMonth() && 
           eventDate.getFullYear() === currentDate.getFullYear();
  });

  // Export schema definition
  const exportSchema = () => {
    const blob = new Blob([JSON.stringify(graphSchema, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'temporal-graph-schema.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export current graph data
  const exportGraphData = () => {
    const blob = new Blob([JSON.stringify(fullGraphData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'temporal-graph-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import graph data from file
  const importGraphData = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setImportError(null);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        
        // Basic validation of the imported data
        if (importedData.graph && 
            Array.isArray(importedData.graph.nodes) && 
            Array.isArray(importedData.graph.edges) &&
            importedData.graph.metadata) {
          
          setFullGraphData(importedData);
          setCurrentTime(new Date("2023-01-01T00:00:00Z").getTime()); // Reset to beginning
          
        } else {
          setImportError("The imported file does not follow the required schema format.");
        }
      } catch (error) {
        console.error("Error parsing imported file:", error);
        setImportError("Failed to parse the imported file. Make sure it's a valid JSON file.");
      }
    };
    
    reader.readAsText(file);
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Reset to default data
  const resetToDefault = () => {
    setFullGraphData(defaultGraphData);
    setCurrentTime(new Date("2023-01-01T00:00:00Z").getTime());
    setSelectedNode(null);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Temporal Graph Explorer</h1>
          
          <div className="flex items-center space-x-4">
            <div className="px-4 py-2 bg-white bg-opacity-20 rounded">
              {formatDate(currentTime)}
            </div>
            
            <div className="flex">
              <button 
                onClick={() => setMetadataVisible(!metadataVisible)} 
                className="bg-white bg-opacity-20 px-3 py-2 rounded-l hover:bg-opacity-30 transition"
                title="View graph metadata"
              >
                Info
              </button>
              <button 
                onClick={exportSchema} 
                className="bg-white bg-opacity-20 px-3 py-2 hover:bg-opacity-30 transition"
                title="Export schema definition"
              >
                Schema
              </button>
              <button 
                onClick={exportGraphData} 
                className="bg-white bg-opacity-20 px-3 py-2 hover:bg-opacity-30 transition"
                title="Export current graph data"
              >
                Export
              </button>
              <button 
                onClick={() => fileInputRef.current.click()} 
                className="bg-white bg-opacity-20 px-3 py-2 hover:bg-opacity-30 transition"
                title="Import graph data"
              >
                Import
              </button>
              <button 
                onClick={resetToDefault} 
                className="bg-white bg-opacity-20 px-3 py-2 rounded-r hover:bg-opacity-30 transition"
                title="Reset to default data"
              >
                Reset
              </button>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={importGraphData} 
                accept=".json" 
                className="hidden" 
              />
            </div>
          </div>
        </div>
      </header>
      
      {/* Import Error Alert */}
      {importError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          <div className="flex items-center">
            <div className="py-1">
              <svg className="h-6 w-6 text-red-500 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-bold">Import Error</p>
              <p className="text-sm">{importError}</p>
            </div>
            <button 
              onClick={() => setImportError(null)} 
              className="ml-auto text-red-500 hover:text-red-700"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {/* Metadata Panel */}
      {metadataVisible && fullGraphData?.graph?.metadata && (
        <div className="bg-white border-b shadow-sm p-4">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Graph Metadata</h2>
              <button 
                onClick={() => setMetadataVisible(false)} 
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-500">Description</span>
                <p className="text-sm">{fullGraphData.graph.metadata.description}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Schema Version</span>
                <p className="text-sm">{fullGraphData.graph.metadata.schemaVersion}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Graph Type</span>
                <p className="text-sm">{fullGraphData.graph.metadata.graphType}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Last Updated</span>
                <p className="text-sm">{new Date(fullGraphData.graph.metadata.lastUpdated).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Author</span>
                <p className="text-sm">{fullGraphData.graph.metadata.author}</p>
              </div>
              <div className="md:col-span-2">
                <span className="text-sm font-medium text-gray-500">Indexed Properties</span>
                <p className="text-sm">{fullGraphData.graph.metadata.indexedProperties?.join(', ')}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <div className="w-64 bg-white shadow-md p-4 flex flex-col overflow-auto">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Node Labels</label>
            <div className="space-y-2 border p-2 rounded max-h-32 overflow-y-auto">
              {Array.from(new Set(fullGraphData.graph.nodes.map(node => node.label))).map(label => (
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
              {Array.from(new Set(fullGraphData.graph.edges.map(edge => edge.type))).map(type => (
                <div key={type} className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span>{type}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-auto">
            <h3 className="text-md font-medium mb-2">Ask AI Assistant</h3>
            <textarea 
              className="w-full p-2 border rounded h-24 text-sm"
              placeholder="Ask a question about the graph data..."
            ></textarea>
            <button className="w-full mt-2 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
              Ask AI
            </button>
          </div>
        </div>
        
        {/* Main Panel */}
        <div className="flex-1 flex flex-col">
          {/* Timeline control */}
          <div className="bg-white border-b p-4 flex flex-col space-y-4">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center justify-center w-24"
              >
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              
              <div className="flex space-x-2">
                <button 
                  onClick={() => setPlaybackSpeed(0.5)}
                  className={`px-2 py-1 rounded text-xs ${playbackSpeed === 0.5 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                >
                  0.5x
                </button>
                <button 
                  onClick={() => setPlaybackSpeed(1)}
                  className={`px-2 py-1 rounded text-xs ${playbackSpeed === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                >
                  1x
                </button>
                <button 
                  onClick={() => setPlaybackSpeed(2)}
                  className={`px-2 py-1 rounded text-xs ${playbackSpeed === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                >
                  2x
                </button>
              </div>
              
              <div className="text-sm font-medium">
                {formatDate(currentTime)}
              </div>
              
              {currentEvent && (
                <div className="flex-1 ml-4 text-sm bg-blue-50 p-2 rounded border-l-4 border-blue-500">
                  <span className="font-medium">Event:</span> {currentEvent.description}
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <input
                type="range"
                min={timelineData.length > 0 ? timelineData[0].timestamp : 0}
                max={timelineData.length > 0 ? timelineData[timelineData.length - 1].timestamp : 100}
                value={currentTime}
                onChange={(e) => setCurrentTime(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                {timelineData.length > 0 && (
                  <>
                    <span>{timelineData[0].date}</span>
                    <span>{timelineData[Math.floor(timelineData.length / 2)].date}</span>
                    <span>{timelineData[timelineData.length - 1].date}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Graph visualization */}
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
                  <div className="text-sm"><strong>Nodes:</strong> {displayedGraphData.nodes.length}</div>
                  <div className="text-sm"><strong>Edges:</strong> {displayedGraphData.edges.length}</div>
                  <div className="text-sm"><strong>Changes:</strong> {currentTimelinePoint.changes || 0}</div>
                </div>
                
                {/* Cytoscape visualization */}
                <GraphVisualization 
                  graphData={displayedGraphData} 
                  onNodeSelect={setSelectedNode}
                />
                
                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white p-2 rounded shadow-sm">
                  <div className="text-sm font-medium mb-1">Node Types</div>
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-xs">Person</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                      <span className="text-xs">Company</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-xs">Project</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                      <span className="text-xs">Technology</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Right Sidebar - Details Panel */}
        <div className="w-72 bg-white shadow-md p-4 overflow-auto">
          {selectedNode ? (
            // Node details panel
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Node Details</h2>
                <button 
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setSelectedNode(null)}
                >
                  ×
                </button>
              </div>
              
              <div className="mb-4">
                <div className="text-sm text-gray-500">ID</div>
                <div className="font-medium">{selectedNode.id}</div>
              </div>
              
              <div className="mb-4">
                <div className="text-sm text-gray-500">Label</div>
                <div className="inline-block px-2 py-1 rounded text-xs font-medium"
                  style={{ 
                    backgroundColor: 
                      selectedNode.label === 'Person' ? '#bee3f8' :
                      selectedNode.label === 'Company' ? '#feebc8' :
                      selectedNode.label === 'Project' ? '#c6f6d5' :
                      selectedNode.label === 'Technology' ? '#e9d8fd' : '#bee3f8',
                    color:
                      selectedNode.label === 'Person' ? '#2c5282' :
                      selectedNode.label === 'Company' ? '#7b341e' :
                      selectedNode.label === 'Project' ? '#276749' :
                      selectedNode.label === 'Technology' ? '#553c9a' : '#2c5282',
                  }}
                >
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
                <button className="w-full py-2 mb-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition">
                  Find Related Nodes
                </button>
                <button className="w-full py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition">
                  View History
                </button>
              </div>
            </div>
          ) : (
            // LLM query panel (simplified)
            <div>
              <h2 className="text-lg font-semibold mb-4">AI Assistant</h2>
              
              <div className="bg-blue-50 p-3 rounded mb-4">
                <p className="text-sm">Ask me anything about the graph data!</p>
                <ul className="text-xs text-gray-600 mt-2 ml-4 list-disc">
                  <li>Analyze temporal patterns</li>
                  <li>Find relationships between nodes</li>
                  <li>Explain graph evolution</li>
                  <li>Discover paths between entities</li>
                </ul>
              </div>
              
              <div className="mb-4">
                <div className="text-sm mb-2 font-medium">Suggested Questions</div>
                <div className="space-y-2">
                  <div className="bg-gray-100 text-xs p-2 rounded cursor-pointer hover:bg-gray-200">
                    How has the graph evolved over time?
                  </div>
                  <div className="bg-gray-100 text-xs p-2 rounded cursor-pointer hover:bg-gray-200">
                    What connections exist between John and the Website Redesign project?
                  </div>
                  <div className="bg-gray-100 text-xs p-2 rounded cursor-pointer hover:bg-gray-200">
                    When was the Mobile App project launched?
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

export default CytoscapeGraphViz3;