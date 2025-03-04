import { useQuery } from "@apollo/client";
import { GET_AMMO_DATA } from "../services/api/queries";

const AmmoData = ({ ammoName }) => {
  const { loading, error, data } = useQuery(GET_AMMO_DATA, {
    variables: { ammoName },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const ammo = data.items[0];

  return (
    <div>
      <h2>{ammo.name}</h2>
      <p><strong>Damage:</strong> {ammo.properties.damage}</p>
      <p><strong>Penetration Power:</strong> {ammo.properties.penetrationPower}</p>

      <h3>Prices:</h3>
      <ul>
        {ammo.buyFor.map((price, index) => (
          <li key={index}>
            <strong>Source:</strong> {price.source} - {price.price} {price.currency}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AmmoData;
