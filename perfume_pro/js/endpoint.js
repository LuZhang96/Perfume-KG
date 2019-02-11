function exec() {
    /* Uncomment to see debug information in console */
    // d3sparql.debug = true
    var endpoint ="http://localhost:3030/inf558_final/query"
    var preff = d3.select("#sparql").property("value");
    // var endpoint = "http://dbpedia.org/sparql"
    console.log(preff)
    var name = d3.select("#name").property("value").toLowerCase();
    var brand = d3.select("#brand").property("value").toLowerCase();
    var designer = d3.select("#perfumer").property("value").toLowerCase();
    var note = d3.select("#note").property("value").toLowerCase();

    var notes =note.split(',')
    if(note==""){
        notes = [""]
    }
    console.log(notes.length)
    // var score = d3.select("#score").property("value").toLowerCase();
    var flag = $('#recommendation').is(':checked');

    // basic query
    if(flag==false){
        var sparql =preff+" \n\
        select  * \n\
        where{\n \
            ?s a schema:Perfume.\n\
            ?s perfume:name ?name;\n\
                FILTER (CONTAINS(lcase(str(?name)), \""+name+"\")).\n\
            ?s perfume:brand ?brand;\n\
                FILTER (CONTAINS(lcase(str(?brand)), \""+brand+"\")).\n\
            ?s perfume:designer ?designer;\n\
                FILTER (CONTAINS(lcase(str(?designer)), \""+designer+"\")).\n\
             "

        for (var i = 0; i < notes.length; i++) {
            var nt= "?note"+i
            var line = "?s perfume:note"+ nt+";\n\
            FILTER (CONTAINS(lcase(str("+nt+")), \""+notes[i]+"\")).\n\ "
            sparql = sparql+line
            //Do something
        }
        var tail = "}\n\
        LIMIT 10"
        sparql= sparql+tail
        console.log(sparql)
    }

    else{
        var sparql =preff+" \n\
        select  * \n\
        where{\n \
            ?s a schema:Perfume.\n\
            ?s perfume:name ?name;\n\
                FILTER (CONTAINS(lcase(str(?name)), \""+name+"\")).\n\
            ?s perfume:brand ?brand;\n\
                FILTER (CONTAINS(lcase(str(?brand)), \""+brand+"\")).\n\
            ?s perfume:designer ?designer;\n\
                FILTER (CONTAINS(lcase(str(?designer)), \""+designer+"\")).\n\
            ?s perfume:isSimilarTo/perfume:isSimilarTo ?p.\n\
                "
        for (var i = 0; i < notes.length; i++) {
            var nt= "?note"+i
            var line = "?s perfume:note"+ nt+";\n\
            FILTER (CONTAINS(lcase(str("+nt+")), \""+notes[i]+"\")).\n\ "
            sparql = sparql+line
            //Do something
        }
        var tail = "}\n\
        LIMIT 10"
        sparql= sparql+tail

        console.log(sparql)
   
    }

    var range = document.getElementById("pricerange").value;
    var priceflag= $('#priceflag').is(':checked');
    console.log(priceflag)

    if(priceflag){
        var pmin=range-100
        var pmax=range
        if(range==500){
            pmax=2000;
        }
        var sparql =preff+" \n\
        select  * \n\
        where{\n \
            ?s a schema:Perfume.\n\
            ?s perfume:name ?name;\n\
                FILTER (CONTAINS(lcase(str(?name)), \""+name+"\")).\n\
            ?s perfume:brand ?brand;\n\
                FILTER (CONTAINS(lcase(str(?brand)), \""+brand+"\")).\n\
            ?s perfume:designer ?designer;\n\
                FILTER (CONTAINS(lcase(str(?designer)), \""+designer+"\")).\n\
            ?s  perfume:offer [ perfume:price  ?price].\n\
            FILTER (?price >"+ pmin+")\n\
            FILTER (?price <"+ pmax+")\n\
                "
        for (var i = 0; i < notes.length; i++) {
            var nt= "?note"+i
            var line = "?s perfume:note"+ nt+";\n\
            FILTER (CONTAINS(lcase(str("+nt+")), \""+notes[i]+"\")).\n\ "
            sparql = sparql+line
            //Do something
        }
        var tail = "}\n\
        ORDER BY DESC(?price)\n\
        LIMIT 10"
        sparql= sparql+tail
        console.log(sparql)
    }
  
    d3sparql.query(endpoint, sparql, render)
  }

  function render(json) {
//     /* set options and call the d3spraql.xxxxx function in this library ... */
    var config = {
	  "selector": "#result"
	}
  d3sparql.htmltable(json, config)
  }

  function exec1(){
    var endpoint ="http://localhost:3030/inf558_final/query"
    var preff = d3.select("#sparql").property("value");
    var sparql =preff+" \n\
    select  ?designer (count(?s) as ?count) \n\
    where{\n \
        ?s a schema:Perfume.\n\
        ?s perfume:designer ?designer.\n\
            "
        var tail = "}\n\
            GROUP BY(?designer)\n\
            HAVING(COUNT(?s) <2000)\n\
            ORDER BY DESC(?count)\n\
            LIMIT 10"

            sparql= sparql+tail
            console.log(sparql)
            d3sparql.query(endpoint, sparql, render_PIE)
            d3sparql.query(endpoint, sparql, render)
  }

  function render_PIE(json) {
    var config = {
      "label": "designer",
      "size": "count",
      "width":  600,  // canvas width
      "height": 600,  // canvas height
      "margin":  10,  // canvas margin
      "hole":   200,  // doughnut hole: 0 for pie, r > 0 for doughnut
      "selector": "#result2"
    }
    d3sparql.piechart(json, config)
  }

  function exec2(){
    var endpoint ="http://localhost:3030/inf558_final/query"
    var preff = d3.select("#sparql").property("value");
    var sparql =preff+" \n\
    select  ?s (count(?note) as ?count) \n\
    where{\n \
        ?s a schema:Perfume.\n\
        ?s perfume:name ?name.\n\
        ?s perfume:note ?note.\n\
            "
        var tail = "}\n\
            GROUP BY(?s)\n\
            ORDER BY DESC(?count)\n\
            LIMIT 10"
            sparql= sparql+tail
            console.log(sparql)
            d3sparql.query(endpoint, sparql, render_PIE_2)
            d3sparql.query(endpoint, sparql, render)
  }

  function render_PIE_2(json) {
    var config = {
      "label": "s",
      "size": "count",
      "width":  600,  // canvas width
      "height": 600,  // canvas height
      "margin":  10,  // canvas margin
      "hole":   200,  // doughnut hole: 0 for pie, r > 0 for doughnut
      "selector": "#result2"
    }
    d3sparql.piechart(json, config)
  }


  function exec3(){
    var endpoint ="http://localhost:3030/inf558_final/query"
    var preff = d3.select("#sparql").property("value");
    var sparql =preff+" \n\
    select distinct ?p \n\
    where{\n \
        ?s a schema:Perfume.\n\
        ?s ?p ?o.\n\
            "
        var tail = "}\n\
            LIMIT 10"
            sparql= sparql+tail
            console.log(sparql)
            d3sparql.query(endpoint, sparql, render)
  }


