// History of Hydroponics Timeline - vis-timeline
// CANVAS_HEIGHT: 480
document.addEventListener('DOMContentLoaded', function () {
    const events = [
        {
            id: 1, year: '1200-01-01', title: 'Aztec Chinampas',
            era: 'ancient',
            summary: 'Floating island gardens on Lake Texcoco supplied Tenochtitlan with food.',
            detail: 'Chinampas were rectangular plots staked into the shallow lakebed and built up with mud, decaying vegetation, and reeds. Roots accessed nutrient-rich lake water year-round, producing multiple harvests per year — an early demonstration that plants thrive when roots stay continuously fed by water carrying dissolved minerals.'
        },
        {
            id: 2, year: '1648-01-01', title: 'Van Helmont\'s willow experiment',
            era: 'ancient',
            summary: 'Showed plants gain mass from water, not soil — a foundational mystery.',
            detail: 'Jan Baptist van Helmont planted a 5 lb willow in a sealed pot of 200 lb of dried soil, watered it for 5 years, then weighed everything: the tree gained 164 lb while the soil lost only 2 oz. He wrongly concluded the mass came from water alone — but he had correctly removed soil as the answer, setting up centuries of inquiry into where plant mass actually comes from.'
        },
        {
            id: 3, year: '1804-01-01', title: 'Nicolas de Saussure',
            era: 'foundation',
            summary: 'Established that plants take up specific mineral elements.',
            detail: 'De Saussure\'s careful chemistry showed that plants absorb mineral ions through their roots and CO₂ through their leaves. This established mineral nutrition as the real chemical basis of plant growth and pointed the way to defined nutrient mixtures.'
        },
        {
            id: 4, year: '1859-01-01', title: 'Julius von Sachs',
            era: 'foundation',
            summary: 'Published the first complete nutrient solution recipe.',
            detail: 'Sachs at the University of Würzburg published a defined recipe containing N, P, K, Ca, Mg, S and Fe in water. Plants grown in his solution completed their full life cycle without any soil, proving that the mineral list — not soil itself — was what plants needed.'
        },
        {
            id: 5, year: '1865-01-01', title: 'Knop\'s solution',
            era: 'foundation',
            summary: 'A simplified nutrient formula still used in plant biology labs today.',
            detail: 'Wilhelm Knop simplified Sachs\'s formula into a reproducible recipe: Ca(NO₃)₂, KNO₃, KH₂PO₄, MgSO₄ and an iron salt. Knop\'s solution became the standard reference for over a century of plant nutrition research.'
        },
        {
            id: 6, year: '1929-01-01', title: 'Gericke begins UC Berkeley work',
            era: 'modern',
            summary: 'Soilless culture moves from physiology lab to commercial demonstration.',
            detail: 'William F. Gericke scaled lab nutrient-solution methods up to commercial tank systems at UC Berkeley. His tanks supported full-size crops — moving soilless culture out of biology textbooks and into the question "could you actually grow food this way?"'
        },
        {
            id: 7, year: '1937-01-01', title: 'Gericke coins "hydroponics"',
            era: 'modern',
            summary: '25-foot tomato vines grown in nutrient solution become front-page news.',
            detail: 'Gericke combined the Greek roots hydro (water) and ponos (labor) to name the field. Photographs of his enormous tomato vines spread worldwide, and "hydroponics" became a household word almost overnight — though commercial systems would take decades to mature.'
        },
        {
            id: 8, year: '1945-01-01', title: 'WWII — Wake Island farms',
            era: 'modern',
            summary: 'U.S. Army grows hydroponic vegetables for troops on coral islands.',
            detail: 'Pacific atolls had no arable soil. The U.S. Army built hydroponic farms covering several acres on Wake Island, Iwo Jima and Ascension Island, supplying fresh produce to thousands of soldiers per day. This was the first large-scale operational deployment of hydroponics.'
        },
        {
            id: 9, year: '1973-01-01', title: 'NFT invented',
            era: 'modern',
            summary: 'Allan Cooper develops Nutrient Film Technique in England.',
            detail: 'NFT runs a thin film of nutrient solution down a gently sloped channel, with bare roots resting in the film. It uses very little solution, oxygenates roots well, and recirculates — features that made it the dominant commercial leafy-greens method for decades.'
        },
        {
            id: 10, year: '1982-01-01', title: 'EPCOT "The Land"',
            era: 'modern',
            summary: 'Walt Disney World opens a public hydroponic showcase.',
            detail: 'The Land pavilion took millions of visitors per year through working hydroponic, aeroponic and aquaponic greenhouses. For a generation of Americans this was their first direct exposure to soilless growing, seeding broad public awareness of vertical farming.'
        },
        {
            id: 11, year: '2005-01-01', title: 'LED revolution',
            era: 'industry',
            summary: 'Efficient LED grow lights transform indoor farming economics.',
            detail: 'Red-and-blue LEDs reached the efficacy needed to replace HPS lamps with a fraction of the energy and heat. Combined with PWM dimming and spectral tuning, LEDs made fully indoor warehouse farms economically conceivable for the first time.'
        },
        {
            id: 12, year: '2014-01-01', title: 'Vertical farming venture capital',
            era: 'industry',
            summary: 'AeroFarms, Bowery and Plenty raise hundreds of millions for warehouse farms.',
            detail: 'A wave of well-funded startups built multi-acre indoor farms with automated nutrient dosing, LED lighting, and machine-vision crop monitoring. Their facilities produce millions of heads of lettuce per year per site and demonstrate hydroponics at full industrial scale.'
        },
        {
            id: 13, year: '2026-01-01', title: 'Global market exceeds $20B',
            era: 'industry',
            summary: 'Hydroponics is now a mainstream agricultural sector.',
            detail: 'Drivers include urban food security, climate-resilient production, year-round leafy-greens supply, and the maturation of low-cost sensors and automation. The same ideas Sachs validated in a glass jar in 1859 now feed cities at scale.'
        }
    ];

    // Short labels prevent overflow past the timeline's right edge
    const shortLabels = {
        1: 'Chinampas',
        2: "Van Helmont's willow",
        3: 'de Saussure',
        4: 'Sachs nutrient recipe',
        5: "Knop's solution",
        6: 'Gericke at UC Berkeley',
        7: 'Coins "hydroponics"',
        8: 'WWII Wake Island',
        9: 'NFT invented',
        10: 'EPCOT "The Land"',
        11: 'LED revolution',
        12: 'Vertical farm VC',
        13: 'Market > $20B'
    };
    const items = events.map(e => ({
        id: e.id,
        content: shortLabels[e.id] || e.title,
        start: e.year,
        title: e.summary,
        className: 'era-' + e.era,
        type: 'point'
    }));

    const container = document.getElementById('timeline');
    const dataset = new vis.DataSet(items);
    const options = {
        min: '1180-01-01',
        max: '2080-01-01',
        start: '1180-01-01',
        end: '2080-01-01',
        zoomMin: 1000 * 60 * 60 * 24 * 365 * 5,
        zoomMax: 1000 * 60 * 60 * 24 * 365 * 1000,
        height: '380px',
        stack: true,
        showCurrentTime: false,
        margin: { item: 8 }
    };
    const timeline = new vis.Timeline(container, dataset, options);

    const detail = document.getElementById('detail');
    function showEvent(id) {
        const e = events.find(x => x.id === id);
        if (!e) return;
        const year = e.year.slice(0, 4);
        detail.innerHTML =
            '<h2>' + e.title + '</h2>' +
            '<div class="year">' + year + '</div>' +
            '<div class="body">' + e.detail + '</div>';
    }
    timeline.on('select', function (props) {
        if (props.items && props.items.length > 0) showEvent(props.items[0]);
    });
    timeline.on('click', function (props) {
        if (props.item) showEvent(props.item);
    });
});
