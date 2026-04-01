//1
const a = 10;
const b = 5;

console.log("1 ");
console.log("Сума:", a + b);
console.log("Різниця:", a - b);
console.log("Множення:", a * b);
console.log("Ділення:", a / b);
console.log("");

//2
const firstName = "Іван";
const lastName = "Іванов";
const fullName = `${firstName} ${lastName}`;

console.log("2");
console.log(`Привіт, ${fullName}!`);
console.log("");

//3
let age = 20;

console.log("3");
if (age >= 18) {
    console.log("Доступ дозволено");
} else {
    console.log("Доступ заборонено");
}
console.log("");

// 4
console.log("4");
for (let i = 1; i <= 10; i++) {
    console.log(i);
}
console.log("");

// 5
function square(number) {
    return number * number;
}

const result = square(5);
console.log("5");
console.log("Квадрат числа 5 дорівнює:", result);
console.log("");

//6
const fruits = ["Яблуко", "Банан", "Апельсин"];
fruits.push("Манго");

console.log("6");
console.log("Список фруктів:", fruits);