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
    
    // Convert graph data to Cytoscape format
    const elements = {
      nodes: graphData.nodes.map(node => ({
        data: { 
          id: node.id,
          label: node.label, 
          ...node.properties
        },
        position: { x: node.x, y: node.y }
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
            'label': 'data(id)',
            'color': 'white',
            'text-halign': 'center',
            'text-valign': 'center',
            'font-size': '12px',
            'font-weight': 'bold'
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

// Main App Component
const CytoscapeGraphExplorer = () => {
  // State management
  const [currentTime, setCurrentTime] = useState(1698796800000); // Nov 1, 2023
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);
  const [timelineData, setTimelineData] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // Load mock data
  useEffect(() => {
    const mockTimelineData = [
      { timestamp: 1672531200000, nodeCount: 45, edgeCount: 67, changes: 0, date: "Jan 2023" },
      { timestamp: 1675209600000, nodeCount: 52, edgeCount: 78, changes: 18, date: "Feb 2023" },
      { timestamp: 1677628800000, nodeCount: 58, edgeCount: 92, changes: 20, date: "Mar 2023" },
      { timestamp: 1680307200000, nodeCount: 62, edgeCount: 103, changes: 15, date: "Apr 2023" },
      { timestamp: 1682899200000, nodeCount: 71, edgeCount: 126, changes: 32, date: "May 2023" },
      { timestamp: 1685577600000, nodeCount: 73, edgeCount: 131, changes: 7, date: "Jun 2023" },
      { timestamp: 1688169600000, nodeCount: 79, edgeCount: 142, changes: 17, date: "Jul 2023" },
      { timestamp: 1690848000000, nodeCount: 84, edgeCount: 155, changes: 18, date: "Aug 2023" },
      { timestamp: 1693526400000, nodeCount: 86, edgeCount: 161, changes: 8, date: "Sep 2023" },
      { timestamp: 1696118400000, nodeCount: 90, edgeCount: 170, changes: 13, date: "Oct 2023" },
      { timestamp: 1698796800000, nodeCount: 94, edgeCount: 182, changes: 16, date: "Nov 2023" },
      { timestamp: 1701388800000, nodeCount: 98, edgeCount: 193, changes: 15, date: "Dec 2023" },
    ];
    
    setTimelineData(mockTimelineData);
    loadGraphData(currentTime);
  }, []);

  // Play/pause timeline animation
  useEffect(() => {
    let interval;
    if (isPlaying) {
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

  // Update graph data when time changes
  useEffect(() => {
    if (currentTime) {
      loadGraphData(currentTime);
    }
  }, [currentTime]);

  // Load graph data for a specific timestamp
  const loadGraphData = (timestamp) => {
    setLoading(true);
    
    // Simulate API call with delayed response
    setTimeout(() => {
      // Filter nodes and edges based on timestamp (more would appear over time)
      
      // Base nodes that are always present
      const baseNodes = [
        { id: "1", label: "Person", properties: { name: "John Smith", age: 34 }, x: 100, y: 100 },
        { id: "2", label: "Person", properties: { name: "Emma Johnson", age: 29 }, x: 250, y: 150 },
        { id: "3", label: "Company", properties: { name: "Acme Corp", founded: 2005 }, x: 175, y: 250 },
      ];
      
      // Additional nodes that appear over time
      const timeBasedNodes = [
        { id: "4", label: "Project", properties: { name: "Website Redesign", budget: 50000 }, x: 300, y: 120, minTime: 1675209600000 },
        { id: "5", label: "Technology", properties: { name: "React", version: "18.2" }, x: 400, y: 170, minTime: 1680307200000 },
        { id: "6", label: "Project", properties: { name: "Mobile App", budget: 75000 }, x: 350, y: 250, minTime: 1682899200000 },
        { id: "7", label: "Person", properties: { name: "Alex Chen", age: 31 }, x: 150, y: 350, minTime: 1688169600000 },
        { id: "8", label: "Technology", properties: { name: "Node.js", version: "18.0" }, x: 450, y: 300, minTime: 1693526400000 },
      ];
      
      // Base edges that are always present
      const baseEdges = [
        { id: "e1", source: "1", target: "3", type: "WORKS_AT", properties: { since: 2018 } },
        { id: "e2", source: "2", target: "3", type: "WORKS_AT", properties: { since: 2020 } },
      ];
      
      // Additional edges that appear over time
      const timeBasedEdges = [
        { id: "e3", source: "3", target: "4", type: "MANAGES", properties: { startDate: "2023-02-15" }, minTime: 1675209600000 },
        { id: "e4", source: "1", target: "4", type: "WORKS_ON", properties: { role: "Project Manager" }, minTime: 1677628800000 },
        { id: "e5", source: "2", target: "4", type: "WORKS_ON", properties: { role: "Developer" }, minTime: 1677628800000 },
        { id: "e6", source: "4", target: "5", type: "USES", properties: { criticality: "High" }, minTime: 1680307200000 },
        { id: "e7", source: "3", target: "6", type: "MANAGES", properties: { startDate: "2023-05-10" }, minTime: 1682899200000 },
        { id: "e8", source: "2", target: "6", type: "WORKS_ON", properties: { role: "Team Lead" }, minTime: 1685577600000 },
        { id: "e9", source: "7", target: "3", type: "WORKS_AT", properties: { since: 2023 }, minTime: 1688169600000 },
        { id: "e10", source: "7", target: "6", type: "WORKS_ON", properties: { role: "Developer" }, minTime: 1690848000000 },
        { id: "e11", source: "6", target: "8", type: "USES", properties: { criticality: "Medium" }, minTime: 1693526400000 },
        { id: "e12", source: "7", target: "4", type: "WORKS_ON", properties: { role: "Support" }, minTime: 1696118400000 },
      ];

      // Filter based on timestamp
      const filteredNodes = [
        ...baseNodes,
        ...timeBasedNodes.filter(node => node.minTime <= timestamp)
      ];
      
      const filteredEdges = [
        ...baseEdges,
        ...timeBasedEdges.filter(edge => edge.minTime <= timestamp)
      ];

      const graphData = {
        nodes: filteredNodes,
        edges: filteredEdges
      };
      
      setGraphData(graphData);
      setLoading(false);
    }, 500);
  };

  // Format timestamp to readable date
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  // Get current timeline data point
  const currentTimelinePoint = timelineData.find(item => item.timestamp === currentTime) || {};

  // Key events in the timeline
  const keyEvents = [
    { timestamp: 1675209600000, description: "Website Redesign project started" },
    { timestamp: 1680307200000, description: "React technology adopted" },
    { timestamp: 1682899200000, description: "Mobile App project launched" },
    { timestamp: 1688169600000, description: "Alex Chen joined the company" },
    { timestamp: 1693526400000, description: "Node.js implemented in Mobile App" }
  ];

  // Get current event if there is one
  const currentEvent = keyEvents.find(event => event.timestamp === currentTime);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Temporal Graph Explorer</h1>
          <div className="px-4 py-2 bg-white bg-opacity-20 rounded">
            {formatDate(currentTime)}
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <div className="w-64 bg-white shadow-md p-4 flex flex-col overflow-auto">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Node Labels</label>
            <div className="space-y-2 border p-2 rounded max-h-32 overflow-y-auto">
              {["Person", "Company", "Project", "Technology"].map(label => (
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
              {["WORKS_AT", "MANAGES", "WORKS_ON", "USES"].map(type => (
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
                  <div className="text-sm"><strong>Nodes:</strong> {currentTimelinePoint.nodeCount || 0}</div>
                  <div className="text-sm"><strong>Edges:</strong> {currentTimelinePoint.edgeCount || 0}</div>
                  <div className="text-sm"><strong>Changes:</strong> {currentTimelinePoint.changes || 0}</div>
                </div>
                
                {/* Cytoscape visualization */}
                <GraphVisualization 
                  graphData={graphData} 
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
                    Which month had the most significant changes?
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

export default CytoscapeGraphExplorer;
