import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CourseListRow from './CourseListRow/CourseListRow';
import WithLogging from '../../components/HOC/WithLogging';
import { selectCourse, unSelectCourse } from '../../features/courses/coursesSlice';

function CourseList() {
  const courses = useSelector((state) => state.courses.courses);
  const dispatch = useDispatch();

  const onChangeRow = useCallback((id, checked) => {
    if (checked) {
      dispatch(selectCourse(id));
    } else {
      dispatch(unSelectCourse(id));
    }
  }, [dispatch]);

  return (
    <>
      <div className='w-full max-w-4xl mx-auto my-8 px-4 sm:px-0 overflow-x-auto'>
        <table id='CourseList' className='w-full min-w-[280px] border-collapse'>
          <thead>
            { courses.length === 0 ? (
                <CourseListRow isHeader={true} textFirstCell='No course available yet' />
              ) : (
                <>
                  <CourseListRow isHeader={true} textFirstCell="Available courses" />
                  <CourseListRow isHeader={true} textFirstCell="Course name" textSecondCell="Credit" />
                </>
              )
            }
          </thead>
          <tbody>
            {
              courses.map(course => (
                <CourseListRow
                  key={course.id}
                  id={course.id}
                  isHeader={false}
                  textFirstCell={course.name}
                  textSecondCell={course.credit}
                  isChecked={course.isSelected}
                  changeRow={onChangeRow}
                />
              ))
            }
          </tbody>
        </table>
      </div>
    </>
  )
}

const CourseListWithLogging = WithLogging(CourseList);
export default CourseListWithLogging;
