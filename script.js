const dataUrl = 'https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json'

const width = window.innerWidth,
  height = window.innerHeight,
  margin = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20
  }

const graphWrapper = d3.select('.wrapper')
const svg = d3.select('svg')
const divTooltip = d3.select('body')
  .append('div')
  .attr('class', 'tool-tip')

const simulation = d3.forceSimulation()
  .force('link', d3.forceLink())
  .force('charge', d3.forceManyBody().strength(-30).distanceMax(180).distanceMin(150))
  .force('center', d3.forceCenter(width / 2, height / 2))

d3.json(dataUrl, graph => {

  const node = graphWrapper.select('.flags')
    .selectAll('node')
    .data(graph.nodes)
    .enter().append('img')
    .attr('class', d => `flag flag-${d.code}`)
    .call(d3.drag()
      .on('start', dragStart)
      .on('drag', drag)
      .on('end', dragEnd)
    )
    .on('mouseover', handleMouseOver)
    .on('mouseout', handleMouseOut)

  const link = svg.append('g')
    .selectAll('line')
    .data(graph.links)
    .enter().append('line')
    .attr('stroke', '#20a1f8')
    .attr('stroke-width', 1)
    .attr('opacity', 0.7)

  simulation
    .nodes(graph.nodes)
    .on('tick', ticked)

  simulation.force('link')
    .links(graph.links)

  function ticked() {
    node
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .style('left', d => (d.x - 8) + "px")
      .style('top', d => (d.y - 5) + "px")

    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)
  }

  function dragStart(d) {
    if (!d3.event.active) simulation.alphaTarget(0.5).restart()
    d.fx = d.x
    d.fy = d.y
  }

  function drag(d) {
    d.fx = d3.event.x
    d.fy = d3.event.y
  }

  function dragEnd(d) {
    if (!d3.event.active) simulation.alphaTarget(0)
    d.fx = null
    d.fy = null
  }

  function handleMouseOver(d) {
    d3.select(this)
      .attr('cursor', 'pointer')
    divTooltip.style('left', d3.event.pageX + 20 + 'px')
    divTooltip.style('top', d3.event.pageY - 25 + 'px')
    divTooltip.style('display', 'inline-block')
    divTooltip.transition()
      .duration(300)
      .style('opacity', 1)
    divTooltip.html(d.country)
  }

  function handleMouseOut(d) {
    divTooltip.style('display', 'none')
    divTooltip.transition()
      .duration(300)
      .style('opacity', 0)
  }

})
