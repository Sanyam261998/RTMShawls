const products = [
  {
    id: 1,
    name: "Samsung Galaxy S24 Ultra",
    description: "Flagship smartphone with stunning camera and display.",
    price: 1199,
    image: "https://images.samsung.com/is/image/samsung/assets/global/galaxy-s24/gallery/galaxy-s24-ultra-titanium-black-front.jpg",
  },
  {
    id: 2,
    name: "Apple MacBook Pro 14” M3",
    description: "M3 chip for extreme power and long battery life.",
    price: 1999,
    image: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mbp14-spacegray-select-202310_GEO_US?wid=1808&hei=1680&fmt=jpeg&qlt=90&.v=1697311103003",
  },
  {
    id: 3,
    name: "Sony WH-1000XM5",
    description: "Noise-cancelling wireless headphones with incredible sound.",
    price: 349,
    image: "https://m.media-amazon.com/images/I/61bK6PMOC3L._AC_SL1500_.jpg",
  },
  {
    id: 4,
    name: "Logitech MX Master 3S",
    description: "Precision wireless mouse for professionals.",
    price: 99,
    image: "https://resource.logitech.com/w_800,c_limit,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/mice/mx-master-3s/gallery/mx-master-3s-top-view-black.png",
  },
  {
    id: 5,
    name: "Dell UltraSharp 27” Monitor",
    description: "4K resolution, factory-calibrated for creative professionals.",
    price: 599,
    image: "https://i.dell.com/sites/imagecontent/products/PublishingImages/monitors-u-series/u2723qe-monitor/gallery/monitor-u2723qe-gallery-1.psd",
  },
  {
    id: 6,
    name: "Anker 737 Power Bank",
    description: "26,800mAh PD power bank with 140W output.",
    price: 159,
    image: "https://cdn.anker.com/anker/products/A1289/A1289H11/pc/main_01.jpg",
  },
  {
    id: 7,
    name: "LG C3 OLED TV 55”",
    description: "OLED TV with Dolby Vision & 120Hz gaming mode.",
    price: 1499,
    image: "https://www.lg.com/us/images/tvs/md08003886/gallery/desktop-01.jpg",
  },
  {
    id: 8,
    name: "Razer BlackWidow V4 Pro",
    description: "Mechanical gaming keyboard with RGB & macros.",
    price: 229,
    image: "https://assets2.razerzone.com/images/pnx.assets/065da20ba4202070ee41f43c3d9f0b69/razer-blackwidow-v4-pro-01.png",
  },
  {
    id: 9,
    name: "WD Black SN850X 2TB SSD",
    description: "High-speed Gen4 NVMe SSD for gaming & creators.",
    price: 199,
    image: "https://m.media-amazon.com/images/I/71WDtW3ojtL._AC_SL1500_.jpg",
  },
  {
    id: 10,
    name: "Canon EOS R7",
    description: "APS-C mirrorless camera with 32.5MP sensor.",
    price: 1499,
    image: "https://static.bhphoto.com/images/images2500x2500/1654013899_1703803.jpg",
  },
  {
    id: 11,
    name: "Apple iPad Pro 11” M4",
    description: "All-screen design, Apple Pencil Pro support.",
    price: 1099,
    image: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/ipad-pro-11-select-202404?wid=940&hei=1112&fmt=png-alpha&.v=1712775750749",
  },
  {
    id: 12,
    name: "Google Pixel 8 Pro",
    description: "The AI-first phone with Tensor G3 chip.",
    price: 999,
    image: "https://store.google.com/product/images/pxl8pro_black_front_back_en.jpg",
  },
  {
    id: 13,
    name: "Asus ROG Strix G18",
    description: "RTX 4080, 13th Gen i9, 18-inch 240Hz QHD+ display.",
    price: 2699,
    image: "https://dlcdnwebimgs.asus.com/gain/4D92934B-5074-4906-91D2-030F7F3A0985",
  },
  {
    id: 14,
    name: "DJI Mini 4 Pro Drone",
    description: "4K video, lightweight, and obstacle avoidance.",
    price: 799,
    image: "https://cdn.shopify.com/s/files/1/0013/8296/2301/products/dji-mini-4-pro-front.jpg",
  },
  {
    id: 15,
    name: "Corsair iCUE H150i Elite",
    description: "360mm liquid cooler with RGB fans.",
    price: 199,
    image: "https://m.media-amazon.com/images/I/712xrpBDnqL._AC_SL1500_.jpg",
  },
  {
    id: 16,
    name: "Steam Deck OLED",
    description: "Portable gaming PC with 512GB SSD.",
    price: 649,
    image: "https://cdn.cloudflare.steamstatic.com/steamdeck/images/marketing/oled/steamdeck-oled.jpg",
  },
  {
    id: 17,
    name: "Apple Watch Ultra 2",
    description: "Rugged smartwatch for athletes & adventurers.",
    price: 799,
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-ultra2-gray-alpine-loop-202309?wid=940&hei=1112&fmt=png-alpha&.v=1693704524245",
  },
  {
    id: 18,
    name: "Elgato Stream Deck XL",
    description: "32 customizable LCD keys for pro streaming.",
    price: 249,
    image: "https://m.media-amazon.com/images/I/61A5ZtTZptL._AC_SL1500_.jpg",
  },
  {
    id: 19,
    name: "BenQ EX3501R Monitor",
    description: "35” curved ultrawide 100Hz HDR display.",
    price: 699,
    image: "https://m.media-amazon.com/images/I/71wSeMaTzrL._AC_SL1500_.jpg",
  },
  {
    id: 20,
    name: "Yeti Blue XLR Mic",
    description: "Studio-grade USB/XLR hybrid microphone.",
    price: 129,
    image: "https://www.bluemic.com/content/dam/bluemicrophones/images/YetiX/Yeti-X_Product-Image_Blackout_Front.png",
  },
  {
    id: 21,
    name: "NVIDIA RTX 4090",
    description: "Ultimate GPU for AI, rendering, and 4K gaming.",
    price: 2199,
    image: "https://m.media-amazon.com/images/I/61VbKHdE+VL._AC_SL1000_.jpg",
  },
  {
    id: 22,
    name: "Bose QuietComfort Ultra",
    description: "World-class noise cancelling & immersive audio.",
    price: 399,
    image: "https://www.bose.com/content/dam/Bose_DAM/Web/consumer_electronics/global/products/headphones/qc_ultra/images/qc_ultra_black_EC_hero.psd",
  },
  {
    id: 23,
    name: "HyperX Cloud II Wireless",
    description: "Legendary headset with 30-hour battery life.",
    price: 149,
    image: "https://media.kingston.com/hyperx/product/hx-product-headset-cloud-ii-wireless-1-zm-lg.jpg",
  },
  {
    id: 24,
    name: "Samsung T7 Shield SSD 2TB",
    description: "Rugged portable SSD with USB 3.2 Gen 2.",
    price: 219,
    image: "https://images.samsung.com/is/image/samsung/p6pim/levant/portable-ssd-t7-shield-2tb-black-1.jpg",
  },
  {
    id: 25,
    name: "TP-Link Archer AX11000",
    description: "Tri-band Wi-Fi 6 gaming router, 10Gb Ethernet.",
    price: 349,
    image: "https://static.tp-link.com/2020/202004/20200428/Archer-AX11000-1.0_01_large_1556083760877b.jpg",
  },
];

export default products;
