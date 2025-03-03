'use client'
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const MCPKnowledgeGraph = () => {
  const svgRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [entityTypes, setEntityTypes] = useState([]);
  const [relationTypes, setRelationTypes] = useState([]);
  
  // Define color scale for node types
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
  
  useEffect(() => {
    // Load graph data
    const fetchData = async () => {
      try {
        const graphData = {
          "entities": [
            {"name": "MCP", "entityType": "Protocol", "observations": [
              "Stands for Model Context Protocol",
              "Standardized way for applications to provide context for LLMs",
              "Has TypeScript and Python SDKs",
              "Supports tools, resources, and prompts as core concepts",
              "Designed for secure, controlled access to tools and data sources",
              "Open standard for secure, two-way connections between data sources and AI-powered tools",
              "Released by Anthropic in late 2023",
              "Similar to how USB-C standardizes physical connections, MCP standardizes AI connections",
              "Complete specification available on GitHub",
              "Enables interoperability between different AI systems and tools"
            ]},
            {"name": "Tool", "entityType": "MCP_Component", "observations": [
              "Functions that LLMs can call to take actions",
              "Defined with name, description, and input schema",
              "Examples include file operations, API calls, and data processing",
              "Typically used for operations with side effects",
              "Similar to POST endpoints in REST APIs",
              "Model-controlled functions that can be called to take actions",
              "Similar to function calling in other LLM platforms",
              "Enables safe execution of operations with side effects",
              "Can integrate with external APIs and services",
              "Must specify a schema describing required and optional parameters"
            ]},
            {"name": "Resource", "entityType": "MCP_Component", "observations": [
              "Data sources LLMs can access",
              "Referenced by URI format",
              "Can represent files, API responses, or other data",
              "Similar to GET endpoints in REST APIs",
              "Can be static or dynamic",
              "Application-controlled data sources that LLMs can access",
              "Identified by URI patterns (e.g., file://, github://)",
              "Can be static files or dynamic data from APIs",
              "Support pagination for large datasets",
              "Can optionally support subscription for updates"
            ]},
            {"name": "Prompt", "entityType": "MCP_Component", "observations": [
              "Reusable templates for LLM interactions",
              "Can include predefined messages and parameters",
              "Help structure conversations for specific tasks",
              "User-controlled through slash commands or menu options",
              "User-controlled templates invoked by user choice",
              "Can include variables that get filled with arguments",
              "Typically appear as slash commands or menu options",
              "Help standardize common interaction patterns",
              "Can include multi-turn conversations with predefined messages"
            ]},
            {"name": "MCP_Server", "entityType": "Software", "observations": [
              "Implements the MCP protocol to expose functionality",
              "Can provide tools, resources, and prompts",
              "Communicates over stdio or HTTP/SSE",
              "Typically built with TypeScript or Python SDKs",
              "Many specialized implementations for different services",
              "Exposes functionality through standardized protocol",
              "Can be implemented in TypeScript, Python, or other languages",
              "Can run over stdio or HTTP with Server-Sent Events (SSE)",
              "Should declare capabilities during initialization",
              "Can support custom extensions through experimental capabilities"
            ]},
            {"name": "MCP_Client", "entityType": "Software", "observations": [
              "Connects to MCP servers",
              "Includes Claude Desktop and other LLM applications",
              "Configures and launches servers",
              "Routes LLM requests to appropriate servers",
              "Connects to and manages MCP servers",
              "Handles authentication and routing requests",
              "Can be AI applications or development tools",
              "Examples include Claude Desktop, Zed editor, and MCPInspector",
              "Responsible for lifecycle management of servers"
            ]},
            {"name": "TypeScript_SDK", "entityType": "Software_Library", "observations": [
              "Implementation of MCP protocol in TypeScript",
              "Provides server and client classes",
              "Handles message parsing and transport",
              "Used in most JavaScript/TypeScript MCP servers",
              "Official TypeScript implementation by Anthropic",
              "Available on npm as @modelcontextprotocol/sdk",
              "Provides low-level Server and high-level McpServer classes",
              "Handles transport layer communication",
              "Includes type definitions for all protocol messages"
            ]},
            {"name": "Python_SDK", "entityType": "Software_Library", "observations": [
              "Implementation of MCP protocol in Python",
              "Includes FastMCP for simplified server creation",
              "Provides full protocol support for clients and servers",
              "Used in Python-based MCP servers",
              "Official Python implementation by Anthropic",
              "Available on PyPI as 'mcp'",
              "Provides FastMCP for simplified server creation",
              "Supports async/await patterns",
              "Includes CLI tools for server management"
            ]},
            {"name": "Claude_Desktop", "entityType": "Application", "observations": [
              "Desktop application for Claude AI assistant",
              "Can be configured to use MCP servers",
              "Launches servers and manages connections",
              "Uses configuration in claude_desktop_config.json",
              "Official desktop application by Anthropic",
              "Provides a GUI for Claude AI assistant",
              "Configurable through claude_desktop_config.json",
              "Can launch and manage multiple MCP servers",
              "Available for Windows, macOS, and Linux"
            ]},
            {"name": "Filesystem_Server", "entityType": "MCP_Server_Implementation", "observations": [
              "Provides secure file operations",
              "Has configurable access controls",
              "Can create, read, update, and delete files",
              "Supports file search",
              "Exposed as an MCP server",
              "Provides secure access to local filesystem",
              "Features configurable access controls for directories",
              "Can read, write, search, and manipulate files",
              "Popular server for development and testing",
              "Implements proper security boundaries to prevent unauthorized access"
            ]},
            {"name": "Redis_Server", "entityType": "MCP_Server_Implementation", "observations": [
              "Provides Redis database operations",
              "Can set, get, and delete key-value pairs",
              "Lists Redis keys matching patterns",
              "Exposed as an MCP server",
              "Provides access to Redis key-value store operations",
              "Supports set, get, delete, and pattern-matching operations",
              "Can connect to local or remote Redis instances",
              "Useful for caching and temporary data storage",
              "Configurable through connection string"
            ]},
            {"name": "GitHub_Server", "entityType": "MCP_Server_Implementation", "observations": [
              "Repository management and GitHub API integration",
              "Supports file operations",
              "Can create issues and pull requests",
              "Provides search capabilities",
              "Exposed as an MCP server",
              "Provides access to GitHub repositories and project management",
              "Supports file operations, issue creation, and PR management",
              "Available as an official reference implementation",
              "Requires GitHub Personal Access Token for authentication",
              "Can search code, create commits, and manage branches"
            ]},
            {"name": "Brave_Search_Server", "entityType": "MCP_Server_Implementation", "observations": [
              "Provides web and local search via Brave's API",
              "Supports pagination and filtering",
              "Returns formatted search results",
              "Exposed as an MCP server",
              "Integrates with Brave's Search API for web and local search",
              "Returns formatted search results with pagination support",
              "Requires API key from Brave",
              "Can perform local business searches with geographical context",
              "Falls back to web search when no local results are found"
            ]},
            {"name": "Memory_Server", "entityType": "MCP_Server_Implementation", "observations": [
              "Knowledge graph-based persistent memory",
              "Stores information as entities and relationships",
              "Supports adding and retrieving information",
              "Maintains context across conversations",
              "Exposed as an MCP server",
              "Stores information in a knowledge graph structure",
              "Maintains entity and relationship data across sessions",
              "Enables persistence of user preferences and information",
              "Can be used for personalized experiences",
              "Useful for maintaining conversation context over time"
            ]},
            {"name": "Google_Maps_Server", "entityType": "MCP_Server_Implementation", "observations": [
              "Provides location services via Google Maps API",
              "Features include geocoding, directions, places search",
              "Returns formatted location data",
              "Exposed as an MCP server",
              "Provides geolocation services through Google Maps API",
              "Features include geocoding, reverse geocoding, and directions",
              "Requires Google Maps API key",
              "Returns rich location data including coordinates and place details",
              "Can calculate distances and travel times between locations"
            ]},
            {"name": "Docker", "entityType": "Deployment_Method", "observations": [
              "Container-based deployment",
              "Used for MCP servers",
              "Provides isolation",
              "Configurable via environment variables",
              "Can mount volumes for persistence",
              "Recommended deployment method for production MCP servers",
              "Provides consistent environment across platforms",
              "Simplifies dependency management",
              "Enables secure isolation of server processes",
              "Official images available for many reference servers"
            ]},
            {"name": "NPX", "entityType": "Deployment_Method", "observations": [
              "Node.js package execution",
              "Used for JavaScript/TypeScript MCP servers",
              "Can install and run packages directly",
              "Simpler than Docker but less isolated",
              "Runs on local system",
              "Development-focused deployment method",
              "Directly executes npm packages without installation",
              "Simpler setup for JavaScript/TypeScript servers",
              "Useful for quick testing and experimentation",
              "Automatically downloads required dependencies"
            ]},
            {"name": "FastMCP", "entityType": "Development_Framework", "observations": [
              "Simplifies MCP server development",
              "Available in both TypeScript and Python versions",
              "Provides higher-level abstractions than raw SDKs",
              "Reduces boilerplate code",
              "Follows convention over configuration patterns"
            ]},
            {"name": "HTTP_SSE", "entityType": "Transport_Protocol", "observations": [
              "Alternative to stdio for server communication",
              "HTTP with Server-Sent Events for bidirectional comms",
              "Good for remote or distributed deployments",
              "Enables connectivity across network boundaries",
              "Requires additional web server setup"
            ]},
            {"name": "StdioTransport", "entityType": "Transport_Protocol", "observations": [
              "Default transport protocol for MCP",
              "Simple stdin/stdout pipe-based communication",
              "Works well for local processes",
              "Used in most basic deployments",
              "Lower overhead than HTTP/SSE"
            ]},
            {"name": "Server_Capabilities", "entityType": "Protocol_Feature", "observations": [
              "Declared during initialization",
              "Includes support for tools, resources, prompts",
              "Can specify optional features like subscriptions",
              "Allows clients to adapt to server features",
              "Can include experimental capabilities"
            ]},
            {"name": "Zed_Editor", "entityType": "MCP_Client", "observations": [
              "Code editor with built-in MCP client support",
              "Can configure and use MCP servers",
              "Alternative to Claude Desktop for developers",
              "Integrates AI capabilities into editing workflow",
              "Open source editor with MCP extensions"
            ]},
            {"name": "MCPInspector", "entityType": "Development_Tool", "observations": [
              "Command-line tool for testing MCP servers",
              "Allows direct interaction with server tools and resources",
              "Useful for debugging during development",
              "Can be installed via NPX",
              "Provides immediate feedback on server responses",
              "Official tool from Anthropic for MCP development"
            ]},
            {"name": "LocalTesting", "entityType": "Process", "observations": [
              "Verifies server functionality before deployment",
              "Multiple methods available depending on language and environment",
              "Critical for iterative development"
            ]}
          ],
          "relations": [
            {"from": "MCP", "to": "Tool", "relationType": "defines"},
            {"from": "MCP", "to": "Resource", "relationType": "defines"},
            {"from": "MCP", "to": "Prompt", "relationType": "defines"},
            {"from": "MCP_Server", "to": "MCP", "relationType": "implements"},
            {"from": "MCP_Client", "to": "MCP", "relationType": "implements"},
            {"from": "TypeScript_SDK", "to": "MCP", "relationType": "implements"},
            {"from": "Python_SDK", "to": "MCP", "relationType": "implements"},
            {"from": "MCP_Server", "to": "Tool", "relationType": "provides"},
            {"from": "MCP_Server", "to": "Resource", "relationType": "provides"},
            {"from": "MCP_Server", "to": "Prompt", "relationType": "provides"},
            {"from": "MCP_Client", "to": "MCP_Server", "relationType": "connects_to"},
            {"from": "Claude_Desktop", "to": "MCP_Client", "relationType": "is_a"},
            {"from": "Zed_Editor", "to": "MCP_Client", "relationType": "is_a"},
            {"from": "MCP_Server", "to": "TypeScript_SDK", "relationType": "uses"},
            {"from": "MCP_Server", "to": "Python_SDK", "relationType": "uses"},
            {"from": "MCP_Client", "to": "TypeScript_SDK", "relationType": "uses"},
            {"from": "MCP_Client", "to": "Python_SDK", "relationType": "uses"},
            {"from": "Filesystem_Server", "to": "MCP_Server", "relationType": "is_a"},
            {"from": "Redis_Server", "to": "MCP_Server", "relationType": "is_a"},
            {"from": "GitHub_Server", "to": "MCP_Server", "relationType": "is_a"},
            {"from": "Brave_Search_Server", "to": "MCP_Server", "relationType": "is_a"},
            {"from": "Memory_Server", "to": "MCP_Server", "relationType": "is_a"},
            {"from": "Google_Maps_Server", "to": "MCP_Server", "relationType": "is_a"},
            {"from": "Filesystem_Server", "to": "TypeScript_SDK", "relationType": "uses"},
            {"from": "Redis_Server", "to": "TypeScript_SDK", "relationType": "uses"},
            {"from": "GitHub_Server", "to": "TypeScript_SDK", "relationType": "uses"},
            {"from": "Brave_Search_Server", "to": "TypeScript_SDK", "relationType": "uses"},
            {"from": "Google_Maps_Server", "to": "TypeScript_SDK", "relationType": "uses"},
            {"from": "Memory_Server", "to": "TypeScript_SDK", "relationType": "uses"},
            {"from": "Docker", "to": "MCP_Server", "relationType": "deploys"},
            {"from": "NPX", "to": "MCP_Server", "relationType": "deploys"},
            {"from": "Claude_Desktop", "to": "Docker", "relationType": "uses"},
            {"from": "Claude_Desktop", "to": "NPX", "relationType": "uses"},
            {"from": "FastMCP", "to": "Python_SDK", "relationType": "extends"},
            {"from": "FastMCP", "to": "TypeScript_SDK", "relationType": "extends"},
            {"from": "MCP_Server", "to": "StdioTransport", "relationType": "can_use"},
            {"from": "MCP_Server", "to": "HTTP_SSE", "relationType": "can_use"},
            {"from": "MCP_Server", "to": "Server_Capabilities", "relationType": "declares"},
            {"from": "MCP_Client", "to": "Server_Capabilities", "relationType": "adapts_to"},
            {"from": "StdioTransport", "to": "MCP", "relationType": "implements"},
            {"from": "HTTP_SSE", "to": "MCP", "relationType": "implements"},
            {"from": "LocalTesting", "to": "MCPInspector", "relationType": "uses"}
          ]
        };

        // Extract unique entity types and relation types
        const types = [...new Set(graphData.entities.map(e => e.entityType))];
        const relations = [...new Set(graphData.relations.map(r => r.relationType))];
        
        setEntityTypes(types);
        setRelationTypes(relations);
        
        // Convert to D3 format
        const nodes = graphData.entities.map(entity => ({
          id: entity.name,
          type: entity.entityType,
          observations: entity.observations
        }));
        
        const links = graphData.relations.map(relation => ({
          source: relation.from,
          target: relation.to,
          type: relation.relationType
        }));
        
        renderGraph(nodes, links);
      } catch (error) {
        console.error('Error loading graph data:', error);
      }
    };
    
    fetchData();
  }, []);
  
  useEffect(() => {
    // Re-render when filters change
    const svg = d3.select(svgRef.current);
    if (svg.selectAll('.nodes').size() > 0) {
      // Get current nodes and links
      const nodes = svg.selectAll('.node').data().map(d => ({
        id: d.id,
        type: d.type,
        observations: d.observations
      }));
      
      const links = svg.selectAll('.link').data().map(d => ({
        source: typeof d.source === 'object' ? d.source.id : d.source,
        target: typeof d.target === 'object' ? d.target.id : d.target,
        type: d.type
      }));
      
      // Apply filters
      const filteredNodes = nodes.filter(node => {
        const matchesSearch = node.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'All' || node.type === filterType;
        return matchesSearch && matchesType;
      });
      
      const filteredNodeIds = new Set(filteredNodes.map(node => node.id));
      
      const filteredLinks = links.filter(link => 
        filteredNodeIds.has(link.source) && filteredNodeIds.has(link.target)
      );
      
      renderGraph(filteredNodes, filteredLinks);
    }
  }, [searchTerm, filterType]);
  
  const renderGraph = (nodes, links) => {
    const width = 900;
    const height = 700;
    
    // Clear previous graph
    d3.select(svgRef.current).selectAll("*").remove();
    
    const svg = d3.select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", "100%")
      .attr("height", "100%");
      
    // Define arrow markers for links
    svg.append("defs").selectAll("marker")
      .data(["end"])
      .enter().append("marker")
      .attr("id", d => d)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", "#999")
      .attr("d", "M0,-5L10,0L0,5");
      
    // Convert string references to object references for D3 force simulation
    const nodeMap = {};
    nodes.forEach(node => {
      nodeMap[node.id] = node;
    });
    
    const linkData = links.map(link => ({
      source: nodeMap[link.source] || link.source,
      target: nodeMap[link.target] || link.target,
      type: link.type
    }));
    
    // Create force simulation with adjusted parameters for better visualization
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(linkData).id(d => d.id).distance(180))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(70));
      
    // Create links
    const link = svg.append("g")
      .attr("class", "links")
      .selectAll("path")
      .data(linkData)
      .enter().append("path")
      .attr("class", "link")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1.5)
      .attr("fill", "none")
      .attr("marker-end", "url(#end)");
      
    // Create link labels
    const linkText = svg.append("g")
      .attr("class", "link-labels")
      .selectAll("text")
      .data(linkData)
      .enter().append("text")
      .attr("class", "link-label")
      .attr("fill", "#666")
      .attr("font-size", "10px")
      .attr("text-anchor", "middle")
      .text(d => d.type);
      
    // Create nodes
    const node = svg.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(nodes)
      .enter().append("g")
      .attr("class", "node")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));
        
    // Add circles to nodes
    node.append("circle")
      .attr("r", d => {
        // Make core MCP components slightly larger
        if (d.type === "Protocol" || d.type === "MCP_Component") return 12;
        if (d.type === "Software" || d.type === "Software_Library") return 11;
        return 10;
      })
      .attr("fill", d => colorScale(d.type))
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .on("click", (event, d) => {
        setSelectedNode(d);
        event.stopPropagation();
      });
      
    // Add labels to nodes
    node.append("text")
      .attr("dy", -15)
      .attr("text-anchor", "middle")
      .attr("fill", "#333")
      .text(d => d.id.replace(/_/g, ' '));
      
    // Add node type labels
    node.append("text")
      .attr("dy", 20)
      .attr("text-anchor", "middle")
      .attr("fill", "#666")
      .attr("font-size", "8px")
      .text(d => d.type.replace(/_/g, ' '));
    
    // Clear selection when clicking on blank areas
    svg.on("click", () => setSelectedNode(null));
      
    // Update simulation on each tick
    simulation.on("tick", () => {
      // Calculate curved path for links
      link.attr("d", d => {
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const dr = Math.sqrt(dx * dx + dy * dy) * 2;
        return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
      });
      
      // Update link text positions
      linkText.attr("transform", d => {
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        const midX = (d.source.x + d.target.x) / 2;
        const midY = (d.source.y + d.target.y) / 2;
        return `translate(${midX},${midY}) rotate(${angle})`;
      });
      
      // Update node positions
      node.attr("transform", d => `translate(${d.x},${d.y})`);
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
  };
  
  return (
    <div className="flex flex-col w-full h-full max-w-6xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
        <h1 className="text-2xl font-bold mb-4 text-center">Model Context Protocol (MCP) Knowledge Graph</h1>
        <p className="text-center text-gray-600 mb-4">An interactive visualization of the MCP ecosystem and components</p>
        
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="w-full md:w-64">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Entities</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div className="w-full md:w-64">
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="All">All Types</option>
              {entityTypes.map(type => (
                <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mb-4 text-sm">
          <p><strong>Instructions:</strong> Drag nodes to reposition. Click a node to view details. Use search and filters to focus on specific parts of the graph.</p>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="bg-white rounded-lg shadow-lg p-4 w-full md:w-2/3 h-[600px]">
          <svg ref={svgRef} width="100%" height="100%" className="border border-gray-200 rounded"></svg>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-4 w-full md:w-1/3">
          <h2 className="text-xl font-bold mb-4">Entity Details</h2>
          {selectedNode ? (
            <div>
              <h3 className="text-lg font-semibold">{selectedNode.id.replace(/_/g, ' ')}</h3>
              <p className="text-sm text-gray-500 mb-2">Type: {selectedNode.type.replace(/_/g, ' ')}</p>
              
              <h4 className="font-medium mt-4 mb-2">Observations:</h4>
              <ul className="list-disc pl-5 space-y-1">
                {selectedNode.observations.map((obs, i) => (
                  <li key={i} className="text-sm">{obs}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-gray-500">Click on a node to view its details</p>
          )}
          
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Legend</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {entityTypes.map(type => (
                <div key={type} className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-2" 
                    style={{ backgroundColor: colorScale(type) }}
                  ></div>
                  <span>{type.replace(/_/g, ' ')}</span>
                </div>
              ))}
            </div>
            
            <h2 className="text-xl font-bold mt-6 mb-4">Relationship Types</h2>
            <div className="text-sm space-y-1">
              {relationTypes.slice(0, 10).map(type => (
                <div key={type} className="flex items-center">
                  <span className="font-medium">{type.replace(/_/g, ' ')}</span>
                </div>
              ))}
              {relationTypes.length > 10 && (
                <div className="text-gray-500 italic">
                  +{relationTypes.length - 10} more relationship types
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MCPKnowledgeGraph;