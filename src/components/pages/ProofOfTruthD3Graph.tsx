'use client'

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const ProofOfTruthGraph = () => {
  const svgRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [filterType, setFilterType] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [selectedNodeDetails, setSelectedNodeDetails] = useState(null);
  const [selectedNodeConnections, setSelectedNodeConnections] = useState([]);
  
  // Define entity types for filtering with enabled state tracking
  const entityTypes = [
    "All", "System", "Ontology", "Technology", "Protocol", 
    "Challenge", "Process", "Specific Ontology", "Implementation", 
    "Component", "Strategy"
  ];
  
  // Track which entity types are being displayed (all by default)
  const [enabledTypes, setEnabledTypes] = useState(
    entityTypes.filter(type => type !== "All")
  );
  
  // Define the color scale at the component level so it's accessible in JSX
  const colorScale = d3.scaleOrdinal()
    .domain(entityTypes.filter(type => type !== "All"))
    .range(["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", 
           "#ffff33", "#a65628", "#f781bf", "#999999", "#66c2a5"]);
  
  // Toggle filter for an entity type
  const toggleType = (type) => {
    if (type === "All") {
      // If "All" is clicked, toggle between all types and no types
      if (enabledTypes.length === entityTypes.length - 1) {
        setEnabledTypes([]);
      } else {
        setEnabledTypes(entityTypes.filter(t => t !== "All"));
      }
    } else {
      // Toggle individual type
      if (enabledTypes.includes(type)) {
        setEnabledTypes(enabledTypes.filter(t => t !== type));
        if(selectedNodeDetails && selectedNodeDetails.group === type) {
          setSelectedNodeDetails(null);
          setSelectedNodeConnections([]);
        }
      } else {
        setEnabledTypes([...enabledTypes, type]);
      }
    }
  };

  useEffect(() => {
    if (!svgRef.current) return;

    // Define our data
    const data = {
      nodes: [
        { id: "Proof of Truth", group: "System", radius: 20, 
          description: "A mechanism for content validation integrating semantic models of bias, objectivity, and ethics with decentralized verification" },
        { id: "Media Bias Ontologies", group: "Ontology", radius: 16,
          description: "Formal knowledge representations that capture different forms of bias in news and information" },
        { id: "Sentiment Ontologies", group: "Ontology", radius: 16,
          description: "Structured models to evaluate how opinionated or emotional content is" },
        { id: "Human Rights Ontologies", group: "Ontology", radius: 16,
          description: "Capture principles of human rights, types of violations, and related factual descriptors" },
        { id: "Knowledge Graph", group: "Technology", radius: 18,
          description: "Network of entities and relationships representing complex domains that enables structured querying of content" },
        { id: "NOSTR", group: "Protocol", radius: 16,
          description: "Notes and Other Stuff Transmitted by Relays - decentralized publish-subscribe protocol" },
        { id: "Blockchain", group: "Technology", radius: 18,
          description: "Used to store truth certificates or content hashes providing tamper-proof records" },
        { id: "Decentralized Knowledge Graph", group: "Technology", radius: 18,
          description: "Combines knowledge graph data with blockchain to achieve decentralized storage and verification" },
        { id: "Implementation Challenges", group: "Challenge", radius: 14,
          description: "Obstacles in creating the system including ontology limitations, defining ground truth, and scalability" },
        { id: "OntoSenticNet", group: "Specific Ontology", radius: 12,
          description: "A commonsense sentiment ontology that organizes concepts and sentiment values in a knowledge graph" },
        { id: "OntoRights", group: "Specific Ontology", radius: 12,
          description: "Domain ontology for documenting human rights violations with input from practitioners" },
        { id: "OriginTrail DKG", group: "Implementation", radius: 12,
          description: "Example of a decentralized knowledge graph combining knowledge graph data with blockchain" },
        { id: "Truth Validation Process", group: "Process", radius: 18,
          description: "Workflow that includes content ingestion, semantic annotation, verification, and blockchain anchoring" },
        { id: "Interoperability Standards", group: "Component", radius: 14,
          description: "Common data standards for ontologies and data interchange like RDF, OWL, schema.org" },
        { id: "Modular Ontology Integration", group: "Strategy", radius: 14,
          description: "Approach of maintaining modular ontologies that interlink rather than monolithic structure" },
        { id: "Decentralized Storage", group: "Component", radius: 14,
          description: "Distributed graph database or DHT to store triples, with content-addressable storage" },
        { id: "Verification Oracles", group: "Component", radius: 14,
          description: "Hybrid approach combining NLP algorithms with human fact-checkers for validation" }
      ],
      links: [
        { source: "Proof of Truth", target: "Media Bias Ontologies", type: "uses", 
          description: "The system incorporates bias detection and classification frameworks" },
        { source: "Proof of Truth", target: "Sentiment Ontologies", type: "uses",
          description: "The system leverages sentiment analysis to evaluate objectivity of content" },
        { source: "Proof of Truth", target: "Human Rights Ontologies", type: "uses",
          description: "The system applies human rights frameworks to ensure ethical alignment" },
        { source: "Proof of Truth", target: "Knowledge Graph", type: "integrates",
          description: "The system uses knowledge graphs as its core information architecture" },
        { source: "Proof of Truth", target: "NOSTR", type: "leverages",
          description: "The system uses NOSTR for decentralized content distribution" },
        { source: "Proof of Truth", target: "Blockchain", type: "leverages",
          description: "The system uses blockchain for immutable record-keeping" },
        { source: "Knowledge Graph", target: "Media Bias Ontologies", type: "incorporates",
          description: "The knowledge graph integrates bias classifications into its structure" },
        { source: "Knowledge Graph", target: "Sentiment Ontologies", type: "incorporates",
          description: "The knowledge graph represents sentiment evaluations as node properties" },
        { source: "Knowledge Graph", target: "Human Rights Ontologies", type: "incorporates",
          description: "The knowledge graph includes human rights concepts and relations" },
        { source: "Decentralized Knowledge Graph", target: "Knowledge Graph", type: "extends",
          description: "DKG builds upon standard knowledge graph technology with distributed features" },
        { source: "Decentralized Knowledge Graph", target: "Blockchain", type: "integrates",
          description: "DKG uses blockchain for consensus and immutable storage" },
        { source: "Implementation Challenges", target: "Proof of Truth", type: "affects",
          description: "Various challenges impact the effectiveness of the system" },
        { source: "Implementation Challenges", target: "Knowledge Graph", type: "impacts",
          description: "Challenges like scalability and bias affect knowledge graph implementation" },
        { source: "Implementation Challenges", target: "Blockchain", type: "impacts",
          description: "Issues like transaction costs and throughput affect blockchain integration" },
        { source: "NOSTR", target: "Blockchain", type: "complements",
          description: "NOSTR and blockchain provide complementary decentralization capabilities" },
        { source: "Knowledge Graph", target: "Proof of Truth", type: "enables",
          description: "Knowledge graph technology makes the truth verification possible" },
        { source: "OntoSenticNet", target: "Sentiment Ontologies", type: "isA",
          description: "OntoSenticNet is a specific implementation of a sentiment ontology" },
        { source: "OntoRights", target: "Human Rights Ontologies", type: "isA",
          description: "OntoRights is a specific implementation of a human rights ontology" },
        { source: "OriginTrail DKG", target: "Decentralized Knowledge Graph", type: "implements",
          description: "OriginTrail is a specific implementation of a decentralized knowledge graph" },
        { source: "Truth Validation Process", target: "Proof of Truth", type: "enabledBy",
          description: "The process is made possible by the Proof of Truth framework" },
        { source: "Truth Validation Process", target: "Knowledge Graph", type: "uses",
          description: "The process uses knowledge graphs to check content against known facts" },
        { source: "Truth Validation Process", target: "NOSTR", type: "leverages",
          description: "The process uses NOSTR for publishing verified content" },
        { source: "Truth Validation Process", target: "Blockchain", type: "leverages",
          description: "The process uses blockchain to create permanent validation records" },
        { source: "Implementation Challenges", target: "Truth Validation Process", type: "impacts",
          description: "Challenges affect how effectively the validation process can operate" },
        { source: "Interoperability Standards", target: "Proof of Truth", type: "enables",
          description: "Standards allow different components to work together in the system" },
        { source: "Interoperability Standards", target: "Knowledge Graph", type: "supports",
          description: "Standards enable knowledge graphs to be shared and interoperable" },
        { source: "Modular Ontology Integration", target: "Media Bias Ontologies", type: "appliesTo",
          description: "This strategy is used to incorporate media bias ontologies" },
        { source: "Modular Ontology Integration", target: "Sentiment Ontologies", type: "appliesTo",
          description: "This strategy is used to incorporate sentiment ontologies" },
        { source: "Modular Ontology Integration", target: "Human Rights Ontologies", type: "appliesTo",
          description: "This strategy is used to incorporate human rights ontologies" },
        { source: "Modular Ontology Integration", target: "Knowledge Graph", type: "supports",
          description: "This strategy enhances knowledge graph flexibility and extensibility" },
        { source: "Decentralized Storage", target: "Knowledge Graph", type: "implements",
          description: "Provides the distributed storage layer for knowledge graph data" },
        { source: "Decentralized Storage", target: "Decentralized Knowledge Graph", type: "usedBy",
          description: "DKG specifically uses decentralized storage solutions" },
        { source: "Decentralized Storage", target: "Blockchain", type: "leverages",
          description: "Uses blockchain for content addressing and verification" },
        { source: "Verification Oracles", target: "Truth Validation Process", type: "participateIn",
          description: "Oracles provide external validation during the process" },
        { source: "Verification Oracles", target: "Proof of Truth", type: "enhance",
          description: "Oracles improve the quality and trustworthiness of verifications" }
      ]
    };

    // Apply filters based on current state
    const filteredNodes = data.nodes.filter(node => {
      // Filter by entity type (using the enabled types)
      const typeMatch = enabledTypes.includes(node.group);
      
      // Filter by search text (case-insensitive)
      const searchMatch = !searchText || 
        node.id.toLowerCase().includes(searchText.toLowerCase()) ||
        node.description.toLowerCase().includes(searchText.toLowerCase());
        
      return typeMatch && searchMatch;
    });
    
    // Get node IDs after filtering
    const filteredNodeIds = new Set(filteredNodes.map(node => node.id));
    
    // Filter links to only include connections between filtered nodes
    const filteredLinks = data.links.filter(link => 
      filteredNodeIds.has(link.source) && filteredNodeIds.has(link.target) ||
      (typeof link.source === 'object' && filteredNodeIds.has(link.source.id) && 
       typeof link.target === 'object' && filteredNodeIds.has(link.target.id))
    );

    // Clear any existing SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    // Set up the SVG container with consistent dimensions
    const width = 900;
    const height = 700;
    const svg = d3.select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`);
      
    // Create a tooltip div for hover info
    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "1px solid #ddd")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("pointer-events", "none")
      .style("opacity", 0)
      .style("max-width", "300px")
      .style("z-index", 1000);

    // Color scale for node types
    const colorScale = d3.scaleOrdinal()
      .domain(entityTypes.filter(type => type !== "All"))
      .range(["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", 
               "#ffff33", "#a65628", "#f781bf", "#999999", "#66c2a5"]);

    // Create a zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.25, 4])
      .on("zoom", (event) => {
        container.attr("transform", event.transform);
      });
      
    // Apply zoom behavior to SVG
    svg.call(zoom);
    
    // Create a container for all visualization elements that will be zoomed
    const container = svg.append("g");

    // Create the simulation with better force parameters
    const simulation = d3.forceSimulation(filteredNodes)
      .force("link", d3.forceLink(filteredLinks).id(d => d.id).distance(d => {
        // Longer distance for central nodes with many connections
        const sourceConnections = filteredLinks.filter(l => 
          l.source === d.source || l.source.id === d.source.id).length;
        const targetConnections = filteredLinks.filter(l => 
          l.target === d.target || l.target.id === d.target.id).length;
        return 100 + Math.min(100, Math.max(sourceConnections, targetConnections) * 5);
      }))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("x", d3.forceX(width / 2).strength(0.05))
      .force("y", d3.forceY(height / 2).strength(0.05))
      .force("collide", d3.forceCollide().radius(d => d.radius * 2));

    // Add the links
    const link = container.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(filteredLinks)
      .join("line")
      .attr("stroke-width", 1.5)
      .on("mouseover", function(event, d) {
        // Show link tooltip
        tooltip.transition()
          .duration(200)
          .style("opacity", 0.9);
        tooltip.html(`<strong>${typeof d.source === 'object' ? d.source.id : d.source} 
                      → ${typeof d.target === 'object' ? d.target.id : d.target}</strong><br>
                      <strong>Relationship:</strong> ${d.type}<br>
                      <em>${d.description}</em>`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
          
        // Highlight this link
        d3.select(this).attr("stroke", "#ff0000").attr("stroke-width", 3);
      })
      .on("mouseout", function() {
        // Hide tooltip
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
          
        // Reset highlight if no node is selected
        if (!selectedNodeDetails) {
          d3.select(this).attr("stroke", "#999").attr("stroke-width", 1.5);
        }
      });

    // Add link labels
    const linkText = container.append("g")
      .selectAll("text")
      .data(filteredLinks)
      .join("text")
      .text(d => d.type)
      .attr("font-size", "8px")
      .attr("text-anchor", "middle")
      .attr("dy", "-5px")
      .attr("fill", "#666")
      .style("pointer-events", "none"); // prevent interfering with mouse events

    // Add the nodes
    const node = container.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(filteredNodes)
      .join("circle")
      .attr("r", d => d.radius)
      .attr("fill", d => colorScale(d.group))
      .style("cursor", "pointer")
      .call(drag(simulation))
      .on("mouseover", function(event, d) {
        // Show tooltip
        tooltip.transition()
          .duration(200)
          .style("opacity", 0.9);
        tooltip.html(`<strong>${d.id}</strong><br>
                      <strong>Type:</strong> ${d.group}<br>
                      <em>${d.description}</em>`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
        
        // Highlight connections temporarily
        if (!selectedNodeDetails) {
          highlightConnections(d);
        }
      })
      .on("mouseout", function() {
        // Hide tooltip if not clicked
        if (!selectedNodeDetails) {
          tooltip.transition()
            .duration(500)
            .style("opacity", 0);
          
          resetHighlighting();
        }
      })
      .on("click", function(event, d) {
        event.stopPropagation();
        
        // Find connections for the details panel
        const connections = [];
        filteredLinks.forEach(link => {
          const isSource = (typeof link.source === 'object' ? link.source.id === d.id : link.source === d.id);
          const isTarget = (typeof link.target === 'object' ? link.target.id === d.id : link.target === d.id);
          
          if (isSource || isTarget) {
            const otherNodeId = isSource ? 
              (typeof link.target === 'object' ? link.target.id : link.target) : 
              (typeof link.source === 'object' ? link.source.id : link.source);
            
            const otherNode = filteredNodes.find(n => n.id === otherNodeId);
            
            connections.push({
              nodeId: otherNodeId,
              nodeType: otherNode ? otherNode.group : "Unknown",
              relationship: link.type,
              direction: isSource ? "outgoing" : "incoming",
              description: link.description
            });
          }
        });
        
        // Update React state with selected node and its connections
        setSelectedNodeDetails(d);
        setSelectedNodeConnections(connections);
        
        // Highlight connections in the graph
        highlightConnections(d);
      });

    // Add node labels
    const nodeLabels = container.append("g")
      .selectAll("text")
      .data(filteredNodes)
      .join("text")
      .text(d => d.id)
      .attr("font-size", "10px")
      .attr("font-weight", d => d.group === "System" ? "bold" : "normal")
      .attr("text-anchor", "middle")
      .attr("dy", d => -d.radius - 5)
      .style("pointer-events", "none"); // prevent interfering with mouse events

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      linkText
        .attr("x", d => (d.source.x + d.target.x) / 2)
        .attr("y", d => (d.source.y + d.target.y) / 2);

      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

      nodeLabels
        .attr("x", d => d.x)
        .attr("y", d => d.y);
    });

    // Function to highlight connections
    function highlightConnections(d) {
      // Find connected links and nodes
      const connectedLinks = filteredLinks.filter(link => 
        (typeof link.source === 'object' ? link.source.id === d.id : link.source === d.id) || 
        (typeof link.target === 'object' ? link.target.id === d.id : link.target === d.id)
      );
      
      const connectedNodeIds = new Set();
      connectedLinks.forEach(link => {
        const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        const targetId = typeof link.target === 'object' ? link.target.id : link.target;
        connectedNodeIds.add(sourceId);
        connectedNodeIds.add(targetId);
      });
      
      // Apply visual highlighting
      node.attr("opacity", n => connectedNodeIds.has(n.id) || n.id === d.id ? 1 : 0.2);
      link.attr("stroke-opacity", l => {
        const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
        const targetId = typeof l.target === 'object' ? l.target.id : l.target;
        return sourceId === d.id || targetId === d.id ? 1 : 0.1;
      })
      .attr("stroke-width", l => {
        const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
        const targetId = typeof l.target === 'object' ? l.target.id : l.target;
        return sourceId === d.id || targetId === d.id ? 2.5 : 1.5;
      })
      .attr("stroke", l => {
        const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
        const targetId = typeof l.target === 'object' ? l.target.id : l.target;
        return sourceId === d.id || targetId === d.id ? "#ff0000" : "#999";
      });
      
      linkText.attr("opacity", l => {
        const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
        const targetId = typeof l.target === 'object' ? l.target.id : l.target;
        return sourceId === d.id || targetId === d.id ? 1 : 0.1;
      });
      
      nodeLabels.attr("opacity", n => connectedNodeIds.has(n.id) || n.id === d.id ? 1 : 0.2);
    }

    // Function to reset highlighting
    function resetHighlighting() {
      node.attr("opacity", 1);
      link.attr("stroke-opacity", 0.6)
          .attr("stroke-width", 1.5)
          .attr("stroke", "#999");
      linkText.attr("opacity", 1);
      nodeLabels.attr("opacity", 1);
    }

    // Drag functionality
    function drag(simulation) {
      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }
      
      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }
      
      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }
      
      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }

    // Clear selection when clicking on the background
    svg.on("click", () => {
      setSelectedNodeDetails(null);
      setSelectedNodeConnections([]);
      resetHighlighting();
    });

    // Return a cleanup function
    return () => {
      simulation.stop();
      d3.select("body").selectAll(".tooltip").remove();
    };
  }, [enabledTypes, searchText]); // Re-render when filters change

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
        <h1 className="text-2xl font-bold mb-2 text-center">Proof of Truth Framework</h1>
        <p className="text-gray-600 text-center mb-4">Knowledge Graph Visualization of System Components and Relationships</p>
        
        <div className="flex flex-col md:flex-row gap-4">
          {/* Main graph visualization */}
          <div className="w-full md:w-8/12 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="bg-gray-100 p-3 flex flex-wrap gap-2 items-center border-b border-gray-200">
              <div className="flex-grow flex items-center">
                <input
                  type="text"
                  className="p-2 border rounded w-full"
                  placeholder="Search nodes..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
              <button 
                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => {
                  setSearchText("");
                  setSelectedNodeDetails(null);
                  setSelectedNodeConnections([]);
                }}
              >
                Reset
              </button>
            </div>
            
            <div className="relative">
              <svg 
                ref={svgRef} 
                width="100%" 
                height="600" 
                style={{cursor: "grab", minHeight: "600px"}}
                className="rounded-b-lg"
              ></svg>
              
              <div className="absolute bottom-4 right-4">
                <button 
                  className="p-2 bg-green-500 text-white rounded hover:bg-green-600 shadow"
                  onClick={() => {
                    const svg = d3.select(svgRef.current);
                    svg.transition().duration(750).call(
                      d3.zoom().transform,
                      d3.zoomIdentity
                    );
                  }}
                >
                  Re-center Graph
                </button>
              </div>
            </div>
          </div>
          
          {/* Details panel */}
          <div className="w-full md:w-4/12 bg-white rounded-lg shadow border border-gray-200">
            {/* Node details section */}
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold mb-3">Node Details</h2>
              {selectedNodeDetails ? (
                <div>
                  <h3 className="text-xl font-bold mb-2">{selectedNodeDetails.id}</h3>
                  <p className="text-sm text-gray-500 mb-3">Type: {selectedNodeDetails.group}</p>
                  <p className="text-sm mb-4">{selectedNodeDetails.description}</p>
                  
                  {selectedNodeConnections.length > 0 && (
                    <>
                      <h4 className="text-md font-semibold mb-2">Relationships:</h4>
                      <div className="max-h-60 overflow-y-auto pr-2">
                        <ul className="space-y-2">
                          {selectedNodeConnections.map((conn, idx) => (
                            <li key={idx} className="text-sm border-l-4 border-gray-300 pl-3 py-1">
                              <span className={`font-medium ${conn.direction === "outgoing" ? "text-blue-600" : "text-green-600"}`}>
                                {conn.direction === "outgoing" ? "→ To " : "← From "}
                              </span>
                              <span className="font-bold">{conn.nodeId}</span>
                              <div className="text-gray-600">Relationship: {conn.relationship}</div>
                              <div className="italic text-xs mt-1">{conn.description}</div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">Click on a node to view details</p>
              )}
            </div>
            
            {/* Filter section */}
            <div className="p-4">
              <h3 className="text-md font-semibold mb-2">Filter by Entity Type:</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                <div className="flex items-center mb-1">
                  <input 
                    type="checkbox" 
                    id="filter-all"
                    checked={enabledTypes.length === entityTypes.length - 1} 
                    onChange={() => toggleType("All")}
                    className="mr-2"
                  />
                  <label htmlFor="filter-all" className="text-sm font-medium">
                    All Entity Types
                  </label>
                </div>
                
                <div className="border-t border-gray-200 pt-2">
                  {entityTypes.filter(type => type !== "All").map((type) => {
                    const colorIndex = entityTypes.indexOf(type) - 1;
                    return (
                      <div key={type} className="flex items-center mb-1">
                        <input 
                          type="checkbox" 
                          id={`filter-${type}`}
                          checked={enabledTypes.includes(type)} 
                          onChange={() => toggleType(type)}
                          className="mr-2"
                        />
                        <div 
                          className="w-4 h-4 rounded-full mr-2"
                          style={{ backgroundColor: colorScale ? colorScale(type) : '#ccc' }}
                        ></div>
                        <label htmlFor={`filter-${type}`} className="text-sm">
                          {type}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Instructions (collapsible) */}
            <div className="p-4 border-t border-gray-200">
              <details>
                <summary className="text-md font-semibold mb-2 cursor-pointer">Instructions</summary>
                <ul className="list-disc pl-5 text-sm space-y-1 text-gray-600">
                  <li>Hover over nodes or links to see quick details</li>
                  <li>Click on a node to select it and view full details</li>
                  <li>Use checkboxes to filter by entity types</li>
                  <li>Search to find specific nodes</li>
                  <li>Drag nodes to rearrange the layout</li>
                  <li>Scroll to zoom, drag background to pan</li>
                </ul>
              </details>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProofOfTruthGraph;
