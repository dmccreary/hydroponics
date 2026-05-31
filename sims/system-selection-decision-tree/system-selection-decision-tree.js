// System Selection Decision Tree — p5.js
// CANVAS_HEIGHT: 640
let canvasWidth = 900;
let drawHeight = 520;
let controlHeight = 120;
let canvasHeight = drawHeight + controlHeight;
let containerWidth;
let containerHeight = canvasHeight;

let resetBtn, showAllBtn;
let showAllPaths = false;

// Decision tree data
const tree = {
    id: 'root',
    type: 'decision',
    label: 'Primary crop?',
    question: 'What is your primary crop?',
    children: [
        {
            answerLabel: 'Leafy / herbs',
            node: {
                id: 'q-power',
                type: 'decision',
                label: 'Electricity?',
                question: 'Do you have reliable electricity?',
                children: [
                    {
                        answerLabel: 'Yes',
                        node: {
                            id: 'q-budget',
                            type: 'decision',
                            label: 'Budget?',
                            question: 'What is your budget?',
                            children: [
                                { answerLabel: '<$50', node: { id: 't-kratky-budget', type: 'terminal', systemKey: 'kratky' } },
                                { answerLabel: '$50–200', node: { id: 't-dwc-leafy', type: 'terminal', systemKey: 'dwc' } },
                                { answerLabel: '$200+', node: { id: 't-nft', type: 'terminal', systemKey: 'nft' } }
                            ]
                        }
                    },
                    {
                        answerLabel: 'No',
                        node: { id: 't-kratky-nopower', type: 'terminal', systemKey: 'kratky' }
                    }
                ]
            }
        },
        {
            answerLabel: 'Fruiting',
            node: {
                id: 'q-duration',
                type: 'decision',
                label: 'Duration?',
                question: 'Expected growth duration?',
                children: [
                    { answerLabel: '<60 days', node: { id: 't-dwc-fruit', type: 'terminal', systemKey: 'dwc' } },
                    { answerLabel: '>60 days', node: { id: 't-ebb-fruit', type: 'terminal', systemKey: 'ebb' } }
                ]
            }
        },
        {
            answerLabel: 'Root crops',
            node: {
                id: 'q-scale',
                type: 'decision',
                label: 'Scale?',
                question: 'What scale are you growing at?',
                children: [
                    { answerLabel: 'Home', node: { id: 't-ebb-root', type: 'terminal', systemKey: 'ebb' } },
                    { answerLabel: 'Commercial', node: { id: 't-aero', type: 'terminal', systemKey: 'aero' } }
                ]
            }
        },
        {
            answerLabel: 'Propagation',
            node: {
                id: 'q-speed',
                type: 'decision',
                label: 'Speed?',
                question: 'How important is propagation speed?',
                children: [
                    { answerLabel: 'Max speed', node: { id: 't-fog', type: 'terminal', systemKey: 'fog' } },
                    { answerLabel: 'Good enough', node: { id: 't-clone', type: 'terminal', systemKey: 'clone' } }
                ]
            }
        }
    ]
};

// Recommendation details
const systems = {
    kratky: {
        name: 'Kratky',
        desc: 'Passive, non-circulating hydroponic system for leafy crops.',
        cost: '$5–30 build cost',
        strength: 'Zero electricity, simple, no pumps.',
        weakness: 'Limited to short-cycle leafy crops; cannot top up mid-cycle.',
        chapter: 'Chapter 6 — Passive and Basic Active Systems'
    },
    dwc: {
        name: 'DWC',
        desc: 'Deep water culture with a single bubbler oxygenating the root zone.',
        cost: '$20–100 build cost',
        strength: 'Fast growth, low parts count.',
        weakness: 'Pump failure kills plants within hours.',
        chapter: 'Chapter 7 — Deep Water Culture'
    },
    nft: {
        name: 'NFT',
        desc: 'Nutrient Film Technique — a thin film of solution flows past roots in a tilted channel.',
        cost: '$200–500 build cost',
        strength: 'Best oxygen for leafy crops; scales linearly.',
        weakness: 'Pump failure causes death in under 30 min; root mats can clog.',
        chapter: 'Chapter 8 — NFT Channels'
    },
    ebb: {
        name: 'Ebb-and-Flow',
        desc: 'Periodic flood-and-drain over a growing medium.',
        cost: '$100–300 build cost',
        strength: 'Supports larger fruiting crops; medium buffers a brief pump outage.',
        weakness: 'Heavy; requires sturdy bench; medium adds cost and weight.',
        chapter: 'Chapter 9 — Ebb-and-Flow Systems'
    },
    aero: {
        name: 'Aeroponics',
        desc: 'Roots suspended in air, sprayed with nutrient mist.',
        cost: '$500–2000 build cost',
        strength: 'Highest O₂, fastest growth, used in commercial root-crop production.',
        weakness: 'Highest complexity; minutes of pump downtime kill plants.',
        chapter: 'Chapter 10 — Aeroponics'
    },
    fog: {
        name: 'Fogponics',
        desc: 'Ultrasonic fogger generates sub-50μm nutrient droplets in a closed chamber.',
        cost: '$200–600 build cost',
        strength: 'Fastest propagation, lowest water use.',
        weakness: 'Niche; sensitive to chamber leaks and EC drift.',
        chapter: 'Chapter 10 — Aeroponics'
    },
    clone: {
        name: 'DWC clone bucket',
        desc: 'Small DWC variant for rooting cuttings.',
        cost: '$20–50 build cost',
        strength: 'Simple and reliable for propagation.',
        weakness: 'Not yield-optimized.',
        chapter: 'Chapter 7 — Deep Water Culture'
    }
};

// Flattened node registry
let nodeMap = {};
// Edges with answer labels
let edges = []; // {parentId, childId, label}
// Visited node ids (decision nodes that are on a chosen path)
let visitedNodeIds = new Set();
// Currently selected terminal (for side panel)
let selectedTerminalId = null;
// Active path = the chain of decisions the user has clicked through
let activePathIds = ['root'];

// Layout values (logical 900 x 520 frame)
const LOGICAL_W = 900;
const LOGICAL_H = 520;
const NODE_W = 95;
const NODE_H = 50;

function updateCanvasSize() {
    const container = document.querySelector('main').parentElement;
    containerWidth = Math.min(container.offsetWidth, 900);
}

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(containerWidth, containerHeight);
    canvas.parent(document.querySelector('main'));
    textFont('Segoe UI');

    setupTree();

    resetBtn = createButton('Reset');
    resetBtn.position(10, drawHeight + 10);
    resetBtn.mousePressed(() => {
        visitedNodeIds = new Set();
        activePathIds = ['root'];
        selectedTerminalId = null;
        showAllPaths = false;
        showAllBtn.html('Show all paths');
    });

    showAllBtn = createButton('Show all paths');
    showAllBtn.position(75, drawHeight + 10);
    showAllBtn.mousePressed(() => {
        showAllPaths = !showAllPaths;
        showAllBtn.html(showAllPaths ? 'Hide all paths' : 'Show all paths');
    });
}

// Build nodeMap, edges, and assign x/y by recursive leaf-count layout
function setupTree() {
    nodeMap = {};
    edges = [];

    // Walk tree to register nodes and edges
    function register(node, parentId) {
        nodeMap[node.id] = { ref: node, x: 0, y: 0, depth: 0 };
        if (node.children) {
            for (const c of node.children) {
                register(c.node, node.id);
                edges.push({ parentId: node.id, childId: c.node.id, label: c.answerLabel });
            }
        }
    }
    register(tree, null);

    // Count leaves under each node
    function leafCount(node) {
        if (!node.children || node.children.length === 0) return 1;
        let n = 0;
        for (const c of node.children) n += leafCount(c.node);
        return n;
    }

    // Assign x,y. Each subtree gets a horizontal slot proportional to its leaf count.
    const totalLeaves = leafCount(tree);
    const usableW = LOGICAL_W - 40;
    const leafSlot = usableW / totalLeaves;

    function layout(node, depth, leftEdge) {
        const lc = leafCount(node);
        const subtreeWidth = lc * leafSlot;
        const centerX = leftEdge + subtreeWidth / 2;
        nodeMap[node.id].x = centerX;
        nodeMap[node.id].y = 50 + depth * 95;
        nodeMap[node.id].depth = depth;
        if (node.children) {
            let cursor = leftEdge;
            for (const c of node.children) {
                const childLeaves = leafCount(c.node);
                layout(c.node, depth + 1, cursor);
                cursor += childLeaves * leafSlot;
            }
        }
    }
    layout(tree, 0, 20);
}

function draw() {
    background(248, 249, 250);

    // Title
    push();
    fill(46, 125, 50);
    noStroke();
    textSize(14);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text('System Selection Decision Tree', 12, 8);
    pop();

    // Right-side panel reserves ~35% if a terminal is selected
    const panelW = selectedTerminalId ? Math.floor(width * 0.35) : 0;
    const treeAreaW = width - panelW;

    // Determine which nodes are "active" (reachable along the current activePath)
    // Active set = activePathIds + all descendants of the deepest activePath node
    const deepest = activePathIds[activePathIds.length - 1];
    const activeSet = new Set(activePathIds);
    collectDescendants(deepest, activeSet);

    // Draw edges first
    drawEdges(treeAreaW, activeSet);

    // Draw nodes
    drawNodes(treeAreaW, activeSet);

    // Side panel
    if (selectedTerminalId) {
        drawSidePanel(panelW);
    }

    // Hover tooltip
    drawHoverTooltip(treeAreaW);

    // Instruction line in control area
    drawInstructions();
}

function collectDescendants(nodeId, set) {
    const entry = nodeMap[nodeId];
    if (!entry) return;
    const node = entry.ref;
    if (!node.children) return;
    for (const c of node.children) {
        set.add(c.node.id);
        collectDescendants(c.node.id, set);
    }
}

function nodeScreenPos(id, treeAreaW) {
    const sx = treeAreaW / LOGICAL_W;
    const sy = drawHeight / LOGICAL_H;
    const e = nodeMap[id];
    return { x: e.x * sx, y: e.y * sy, sx, sy };
}

function drawEdges(treeAreaW, activeSet) {
    for (const ed of edges) {
        const p = nodeScreenPos(ed.parentId, treeAreaW);
        const c = nodeScreenPos(ed.childId, treeAreaW);

        const parentOnPath = activePathIds.includes(ed.parentId);
        const childActive = activeSet.has(ed.childId);
        const visitedChild = visitedNodeIds.has(ed.childId);

        push();
        if (showAllPaths) {
            stroke(46, 125, 50, 180);
            strokeWeight(2);
        } else if (parentOnPath && childActive) {
            stroke(46, 125, 50);
            strokeWeight(2.5);
        } else if (visitedChild) {
            stroke(129, 199, 132);
            strokeWeight(1.8);
        } else {
            stroke(207, 216, 220);
            strokeWeight(1.2);
        }

        // Draw line from bottom of parent to top of child
        const py = p.y + NODE_H / 2;
        const cy = c.y - NODE_H / 2;
        line(p.x, py, c.x, cy);

        // arrowhead at child top
        const ah = 6;
        noStroke();
        if (showAllPaths) fill(46, 125, 50, 180);
        else if (parentOnPath && childActive) fill(46, 125, 50);
        else if (visitedChild) fill(129, 199, 132);
        else fill(207, 216, 220);
        triangle(c.x, cy, c.x - ah / 2, cy - ah, c.x + ah / 2, cy - ah);
        pop();

        // Edge label (the answer text)
        const mx = (p.x + c.x) / 2;
        const my = (py + cy) / 2;
        push();
        // background pill for legibility
        textSize(10);
        const tw = textWidth(ed.label) + 8;
        noStroke();
        fill(255, 255, 255, 230);
        rect(mx - tw / 2, my - 8, tw, 14, 3);
        if (showAllPaths || (parentOnPath && childActive)) {
            fill(27, 94, 32);
        } else if (visitedChild) {
            fill(56, 142, 60);
        } else {
            fill(120, 130, 135);
        }
        textAlign(CENTER, CENTER);
        textStyle(BOLD);
        text(ed.label, mx, my);
        pop();
    }
}

function drawNodes(treeAreaW, activeSet) {
    for (const id in nodeMap) {
        const entry = nodeMap[id];
        const node = entry.ref;
        const p = nodeScreenPos(id, treeAreaW);

        const onActivePath = activePathIds.includes(id);
        const isActive = activeSet.has(id);
        const isVisited = visitedNodeIds.has(id);
        const isSelected = selectedTerminalId === id;

        if (node.type === 'decision') {
            drawDiamond(p.x, p.y, NODE_W, NODE_H, node.label, {
                onActivePath, isActive, isVisited, showAll: showAllPaths
            });
        } else {
            drawTerminal(p.x, p.y, NODE_W, NODE_H, node.systemKey, {
                isActive, isVisited, isSelected, showAll: showAllPaths
            });
        }
    }
}

function drawDiamond(cx, cy, w, h, label, state) {
    const { onActivePath, isActive, isVisited, showAll } = state;

    push();
    let fillColor;
    let strokeColor = [120, 130, 135];
    let strokeW = 1.2;
    let textColor = [55, 71, 79];

    if (showAll || isActive) {
        fillColor = [0, 188, 212]; // teal
        strokeColor = [0, 131, 143];
        strokeW = 2;
        textColor = [255, 255, 255];
    } else if (isVisited) {
        fillColor = [178, 235, 242];
        strokeColor = [0, 131, 143];
        textColor = [38, 50, 56];
    } else {
        fillColor = [236, 239, 241];
        textColor = [120, 130, 135];
    }

    if (onActivePath) {
        strokeColor = [46, 125, 50];
        strokeW = 3;
    }

    stroke(strokeColor);
    strokeWeight(strokeW);
    fill(fillColor);
    quad(cx, cy - h / 2, cx + w / 2, cy, cx, cy + h / 2, cx - w / 2, cy);

    noStroke();
    fill(textColor);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    let ts = 11;
    textSize(ts);
    while (textWidth(label) > w - 6 && ts > 7) {
        ts -= 1;
        textSize(ts);
    }
    text(label, cx, cy);
    pop();
}

function drawTerminal(cx, cy, w, h, systemKey, state) {
    const { isActive, isVisited, isSelected, showAll } = state;
    const sys = systems[systemKey];

    push();
    let fillColor, strokeColor, textColor, strokeW = 1.2;

    if (showAll || isActive) {
        fillColor = [46, 125, 50];
        strokeColor = [27, 94, 32];
        textColor = [255, 255, 255];
        strokeW = 2;
    } else if (isVisited) {
        fillColor = [165, 214, 167];
        strokeColor = [56, 142, 60];
        textColor = [27, 94, 32];
    } else {
        fillColor = [236, 239, 241];
        strokeColor = [180, 190, 195];
        textColor = [120, 130, 135];
    }

    if (isSelected) {
        strokeColor = [255, 152, 0];
        strokeW = 3.5;
    }

    stroke(strokeColor);
    strokeWeight(strokeW);
    fill(fillColor);
    rect(cx - w / 2, cy - h / 2, w, h, 10);

    noStroke();
    fill(textColor);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    // Auto-shrink text to fit inside the box
    let ts = 11;
    textSize(ts);
    while (textWidth(sys.name) > w - 6 && ts > 7) {
        ts -= 1;
        textSize(ts);
    }
    text(sys.name, cx, cy);
    pop();
}

function drawSidePanel(panelW) {
    const sys = systems[nodeMap[selectedTerminalId].ref.systemKey];
    const x0 = width - panelW + 8;
    const y0 = 10;
    const w = panelW - 16;
    const h = drawHeight - 20;

    push();
    noStroke();
    fill(255);
    rect(x0, y0, w, h, 6);
    stroke(46, 125, 50);
    strokeWeight(2);
    noFill();
    rect(x0, y0, w, h, 6);
    pop();

    push();
    noStroke();
    textAlign(LEFT, TOP);

    // Title bar
    fill(46, 125, 50);
    rect(x0, y0, w, 32, 6, 6, 0, 0);
    fill(255);
    textStyle(BOLD);
    textSize(14);
    text('Recommended: ' + sys.name, x0 + 10, y0 + 8);

    // Body
    let ty = y0 + 44;
    fill(33);
    textStyle(NORMAL);
    textSize(12);
    text(sys.desc, x0 + 10, ty, w - 20);
    ty += textHeightOf(sys.desc, w - 20, 12) + 14;

    textStyle(BOLD);
    fill(27, 94, 32);
    text('Cost', x0 + 10, ty);
    ty += 16;
    textStyle(NORMAL);
    fill(33);
    text(sys.cost, x0 + 10, ty, w - 20);
    ty += 22;

    textStyle(BOLD);
    fill(27, 94, 32);
    text('Strength', x0 + 10, ty);
    ty += 16;
    textStyle(NORMAL);
    fill(33);
    text(sys.strength, x0 + 10, ty, w - 20);
    ty += textHeightOf(sys.strength, w - 20, 12) + 14;

    textStyle(BOLD);
    fill(198, 40, 40);
    text('Weakness', x0 + 10, ty);
    ty += 16;
    textStyle(NORMAL);
    fill(33);
    text(sys.weakness, x0 + 10, ty, w - 20);
    ty += textHeightOf(sys.weakness, w - 20, 12) + 14;

    textStyle(ITALIC);
    fill(85, 95, 100);
    textSize(11);
    text('See: ' + sys.chapter, x0 + 10, ty, w - 20);
    pop();
}

function textHeightOf(str, w, sz) {
    // Approximate: ~6px per char per line at sz=12
    const charsPerLine = Math.max(10, Math.floor(w / (sz * 0.55)));
    const lines = Math.ceil(str.length / charsPerLine);
    return lines * (sz + 4);
}

function drawHoverTooltip(treeAreaW) {
    // Find decision node under cursor
    for (const id in nodeMap) {
        const entry = nodeMap[id];
        if (entry.ref.type !== 'decision') continue;
        const p = nodeScreenPos(id, treeAreaW);
        if (pointInDiamond(mouseX, mouseY, p.x, p.y, NODE_W, NODE_H)) {
            const q = entry.ref.question;
            push();
            textSize(11);
            const tw = Math.min(textWidth(q) + 16, 260);
            const lines = Math.ceil(textWidth(q) / (tw - 16));
            const th = 14 + lines * 14;
            let tx = mouseX + 12;
            let ty = mouseY + 12;
            if (tx + tw > width) tx = mouseX - tw - 12;
            if (ty + th > drawHeight) ty = mouseY - th - 12;
            noStroke();
            fill(33, 33, 33, 235);
            rect(tx, ty, tw, th, 4);
            fill(255);
            textAlign(LEFT, TOP);
            text(q, tx + 8, ty + 7, tw - 16);
            pop();
            return;
        }
    }
}

function drawInstructions() {
    push();
    noStroke();
    fill(85, 95, 100);
    textSize(11);
    textAlign(LEFT, TOP);
    const y = drawHeight + 50;
    text('Click a diamond (decision) to descend the tree. Click a green box to see the recommendation.', 10, y);
    text('Hover a diamond for the full question. "Show all paths" reveals every option at once.', 10, y + 16);
    pop();
}

function pointInDiamond(mx, my, cx, cy, w, h) {
    const dx = Math.abs(mx - cx) / (w / 2);
    const dy = Math.abs(my - cy) / (h / 2);
    return (dx + dy) <= 1;
}

function pointInRect(mx, my, cx, cy, w, h) {
    return mx >= cx - w / 2 && mx <= cx + w / 2 &&
           my >= cy - h / 2 && my <= cy + h / 2;
}

function mousePressed() {
    if (mouseY > drawHeight) return;
    if (mouseX < 0 || mouseX > width) return;

    const panelW = selectedTerminalId ? Math.floor(width * 0.35) : 0;
    const treeAreaW = width - panelW;
    if (mouseX > treeAreaW) return; // click in side panel — ignore

    // Hit-test all nodes
    for (const id in nodeMap) {
        const entry = nodeMap[id];
        const node = entry.ref;
        const p = nodeScreenPos(id, treeAreaW);
        let hit = false;
        if (node.type === 'decision') {
            hit = pointInDiamond(mouseX, mouseY, p.x, p.y, NODE_W, NODE_H);
        } else {
            hit = pointInRect(mouseX, mouseY, p.x, p.y, NODE_W, NODE_H);
        }
        if (hit) {
            handleNodeClick(id);
            return;
        }
    }
}

function handleNodeClick(id) {
    // Find path from root to this node
    const path = findPath(tree, id);
    if (!path) return;

    const node = nodeMap[id].ref;
    if (node.type === 'decision') {
        // Set active path to this node (becomes the new context).
        activePathIds = path;
        // Mark ancestors visited
        for (const aid of path) visitedNodeIds.add(aid);
        // Clear side panel since we're navigating, not selecting a result
        selectedTerminalId = null;
    } else {
        // Terminal: light up its path and open side panel
        activePathIds = path;
        for (const aid of path) visitedNodeIds.add(aid);
        visitedNodeIds.add(id);
        selectedTerminalId = id;
    }
}

function findPath(node, targetId, acc) {
    acc = acc || [];
    const next = acc.concat([node.id]);
    if (node.id === targetId) return next;
    if (!node.children) return null;
    for (const c of node.children) {
        const r = findPath(c.node, targetId, next);
        if (r) return r;
    }
    return null;
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(containerWidth, containerHeight);
}
