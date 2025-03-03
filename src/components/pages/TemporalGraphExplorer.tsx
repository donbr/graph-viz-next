'use client'
import React, { useState, useEffect } from 'react';

// Main App Component
const TemporalGraphExplorer = () => {
  // State management
  const [currentTime, setCurrentTime] = useState(1698796800000); // Nov 1, 2023
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);
  const [timelineData, setTimelineData] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);

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
      }, 2000);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, timelineData]);

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
      const timeIndex = timelineData.findIndex(t => t.timestamp === timestamp);
      const nodeCount = timelineData[timeIndex]?.nodeCount || 45;
      
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
          <div className="bg-white border-b p-4 flex items-center space-x-4">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            
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
                <div className="text-lg">Loading graph data...</div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-4 h-full relative">
                {/* Graph metadata */}
                <div className="absolute top-4 left-4 bg-white bg-opacity-80 p-2 rounded shadow-sm z-10">
                  <div className="text-sm"><strong>Nodes:</strong> {currentTimelinePoint.nodeCount || 0}</div>
                  <div className="text-sm"><strong>Edges:</strong> {currentTimelinePoint.edgeCount || 0}</div>
                  <div className="text-sm"><strong>Changes:</strong> {currentTimelinePoint.changes || 0}</div>
                </div>
                
                {/* Simple graph visualization */}
                <div className="h-full w-full relative">
                  {/* Draw edges */}
                  <svg className="absolute inset-0 w-full h-full">
                    {graphData && graphData.edges.map(edge => {
                      const source = graphData.nodes.find(n => n.id === edge.source);
                      const target = graphData.nodes.find(n => n.id === edge.target);
                      if (!source || !target) return null;
                      
                      // Set edge colors based on type
                      const edgeColor = 
                        edge.type === 'WORKS_AT' ? '#a0aec0' :
                        edge.type === 'MANAGES' ? '#fc8181' :
                        edge.type === 'WORKS_ON' ? '#fbd38d' :
                        edge.type === 'USES' ? '#d6bcfa' : '#a0aec0';
                      
                      const midX = (source.x + target.x) / 2;
                      const midY = (source.y + target.y) / 2;
                      
                      return (
                        <g key={edge.id}>
                          <line 
                            x1={source.x} y1={source.y} 
                            x2={target.x} y2={target.y} 
                            stroke={edgeColor} 
                            strokeWidth="2"
                            markerEnd="url(#arrowhead)"
                          />
                          <text 
                            x={midX} 
                            y={midY} 
                            textAnchor="middle" 
                            fill="#4a5568" 
                            fontSize="10"
                            dy="-5"
                          >
                            {edge.type}
                          </text>
                        </g>
                      );
                    })}
                    <defs>
                      <marker 
                        id="arrowhead" 
                        markerWidth="10" 
                        markerHeight="7" 
                        refX="9" 
                        refY="3.5" 
                        orient="auto"
                      >
                        <polygon points="0 0, 10 3.5, 0 7" fill="#718096" />
                      </marker>
                    </defs>
                  </svg>
                  
                  {/* Draw nodes */}
                  {graphData && graphData.nodes.map(node => {
                    // Set node colors based on label
                    const bgColor = 
                      node.label === 'Person' ? '#4299e1' :
                      node.label === 'Company' ? '#ed8936' :
                      node.label === 'Project' ? '#48bb78' :
                      node.label === 'Technology' ? '#9f7aea' : '#4299e1';
                    
                    return (
                      <div 
                        key={node.id}
                        className="absolute rounded-full flex items-center justify-center text-white font-bold text-xs cursor-pointer transform hover:scale-110 transition"
                        style={{ 
                          left: `${node.x}px`, 
                          top: `${node.y}px`,
                          width: '40px',
                          height: '40px',
                          backgroundColor: bgColor,
                          border: selectedNode && selectedNode.id === node.id ? '2px solid white' : 'none',
                          boxShadow: selectedNode && selectedNode.id === node.id ? '0 0 0 2px black' : 'none'
                        }}
                        onClick={() => setSelectedNode(node)}
                      >
                        {node.id}
                      </div>
                    );
                  })}
                </div>
                
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

export default TemporalGraphExplorer;
