import { useState } from "react";
interface PestFormProps {
  existingPest?: any;
  updateCallback: () => void;
}
const PestForm = ({ existingPest = {}, updateCallback }: PestFormProps) => {
  const [name, setName] = useState(existingPest.name || "");
  const [description, setDescription] = useState(
    existingPest.description || ""
  );
  const [cropsAffected, setCropsAffected] = useState(
    existingPest.cropsAffected || ""
  );

  const updating = Object.entries(existingPest).length !== 0;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
      name,
      description,
      cropsAffected,
    };
    const url =
      "http://127.0.0.1:5000/" +
      (updating ? `update_contact/${existingPest.id}` : "create_contact");
    const options = {
      method: updating ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    const response = await fetch(url, options);
    if (response.status !== 201 && response.status !== 200) {
      const data = await response.json();
      alert(data.message);
    } else {
      updateCallback();
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="cropsAffected">Crops Affected:</label>
        <input
          type="text"
          id="cropsAffected"
          value={cropsAffected}
          onChange={(e) => setCropsAffected(e.target.value)}
        />
      </div>
      <button type="submit">{updating ? "Update" : "Create"}</button>
    </form>
  );
};

export default PestForm;
