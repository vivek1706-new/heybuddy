export const CATS = [
    {
        id: 'ac', name: 'Air Conditioner', cost: 100,
        qs: [
            { q: 'Type?', opts: ['Split', 'Window', 'Cassette', 'Tower'], m: false },
            { q: 'Tonnage?', opts: ['0.8T', '1T', '1.5T', '2T'], m: true },
            { q: 'Star rating?', opts: ['3 Star', '4 Star', '5 Star'], m: true },
            { q: 'Inverter?', opts: ['Yes', 'No', 'No preference'], m: false },
            { q: 'Brand?', opts: ['Daikin', 'LG', 'Voltas', 'Blue Star', 'Samsung', 'Hitachi', 'No preference'], m: true },
            { q: 'Budget?', opts: ['Under 25K', '25K-35K', '35K-45K', 'Above 45K'], m: true },
        ],
    },
    {
        id: 'fridge', name: 'Refrigerator', cost: 100,
        qs: [
            { q: 'Type?', opts: ['Single door', 'Double door', 'Side-by-side', 'French door'], m: false },
            { q: 'Capacity?', opts: ['Under 200L', '200-400L', '400-600L', 'Above 600L'], m: true },
            { q: 'Brand?', opts: ['Samsung', 'LG', 'Whirlpool', 'Godrej', 'Haier', 'No preference'], m: true },
            { q: 'Budget?', opts: ['Under 15K', '15K-30K', '30K-50K', 'Above 50K'], m: true },
        ],
    },
    {
        id: 'washer', name: 'Washing Machine', cost: 90,
        qs: [
            { q: 'Type?', opts: ['Front load', 'Top load', 'Semi-auto'], m: false },
            { q: 'Capacity?', opts: ['6 kg', '7 kg', '8 kg', '9+ kg'], m: true },
            { q: 'Brand?', opts: ['LG', 'Samsung', 'Bosch', 'IFB', 'Whirlpool', 'No preference'], m: true },
            { q: 'Budget?', opts: ['Under 15K', '15K-25K', '25K-40K', 'Above 40K'], m: true },
        ],
    },
    {
        id: 'tv', name: 'Television', cost: 80,
        qs: [
            { q: 'Screen size?', opts: ['32 in', '43 in', '50-55 in', '65 in'], m: true },
            { q: 'Display?', opts: ['LED', 'QLED', 'OLED', 'No preference'], m: true },
            { q: 'Brand?', opts: ['Samsung', 'LG', 'Sony', 'TCL', 'Mi', 'No preference'], m: true },
            { q: 'Budget?', opts: ['Under 20K', '20K-40K', '40K-70K', 'Above 70K'], m: true },
        ],
    },
    {
        id: 'laptop', name: 'Laptop', cost: 120,
        qs: [
            { q: 'Use?', opts: ['Work', 'Gaming', 'Student', 'Creative'], m: false },
            { q: 'RAM?', opts: ['8 GB', '16 GB', '32 GB+'], m: true },
            { q: 'Brand?', opts: ['Apple', 'Dell', 'HP', 'Lenovo', 'Asus', 'No preference'], m: true },
            { q: 'Budget?', opts: ['Under 40K', '40K-70K', '70K-1.2L', 'Above 1.2L'], m: true },
        ],
    },
    {
        id: 'mobile', name: 'Smartphone', cost: 60,
        qs: [
            { q: 'OS?', opts: ['Android', 'iOS', 'No preference'], m: false },
            { q: 'Priority?', opts: ['Camera', 'Battery', 'Performance', 'Display'], m: true },
            { q: 'Brand?', opts: ['Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Google', 'No preference'], m: true },
            { q: 'Budget?', opts: ['Under 15K', '15K-30K', '30K-50K', 'Above 50K'], m: true },
        ],
    },
    {
        id: 'purifier', name: 'Water Purifier', cost: 80,
        qs: [
            { q: 'Tech?', opts: ['RO', 'UV', 'RO+UV', 'Gravity'], m: false },
            { q: 'Brand?', opts: ['Kent', 'Aquaguard', 'Pureit', 'No preference'], m: true },
            { q: 'Budget?', opts: ['Under 10K', '10K-20K', 'Above 20K'], m: true },
        ],
    },
    {
        id: 'dishwasher', name: 'Dishwasher', cost: 100,
        qs: [
            { q: 'Type?', opts: ['Freestanding', 'Built-in', 'Countertop'], m: false },
            { q: 'Brand?', opts: ['Bosch', 'IFB', 'Samsung', 'LG', 'No preference'], m: true },
            { q: 'Budget?', opts: ['Under 25K', '25K-40K', 'Above 40K'], m: true },
        ],
    },
];

export const PRODS = {
    ac: [
        { id: 1, name: 'Daikin 1.5T 5-Star Inverter', model: 'MTKL50UV16', price: '38,990-42,500', rating: 4.5, specs: { Type: 'Split', Cap: '1.5T', Star: '5 Star' }, emi: '1,890/mo x24', install: 'Free', warranty: '1yr+10yr', src: 'Amazon 39,490 | Flipkart 38,990' },
        { id: 2, name: 'LG 1.5T 3-Star Dual Inverter', model: 'MS-Q18YNZA', price: '32,990-36,000', rating: 4.3, specs: { Type: 'Split', Cap: '1.5T', Star: '3 Star' }, emi: '1,590/mo x24', install: 'Rs.1500', warranty: '1yr+10yr', src: 'Amazon 33,490 | Flipkart 32,990' },
        { id: 3, name: 'Voltas 1.5T 5-Star', model: '185V DAZJ', price: '35,490-39,000', rating: 4.2, specs: { Type: 'Split', Cap: '1.5T', Star: '5 Star' }, emi: '1,710/mo x24', install: 'Free', warranty: '1yr+5yr', src: 'Amazon 36,200 | Flipkart 35,490' },
        { id: 4, name: 'Blue Star 1.5T 5-Star', model: 'IC518DNUR', price: '37,990-41,500', rating: 4.4, specs: { Type: 'Split', Cap: '1.5T', Star: '5 Star' }, emi: '1,830/mo x24', install: 'Free', warranty: '1yr+10yr', src: 'Amazon 38,990 | Flipkart 37,990' },
    ],
    fridge: [
        { id: 1, name: 'Samsung 253L 3-Star Double Door', model: 'RT28T3122S8', price: '24,490-27,000', rating: 4.3, specs: { Type: 'Double door', Cap: '253L', Star: '3 Star' }, emi: '1,190/mo x24', install: 'Free', warranty: '1yr+10yr', src: 'Amazon 25,490 | Flipkart 24,490' },
        { id: 2, name: 'LG 360L 3-Star Frost Free', model: 'GL-T382VPZX', price: '36,990-40,000', rating: 4.4, specs: { Type: 'Double door', Cap: '360L', Star: '3 Star' }, emi: '1,790/mo x24', install: 'Free', warranty: '1yr+10yr', src: 'Amazon 37,490 | Flipkart 36,990' },
    ],
    washer: [
        { id: 1, name: 'LG 8kg 5-Star Front Load', model: 'FHM1408BDL', price: '38,990-42,000', rating: 4.5, specs: { Type: 'Front load', Cap: '8 kg', Star: '5 Star' }, emi: '1,890/mo x24', install: 'Free', warranty: '2yr+10yr', src: 'Amazon 39,490 | Flipkart 38,990' },
        { id: 2, name: 'Samsung 7kg Top Load', model: 'WA70BG4441BY', price: '18,990-21,000', rating: 4.1, specs: { Type: 'Top load', Cap: '7 kg', Star: '5 Star' }, emi: '910/mo x24', install: 'Rs.1000', warranty: '1yr+5yr', src: 'Amazon 19,490 | Flipkart 18,990' },
    ],
    tv: [
        { id: 1, name: 'Samsung 55" QLED 4K', model: 'QA55Q60DAKLXL', price: '62,990-68,000', rating: 4.5, specs: { Size: '55 in', Display: 'QLED', Brand: 'Samsung' }, emi: '3,050/mo x24', install: 'Free', warranty: '1yr', src: 'Amazon 63,990 | Flipkart 62,990' },
        { id: 2, name: 'LG 43" 4K UHD Smart TV', model: '43UR7500PSC', price: '31,990-35,000', rating: 4.2, specs: { Size: '43 in', Display: 'LED', Brand: 'LG' }, emi: '1,550/mo x24', install: 'Free', warranty: '1yr', src: 'Amazon 32,490 | Flipkart 31,990' },
    ],
    laptop: [
        { id: 1, name: 'MacBook Air M3 15in', model: 'MRXN3HN/A', price: '1,24,900-1,29,990', rating: 4.7, specs: { RAM: '8GB', SSD: '256GB' }, emi: '5,990/mo x24', install: 'N/A', warranty: '1yr AppleCare', src: 'Apple.in 1,24,900' },
        { id: 2, name: 'Dell XPS 14', model: '9440', price: '1,49,990-1,59,000', rating: 4.5, specs: { RAM: '16GB', SSD: '512GB' }, emi: '7,190/mo x24', install: 'N/A', warranty: '1yr Premium', src: 'Dell.in 1,49,990' },
    ],
    mobile: [
        { id: 1, name: 'iPhone 15', model: 'MTLM3HN/A', price: '69,900-74,900', rating: 4.6, specs: { OS: 'iOS', RAM: '6GB' }, emi: '3,390/mo x24', install: 'N/A', warranty: '1yr', src: 'Apple.in 69,900' },
        { id: 2, name: 'Samsung Galaxy S24', model: 'SM-S921BZKGINS', price: '62,999-68,000', rating: 4.4, specs: { OS: 'Android', RAM: '8GB' }, emi: '3,050/mo x24', install: 'N/A', warranty: '1yr', src: 'Amazon 63,999 | Flipkart 62,999' },
    ],
    purifier: [
        { id: 1, name: 'Kent Grand Star', model: '11064', price: '14,900-17,000', rating: 4.4, specs: { Tech: 'RO+UV', Cap: '9L' }, emi: '720/mo x24', install: 'Free', warranty: '1yr+3yr', src: 'Amazon 15,900 | Flipkart 14,900' },
        { id: 2, name: 'Aquaguard Geneus', model: 'WCEG00SSSM000', price: '18,490-21,000', rating: 4.3, specs: { Tech: 'RO+UV', Cap: '8L' }, emi: '890/mo x24', install: 'Free', warranty: '1yr+3yr', src: 'Amazon 19,490 | Flipkart 18,490' },
    ],
    dishwasher: [
        { id: 1, name: 'Bosch 12 Place Free Standing', model: 'SMS24AW01I', price: '29,990-33,000', rating: 4.3, specs: { Type: 'Freestanding', Places: '12' }, emi: '1,450/mo x24', install: 'Rs.2000', warranty: '2yr', src: 'Amazon 30,990 | Flipkart 29,990' },
        { id: 2, name: 'IFB Neptune VX', model: 'Neptune VX', price: '27,490-30,000', rating: 4.1, specs: { Type: 'Freestanding', Places: '12' }, emi: '1,330/mo x24', install: 'Rs.1500', warranty: '4yr', src: 'Amazon 28,490 | Flipkart 27,490' },
    ],
};

export const STORES = [
    { id: 1, name: 'Croma, Sector 18', dist: '1.2 km', resp: '94%', hours: '10AM-9PM' },
    { id: 2, name: 'Vijay Sales, GIP', dist: '2.8 km', resp: '89%', hours: '11AM-9:30PM' },
    { id: 3, name: 'Reliance Digital', dist: '3.1 km', resp: '91%', hours: '10AM-9PM' },
    { id: 4, name: 'Sargam Electronics', dist: '1.8 km', resp: '97%', hours: '10:30AM-8:30PM' },
    { id: 5, name: 'Pai Electronics', dist: '4.2 km', resp: '86%', hours: '10AM-9PM' },
    { id: 6, name: 'Next Galleria', dist: '3.8 km', resp: '82%', hours: '11AM-8PM' },
    { id: 7, name: 'Kohinoor Electronics', dist: '2.1 km', resp: '93%', hours: '9:30AM-8PM' },
];

export const LOCS = [
    'Supertech Capetown, Sector 74',
    'Amrapali Sapphire, Sector 45',
    'ATS Greens, Sector 50',
    'Gaur City, Greater Noida West',
    'Mahagun Moderne, Sector 78',
    'Sector 62, Noida',
    'Sector 18, Noida',
    'Sector 44, Noida',
    'Sector 50, Noida',
    'Sector 75, Noida',
    'Sector 120, Noida',
    'Sector 137, Noida',
    'Logix City Centre, Noida',
    'Paras Tierea, Sector 137',
    'Jaypee Wish Town, Sector 128',
];
