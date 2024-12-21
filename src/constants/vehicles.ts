export const EXEMPTED_VEHICLES = {
  emergency: {
    title: 'Kendaraan Darurat',
    items: [
      'Ambulans',
      'Pemadam Kebakaran',
      'Kendaraan evakuasi kecelakaan lalu lintas',
    ],
  },
  public: {
    title: 'Transportasi Umum',
    items: ['Angkutan umum berplat kuning', 'Truk tangki bahan bakar'],
  },
  special: {
    title: 'Kendaraan Khusus',
    items: [
      'Kendaraan berstiker disabilitas',
      'Kendaraan berbahan bakar listrik',
      'Kendaraan operasional TNI/Polri (TNKB merah)',
      'Kendaraan pimpinan lembaga tinggi negara',
      'Kendaraan pimpinan dan pejabat negara asing/lembaga internasional',
    ],
  },
  others: {
    title: 'Lainnya',
    items: [
      'Sepeda motor',
      'Kendaraan pengangkut uang Bank Indonesia & ATM (dengan pengawalan Polri)',
      'Kendaraan untuk kepentingan tertentu menurut pertimbangan Polri',
    ],
  },
} as const; 
