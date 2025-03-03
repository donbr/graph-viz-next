'use client'

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const ForceDirectedGraph = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  // Define all entity types for filtering and legend
  const allEntityTypes = [
    "Core_Concept", "Architecture", "Mechanism", "Technology", 
    "Stakeholder", "Validation_Component", "Principle", 
    "Goal", "Feature", "Process", "Output", "Incentive_System"
  ];

  // Accessible color palette used for nodes and legend
  const accessibleColors = [
    "#4477AA", "#EE6677", "#228833", "#CCBB44", 
    "#66CCEE", "#AA3377", "#BBBBBB", "#2C3E50", 
    "#E67E22", "#16A085", "#2980B9", "#8E44AD"
  ];

  const [enabledTypes, setEnabledTypes] = useState<string[]>(allEntityTypes);

  // Static data: entities and relations
  const entities = [
    { "name": "Decentralized_Content_Framework", "entityType": "Core_Concept", "observations": [
      "Primary system being proposed in the research",
      "Enables transparent content submission and distribution",
      "Combines truth anchoring and knowledge graph representation",
      "Goal is to reduce misinformation and enhance credibility",
      "Serves both legacy media and new-generation content creators"
    ]},
    { "name": "Knowledge_Graph", "entityType": "Architecture", "observations": [
      "Core architectural component",
      "Represents concepts and entities as nodes",
      "Represents relationships and actions as edges",
      "Enables verifiable network of information",
      "Allows for contextual understanding",
      "Supports provenance tracking",
      "Facilitates integrity verification"
    ]},
    { "name": "Proof_of_Truth", "entityType": "Mechanism", "observations": [
      "Core validation mechanism",
      "Validates content before permanent recording",
      "Combines human validators, AI systems, and decentralized processes",
      "Assesses truthfulness, credibility, and alignment with facts",
      "Essential for establishing content reliability"
    ]},
    { "name": "Blockchain_Integration", "entityType": "Technology", "observations": [
      "Potential foundation technology",
      "Could be built on Bitcoin blockchain",
      "Provides immutable record-keeping",
      "Enables transparent verification",
      "Supports decentralized consensus"
    ]},
    { "name": "NOSTR_Protocol", "entityType": "Technology", "observations": [
      "Potential inspiration for protocol design",
      "Notes and Other Stuff Transmitted by Relays",
      "Decentralized social networking protocol",
      "Uses cryptographic keys for identity",
      "Provides censorship-resistant messaging"
    ]},
    { "name": "Content_Creators", "entityType": "Stakeholder", "observations": [
      "Key users of the system",
      "Include legacy media (newspapers, mainstream outlets)",
      "Include new-generation creators (influencers, podcasters, journalists)",
      "Submit content for validation and distribution",
      "Benefit from increased credibility and reach"
    ]},
    { "name": "Audience", "entityType": "Stakeholder", "observations": [
      "Content consumers",
      "Participate in validation and discourse",
      "Provide engagement and feedback",
      "Benefit from more reliable information",
      "Can assess content credibility"
    ]},
    { "name": "Human_Validators", "entityType": "Validation_Component", "observations": [
      "Part of hybrid validation system",
      "Provide expert assessment",
      "Bring contextual understanding",
      "May include fact-checkers, domain experts, or trusted entities",
      "Critical for nuanced evaluation"
    ]},
    { "name": "AI_Systems", "entityType": "Validation_Component", "observations": [
      "Part of hybrid validation system",
      "Provide scalable analysis",
      "Can process large volumes of content",
      "May detect patterns of misinformation",
      "Support human validators with initial screening"
    ]},
    { "name": "Decentralized_Mechanisms", "entityType": "Validation_Component", "observations": [
      "Part of hybrid validation system",
      "Provide consensus across distributed network",
      "May use token economics for incentives",
      "Reduce central points of failure",
      "Ensure system resilience"
    ]},
    { "name": "Incentive_Systems", "entityType": "Mechanism", "observations": [
      "Reward participation and accurate validation",
      "Encourage engagement from all stakeholders",
      "May include reputation points, tokens, or other rewards",
      "Critical for sustainable ecosystem",
      "Align individual actions with system goals"
    ]},
    { "name": "Epistemic_Humility", "entityType": "Principle", "observations": [
      "Core value promoted by the system",
      "Recognition of knowledge limitations",
      "Openness to evidence and revision",
      "Counterbalance to overconfidence",
      "Foundation for genuine truth-seeking"
    ]},
    { "name": "Transparent_Information_Ecosystem", "entityType": "Goal", "observations": [
      "Ultimate objective of the framework",
      "Features reduced misinformation",
      "Provides enhanced credibility",
      "Offers transparency about sources and methods",
      "Creates resilience against manipulation"
    ]},
    { "name": "Provenance_Tracking", "entityType": "Feature", "observations": [
      "Records origin and history of content",
      "Enables source verification",
      "Traces information evolution over time",
      "Creates accountability for creators",
      "Helps establish trust in content"
    ]},
    { "name": "Misinformation_Reduction", "entityType": "Goal", "observations": [
      "Key objective of the framework",
      "Addresses deliberate falsehoods",
      "Targets accidental inaccuracies",
      "Reduces harmful information cascades",
      "Improves overall information quality"
    ]},
    { "name": "Truth_Assessment_Methodology", "entityType": "Process", "observations": [
      "Systematic approach for verifying factual claims",
      "May involve multiple levels of evaluation",
      "Can include rating systems for degrees of truthfulness",
      "Combines lateral reading across multiple sources",
      "Uses both automated and human verification steps",
      "Requires finding relevant evidence from reliable sources",
      "May employ structured processes for quick fact assessment",
      "Critical component for the Proof of Truth mechanism",
      "Ensures consistency in validation approach",
      "Can adapt based on claim complexity and domain"
    ]},
    { "name": "Structured_Knowledge", "entityType": "Output", "observations": [
      "Organized information relationships",
      "Machine-readable content connections",
      "Queryable information network",
      "Enables semantic search",
      "Supports inference and discovery",
      "Represents concepts as nodes and relationships as edges",
      "Facilitates automated reasoning",
      "Allows for inheritance of properties through hierarchies"
    ]},
    { "name": "Token_Economics", "entityType": "Incentive_System", "observations": [
      "Design of cryptocurrency incentive mechanisms",
      "Balances centralization and decentralization",
      "Enables governance operationalization",
      "Creates sustainable participation motivation",
      "Reduces bootstrapping and scaling costs for economic networks",
      "Enables value exchange between participants",
      "Key component for decentralized systems",
      "Can align individual and collective interests",
      "Supports political decentralization",
      "May include reputation and status elements"
    ]}
  ];

  const relations = [
    { "from": "Decentralized_Content_Framework", "to": "Knowledge_Graph", "relationType": "uses_architecture" },
    { "from": "Decentralized_Content_Framework", "to": "Proof_of_Truth", "relationType": "implements_mechanism" },
    { "from": "Decentralized_Content_Framework", "to": "Blockchain_Integration", "relationType": "may_utilize" },
    { "from": "Decentralized_Content_Framework", "to": "NOSTR_Protocol", "relationType": "inspired_by" },
    { "from": "Decentralized_Content_Framework", "to": "Transparent_Information_Ecosystem", "relationType": "aims_to_create" },
    { "from": "Decentralized_Content_Framework", "to": "Misinformation_Reduction", "relationType": "targets" },
    { "from": "Knowledge_Graph", "to": "Provenance_Tracking", "relationType": "supports" },
    { "from": "Proof_of_Truth", "to": "Human_Validators", "relationType": "incorporates" },
    { "from": "Proof_of_Truth", "to": "AI_Systems", "relationType": "incorporates" },
    { "from": "Proof_of_Truth", "to": "Decentralized_Mechanisms", "relationType": "incorporates" },
    { "from": "Content_Creators", "to": "Decentralized_Content_Framework", "relationType": "use" },
    { "from": "Audience", "to": "Decentralized_Content_Framework", "relationType": "interact_with" },
    { "from": "Incentive_Systems", "to": "Human_Validators", "relationType": "motivates" },
    { "from": "Incentive_Systems", "to": "Content_Creators", "relationType": "rewards" },
    { "from": "Incentive_Systems", "to": "Audience", "relationType": "encourages" },
    { "from": "Proof_of_Truth", "to": "Epistemic_Humility", "relationType": "promotes" },
    { "from": "Blockchain_Integration", "to": "Provenance_Tracking", "relationType": "facilitates" },
    { "from": "Blockchain_Integration", "to": "Decentralized_Mechanisms", "relationType": "enables" },
    { "from": "NOSTR_Protocol", "to": "Decentralized_Mechanisms", "relationType": "informs" },
    { "from": "Provenance_Tracking", "to": "Misinformation_Reduction", "relationType": "contributes_to" },
    { "from": "Provenance_Tracking", "to": "Transparent_Information_Ecosystem", "relationType": "supports" },
    { "from": "Decentralized_Content_Framework", "to": "Incentive_Systems", "relationType": "implements_mechanism" },
    { "from": "Human_Validators", "to": "Epistemic_Humility", "relationType": "practices" },
    { "from": "AI_Systems", "to": "Misinformation_Reduction", "relationType": "contributes_to" },
    { "from": "Decentralized_Mechanisms", "to": "Transparent_Information_Ecosystem", "relationType": "enables" },
    { "from": "Proof_of_Truth", "to": "Truth_Assessment_Methodology", "relationType": "uses" },
    { "from": "Truth_Assessment_Methodology", "to": "Human_Validators", "relationType": "involves" },
    { "from": "Truth_Assessment_Methodology", "to": "AI_Systems", "relationType": "utilizes" },
    { "from": "Truth_Assessment_Methodology", "to": "Epistemic_Humility", "relationType": "enforces" },
    { "from": "Truth_Assessment_Methodology", "to": "Misinformation_Reduction", "relationType": "enables" },
    { "from": "Knowledge_Graph", "to": "Structured_Knowledge", "relationType": "produces" },
    { "from": "Structured_Knowledge", "to": "Misinformation_Reduction", "relationType": "enables" },
    { "from": "Structured_Knowledge", "to": "AI_Systems", "relationType": "powers" },
    { "from": "Structured_Knowledge", "to": "Truth_Assessment_Methodology", "relationType": "supports" },
    { "from": "Incentive_Systems", "to": "Token_Economics", "relationType": "includes" },
    { "from": "Token_Economics", "to": "Decentralized_Mechanisms", "relationType": "enables" },
    { "from": "Token_Economics", "to": "Content_Creators", "relationType": "motivates" },
    { "from": "Token_Economics", "to": "Human_Validators", "relationType": "rewards" },
    { "from": "Token_Economics", "to": "Blockchain_Integration", "relationType": "leverages" }
  ];

  // Toggle filter for an entity type
  const toggleType = (type: string) => {
    if (enabledTypes.includes(type)) {
      setEnabledTypes(enabledTypes.filter(t => t !== type));
      if(selectedNode && selectedNode.entityType === type) {
        setSelectedNode(null);
      }
    } else {
      setEnabledTypes([...enabledTypes, type]);
    }
  };

  // Re-render the graph when filters change
  useEffect(() => {
    const filteredEntities = entities.filter(e => enabledTypes.includes(e.entityType));
    const filteredNames = new Set(filteredEntities.map(e => e.name));
    const filteredRelations = relations.filter(r => filteredNames.has(r.from) && filteredNames.has(r.to));
    createForceDirectedGraph(filteredEntities, filteredRelations);
  }, [enabledTypes]);

  // Update node styles on selection change
  useEffect(() => {
    d3.select(svgRef.current)
      .selectAll(".node circle")
      .attr("stroke", d => (selectedNode && selectedNode.name === d.name ? "#000" : "#fff"))
      .attr("stroke-width", d => (selectedNode && selectedNode.name === d.name ? 3 : 1.5));
  }, [selectedNode]);

  const createForceDirectedGraph = (entitiesData: any[], relationsData: any[]) => {
    const width = 800;
    const height = 600;
    const nodeRadius = 10;
    
    // Clear existing SVG
    d3.select(svgRef.current).selectAll("*").remove();
    
    // Define color scale using the accessible palette
    const colorScale = d3.scaleOrdinal()
      .domain(allEntityTypes)
      .range(accessibleColors);
    
    // Create SVG container with a responsive viewBox
    const svg = d3.select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g");
    
    // Enable zoom and pan
    const zoom = d3.zoom()
      .scaleExtent([0.5, 5])
      .on("zoom", (event) => {
        svg.attr("transform", event.transform);
      });
    
    d3.select(svgRef.current).call(zoom);
    
    // Define arrow markers
    svg.append("defs").selectAll("marker")
      .data(["arrow"])
      .enter().append("marker")
      .attr("id", d => d)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 15)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#999");
    
    // Transform relations data to use "source" and "target" properties
    const processedLinks = relationsData.map(link => ({
      source: link.from,
      target: link.to,
      relationType: link.relationType
    }));
    
    // Create a shared tooltip
    d3.select("body").selectAll(".tooltip").remove();
    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "1px solid #ddd")
      .style("padding", "10px")
      .style("border-radius", "5px")
      .style("pointer-events", "none")
      .style("opacity", 0);
    
    // Create links with edge tooltips on hover
    const link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(processedLinks)
      .enter().append("line")
      .attr("stroke-width", 1)
      .attr("stroke", "#999")
      .attr("marker-end", "url(#arrow)")
      .on("mouseover", (event, d) => {
        tooltip.transition()
          .duration(200)
          .style("opacity", 0.9);
        tooltip.html(`<strong>${d.relationType.replace(/_/g, " ")}</strong>`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", () => {
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });
    
    // Create nodes
    const node = svg.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(entitiesData)
      .enter().append("g")
      .attr("class", "node")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));
    
    // Add circles to nodes with enhanced interactivity
    node.append("circle")
      .attr("r", d => (d.name === "Decentralized_Content_Framework" ? nodeRadius * 1.5 : nodeRadius))
      .attr("fill", d => colorScale(d.entityType))
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .on("click", (event, d) => {
        event.stopPropagation();
        setSelectedNode(d);
      })
      .on("mouseover", (event, d) => {
        tooltip.transition()
          .duration(200)
          .style("opacity", 0.9);
        const tooltipContent = `
          <strong>${d.name.replace(/_/g, " ")}</strong><br>
          <em>Type: ${d.entityType.replace(/_/g, " ")}</em><br>
          ${d.observations[0]}
        `;
        tooltip.html(tooltipContent)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", () => {
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });
    
    // Add text labels for nodes
    node.append("text")
      .attr("dx", 15)
      .attr("dy", 4)
      .text(d => d.name.replace(/_/g, " "))
      .attr("font-size", "10px");
    
    // Set up force simulation with an increased collision radius
    const simulation = d3.forceSimulation(entitiesData)
      .force("link", d3.forceLink(processedLinks)
        .id(d => d.name)
        .distance(120))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(nodeRadius * 3));
    
    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => {
          const dx = d.target.x - d.source.x;
          const dy = d.target.y - d.source.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const ratio = (distance - nodeRadius) / distance;
          return d.source.x + dx * ratio;
        })
        .attr("y2", d => {
          const dx = d.target.x - d.source.x;
          const dy = d.target.y - d.source.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const ratio = (distance - nodeRadius) / distance;
          return d.source.y + dy * ratio;
        });
        
      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });
    
    // Drag event handlers
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
    
    // Clear selected node when clicking on the background
    d3.select(svgRef.current).on("click", () => {
      setSelectedNode(null);
    });
  };
  
  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
        <h1 className="text-2xl font-bold mb-2 text-center">Decentralized Truth-Anchored Content Framework</h1>
        <p className="text-gray-600 text-center mb-4">Interactive Visualization of Core Concepts and Relationships</p>
        <div className="text-sm mb-4">
          <p><strong>Instructions:</strong> Drag nodes to reposition. Hover over nodes and links for details. Click a node to see detailed observations.</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-8/12 bg-gray-50 border border-gray-200 rounded-lg">
            <svg 
              ref={svgRef} 
              width="100%" 
              height="600" 
              className="border border-gray-200 rounded-lg"
              style={{ cursor: "grab", minHeight: "600px" }}
            ></svg>
          </div>
          
          <div className="w-full md:w-4/12 bg-white rounded-lg p-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">Node Details</h2>
              {selectedNode ? (
                <div>
                  <h3 className="text-xl font-bold mb-2">{selectedNode.name.replace(/_/g, " ")}</h3>
                  <p className="text-sm text-gray-500 mb-3">Type: {selectedNode.entityType.replace(/_/g, " ")}</p>
                  <h4 className="text-md font-semibold mb-2">Observations:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {selectedNode.observations.map((obs: string, index: number) => (
                      <li key={index} className="text-sm">{obs}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-500">Click on a node to view details</p>
              )}
            </div>
            <div>
              <h3 className="text-md font-semibold mb-2">Legend & Filters:</h3>
              <div className="space-y-2">
                {allEntityTypes.map((type) => (
                  <div key={type} className="flex items-center">
                    <input 
                      type="checkbox" 
                      checked={enabledTypes.includes(type)} 
                      onChange={() => toggleType(type)}
                      className="mr-2"
                    />
                    <div 
                      className="w-4 h-4 rounded-full mr-2"
                      style={{ backgroundColor: accessibleColors[allEntityTypes.indexOf(type) % accessibleColors.length] }}
                    ></div>
                    <span className="text-sm">{type.replace(/_/g, " ")}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForceDirectedGraph;
