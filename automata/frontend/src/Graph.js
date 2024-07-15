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
        this.AdjList.get(v).forEach(adjVertex => {
            this.AdjList.set(adjVertex, this.AdjList.get(adjVertex).filter(vertex => vertex !== v));
        });

        // Remove the vertex from the adjacency list and vertices array
        this.AdjList.delete(v);
        this.vertices = this.vertices.filter(vertex => vertex !== v);

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