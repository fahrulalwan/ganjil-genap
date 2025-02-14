// Road coordinates for Jakarta's Ganjil-Genap policy areas
// Coordinates are in [longitude, latitude] format as per MapTiler SDK requirements
export const ROAD_COORDINATES = {
  // Central Jakarta (Jakarta Pusat) - Northern Area
  'Jl. Pintu Besar Selatan': [
    [106.813095, -6.135672], // Start: Kota Tua
    [106.813798, -6.137205], // Mid: Pintu Besar
    [106.814485, -6.139012]  // End: Glodok
  ],
  'Jl. Gajah Mada': [
    [106.814485, -6.139012], // Start: Glodok
    [106.815558, -6.144521], // Mid: Mangga Besar
    [106.816631, -6.150030], // Mid 2: Gang Kelinci
    [106.817318, -6.155539], // Mid 3: Petojo
    [106.818047, -6.159701]  // End: Harmoni
  ],
  'Jl. Hayam Wuruk': [
    [106.814571, -6.139012], // Start: Glodok
    [106.815644, -6.144521], // Mid: Mangga Besar
    [106.816717, -6.150030], // Mid 2: Gang Kelinci
    [106.817404, -6.155539], // Mid 3: Petojo
    [106.818133, -6.159701]  // End: Harmoni
  ],
  'Jl. Majapahit': [
    [106.818047, -6.159701], // Start: Harmoni
    [106.820064, -6.163863], // Mid: Juanda
    [106.822081, -6.168025], // Mid 2: Medan Merdeka
    [106.824098, -6.169701]  // End: Monas
  ],
  'Jl. Medan Merdeka Barat': [
    [106.818133, -6.159701], // Start: Harmoni
    [106.820150, -6.163863], // Mid: Budi Kemuliaan
    [106.822167, -6.168025], // Mid 2: Istana
    [106.824184, -6.169701]  // End: Monas
  ],
  'Jl. MH Thamrin': [
    [106.824098, -6.169701], // Start: Monas
    [106.823711, -6.175210], // Mid: Kebon Sirih
    [106.823368, -6.180719], // Mid 2: Sarinah
    [106.823025, -6.186228], // Mid 3: Dukuh Atas
    [106.822682, -6.196570]  // End: Bundaran HI
  ],
  'Jl. Jend. Sudirman': [
    [106.822682, -6.196570], // Start: Bundaran HI
    [106.821252, -6.200732], // Mid: Bendungan Hilir
    [106.819822, -6.204894], // Mid 2: Karet
    [106.818392, -6.209056], // Mid 3: Setiabudi
    [106.816962, -6.213218], // Mid 4: Semanggi
    [106.815532, -6.217380], // Mid 5: Senayan
    [106.814102, -6.221542], // Mid 6: Senayan Golf
    [106.812672, -6.224178]  // End: Blok M
  ],

  // Central Jakarta - Western Area
  'Jl. Tomang Raya': [
    [106.789772, -6.173863], // Start: Tomang
    [106.791202, -6.175539], // Mid: Slipi
    [106.792632, -6.177215]  // End: Grogol
  ],
  'Jl. Kyai Caringin': [
    [106.792632, -6.177215], // Start: Grogol
    [106.794062, -6.178891], // Mid: Kyai Caringin
    [106.795492, -6.180567]  // End: S Parman Junction
  ],
  'Jl. Jend. S Parman': [
    [106.795492, -6.180567], // Start: S Parman Junction
    [106.797836, -6.185815], // Mid: Taman Anggrek
    [106.800180, -6.191063], // Mid 2: Central Park
    [106.802524, -6.196311], // Mid 3: Wisma 46
    [106.804868, -6.201559], // Mid 4: Wisma Indocement
    [106.807212, -6.204281]  // End: Semanggi
  ],

  // Central Jakarta - Eastern Area
  'Jl. Gunung Sahari': [
    [106.838713, -6.146121], // Start: Mangga Dua
    [106.839657, -6.151630], // Mid: Gunung Sahari Raya
    [106.840601, -6.157139], // Mid 2: Kemayoran
    [106.841545, -6.162648], // Mid 3: Bungur
    [106.842489, -6.168157]  // End: Senen
  ],
  'Jl. Stasiun Senen': [
    [106.842489, -6.168157], // Start: Stasiun Senen
    [106.843433, -6.173666], // Mid: Pasar Senen
    [106.844377, -6.177828]  // End: Kramat
  ],
  'Jl. Kramat Raya': [
    [106.844377, -6.177828], // Start: Senen
    [106.845321, -6.183337], // Mid: Kramat
    [106.846265, -6.188846], // Mid 2: Salemba
    [106.847209, -6.193193]  // End: Matraman
  ],
  'Jl. Salemba Raya': [
    [106.846265, -6.188846], // Start: Salemba
    [106.851097, -6.191684], // Mid: RS Salemba
    [106.855929, -6.194522]  // End: Matraman
  ],

  // South Jakarta
  'Jl. Sisingamangaraja': [
    [106.812672, -6.224178], // Start: Blok M
    [106.814102, -6.229687], // Mid: Kebayoran
    [106.815532, -6.235196], // Mid 2: Pakubuwono
    [106.816962, -6.240705]  // End: Kebayoran Baru
  ],
  'Jl. Panglima Polim': [
    [106.816962, -6.240705], // Start: Kebayoran Baru
    [106.818392, -6.246214], // Mid: Polim
    [106.819822, -6.251723]  // End: Melawai
  ],
  'Jl. Fatmawati': [
    [106.796436, -6.277474], // Start: Cilandak
    [106.808186, -6.278812], // Mid: Fatmawati
    [106.819936, -6.280150]  // End: Cipete
  ],
  'Jl. Gatot Subroto': [
    [106.807212, -6.204281], // Start: Semanggi
    [106.816962, -6.217380], // Mid: Kuningan
    [106.826712, -6.230518], // Mid 2: Gatot Subroto
    [106.836462, -6.235196], // Mid 3: Pancoran
    [106.846212, -6.235874]  // End: Pancoran Junction
  ],
  'Jl. HR Rasuna Said': [
    [106.831587, -6.218380], // Start: Kuningan
    [106.833017, -6.223889], // Mid: Setiabudi
    [106.834447, -6.229398], // Mid 2: Kuningan Plaza
    [106.835877, -6.235196]  // End: Casablanca
  ],

  // East Jakarta
  'Jl. MT Haryono': [
    [106.846212, -6.235874], // Start: Pancoran
    [106.856676, -6.244366], // Mid: Tebet
    [106.867140, -6.252858]  // End: Cawang
  ],
  'Jl. DI Panjaitan': [
    [106.867140, -6.252858], // Start: Cawang
    [106.877604, -6.261350], // Mid: Cipinang
    [106.888068, -6.269842]  // End: Klender
  ],
  'Jl. Jend. Ahmad Yani': [
    [106.855929, -6.194522], // Start: Matraman
    [106.871857, -6.202676], // Mid: Jatinegara
    [106.887785, -6.210830]  // End: Cempaka Putih
  ],
  'Jl. Pramuka': [
    [106.855929, -6.194522], // Start: Matraman
    [106.871857, -6.193184], // Mid: Pramuka
    [106.887785, -6.191846]  // End: Utan Kayu
  ]
} as const;

// Style configuration for road visualization
export const ROAD_STYLE = {
  lineWidth: 4,
  activeColor: '#ef4444', // Red for active policy roads
  inactiveColor: '#6b7280', // Gray for inactive policy roads
  opacity: 0.8
} as const;
