/* Scene content and map coordinates. All places are imagined. */
window.CITY_PLACES = [
    {
        id: 'kitchen', number: '01', name: 'The Common Table', short: 'Common Table',
        category: 'FOOD & BELONGING', time: '08:15 / MORNING', color: '#eac093',
        u: -3.8, v: -3, height: 54,
        title: 'A seat at the table.',
        description: 'The kitchen opens before the city wakes. Neighbors bring recipes. A pair of robot arms helps with the heavy things.',
        question: 'What if automation made participation easier, instead of making people unnecessary?',
        moments: [
            ['Something smells familiar.', 'A resident brings a recipe from home. The shared kitchen is part dining room, part meeting place.'],
            ['Many hands, one breakfast.', 'The robot lifts the pot while the cook tastes and adjusts. A neighbor who cannot lift heavy cookware can still lead the meal.'],
            ['More than a faster kitchen.', 'Shared equipment makes this possible without everyone buying a robot. The scarce resource becomes space at the table, not time at the stove.']
        ]
    },
    {
        id: 'workshop', number: '02', name: 'The Open Workshop', short: 'Open Workshop',
        category: 'MAKING & LEARNING', time: '10:40 / LATE MORNING', color: '#b5c6f4',
        u: .3, v: -3.5, height: 94,
        title: 'The city learns by doing.',
        description: 'A neighborhood workshop where people repair what they own, share what they know, and teach machines something new.',
        question: 'Who gets to shape a robot’s skills: its manufacturer, or the people who live with it?',
        moments: [
            ['Bring the imperfect things.', 'A torn shirt, a loose wheel, a robot that cannot quite fold a sleeve. There is room for unfinished work here.'],
            ['Show, try, adjust.', 'A student straightens the fabric. The robot holds one side and follows the demonstration. Learning moves in both directions.'],
            ['Knowledge stays in the neighborhood.', 'Demonstrations and repair notes are shared online. Local technicians are paid to maintain the tools and help others learn.']
        ]
    },
    {
        id: 'transit', number: '03', name: 'The Slow Exchange', short: 'Slow Exchange',
        category: 'MOVEMENT & ACCESS', time: '12:20 / MIDDAY', color: '#9edcea',
        u: 4.1, v: -2.2, height: 44,
        title: 'The journey belongs to everyone.',
        description: 'At the mobility hub, small autonomous shuttles meet walking paths. Deliveries share the infrastructure, not the entire pavement.',
        question: 'Could a smarter transport network make the city feel slower, quieter, and more human?',
        moments: [
            ['No car keys needed.', 'A resident arrives on foot. A low-floor shuttle waits beside a clear, wide path rather than a wall of parked cars.'],
            ['A connected last kilometer.', 'The shuttle carries people; a smaller cart takes groceries to the next block. The route board also works without a personal phone.'],
            ['Access before speed.', 'The city chooses reliable shared trips over faster private ones. People still need a say in where the routes go and what they cost.']
        ]
    },
    {
        id: 'garden', number: '04', name: 'The Living Canopy', short: 'Living Canopy',
        category: 'GROWING & ECOLOGY', time: '15:10 / AFTERNOON', color: '#b9efae',
        u: 3.4, v: 3.1, height: 62,
        title: 'A city that grows back.',
        description: 'Above the streets, greenhouse terraces turn sunlight and collected rain into a neighborhood harvest.',
        question: 'When a machine tends a garden, what do people get to rediscover about growing things?',
        moments: [
            ['Follow the green roofs.', 'A gardener checks the seedlings. Sensors suggest where water is needed, but the garden is also somewhere to spend an afternoon.'],
            ['Small, careful work.', 'A tending robot moves between the beds. It carries water and checks soil while residents plant, prune, and learn the seasons.'],
            ['The harvest is shared.', 'Produce goes to the common kitchen. Water and energy use remain visible, because greener-looking technology is not automatically sustainable.']
        ]
    },
    {
        id: 'commons', number: '05', name: 'The Afterhours Commons', short: 'Afterhours Commons',
        category: 'CULTURE & CONNECTION', time: '18:45 / EARLY EVENING', color: '#efbbcf',
        u: -.7, v: 4.2, height: 22,
        title: 'Leave room for nothing in particular.',
        description: 'The working day ends. Chairs move into the square, music starts, and a small robot clears the cups.',
        question: 'If technology gives us time back, do we have places to spend it together?',
        moments: [
            ['Stay a little longer.', 'A courtyard becomes a dinner table, then an informal stage. You do not need to buy anything to sit here.'],
            ['Support in the background.', 'A service robot takes dishes away. Neighbors move chairs, tell stories, and choose what happens next.'],
            ['Unscheduled is a feature.', 'The public calendar helps people find one another. It does not need to measure every moment or turn every gathering into content.']
        ]
    },
    {
        id: 'care', number: '06', name: 'The Care Courtyard', short: 'Care Courtyard',
        category: 'CARE & INDEPENDENCE', time: '16:30 / LATE AFTERNOON', color: '#f3d891',
        u: -4.5, v: 2.1, height: 45,
        title: 'A little help. More of your own life.',
        description: 'A quiet courtyard links homes, a small clinic, and a neighborhood care team. Assistance is part of everyday life.',
        question: 'How can a robot support independence while making more room for human care?',
        moments: [
            ['An ordinary afternoon.', 'A resident meets a friend outside. A support robot brings a bag and a walking aid from home.'],
            ['Different kinds of care.', 'The machine takes a carrying task. A human care worker spends the freed time listening, not simply seeing more people per hour.'],
            ['Care is a shared commitment.', 'Accessible homes, paid care work, and dependable maintenance matter as much as the robot. Technology is one part of the support network.']
        ]
    }
];
