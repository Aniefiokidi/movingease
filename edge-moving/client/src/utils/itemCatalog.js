export const SERVICE_TYPES = [
  { key: "residential", title: "Residential Move", description: "Apartments, condos, and full homes" },
  { key: "office", title: "Office Move", description: "Commercial and workspace relocation" },
  { key: "single_item", title: "Single Item Move", description: "Fast pickup for one heavy or fragile item" },
  { key: "furniture_moving", title: "Furniture Moving", description: "Furniture-only transport and placement" },
  { key: "junk_removal", title: "Junk Removal", description: "Responsible disposal and hauling" }
];

export const PACKAGE_OPTIONS = [
  { key: "quick_move", name: "Single Item Move", includes: "1-2 items", truckType: "van", workersCount: 2, baseMin: 12000, baseMax: 15000 },
  { key: "small_move", name: "Small Move (1-5 items)", includes: "Up to 5 items", truckType: "van", workersCount: 2, baseMin: 20000, baseMax: 25000 },
  { key: "medium_move", name: "Medium Move (6-10 items)", includes: "Up to 10 items", truckType: "medium", workersCount: 3, baseMin: 35000, baseMax: 45000 },
  { key: "full_home_move", name: "Full Home Move", includes: "Large household move", truckType: "large", workersCount: 4, baseMin: 60000, baseMax: 80000 }
];

export const ITEM_CATALOG = [
  { key: "sofa_2", label: "Sofa (2-seater)", volumeScore: 3, weightScore: 3 },
  { key: "sofa_3", label: "Sofa (3-seater)", volumeScore: 4, weightScore: 4 },
  { key: "bed_single", label: "Bed (single)", volumeScore: 2, weightScore: 2 },
  { key: "bed_queen", label: "Bed (queen)", volumeScore: 3, weightScore: 3 },
  { key: "bed_king", label: "Bed (king)", volumeScore: 4, weightScore: 4 },
  { key: "fridge_small", label: "Fridge (small)", volumeScore: 3, weightScore: 4, isHeavy: true },
  { key: "fridge_large", label: "Fridge (large)", volumeScore: 5, weightScore: 6, isHeavy: true },
  { key: "tv", label: "TV", volumeScore: 1, weightScore: 1, isFragile: true },
  { key: "boxes", label: "Boxes", volumeScore: 0.5, weightScore: 0.5 },
  { key: "table", label: "Table", volumeScore: 2, weightScore: 2 },
  { key: "chair", label: "Chair", volumeScore: 0.5, weightScore: 0.5 },
  { key: "washing_machine", label: "Washing Machine", volumeScore: 3, weightScore: 5, isHeavy: true },
  { key: "piano", label: "Piano", volumeScore: 8, weightScore: 10, isHeavy: true, isFragile: true }
];
