class Graph {
     

    constructor(){
        this.AdjList = new Map();
        this.vertices = []
    }

    addVertex(v){
        this.AdjList.set(v, [])
        this.vertices.push(v)        
    }

    removeVertex(v){
        let filterOut = v
        this.AdjList.forEach((value, key) => {
            let filteredMap = value.filter(vertex => vertex !== filterOut);
            this.AdjList.set(key, filteredMap)
        })

    }

    addEdge(v,w){
        
        this.AdjList.get(v).push(w);

        this.AdjList.get(w).push(v);

    }

    removeEdge(v, w) {
        if (this.AdjList.has(v)) {
            this.AdjList.set(v, this.AdjList.get(v).filter(vertex => vertex !== w));
        }

        if (this.AdjList.has(w)) {
            this.AdjList.set(w, this.AdjList.get(w).filter(vertex => vertex !== v));
        }
    }

    changeEdge(v, w, x){
        
        // root = v
        // old destination = w
        // new destination = x

        this.removeEdge(v,w)

        this.addEdge(v,x)


    }
    


}