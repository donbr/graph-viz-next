'use client'

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const AirlineAIKnowledgeGraph = () => {
  const svgRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [highlightedNodes, setHighlightedNodes] = useState([]);
  const [highlightedLinks, setHighlightedLinks] = useState([]);
  const [filterType, setFilterType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });

  // Graph data
  const nodes = [
    { id: 'GenerativeAI', name: 'Generative AI in Aviation', type: 'Technology', 
      description: 'AI systems that create new content based on patterns in training data. Used for chatbots, personalization, and content generation. Implementation peaked in airlines during 2023-2024.' },
    { id: 'AgenticAI', name: 'Agentic AI in Aviation', type: 'Technology', 
      description: 'AI systems that take autonomous actions on behalf of users. Transitions from passive assistance to proactive problem-solving. Expected widespread airline adoption from 2025 onward.' },
    { id: 'AlaskaAirlines', name: 'Alaska Airlines Platform', type: 'Implementation', 
      description: 'Unveiled at SXSW 2025. Uses computer vision to manage carry-on baggage and features AI-powered personalized airport navigation.' },
    { id: 'SingaporeAirlines', name: 'Singapore Airlines Agentforce', type: 'Implementation', 
      description: 'Implements Salesforce\'s autonomous agent technology for customer service. Uses Data Cloud to integrate customer information.' },
    { id: 'UnitedAirlines', name: 'United Airlines AI Initiative', type: 'Implementation', 
      description: 'Focused on proactive traveler problem resolution. Developing anticipatory AI for passenger needs and specializing in disruption management.' },
    { id: 'DeltaAirlines', name: 'Delta AI Concierge', type: 'Implementation', 
      description: 'Personalized concierge service using AI. Enhanced in-flight experience technologies with a passenger-centric approach.' },
    { id: 'CustomerExperience', name: 'Customer Experience', type: 'Application Area', 
      description: 'Virtual agents handling complex inquiries across channels. Real-time translation and personalized recommendations to improve satisfaction.' },
    { id: 'OperationsEfficiency', name: 'Operations Efficiency', type: 'Application Area', 
      description: 'Predictive maintenance using sensor data analytics. Flight route optimization and AI-driven crew scheduling and management.' },
    { id: 'TerminalExperience', name: 'Terminal Experience', type: 'Application Area', 
      description: 'AI navigation assistance in airports. Computer vision for baggage handling and automated check-in and boarding processes.' },
    { id: 'DisruptionResponse', name: 'Disruption Response', type: 'Application Area', 
      description: 'AI-driven proactive rebooking systems. Autonomous accommodation arrangements during travel disruptions and personalized communication.' },
    { id: 'SalesforceAgentforce', name: 'Salesforce Agentforce', type: 'Technology Platform', 
      description: 'AI system that deploys autonomous agents for specific tasks. Enables customer service representatives to focus on high-value interactions.' },
    { id: 'RegulatoryCompliance', name: 'Regulatory Compliance', type: 'Challenge', 
      description: 'Aviation authorities developing AI guidelines. European Union Aviation Safety Agency released AI Roadmap with focus on safety and ethics.' },
    { id: 'DataSecurity', name: 'Data Security', type: 'Challenge', 
      description: 'Protecting personal traveler information while enabling personalization. Compliance with international regulations and building trust.' },
    { id: 'TechnicalIntegration', name: 'Technical Integration', type: 'Challenge', 
      description: 'Connecting AI with legacy airline systems. Training staff on new technologies and maintaining appropriate human oversight.' },
    { id: 'AITravelAgents', name: 'AI Travel Agents', type: 'Emerging Technology', 
      description: 'Virtual assistants managing the entire travel journey. Handle booking, changes, and disruptions with multiple AI capabilities.' },
    { id: 'UnifiedAIPlatforms', name: 'Unified AI Platforms', type: 'Architecture', 
      description: 'Integrated systems combining various AI technologies. Orchestrates ML, generative AI, and agentic automation to reduce fragmentation.' },
    { id: 'AirlineAI', name: 'Airline AI', type: 'Category', 
      description: 'Umbrella term for artificial intelligence applications in the airline industry. Evolving rapidly with 2025 marking transition to agentic solutions.' }
  ];

  const links = [
    { source: 'AirlineAI', target: 'GenerativeAI', type: 'Includes' },
    { source: 'AirlineAI', target: 'AgenticAI', type: 'Includes' },
    { source: 'GenerativeAI', target: 'AgenticAI', type: 'Evolves into' },
    { source: 'AlaskaAirlines', target: 'GenerativeAI', type: 'Implements' },
    { source: 'AlaskaAirlines', target: 'AgenticAI', type: 'Pioneers' },
    { source: 'SingaporeAirlines', target: 'AgenticAI', type: 'Implements' },
    { source: 'UnitedAirlines', target: 'GenerativeAI', type: 'Implements' },
    { source: 'UnitedAirlines', target: 'AgenticAI', type: 'Developing' },
    { source: 'DeltaAirlines', target: 'GenerativeAI', type: 'Implements' },
    { source: 'GenerativeAI', target: 'CustomerExperience', type: 'Enables' },
    { source: 'AgenticAI', target: 'CustomerExperience', type: 'Transforms' },
    { source: 'AgenticAI', target: 'TerminalExperience', type: 'Enhances' },
    { source: 'AlaskaAirlines', target: 'TerminalExperience', type: 'Focuses on improving' },
    { source: 'RegulatoryCompliance', target: 'AgenticAI', type: 'Constrains' },
    { source: 'DataSecurity', target: 'GenerativeAI', type: 'Challenges' },
    { source: 'DataSecurity', target: 'AgenticAI', type: 'Challenges' },
    { source: 'TechnicalIntegration', target: 'AgenticAI', type: 'Limits adoption of' },
    { source: 'AgenticAI', target: 'AITravelAgents', type: 'Enables development of' },
    { source: 'UnifiedAIPlatforms', target: 'AgenticAI', type: 'Supports' },
    { source: 'AgenticAI', target: 'DisruptionResponse', type: 'Revolutionizes' },
    { source: 'UnitedAirlines', target: 'DisruptionResponse', type: 'Specializes in' },
    { source: 'DeltaAirlines', target: 'CustomerExperience', type: 'Enhances' },
    { source: 'GenerativeAI', target: 'OperationsEfficiency', type: 'Improves' },
    { source: 'AgenticAI', target: 'OperationsEfficiency', type: 'Optimizes' },
    { source: 'SingaporeAirlines', target: 'SalesforceAgentforce', type: 'Utilizes' },
    { source: 'SalesforceAgentforce', target: 'AgenticAI', type: 'Implements' },
    { source: 'SalesforceAgentforce', target: 'CustomerExperience', type: 'Enhances' }
  ];

  // Filter nodes and links based on type and search term
  useEffect(() => {
    let filteredNodes = nodes;
    if (filterType !== 'All') {
      filteredNodes = nodes.filter(node => node.type === filterType);
    }
    
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filteredNodes = filteredNodes.filter(node => 
        node.name.toLowerCase().includes(lowerSearchTerm) || 
        node.description.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    const nodeIds = new Set(filteredNodes.map(node => node.id));
    
    const filteredLinks = links.filter(link => 
      nodeIds.has(link.source) && nodeIds.has(link.target)
    );
    
    setGraphData({
      nodes: filteredNodes,
      links: filteredLinks.map(link => ({
        ...link,
        source: link.source,
        target: link.target
      }))
    });
  }, [filterType, searchTerm]);

  // Initialize the graph visualization
  useEffect(() => {
    if (!svgRef.current || graphData.nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    const width = 1000;
    const height = 600;
    
    svg.selectAll("*").remove();
    
    // Add viewBox for better responsiveness
    svg.attr("viewBox", `0 0 ${width} ${height}`);
    
    const g = svg.append("g");
    
    // Add zoom functionality
    const zoom = d3.zoom()
      .scaleExtent([0.2, 5])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
    
    svg.call(zoom);
    
    // Improved simulation with better spread parameters
    const simulation = d3.forceSimulation(graphData.nodes)
      .force("link", d3.forceLink(graphData.links).id(d => d.id).distance(d => {
        // Increased base distance for better spacing
        const sourceConnections = graphData.links.filter(l => 
          (typeof l.source === 'object' ? l.source.id : l.source) === 
          (typeof d.source === 'object' ? d.source.id : d.source)).length;
        const targetConnections = graphData.links.filter(l => 
          (typeof l.target === 'object' ? l.target.id : l.target) === 
          (typeof d.target === 'object' ? d.target.id : d.target)).length;
        return 150 + Math.min(80, Math.max(sourceConnections, targetConnections) * 5);
      }))
      .force("charge", d3.forceManyBody().strength(-700)) // Stronger repulsion
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("x", d3.forceX(width / 2).strength(0.07)) // Slightly stronger x-positioning
      .force("y", d3.forceY(height / 2).strength(0.07)) // Slightly stronger y-positioning
      .force("collision", d3.forceCollide().radius(75)); // Larger collision radius
    
    // Create color scale for node types
    const colorScale = d3.scaleOrdinal()
      .domain(['Technology', 'Implementation', 'Application Area', 'Challenge', 'Emerging Technology', 'Architecture', 'Category', 'Technology Platform'])
      .range(['#4e79a7', '#f28e2b', '#59a14f', '#e15759', '#76b7b2', '#edc948', '#b07aa1', '#ff9da7']);
    
    // Create links
    const link = g.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(graphData.links)
      .join("line")
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#arrow)");
    
    // Add arrow markers for directed links
    svg.append("defs").selectAll("marker")
      .data(["arrow"])
      .join("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", "#999")
      .attr("d", "M0,-5L10,0L0,5");
    
    // Create node groups
    const node = g.append("g")
      .selectAll("g")
      .data(graphData.nodes)
      .join("g")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));
    
    // Add circles for nodes
    node.append("circle")
      .attr("r", 20)
      .attr("fill", d => colorScale(d.type))
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);
    
    // Add node labels
    node.append("text")
      .text(d => d.name.length > 20 ? d.name.substring(0, 18) + "..." : d.name)
      .attr("text-anchor", "middle")
      .attr("dy", 30)
      .attr("font-size", "10px")
      .attr("font-weight", "bold")
      .attr("fill", "#333");
    
    // Link-labels
    const linkLabels = g.append("g")
      .selectAll("text")
      .data(graphData.links)
      .join("text")
      .attr("font-size", "8px")
      .attr("text-anchor", "middle")
      .attr("dy", -5)
      .text(d => d.type);
    
    // Node click event handler
    node.on("click", (event, d) => {
      setSelectedNode(d);
      
      // Find connected nodes and links
      const connectedLinks = graphData.links.filter(link => 
        link.source.id === d.id || link.target.id === d.id ||
        link.source === d.id || link.target === d.id
      );
      
      const connectedNodeIds = new Set();
      connectedLinks.forEach(link => {
        if (typeof link.source === 'object') {
          connectedNodeIds.add(link.source.id);
          connectedNodeIds.add(link.target.id);
        } else {
          connectedNodeIds.add(link.source);
          connectedNodeIds.add(link.target);
        }
      });
      
      setHighlightedLinks(connectedLinks);
      setHighlightedNodes(Array.from(connectedNodeIds));
      
      event.stopPropagation();
    });
    
    // Reset selection when clicking on canvas
    svg.on("click", () => {
      setSelectedNode(null);
      setHighlightedNodes([]);
      setHighlightedLinks([]);
    });
    
    // Update link styling based on highlights
    link.attr("stroke", d => {
      if (highlightedLinks.length === 0) return "#999";
      return highlightedLinks.includes(d) ? "#ff9900" : "#ddd";
    })
    .attr("stroke-width", d => {
      if (highlightedLinks.length === 0) return 2;
      return highlightedLinks.includes(d) ? 3 : 1;
    })
    .attr("stroke-opacity", d => {
      if (highlightedLinks.length === 0) return 0.6;
      return highlightedLinks.includes(d) ? 1 : 0.2;
    });
    
    // Update node styling based on highlights
    node.select("circle")
      .attr("r", d => {
        if (highlightedNodes.length === 0) return 20;
        return highlightedNodes.includes(d.id) ? 25 : 15;
      })
      .attr("stroke", d => {
        if (highlightedNodes.length === 0) return "#fff";
        return highlightedNodes.includes(d.id) ? "#ff9900" : "#ddd";
      })
      .attr("stroke-width", d => {
        if (highlightedNodes.length === 0) return 2;
        return highlightedNodes.includes(d.id) ? 3 : 1;
      })
      .attr("opacity", d => {
        if (highlightedNodes.length === 0) return 1;
        return highlightedNodes.includes(d.id) ? 1 : 0.4;
      });
    
    // Setup simulation ticks
    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
      
      node.attr("transform", d => `translate(${d.x},${d.y})`);
      
      linkLabels
        .attr("x", d => (d.source.x + d.target.x) / 2)
        .attr("y", d => (d.source.y + d.target.y) / 2);
    });
    
    // Drag functions
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    
    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }
    
    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    
    // Initial zoom to fit all content
    setTimeout(() => {
      // Calculate the graph's bounds
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      graphData.nodes.forEach(node => {
        if (node.x < minX) minX = node.x;
        if (node.x > maxX) maxX = node.x;
        if (node.y < minY) minY = node.y;
        if (node.y > maxY) maxY = node.y;
      });
      
      // Add padding
      const padding = 50;
      minX -= padding;
      maxX += padding;
      minY -= padding;
      maxY += padding;
      
      // Calculate scale and translate to center the graph
      const graphWidth = maxX - minX;
      const graphHeight = maxY - minY;
      const scale = Math.min(0.8, 0.8 * Math.min(width / graphWidth, height / graphHeight));
      
      // Apply transform
      svg.transition().duration(750).call(
        zoom.transform,
        d3.zoomIdentity
          .translate(width/2 - (minX + maxX)/2 * scale, height/2 - (minY + maxY)/2 * scale)
          .scale(scale)
      );
    }, 300); // Short delay to allow initial simulation to run
    
    // Re-center button handler - update to use improved centering
    const recenterGraph = () => {
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      graphData.nodes.forEach(node => {
        if (node.x < minX) minX = node.x;
        if (node.x > maxX) maxX = node.x;
        if (node.y < minY) minY = node.y;
        if (node.y > maxY) maxY = node.y;
      });
      
      const padding = 50;
      minX -= padding;
      maxX += padding;
      minY -= padding;
      maxY += padding;
      
      const graphWidth = maxX - minX;
      const graphHeight = maxY - minY;
      const scale = Math.min(0.8, 0.8 * Math.min(width / graphWidth, height / graphHeight));
      
      svg.transition().duration(750).call(
        zoom.transform,
        d3.zoomIdentity
          .translate(width/2 - (minX + maxX)/2 * scale, height/2 - (minY + maxY)/2 * scale)
          .scale(scale)
      );
    };
    
    return () => {
      simulation.stop();
    };
  }, [graphData, highlightedNodes, highlightedLinks]);

  // Unique node types for filter dropdown
  const nodeTypes = ['All', ...Array.from(new Set(nodes.map(node => node.type)))];

  return (
    <div className="flex flex-col h-full">
      <div className="bg-blue-900 text-white p-4">
        <h1 className="text-2xl font-bold">Airline AI Ecosystem (2025)</h1>
        <div className="text-sm mt-1">Interactive visualization of Generative AI and Agentic Solutions in the airline industry</div>
      </div>
      
      <div className="flex flex-row h-full">
        <div className="w-1/4 bg-gray-100 p-4 overflow-auto">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Filter by Type:
            </label>
            <select 
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              {nodeTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Search:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Search nodes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="mt-6">
            <div className="text-gray-700 text-sm font-bold mb-2">Legend:</div>
            <div className="flex flex-col gap-2">
              {nodeTypes.filter(type => type !== 'All').map(type => (
                <div key={type} className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-2" 
                    style={{ 
                      backgroundColor: d3.scaleOrdinal()
                        .domain(['Technology', 'Implementation', 'Application Area', 'Challenge', 'Emerging Technology', 'Architecture', 'Category', 'Technology Platform'])
                        .range(['#4e79a7', '#f28e2b', '#59a14f', '#e15759', '#76b7b2', '#edc948', '#b07aa1', '#ff9da7'])(type) 
                    }}
                  ></div>
                  <span className="text-sm">{type}</span>
                </div>
              ))}
            </div>
          </div>
          
          {selectedNode && (
            <div className="mt-6 bg-white p-4 rounded shadow">
              <h3 className="font-bold text-lg">{selectedNode.name}</h3>
              <div className="text-xs font-semibold text-blue-800 mt-1">{selectedNode.type}</div>
              <p className="mt-2 text-sm">{selectedNode.description}</p>
              
              <div className="mt-4">
                <div className="text-sm font-bold">Relationships:</div>
                <ul className="text-xs mt-1">
                  {highlightedLinks.map((link, idx) => {
                    const sourceName = typeof link.source === 'object' ? link.source.name : nodes.find(n => n.id === link.source).name;
                    const targetName = typeof link.target === 'object' ? link.target.name : nodes.find(n => n.id === link.target).name;
                    
                    return (
                      <li key={idx} className="py-1">
                        <strong>{sourceName}</strong> {link.type} <strong>{targetName}</strong>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}
        </div>
        
        <div className="w-3/4 p-4 flex-grow relative">
          <svg 
            ref={svgRef} 
            width="100%" 
            height="600"
            className="border border-gray-300 rounded bg-white"
          ></svg>
          
          {/* Updated re-center button to use new centering function */}
          <div className="absolute bottom-4 right-4">
            <button 
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 shadow text-xs"
              onClick={() => {
                const svg = d3.select(svgRef.current);
                // Use the recenterGraph function defined in the useEffect
                let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
                graphData.nodes.forEach(node => {
                  if (node.x < minX) minX = node.x;
                  if (node.x > maxX) maxX = node.x;
                  if (node.y < minY) minY = node.y;
                  if (node.y > maxY) maxY = node.y;
                });
                
                const padding = 50;
                minX -= padding;
                maxX += padding;
                minY -= padding;
                maxY += padding;
                
                const width = 1000;
                const height = 600;
                const graphWidth = maxX - minX;
                const graphHeight = maxY - minY;
                const scale = Math.min(0.8, 0.8 * Math.min(width / graphWidth, height / graphHeight));
                
                svg.transition().duration(750).call(
                  d3.zoom().transform,
                  d3.zoomIdentity
                    .translate(width/2 - (minX + maxX)/2 * scale, height/2 - (minY + maxY)/2 * scale)
                    .scale(scale)
                );
              }}
            >
              Re-center Graph
            </button>
          </div>
          
          <div className="absolute bottom-4 left-4 text-xs text-gray-500">
            Click on nodes to see details. Drag nodes to reposition. Scroll to zoom. Drag background to pan.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirlineAIKnowledgeGraph;