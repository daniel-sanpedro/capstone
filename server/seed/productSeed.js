const products = [
  {
    id: 1,
    name: "Bulleit Bourbon",
    price: 29.99,
    quantity: 15,
    imageUrl:
      "https://www.masterofmalt.com/whiskies/bulleit/bulleit-bourbon-whiskey.jpg?alt=1&w=511&h=1024&b=0xFFFFFF&q=100",
    description: "A bold, spicy rye backbone with a smooth, clean finish.",
  },
  {
    id: 2,
    name: "Blanton's Original Single Barrel Bourbon",
    price: 69.99,
    quantity: 6,
    imageUrl:
      "https://www.masterofmalt.com/whiskies/blantons/blantons-original-single-barrel-whiskey.jpg?alt=1&w=617&h=1024&b=0xFFFFFF&q=100",
    description:
      "Rich and complex, with a balance of citrus, oak, and sweet vanilla.",
  },
  {
    id: 3,
    name: "Buffalo Trace Bourbon",
    price: 29.99,
    quantity: 14,
    imageUrl:
      "https://www.masterofmalt.com/whiskies/buffalo-trace/buffalo-trace-whiskey.jpg?alt=1&w=496&h=1024&b=0xFFFFFF&q=100",
    description:
      "An aromatic, versatile bourbon known for its deep amber color and complex flavor profile.",
  },
  {
    id: 4,
    name: "Woodford Reserve Bourbon",
    price: 34.99,
    quantity: 12,
    imageUrl:
      "https://www.masterofmalt.com/whiskies/woodford-reserve/woodford-reserve-kentucky-bourbon-whiskey.jpg?alt=1&w=639&h=1024&b=0xFFFFFF&q=100",
    description:
      "Smooth and balanced with rich flavors of vanilla, honey, and a hint of spice.",
  },
  {
    id: 5,
    name: "Eagle Rare 10 Year Old",
    price: 49.99,
    quantity: 10,
    imageUrl:
      "https://www.masterofmalt.com/whiskies/eagle-rare/eagle-rare-10-year-old-whisky.jpg?alt=1&w=385&h=1024&b=0xFFFFFF&q=100",
    description:
      "A full-bodied bourbon offering tantalizing notes of toffee, orange peel, and herbs.",
  },
  {
    id: 6,
    name: "Elijah Craig Small Batch Bourbon",
    price: 39.99,
    quantity: 8,
    imageUrl:
      "https://www.masterofmalt.com/whiskies/elijah-craig/elijah-craig-small-batch-bourbon-whisky.jpg?alt=1&w=528&h=1024&b=0xFFFFFF&q=100",
    description:
      "Complex and smooth, with layers of vanilla, caramel, and nutmeg.",
  },
  {
    id: 7,
    name: "Four Roses Single Barrel Bourbon",
    price: 49.99,
    quantity: 7,
    imageUrl:
      "https://www.masterofmalt.com/whiskies/four-roses-single-barrel-bourbon-100-proof-whiskey.jpg?alt=1&w=488&h=1024&b=0xFFFFFF&q=100",
    description:
      "Delicate and fruity, offering distinct flavors of pear, apple, and honey.",
  },
  {
    id: 8,
    name: "Maker's Mark Bourbon",
    price: 24.99,
    quantity: 20,
    imageUrl:
      "https://www.masterofmalt.com/whiskies/makers-mark-whiskey.jpg?alt=1&w=526&h=1024&b=0xFFFFFF&q=100",
    description:
      "Sweet and balanced with caramel, vanilla, and fruity essences.",
  },
  {
    id: 9,
    name: "Knob Creek 9 Year Old Bourbon",
    price: 39.99,
    quantity: 12,
    imageUrl:
      "https://www.masterofmalt.com/whiskies/knob-creek/knob-creek-kentucky-straight-bourbon-whiskey.jpg?alt=1&w=593&h=1024&b=0xFFFFFF&q=100",
    description:
      "Robust vanilla and caramel notes with long, warm, and rich finish.",
  },
  {
    id: 10,
    name: "Wild Turkey 101 Bourbon",
    price: 22.99,
    quantity: 18,
    imageUrl:
      "https://www.masterofmalt.com/whiskies/wild-turkey/wild-turkey-81-proof-whiskey.jpg?alt=1&w=421&h=1024&b=0xFFFFFF&q=100",
    description:
      "High proof and full of bold flavors, noted for its deep character and smooth finish.",
  },
  {
    id: 11,
    name: "Old Forester 1920 Prohibition Style Bourbon",
    price: 59.99,
    quantity: 8,
    imageUrl:
      "https://www.masterofmalt.com/whiskies/old-forester/old-forester-1920-prohibition-style-whiskey.jpg?alt=1&w=461&h=1024&b=0xFFFFFF&q=100",
    description:
      "A rich burst of chocolate and black cherry with a smoky, spicy finish.",
  },
  {
    id: 12,
    name: "1792 Small Batch Bourbon",
    price: 29.99,
    quantity: 10,
    imageUrl:
      "https://www.masterofmalt.com/whiskies/barton-1792/1792-small-batch-whiskey.jpg?alt=1&w=640&h=1024&b=0xFFFFFF&q=100",
    description: "Spicy and sweet with notes of vanilla, toffee, and pepper.",
  },
  {
    id: 13,
    name: "Henry McKenna 10 Year Old Single Barrel Bourbon",
    price: 49.99,
    quantity: 5,
    imageUrl:
      "https://www.missionliquor.com/cdn/shop/files/Henry-McKenna-Single-Barrel.jpg?v=1691780984&width=1024",
    description:
      "Aged to perfection to produce tastes of vanilla, caramel, and seasoned oak.",
  },
  {
    id: 14,
    name: "Basil Hayden's Bourbon",
    price: 39.99,
    quantity: 9,
    imageUrl:
      "https://www.masterofmalt.com/whiskies/basil-haydens/basil-haydens-bourbon-whiskey.jpg?alt=1&w=430&h=1024&b=0xFFFFFF&q=100",
    description:
      "Light-bodied with hints of spice and tea, an ideal choice for bourbon cocktails.",
  },
  {
    id: 15,
    name: "Angel's Envy Bourbon",
    price: 49.99,
    quantity: 8,
    imageUrl:
      "https://www.masterofmalt.com/whiskies/angels-envy/angels-envy-whiskey.jpg?alt=1&w=542&h=1024&b=0xFFFFFF&q=100",
    description:
      "Finished in port wine barrels, offering unique flavors of wine and ripe fruit.",
  },
  {
    id: 16,
    name: "Booker's Bourbon",
    price: 89.99,
    quantity: 4,
    imageUrl:
      "https://www.thebarreltap.com/cdn/shop/files/booker-s-bourbon-batch-2018-04-kitchen-table-the-barrel-tap-www-thebarreltap-com-1_ef85b815-6da6-4576-8a96-0a06176cb437.jpg?v=1691179941&width=1800",
    description:
      "Unfiltered and uncut, this bourbon offers an intense flavor and remarkable complexity.",
  },
  {
    id: 17,
    name: "George T. Stagg Bourbon",
    price: 249.99,
    quantity: 3,
    imageUrl:
      "https://www.masterofmalt.com/whiskies/george-t-stagg-bourbon/george-t-stagg-bourbon-2015-release.jpg?alt=1&w=359&h=1024&b=0xFFFFFF&q=100",
    description:
      "An unapologetically strong bourbon, known for its rich, sweet, chocolatey undernotes.",
  },
  {
    id: 18,
    name: "Pappy Van Winkle's Family Reserve 15 Year Old",
    price: 999.99,
    quantity: 1,
    imageUrl:
      "https://www.masterofmalt.com/whiskies/pappy-van-winkles-family-reserve-bourbon-15-year-old-whiskey.jpg?alt=1&w=378&h=1024&b=0xFFFFFF&q=100",
    description:
      "Highly sought after for its dark, intensely flavored, deeply complex profile.",
  },
  {
    id: 19,
    name: "Jefferson's Ocean Aged at Sea Bourbon",
    price: 79.99,
    quantity: 7,
    imageUrl:
      "https://d3omj40jjfp5tk.cloudfront.net/products/5e8cf76f32b79e35eb9da853/large.png",
    description:
      "Aged at sea, this unique bourbon is influenced by the sea climate, offering saline and caramel notes.",
  },
  {
    id: 20,
    name: "W.L. Weller Special Reserve Bourbon",
    price: 29.99,
    quantity: 10,
    imageUrl:
      "https://cdn11.bigcommerce.com/s-u9ww3di/images/stencil/1280x1280/products/8003/11442/weller_special_reserve_wheated_bourbon___97474.1535263434.png?c=2?imbypass=on",
    description:
      "A smooth, mild, wheated bourbon that serves as a perfect introduction to the world of premium bourbons.",
  },
  {
    id: 21,
    name: "Evan Williams Black Label Bourbon",
    price: 17.99,
    quantity: 15,
    imageUrl:
      "https://www.masterofmalt.com/whiskies/evan-williams/evan-williams-white-label.jpg?alt=1&w=450&h=1024&b=0xFFFFFF&q=100",
    description:
      "Known for its approachable profile and excellent value, offering hints of nut, chocolate, and vanilla.",
  },
  {
    id: 22,
    name: "Old Grand-Dad 114 Bourbon",
    price: 29.99,
    quantity: 8,
    imageUrl:
      "https://www.totalwine.com/dynamic/x1000,sq/media/sys_master/twmmedia/hc1/h47/12343407214622.png",
    description:
      "A high-rye bourbon with a spicy kick, balanced by underlying notes of vanilla and oak.",
  },
  {
    id: 23,
    name: "Rebel Yell 10 Year Old Single Barrel Bourbon",
    price: 59.99,
    quantity: 5,
    imageUrl:
      "https://www.masterofmalt.com/whiskies/rebell-yell/rebel-yell-10-year-old-single-barrel-whiskey.jpg?alt=1&w=700&h=1013&b=0xFFFFFF&q=100",
    description:
      "Single barrel that offers a smooth, buttery profile with a spicy, warm finish.",
  },
  {
    id: 24,
    name: "Wild Turkey Rare Breed Bourbon",
    price: 49.99,
    quantity: 10,
    imageUrl:
      "https://www.masterofmalt.com/whiskies/wild-turkey/wild-turkey-rare-breed-bourbon-58-4-percent-whiskey.jpg?alt=1&w=700&h=926&b=0xFFFFFF&q=100",
    description:
      "A barrel-proof bourbon that provides rich, deep flavors of vanilla, oak, and pepper without dilution.",
  },
  {
    id: 25,
    name: "Jim Beam Double Oak",
    price: 34.99,
    quantity: 9,
    imageUrl:
      "https://www.masterofmalt.com/whiskies/jim-beam/jim-beam-double-oak-whiskey.jpg?alt=1&w=700&h=926&b=0xFFFFFF&q=100",
    description:
      "Twice-barreled for extra richness and depth, with smooth caramel and toasty oak flavors.",
  },
];

module.exports = products;
