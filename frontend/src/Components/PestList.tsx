interface PestListProps {
  pests: any[];
}

const PestList = ({ pests }: PestListProps) => {
  return (
    <div>
      <h2>Pests</h2>
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Description</th>
            <th scope="col">Crops Affected</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pests.map((pest) => (
            <tr key={pest.id}>
              <td scope="row">{pest.name}</td>
              <td>{pest.description}</td>
              <td>{pest.cropsAffected}</td>
              <td>
                <button>Update</button>
                <button>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PestList;
