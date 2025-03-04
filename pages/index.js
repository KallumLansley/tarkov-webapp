import AmmoList from "../components/AmmoList";

const calibers = [
  "12 Gauge Shot",
  "20 Gauge",
  "23x75mm",
  "9x18mm",
  "7.62x25mm",
  "9x19mm",
  "45 ACP",
  "9x21mm",
  "357 Magnum",
  "5.7x28mm",
  "4.6x30mm",
  "9x39mm",
  "366 TKM",
  "5.45x39mm",
  "5.56x45mm",
  "7.62x39mm",
  "300 BLK",
  "6.8x51mm",
  "7.62x51mm",
  "7.62x54R",
  "12.7x55mm",
  "338 Lapua Magnum",
];

export default function Home() {
  return (
    <div>
      <h1>Escape from Tarkov Ammo Data</h1>
      {calibers.map((caliber) => (
        <AmmoList key={caliber.replace(/\./g, "")} caliber={caliber} />
      ))}
    </div>
  );
}


