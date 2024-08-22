export const getDishById = (id: string) => {
  const products = shopInfo.products.flatMap((category) => category.types);

  return products.flatMap((type) => type.items).find((item) => item.id === id);
};
export const shopInfo = {
  name: "Vapiano",
  products: [
    {
      category: "Hot Coffee",
      types: [
        {
          category: "Espresso",
          items: [
            {
              id: "1",
              name: "Single Espresso",
              price: 2.5,
              info: "A shot of espresso",
              img: require("@assets/images/hot_coffee.jpeg"),
            },
            {
              id: "2",
              name: "Double Espresso",
              price: 3,
              info: "Two shots of espresso",
              img: require("@assets/images/hot_coffee.jpeg"),
            },
            {
              id: "3",
              name: "Ristretto Espresso",
              price: 2.5,
              info: "A short shot of espresso",
              img: require("@assets/images/hot_coffee.jpeg"),
            },
            {
              id: "4",
              name: "Lungo Espresso",
              price: 2.5,
              info: "A long shot of espresso",
              img: require("@assets/images/hot_coffee.jpeg"),
            },
            {
              id: "5",
              name: "Caffe Americano",
              price: 2.5,
              info: "Espresso with hot water",
              img: require("@assets/images/hot_coffee.jpeg"),
            },
            {
              id: "6",
              name: "Macchiato",
              price: 2.5,
              info: "Espresso with a dollop of milk foam",
              img: require("@assets/images/hot_coffee.jpeg"),
            },
            {
              id: "7",
              name: "Cortado",
              price: 2.5,
              info: "Espresso with a small amount of warm milk",
              img: require("@assets/images/hot_coffee.jpeg"),
            },
          ],
        },
        {
          category: "Cappuccino",
          items: [
            {
              id: "8",
              name: "Cappuccino",
              price: 3.5,
              info: "Espresso with steamed milk and milk foam",
              img: require("@assets/images/hot_coffee.jpeg"),
            },
            {
              id: "9",
              name: "Caffe Latte",
              price: 3.5,
              info: "Espresso with steamed milk",
              img: require("@assets/images/hot_coffee.jpeg"),
            },
            {
              id: "10",
              name: "Caffe Mocha",
              price: 3.5,
              info: "Espresso with steamed milk and chocolate",
              img: require("@assets/images/hot_coffee.jpeg"),
            },
          ],
        },
      ],
    },
    {
      category: "Cold Coffee",
      types: [
        {
          category: "Iced Coffee",
          items: [
            {
              id: "11",
              name: "Freddo Espresso",
              price: 3.5,
              info: "Espresso with ice and sugar",
              img: require("@assets/images/freddo.jpeg"),
            },
            {
              id: "12",
              name: "Freddo Cappuccino",
              price: 3.5,
              info: "Espresso with ice, milk foam and sugar",
              img: require("@assets/images/freddo.jpeg"),
            },
          ],
        },
      ],
    },
    {
      category: "Offers",
      types: [
        {
          category: "Combos",
          items: [
            {
              id: "13",
              name: "Καφές + Νερό",
              price: 3.5,
              info: "Καφές με μπουκάλι νερό",
              img: require("@assets/images/offer_1_.png"),
            },
            {
              id: "14",
              name: "Καφές + Τυρόπιτα + Νερό",
              price: 3.5,
              info: "Καφές με μπουκάλι, τυρόπιτα και νερό",
              img: require("@assets/images/offer_5_.png"),
            },
            {
              id: "15",
              name: "Καφές + Τόστ + Νερό",
              price: 3.5,
              info: "Καφές με τόστ και μπουκάλι νερό",
              img: require("@assets/images/offer_6_.png"),
            },
            {
              id: "4",
              name: "Αράβικη πίτα + Χυμόρ Πορτοκάλι",
              price: 3.5,
              info: "Αράβικη πίτα (ζαμπόν τυρί ή γαλοπούλα τυρί) με χυμό πορτοκάλι",
              img: require("@assets/images/offer_9_.png"),
            },
          ],
        },
      ],
    },
    {
      category: "Beverages",
      types: [
        {
          category: "Soft Drinks",
          items: [
            {
              id: "16",
              name: "Coca Cola",
              price: 2.5,
              info: "330ml",
              img: require("@assets/images/beverages.jpg"),
            },
            {
              id: "17",
              name: "Fanta",
              price: 2.5,
              info: "330ml",
              img: require("@assets/images/beverages.jpg"),
            },
            {
              id: "18",
              name: "Sprite",
              price: 2.5,
              info: "330ml",
              img: require("@assets/images/beverages.jpg"),
            },
            {
              id: "19",
              name: "Water",
              price: 2.5,
              info: "500ml",
              img: require("@assets/images/beverages.jpg"),
            },
          ],
        },
      ],
    },
    {
      category: "Snacks",
      types: [
        {
          category: "Bakery",
          items: [
            {
              id: "20",
              name: "Croissant",
              price: 2.5,
              info: "Plain, chocolate or almond",
              img: require("@assets/images/food.jpeg"),
            },
            {
              id: "21",
              name: "Sandwich",
              price: 2.5,
              info: "Ham, cheese or tuna",
              img: require("@assets/images/food.jpeg"),
            },
            {
              id: "22",
              name: "Cake",
              price: 2.5,
              info: "Carrot, chocolate or vanilla",
              img: require("@assets/images/food.jpeg"),
            },
          ],
        },
      ],
    },
    {
      category: "Desserts",
      types: [
        {
          category: "Sweets",
          items: [
            {
              id: "23",
              name: "Tiramisu",
              price: 2.5,
              info: "Classic Italian dessert",
              img: require("@assets/images/desserts.jpg"),
            },
            {
              id: "24",
              name: "Cheesecake",
              price: 2.5,
              info: "New York style cheesecake",
              img: require("@assets/images/desserts.jpg"),
            },
            {
              id: "25",
              name: "Chocolate Cake",
              price: 2.5,
              info: "Rich chocolate cake",
              img: require("@assets/images/desserts.jpg"),
            },
          ],
        },
      ],
    },
    {
      category: "Specials",
      types: [
        {
          category: "Limited Edition",
          items: [
            {
              id: "26",
              name: "Cookies with Hazelnut",
              price: 2.5,
              info: "Choose your flavor",
              img: require("@assets/images/todays_special.jpg"),
            },
            {
              id: "27",
              name: "Muffins",
              price: 2.5,
              info: "Choose your favorite flavor of muffin",
              img: require("@assets/images/todays_special.jpg"),
            },
            {
              id: "28",
              name: "Organic Tea",
              price: 2.5,
              info: "Choose your favorite flavor of tea",
              img: require("@assets/images/todays_special.jpg"),
            },
          ],
        },
      ],
    },
  ],
};
