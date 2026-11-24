function CourseListRow({
  isHeader = false,
  textFirstCell = '',
  textSecondCell = null,
  id,
  isChecked = false,
  changeRow = () => {},
}) {
  if (isHeader) {
    if (textSecondCell === null) {
      return (
        <tr className="bg-table-header/66">
          <th colSpan={2} className="border border-gray-400">{textFirstCell}</th>
        </tr>
      );
    }
    return (
      <tr className="bg-table-header/66">
        <th className="border border-gray-400">{textFirstCell}</th>
        <th className="border border-gray-400">{textSecondCell}</th>
      </tr>
    );
  }
  return (
    <tr className="bg-table-rows/45">
      <td className="border border-gray-400 pl-2">
        <input
          type="checkbox"
          className="mr-2"
          checked={isChecked}
          onChange={(e) => changeRow(id, e.target.checked)}
        />
        {textFirstCell}
      </td>
      <td className="border border-gray-400 pl-2">{textSecondCell}</td>
    </tr>
  );
}

export default CourseListRow;