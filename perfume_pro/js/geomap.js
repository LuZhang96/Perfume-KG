var svg = d3.select("#propotional"),
width = +svg.attr("width"),
height = +svg.attr("height");
d3.json("data/data_a9_1.json").then(function(data ){
    data.sort(function(a,b){return a.rate-b.rate;});
    // console.log(data.map(function(d){return d.rate;}));
    // console.log(data)

    // var color = d3.scaleOrdinal(d3.schemePastel1).domain(data.map(function(d){return d.rate}));
    // var color =d3.scaleOrdinal(d3.schemePaired).domain(data.map(function(d){return d.country;}))
    var color =d3.scaleSequential(d3.interpolateBuGn)
    .domain([30, 1000]);
    var color2 = d3.scaleOrdinal(d3.schemePuRd[6]);


    d3.json("data/custom.geo.json").then(function (json ) {
      for (var i =0;i<data.length;i++){
        var dataCountry = data[i].country;
        var dataRate = +data[i].rate;
        for(var j =0;j<json.features.length;j++){
          var jsonCountry = json.features[j].properties.name;
          if(dataCountry== jsonCountry){
            json.features[j].properties.rate= dataRate;
            break;
          }
        }
      }
      var projection = d3.geoEquirectangular().fitSize([width, height], json);
      var path = d3.geoPath().projection(projection);
      var tooltip = d3.select('body')
      .append('div')
      .attr('class', 'tooltip')   
      .style('opacity', 0);

    svg.selectAll("path")
          .data(json.features)  //data join with features
          .enter()
          .append("path")
          .attr("fill", function(d ){
            var rate = d.properties.rate;
            if(rate){
              return color(d.properties.rate);
              
            }
            else{
              return "#d9d9d9"}})
          .attr("stroke", "black")
          .on("mouseover",function(d){
              if(d.properties.rate){
                $( "#interactive-information" ).hide();
                tooltip.transition()  
                .duration(200)  
                .style('opacity', 0.9);  
                
                tooltip.html(d.properties.name+ '<br/>'  + d.properties.rate) 
                .style('left', (d3.event.pageX -5) + 'px')  
                .style('top', (d3.event.pageY + 5) + 'px');   
              }
              else{
                $( "#interactive-information" ).hide();
                tooltip.transition()  
                .duration(200)  
                .style('opacity', 0.9);  
                
                tooltip.html(d.properties.name) 
                .style('left', (d3.event.pageX -5) + 'px')  
                .style('top', (d3.event.pageY + 5) + 'px');   
              }
 

          })
          .attr("stroke-width",0.1)
          .attr("d", path);  //generate geographic path
          function pulse() {
            var circles = d3.selectAll("circle")
            repeat();
            function repeat() {
             circles.transition()
                .duration(2000)
                .attr("stroke-width", 20)
                .attr("r", 0.5)
                .transition()
                .duration(2000)
                .attr('stroke-width', 0.5)
                .attr("r", 20)
                .ease(d3.easeSin) 
                .on("end", repeat);
            };
          }

          svg.append("g")
          .attr("class", "bubble")
          .selectAll("circle")
          .data(json.features.filter(function(d) {if(d.properties.rate){return d}}))
          // .sort(function(a:any, b:any) { return b.properties.rate - a.properties.rate; })
          .enter().append("circle")
          .attr("transform", function(d ) { return "translate(" + path.centroid(d) + ")"; })
          .attr("r", function(d ) { if(d.properties.rate) {return 10}  else{return 0;}})
          .attr("fill",function(d,i) { return color2(d.properties.name); })
          .attr("opacity","0.6")
          // .attr("stroke", "#ae017e")
          .attr("stroke-width",0.1)
          .append("title")
          .each(pulse())
          .text(function(d ) {
            return (d.properties.name+"\n"+d.properties.rate);
          });

          svg.append("g")
          .attr("class", "label")
          .selectAll("text")
          .data(json.features)
          // .sort(function(a , b:any) { return b.properties.rate - a.properties.rate; })
          .enter()
          .append("text")
          .filter( function(d){ if(d.properties.rate) return true })
          .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
          .attr("class","label")
          .attr("font-size",10)
          .attr("text-anchor","start")
          .text(function(d ) { return d.properties.name +"\n"+ d.properties.rate; })
        //   .style("fill", "green");

  });

 

});



          