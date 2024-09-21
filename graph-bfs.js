var graph = {
    vertices: [{
        edges: [1, 4],
        x: 25,
        y: 25
    }, {
        edges: [0, 2, 3, 4],
        x: 75,
        y: 25
    }, {
        edges: [1, 3],
        x: 125,
        y: 75
    }, {
        edges: [1, 2, 4],
        x: 75,
        y: 125
    }, {
        edges: [0, 1, 3],
        x: 25,
        y: 125
    }]
};

graph.edgelist = (function (G) {
    var i, j, edges = [],
        e;
    var contains = function (a, e) {
            var i;
            for (i = 0; i < a.length; i += 1) {
                if (a[i].n === e.n && a[i].m === e.m) {
                    return true;
                }
                if (a[i].m === e.n && a[i].n === e.m) {
                    return true;
                }
            }
            return false;
        };
    for (i = 0; i < G.vertices.length; i += 1) {
        for (j = 0; j < G.vertices[i].edges.length; j += 1) {
            e = {
                n: i,
                m: G.vertices[i].edges[j]
            };
            if (!contains(edges, {
                n: i,
                m: G.vertices[i].edges[j]
            })) {
                edges.push(e);
            }
        }
    }
    return edges;
})(graph);

var bfs = function (G, s) {

        var edgeIndex, Q = [],
            u, v;

        var o = {};

        o.init = function () {
            var i;
            for (i = 0; i < G.vertices.length; i += 1) {
                G.vertices[i].color = 'white';
                G.vertices[i].distance = Number.POSITIVE_INFINITY;
                G.vertices[i].parent = null;
            }
        };

        var isDone = function isDone() {
                return Q.length === 0;
            };
        o.isDone = isDone;

        o.setStart = function () {
            G.vertices[s].color = 'grey';
            G.vertices[s].distance = 0;
            G.vertices[s].parent = null;

            Q.push(s);
        };

        var step = function () {
                if (!isDone()) {
                    u = Q.splice(0, 1)[0];
                    for (edgeIndex = 0; edgeIndex < G.vertices[u].edges.length; edgeIndex += 1) {
                        v = G.vertices[u].edges[edgeIndex];
                        if (G.vertices[v].color === 'white') {
                            G.vertices[v].color = 'grey';
                            G.vertices[v].distance = G.vertices[u].distance + 1;
                            G.vertices[v].parent = u;
                            Q.push(v);
                        }
                    }
                    G.vertices[u].color = 'black';
                }
            };
        o.step = step;

        o.run = function () {
            while (!isDone()) {
                step();
            }
        };

        return o;

    };

graph.draw = function (ctx) {
    var i;
    var n, m;
    for (i = 0; i < this.edgelist.length; i += 1) {
        n = this.vertices[this.edgelist[i].n];
        m = this.vertices[this.edgelist[i].m];
        drawEdge(ctx, n.x, n.y, m.x, m.y);
    }
    for (i = 0; i < this.vertices.length; i += 1) {
        n = this.vertices[i];
        drawNode(ctx, n.x, n.y, n.color === undefined ? 'white' : n.color);
    }
};

var drawNode = function (ctx, x, y, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();
    };

var drawEdge = function (ctx, x0, y0, x1, y1) {
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
    };

graph.getTarget = function (x, y) {
    var i;
    for (i = 0; i < this.vertices.length; i += 1) {
        if (contains(this.vertices[i], x, y)) {
            return i;
        }
    }
    return undefined;
};

var contains = function (vertex, x, y) {
        var dx, dy;
        dx = x - vertex.x;
        dy = y - vertex.y;
        return (Math.sqrt(dx * dx + dy * dy) < 10);
    };

$('#viewer').click((function () {

    var intervalID;

    return function () {

        var offset, x, y, circle, target, search, ctx;

        offset = $(this).offset();
        x = event.pageX - offset.left - 2; // offset
        y = event.pageY - offset.top - 5; // offset
        target = graph.getTarget(x, y);

        if (target !== undefined) {

            clearInterval(intervalID);

            search = bfs(graph, target);
            search.init();
            search.setStart();

            ctx = $('#viewer')[0].getContext("2d");
            ctx.clearRect(0, 0, 800, 500);
            graph.draw(ctx);

            intervalID = setInterval(function () {
                if (search.isDone()) {
                    clearInterval(intervalID);
                } else {
                    search.step();
                }
                ctx.clearRect(0, 0, 800, 500);
                graph.draw(ctx);
            }, 500);
        }

    };

})());

(function () {

    var canvas = document.getElementById("viewer");
    if (canvas.getContext) {
        var ctx = canvas.getContext("2d");
        graph.draw(ctx);
    }

})();