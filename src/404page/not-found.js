import "./not-found.css";

export default function NotFoundPage() {
  const catArray = [
    "./catzz/cat1.jpeg",
    "./catzz/cat2.jpeg",
    "./catzz/cat4.jpeg",
    "./catzz/cat6.jpeg",
    "./catzz/cat7.jpeg",
    "./catzz/cat8.jpeg",
    "./catzz/cat9.jpeg",
    "./catzz/cat10.jpeg",
    "./catzz/cat11.jpeg",
  ];
  const randomIndex = Math.floor(Math.random() * catArray.length);
  console.log(randomIndex);
  return (
    <div className="div-not-found gap-4">
      <img src={catArray[randomIndex]} className="h-48 w-48" />
      <div className="flex flex-col justify-center align-center ">
        <p className="text-4xl">404</p>
        <p>Oops! page not found</p>
      </div>
    </div>
  );
}
