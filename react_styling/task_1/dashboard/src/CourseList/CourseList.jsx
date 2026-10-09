import CourseListRow from './CourseListRow';

function CourseList({ courses = [] }) {
  if (courses.length === 0) {
    return (
      <div className="courses-container w-4/5 mx-auto my-8">
        <table id="noCourse" className="w-full">
          <tbody>
            <CourseListRow
              textFirstCell="No course available yet"
              isHeader={false}
            />
          </tbody>
        </table>
      </div>
    );
  }
  return (
    <div className="courses-container w-4/5 mx-auto my-8">
      <table id="coursesTable" className="w-full">
        <thead>
          <CourseListRow textFirstCell="Available courses" isHeader={true} />
          <CourseListRow
            textFirstCell="Course name"
            textSecondCell="Credit"
            isHeader={true}
          />
        </thead>
        <tbody>
          {courses.map((course) => (
            <CourseListRow
              key={course.id}
              textFirstCell={course.name}
              textSecondCell={course.credit}
              isHeader={false}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CourseList;
